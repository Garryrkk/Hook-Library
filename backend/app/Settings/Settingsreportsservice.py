from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import json
import csv
import io
import openai
from collections import defaultdict, Counter

from ..Settings.Settingsreportsschemas import (
    UserSettingsUpdate, UserSettingsResponse, ReportGenerationRequest,
    WeeklyReportData, MonthlyReportData, AIGenerationRequest,
    AIGenerationResponse, GeneratedHook, BulkHookOperation,
    BulkOperationResponse, ExportRequest, ExportResponse,
    HookAnalytics, CollectionAnalytics, PlatformAnalytics,
    ReportFormat, HookType, ToneType, NicheCategory
)


class SettingsReportsService:
    def __init__(self, db: Session):
        self.db = db
        
    # ==================== USER SETTINGS ====================
    
    def get_user_settings(self, user_id: str) -> UserSettingsResponse:
        """Get user settings"""
        settings = self.db.query(UserSettings).filter(
            UserSettings.user_id == user_id
        ).first()
        
        if not settings:
            # Create default settings
            settings = self._create_default_settings(user_id)
        
        return UserSettingsResponse(
            id=settings.id,
            user_id=settings.user_id,
            weekly_report_enabled=settings.weekly_report_enabled,
            report_format=settings.report_format,
            report_frequency=settings.report_frequency,
            report_email=settings.report_email,
            last_report_generated=settings.last_report_generated,
            default_hook_type=settings.default_hook_type,
            default_tone=settings.default_tone,
            default_niche=settings.default_niche,
            email_notifications=settings.email_notifications,
            desktop_notifications=settings.desktop_notifications,
            scrape_completion_alerts=settings.scrape_completion_alerts,
            theme=settings.theme,
            cards_per_page=settings.cards_per_page,
            default_view=settings.default_view,
            profile_visibility=settings.profile_visibility,
            show_activity=settings.show_activity,
            created_at=settings.created_at,
            updated_at=settings.updated_at
        )
    
    def update_user_settings(self, user_id: str, update_data: UserSettingsUpdate) -> UserSettingsResponse:
        """Update user settings"""
        settings = self.db.query(UserSettings).filter(
            UserSettings.user_id == user_id
        ).first()
        
        if not settings:
            settings = self._create_default_settings(user_id)
        
        # Update fields
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            if hasattr(settings, key):
                setattr(settings, key, value)
        
        settings.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(settings)
        
        self._log_activity(user_id, "settings_updated", "Updated user settings")
        
        return self.get_user_settings(user_id)
    
    # ==================== REPORT GENERATION ====================
    
    def generate_weekly_report(self, user_id: str) -> WeeklyReportData:
        """Generate weekly activity report"""
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=7)
        
        # Get hooks saved this week
        hooks_saved = self.db.query(func.count(SavedHook.id)).filter(
            SavedHook.user_id == user_id,
            SavedHook.created_at >= start_date
        ).scalar() or 0
        
        # Get scrapes this week
        scrapes = self.db.query(func.count(ScrapeHistory.id)).filter(
            ScrapeHistory.user_id == user_id,
            ScrapeHistory.created_at >= start_date
        ).scalar() or 0
        
        # Get collections created
        collections = self.db.query(func.count(CollectionModel.id)).filter(
            CollectionModel.user_id == user_id,
            CollectionModel.created_at >= start_date
        ).scalar() or 0
        
        # Get favorite platform
        platform_counts = self.db.query(
            Hook.platform,
            func.count(SavedHook.id).label('count')
        ).join(SavedHook).filter(
            SavedHook.user_id == user_id,
            SavedHook.created_at >= start_date
        ).group_by(Hook.platform).order_by(desc('count')).first()
        
        favorite_platform = platform_counts[0] if platform_counts else "None"
        
        # Get top niches
        niche_counts = self.db.query(
            Hook.niche,
            func.count(SavedHook.id).label('count')
        ).join(SavedHook).filter(
            SavedHook.user_id == user_id,
            SavedHook.created_at >= start_date
        ).group_by(Hook.niche).order_by(desc('count')).limit(5).all()
        
        top_niches = [
            {"niche": niche, "count": count}
            for niche, count in niche_counts
        ]
        
        # Get daily activity
        daily_activity = []
        for i in range(7):
            day = start_date + timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0)
            day_end = day.replace(hour=23, minute=59, second=59)
            
            count = self.db.query(func.count(SavedHook.id)).filter(
                SavedHook.user_id == user_id,
                SavedHook.created_at >= day_start,
                SavedHook.created_at <= day_end
            ).scalar() or 0
            
            daily_activity.append({
                "date": day.strftime("%a"),  # Mon, Tue, etc.
                "hooks_saved": count
            })
        
        # Get achievements unlocked
        achievements = self._get_recent_achievements(user_id, start_date)
        
        # Find most active day
        most_active = max(daily_activity, key=lambda x: x['hooks_saved'])
        
        return WeeklyReportData(
            period_start=start_date,
            period_end=end_date,
            total_hooks_saved=hooks_saved,
            total_scrapes=scrapes,
            total_collections_created=collections,
            favorite_platform=favorite_platform,
            top_niches=top_niches,
            daily_activity=daily_activity,
            achievements_unlocked=achievements,
            most_active_day=most_active['date']
        )
    
    def generate_monthly_report(self, user_id: str) -> MonthlyReportData:
        """Generate monthly activity report"""
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)
        
        # Get hooks saved
        hooks_saved = self.db.query(func.count(SavedHook.id)).filter(
            SavedHook.user_id == user_id,
            SavedHook.created_at >= start_date
        ).scalar() or 0
        
        # Get scrapes
        scrapes = self.db.query(func.count(ScrapeHistory.id)).filter(
            ScrapeHistory.user_id == user_id,
            ScrapeHistory.created_at >= start_date
        ).scalar() or 0
        
        # Get collections created
        collections = self.db.query(func.count(CollectionModel.id)).filter(
            CollectionModel.user_id == user_id,
            CollectionModel.created_at >= start_date
        ).scalar() or 0
        
        # Hooks by platform
        platform_data = self.db.query(
            Hook.platform,
            func.count(SavedHook.id).label('count')
        ).join(SavedHook).filter(
            SavedHook.user_id == user_id,
            SavedHook.created_at >= start_date
        ).group_by(Hook.platform).all()
        
        hooks_by_platform = {platform: count for platform, count in platform_data}
        
        # Hooks by niche
        niche_data = self.db.query(
            Hook.niche,
            func.count(SavedHook.id).label('count')
        ).join(SavedHook).filter(
            SavedHook.user_id == user_id,
            SavedHook.created_at >= start_date
        ).group_by(Hook.niche).all()
        
        hooks_by_niche = {niche: count for niche, count in niche_data}
        
        # Weekly breakdown
        weekly_breakdown = []
        for week in range(4):
            week_start = start_date + timedelta(weeks=week)
            week_end = week_start + timedelta(days=7)
            
            count = self.db.query(func.count(SavedHook.id)).filter(
                SavedHook.user_id == user_id,
                SavedHook.created_at >= week_start,
                SavedHook.created_at < week_end
            ).scalar() or 0
            
            weekly_breakdown.append({
                "week": f"Week {week + 1}",
                "hooks_saved": count
            })
        
        # Calculate growth metrics
        previous_month_start = start_date - timedelta(days=30)
        previous_hooks = self.db.query(func.count(SavedHook.id)).filter(
            SavedHook.user_id == user_id,
            SavedHook.created_at >= previous_month_start,
            SavedHook.created_at < start_date
        ).scalar() or 0
        
        growth_rate = ((hooks_saved - previous_hooks) / previous_hooks * 100) if previous_hooks > 0 else 0
        
        growth_metrics = {
            "current_month": hooks_saved,
            "previous_month": previous_hooks,
            "growth_rate": round(growth_rate, 2),
            "average_per_day": round(hooks_saved / 30, 2)
        }
        
        return MonthlyReportData(
            period_start=start_date,
            period_end=end_date,
            total_hooks_saved=hooks_saved,
            total_scrapes=scrapes,
            collections_created=collections,
            hooks_by_platform=hooks_by_platform,
            hooks_by_niche=hooks_by_niche,
            weekly_breakdown=weekly_breakdown,
            growth_metrics=growth_metrics
        )
    
    def export_report(self, user_id: str, request: ReportGenerationRequest) -> str:
        """Export report in specified format"""
        # Generate report data
        if request.report_type == "weekly":
            report_data = self.generate_weekly_report(user_id)
        elif request.report_type == "monthly":
            report_data = self.generate_monthly_report(user_id)
        else:
            # Custom date range
            report_data = self._generate_custom_report(
                user_id, 
                request.start_date, 
                request.end_date
            )
        
        # Export in requested format
        if request.format == ReportFormat.CSV:
            return self._export_to_csv(report_data)
        elif request.format == ReportFormat.JSON:
            return self._export_to_json(report_data)
        else:  # PDF
            return self._export_to_pdf(report_data)
    
    # ==================== AI GENERATION ====================
    
    def generate_hooks_with_ai(self, user_id: str, request: AIGenerationRequest) -> AIGenerationResponse:
        """Generate hooks using AI"""
        start_time = datetime.utcnow()
        
        # Build AI prompt
        prompt = self._build_ai_prompt(request)
        
        # Call OpenAI API
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert content hook writer. Generate compelling, attention-grabbing hooks based on the user's specifications."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=request.temperature,
                n=request.num_variations
            )
            
            # Parse generated hooks
            generated_hooks = []
            for i, choice in enumerate(response.choices):
                hook_content = choice.message.content.strip()
                
                generated_hook = GeneratedHook(
                    id=f"gen_{user_id}_{int(datetime.utcnow().timestamp())}_{i}",
                    content=hook_content,
                    hook_type=request.hook_type,
                    tone=request.tone,
                    niche=request.niche,
                    confidence_score=self._calculate_confidence_score(hook_content),
                    engagement_prediction=self._predict_engagement(hook_content),
                    explanation=self._generate_explanation(hook_content, request.hook_type)
                )
                generated_hooks.append(generated_hook)
            
            generation_time = (datetime.utcnow() - start_time).total_seconds()
            
            # Log generation
            self._log_activity(
                user_id,
                "ai_generation",
                f"Generated {len(generated_hooks)} hooks for topic: {request.topic}"
            )
            
            # Deduct credits
            credits_used = len(generated_hooks)
            self._deduct_credits(user_id, credits_used)
            
            return AIGenerationResponse(
                request_id=f"req_{int(datetime.utcnow().timestamp())}",
                generated_hooks=generated_hooks,
                topic=request.topic,
                parameters={
                    "hook_type": request.hook_type,
                    "tone": request.tone,
                    "niche": request.niche,
                    "num_variations": request.num_variations
                },
                generation_time=generation_time,
                credits_used=credits_used
            )
            
        except Exception as e:
            raise Exception(f"AI generation failed: {str(e)}")
    
    def save_generated_hook(self, user_id: str, hook_content: str, metadata: dict) -> dict:
        """Save AI-generated hook to user's collection"""
        hook = Hook(
            content=hook_content,
            source="AI Generation",
            platform="ai",
            niche=metadata.get('niche'),
            tone=metadata.get('tone'),
            hook_type=metadata.get('hook_type'),
            created_at=datetime.utcnow()
        )
        self.db.add(hook)
        self.db.flush()
        
        # Save to user's hooks
        saved_hook = SavedHook(
            user_id=user_id,
            hook_id=hook.id,
            is_favorite=metadata.get('add_to_favorites', False),
            notes=metadata.get('custom_notes'),
            created_at=datetime.utcnow()
        )
        self.db.add(saved_hook)
        
        # Add to collection if specified
        if metadata.get('collection_id'):
            collection_hook = CollectionHook(
                collection_id=metadata['collection_id'],
                hook_id=hook.id,
                created_at=datetime.utcnow()
            )
            self.db.add(collection_hook)
        
        self.db.commit()
        
        self._log_activity(user_id, "hook_saved", f"Saved AI-generated hook")
        
        return {"message": "Hook saved successfully", "hook_id": hook.id}
    
    # ==================== BULK OPERATIONS ====================
    
    def perform_bulk_operation(self, user_id: str, operation: BulkHookOperation) -> BulkOperationResponse:
        """Perform bulk operations on hooks"""
        success_count = 0
        failed_count = 0
        failed_ids = []
        
        for hook_id in operation.hook_ids:
            try:
                saved_hook = self.db.query(SavedHook).filter(
                    SavedHook.hook_id == hook_id,
                    SavedHook.user_id == user_id
                ).first()
                
                if not saved_hook:
                    failed_ids.append(hook_id)
                    failed_count += 1
                    continue
                
                if operation.operation == "delete":
                    self.db.delete(saved_hook)
                elif operation.operation == "favorite":
                    saved_hook.is_favorite = True
                elif operation.operation == "unfavorite":
                    saved_hook.is_favorite = False
                elif operation.operation == "move":
                    if operation.target_collection_id:
                        # Remove from old collections
                        self.db.query(CollectionHook).filter(
                            CollectionHook.hook_id == hook_id
                        ).delete()
                        
                        # Add to new collection
                        collection_hook = CollectionHook(
                            collection_id=operation.target_collection_id,
                            hook_id=hook_id,
                            created_at=datetime.utcnow()
                        )
                        self.db.add(collection_hook)
                
                success_count += 1
                
            except Exception as e:
                failed_ids.append(hook_id)
                failed_count += 1
        
        self.db.commit()
        
        self._log_activity(
            user_id,
            "bulk_operation",
            f"Performed {operation.operation} on {success_count} hooks"
        )
        
        return BulkOperationResponse(
            success_count=success_count,
            failed_count=failed_count,
            failed_ids=failed_ids,
            message=f"Bulk {operation.operation} completed: {success_count} succeeded, {failed_count} failed"
        )
    
    # ==================== ANALYTICS ====================
    
    def get_hook_analytics(self, user_id: str, hook_id: str) -> HookAnalytics:
        """Get analytics for specific hook"""
        # Get hook stats
        hook = self.db.query(SavedHook).filter(
            SavedHook.hook_id == hook_id,
            SavedHook.user_id == user_id
        ).first()
        
        if not hook:
            raise ValueError("Hook not found")
        
        # Get copy count
        copies = self.db.query(func.count(HookCopy.id)).filter(
            HookCopy.hook_id == hook_id
        ).scalar() or 0
        
        # Calculate engagement rate
        views = hook.view_count or 0
        engagement_rate = (copies / views * 100) if views > 0 else 0
        
        return HookAnalytics(
            hook_id=hook_id,
            views=views,
            copies=copies,
            shares=0,  # Implement if you have sharing feature
            favorites=1 if hook.is_favorite else 0,
            engagement_rate=round(engagement_rate, 2),
            best_performing_time=None  # Implement time analysis
        )
    
    def get_collection_analytics(self, user_id: str, collection_id: str) -> CollectionAnalytics:
        """Get analytics for collection"""
        collection = self.db.query(CollectionModel).filter(
            CollectionModel.id == collection_id,
            CollectionModel.user_id == user_id
        ).first()
        
        if not collection:
            raise ValueError("Collection not found")
        
        # Get hook count
        total_hooks = self.db.query(func.count(CollectionHook.id)).filter(
            CollectionHook.collection_id == collection_id
        ).scalar() or 0
        
        # Calculate total views
        total_views = self.db.query(func.sum(SavedHook.view_count)).join(
            CollectionHook
        ).filter(
            CollectionHook.collection_id == collection_id
        ).scalar() or 0
        
        # Calculate average engagement
        average_engagement = total_views / total_hooks if total_hooks > 0 else 0
        
        # Calculate growth rate
        one_week_ago = datetime.utcnow() - timedelta(days=7)
        recent_hooks = self.db.query(func.count(CollectionHook.id)).filter(
            CollectionHook.collection_id == collection_id,
            CollectionHook.created_at >= one_week_ago
        ).scalar() or 0
        
        growth_rate = (recent_hooks / total_hooks * 100) if total_hooks > 0 else 0
        
        return CollectionAnalytics(
            collection_id=collection_id,
            total_hooks=total_hooks,
            total_views=int(total_views),
            average_engagement=round(average_engagement, 2),
            growth_rate=round(growth_rate, 2),
            most_popular_hook=None  # Implement most viewed hook
        )
    
    def get_platform_analytics(self, user_id: str) -> List[PlatformAnalytics]:
        """Get analytics for all platforms"""
        platforms = ['youtube', 'reddit', 'instagram']
        analytics = []
        
        for platform in platforms:
            # Get scrape count
            total_scrapes = self.db.query(func.count(ScrapeHistory.id)).filter(
                ScrapeHistory.user_id == user_id,
                ScrapeHistory.platform == platform
            ).scalar() or 0
            
            # Get hook count
            total_hooks = self.db.query(func.count(SavedHook.id)).join(Hook).filter(
                SavedHook.user_id == user_id,
                Hook.platform == platform
            ).scalar() or 0
            
            # Get success rate
            successful_scrapes = self.db.query(func.count(ScrapeHistory.id)).filter(
                ScrapeHistory.user_id == user_id,
                ScrapeHistory.platform == platform,
                ScrapeHistory.status == 'success'
            ).scalar() or 0
            
            success_rate = (successful_scrapes / total_scrapes * 100) if total_scrapes > 0 else 0
            
            # Calculate average hooks per scrape
            avg_hooks = total_hooks / total_scrapes if total_scrapes > 0 else 0
            
            # Get last scrape
            last_scrape = self.db.query(ScrapeHistory.created_at).filter(
                ScrapeHistory.user_id == user_id,
                ScrapeHistory.platform == platform
            ).order_by(desc(ScrapeHistory.created_at)).first()
            
            analytics.append(PlatformAnalytics(
                platform=platform,
                total_scrapes=total_scrapes,
                total_hooks=total_hooks,
                success_rate=round(success_rate, 2),
                average_hooks_per_scrape=round(avg_hooks, 2),
                last_scrape=last_scrape[0] if last_scrape else None
            ))
        
        return analytics
    
    # ==================== HELPER METHODS ====================
    
    def _create_default_settings(self, user_id: str) -> UserSettings:
        """Create default settings for user"""
        settings = UserSettings(
            user_id=user_id,
            weekly_report_enabled=True,
            report_format=ReportFormat.CSV,
            report_frequency="weekly",
            default_hook_type=HookType.CURIOSITY_GAP,
            default_tone=ToneType.PROFESSIONAL,
            default_niche=NicheCategory.MARKETING,
            email_notifications=True,
            desktop_notifications=False,
            scrape_completion_alerts=True,
            theme="dark",
            cards_per_page=18,
            default_view="grid",
            profile_visibility="private",
            show_activity=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(settings)
        self.db.commit()
        self.db.refresh(settings)
        return settings
    
    def _build_ai_prompt(self, request: AIGenerationRequest) -> str:
        """Build AI prompt from request parameters"""
        prompt = f"""Generate {request.num_variations} compelling content hooks about: {request.topic}

Hook Type: {request.hook_type}
Tone: {request.tone}
Niche: {request.niche}
Target Audience: {request.target_audience or 'General audience'}

Additional Context: {request.additional_context or 'None'}

Requirements:
- Each hook should be attention-grabbing and concise (1-2 sentences)
- Match the specified tone and hook type
- Be relevant to the {request.niche} niche
- Be optimized for {request.target_audience or 'engagement'}

Generate only the hooks, one per line."""
        
        return prompt
    
    def _calculate_confidence_score(self, hook_content: str) -> float:
        """Calculate confidence score for generated hook"""
        # Simple heuristic based on length and structure
        score = 0.5
        
        if len(hook_content) > 50:
            score += 0.1
        if '?' in hook_content:
            score += 0.1
        if any(word in hook_content.lower() for word in ['you', 'your']):
            score += 0.1
        if hook_content[0].isupper():
            score += 0.1
        if len(hook_content.split()) > 5:
            score += 0.1
            
        return min(score, 1.0)
    
    def _predict_engagement(self, hook_content: str) -> str:
        """Predict engagement level"""
        score = self._calculate_confidence_score(hook_content)
        
        if score >= 0.8:
            return "High"
        elif score >= 0.6:
            return "Medium"
        else:
            return "Low"
    
    def _generate_explanation(self, hook_content: str, hook_type: HookType) -> str:
        """Generate explanation for the hook"""
        explanations = {
            HookType.CURIOSITY_GAP: "This hook creates curiosity by withholding key information",
            HookType.BOLD_CLAIM: "This hook makes a strong, attention-grabbing statement",
            HookType.QUESTION: "This hook engages readers by posing a thought-provoking question",
            HookType.STORY_HOOK: "This hook draws readers in with a narrative element",
            HookType.STATISTIC: "This hook uses data to establish credibility and interest"
        }
        return explanations.get(hook_type, "This hook is designed to capture attention")
    
    def _get_recent_achievements(self, user_id: str, since: datetime) -> List[str]:
        """Get achievements unlocked in time period"""
        achievements = []
        
        # Check for milestones
        hooks_saved = self.db.query(func.count(SavedHook.id)).filter(
            SavedHook.user_id == user_id,
            SavedHook.created_at >= since
        ).scalar()
        
        if hooks_saved >= 10:
            achievements.append("Hook Hunter - Saved 10 hooks!")
        if hooks_saved >= 50:
            achievements.append("Content Curator - Saved 50 hooks!")
        
        return achievements
    
    def _export_to_csv(self, report_data) -> str:
        """Export report data to CSV"""
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write headers
        writer.writerow(['Metric', 'Value'])
        
        # Write data
        for key, value in report_data.dict().items():
            if isinstance(value, (list, dict)):
                value = json.dumps(value)
            writer.writerow([key, value])
        
        return output.getvalue()
    
    def _export_to_json(self, report_data) -> str:
        """Export report data to JSON"""
        return json.dumps(report_data.dict(), indent=2, default=str)
    
    def _export_to_pdf(self, report_data) -> str:
        """Export report data to PDF"""
        # Implement PDF generation using reportlab or similar
        return "PDF generation not implemented"
    
    def _generate_custom_report(self, user_id: str, start_date: datetime, end_date: datetime):
        """Generate custom date range report"""
        # Implement custom report logic
        pass
    
    def _deduct_credits(self, user_id: str, credits: int):
        """Deduct AI generation credits"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.ai_credits = max(0, (user.ai_credits or 0) - credits)
            self.db.commit()
    
    def _log_activity(self, user_id: str, activity_type: str, description: str):
        """Log user activity"""
        activity = ActivityLog(
            user_id=user_id,
            activity_type=activity_type,
            description=description,
            created_at=datetime.utcnow()
        )
        self.db.add(activity)
        self.db.commit()