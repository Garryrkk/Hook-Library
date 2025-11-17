from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, desc
import json
import csv
import io
from collections import defaultdict

from .userprofileschemas import (
    UserProfile, ProfileSummary, QuickStats, ActivityOverview,
    WeeklyActivity, PlatformBreakdown, Collection, CollectionCreate,
    CollectionUpdate, ScrapeRecord, ScrapingStats, Achievement,
    UserLevel, UserRole, PlanType, UsageStats, PlanInfo,
    ActivityItem, ExportFormat, AccountSettings, UserInfoUpdate,
    NotificationPreferences, DisplayPreferences, ScrapingPreferences
)


class UserProfileService:
    def __init__(self, db: Session):
        self.db = db
        
    # ==================== PROFILE MANAGEMENT ====================
    
    def get_user_profile(self, user_id: str) -> UserProfile:
        """Get complete user profile with all data"""
        user = self._get_user_by_id(user_id)
        
        return UserProfile(
            id=user.id,
            full_name=user.full_name,
            username=user.username,
            email=user.email,
            email_verified=user.email_verified,
            profile_picture=user.profile_picture,
            bio=user.bio,
            role=self._get_user_role(user_id),
            member_since=user.created_at,
            quick_stats=self.get_quick_stats(user_id),
            activity_overview=self.get_activity_overview(user_id),
            collections=self.get_user_collections(user_id),
            settings=self.get_account_settings(user_id),
            usage_stats=self.get_usage_stats(user_id),
            plan_info=self.get_plan_info(user_id),
            achievements=self.get_achievements(user_id),
            user_level=self.get_user_level(user_id),
            recent_activity=self.get_recent_activity(user_id, limit=20),
            connected_accounts=self.get_connected_accounts(user_id),
            is_public=user.is_public
        )
    
    def get_profile_summary(self, user_id: str) -> ProfileSummary:
        """Get lightweight profile summary"""
        user = self._get_user_by_id(user_id)
        
        return ProfileSummary(
            id=user.id,
            username=user.username,
            full_name=user.full_name,
            profile_picture=user.profile_picture,
            role=self._get_user_role(user_id),
            quick_stats=self.get_quick_stats(user_id),
            is_public=user.is_public
        )
    
    def update_profile_info(self, user_id: str, update_data: UserInfoUpdate) -> dict:
        """Update user profile information"""
        user = self._get_user_by_id(user_id)
        
        if update_data.full_name:
            user.full_name = update_data.full_name
        if update_data.username:
            # Check if username is taken
            existing = self.db.query(User).filter(
                User.username == update_data.username,
                User.id != user_id
            ).first()
            if existing:
                raise ValueError("Username already taken")
            user.username = update_data.username
        if update_data.bio is not None:
            user.bio = update_data.bio
            
        user.updated_at = datetime.utcnow()
        self.db.commit()
        
        self._log_activity(user_id, "profile_updated", "Updated profile information")
        
        return {"message": "Profile updated successfully"}
    
    def update_profile_picture(self, user_id: str, image_data: str) -> dict:
        """Update profile picture"""
        user = self._get_user_by_id(user_id)
        
        # In production, upload to S3/CloudStorage
        # For now, store base64 or file path
        user.profile_picture = image_data
        user.updated_at = datetime.utcnow()
        self.db.commit()
        
        self._log_activity(user_id, "profile_picture_updated", "Changed profile picture")
        
        return {"message": "Profile picture updated", "url": image_data}
    
    # ==================== QUICK STATS ====================
    
    def get_quick_stats(self, user_id: str) -> QuickStats:
        """Get quick stats for profile header"""
        saved_hooks = self.db.query(func.count(SavedHook.id)).filter(
            SavedHook.user_id == user_id
        ).scalar() or 0
        
        hooks_copied = self.db.query(func.count(HookCopy.id)).filter(
            HookCopy.user_id == user_id
        ).scalar() or 0
        
        collections_count = self.db.query(func.count(Collection.id)).filter(
            Collection.user_id == user_id
        ).scalar() or 0
        
        streak = self._calculate_active_streak(user_id)
        
        return QuickStats(
            total_hooks_saved=saved_hooks,
            hooks_copied=hooks_copied,
            collections_created=collections_count,
            days_active_streak=streak
        )
    
    # ==================== ACTIVITY OVERVIEW ====================
    
    def get_activity_overview(self, user_id: str, days: int = 7) -> ActivityOverview:
        """Get activity overview dashboard data"""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Weekly activity
        weekly_data = self.db.query(
            func.date(SavedHook.created_at).label('date'),
            func.count(SavedHook.id).label('hooks_saved')
        ).filter(
            SavedHook.user_id == user_id,
            SavedHook.created_at >= start_date
        ).group_by(func.date(SavedHook.created_at)).all()
        
        scrape_data = self.db.query(
            func.date(ScrapeHistory.created_at).label('date'),
            func.count(ScrapeHistory.id).label('scrapes')
        ).filter(
            ScrapeHistory.user_id == user_id,
            ScrapeHistory.created_at >= start_date
        ).group_by(func.date(ScrapeHistory.created_at)).all()
        
        # Combine data
        activity_dict = {}
        for item in weekly_data:
            activity_dict[str(item.date)] = {
                'hooks_saved': item.hooks_saved,
                'scrapes_performed': 0
            }
        for item in scrape_data:
            if str(item.date) in activity_dict:
                activity_dict[str(item.date)]['scrapes_performed'] = item.scrapes
            else:
                activity_dict[str(item.date)] = {
                    'hooks_saved': 0,
                    'scrapes_performed': item.scrapes
                }
        
        weekly_activity = [
            WeeklyActivity(
                date=date,
                hooks_saved=data['hooks_saved'],
                scrapes_performed=data['scrapes_performed']
            )
            for date, data in sorted(activity_dict.items())
        ]
        
        # Platform breakdown
        platform_counts = self.db.query(
            Hook.platform,
            func.count(SavedHook.id)
        ).join(SavedHook).filter(
            SavedHook.user_id == user_id
        ).group_by(Hook.platform).all()
        
        total = sum(count for _, count in platform_counts)
        platform_breakdown = PlatformBreakdown()
        if total > 0:
            for platform, count in platform_counts:
                percentage = (count / total) * 100
                if platform == 'youtube':
                    platform_breakdown.youtube = percentage
                elif platform == 'reddit':
                    platform_breakdown.reddit = percentage
                elif platform == 'instagram':
                    platform_breakdown.instagram = percentage
        
        # Favorite categories
        favorite_categories = self._get_favorite_categories(user_id, limit=5)
        favorite_tones = self._get_favorite_tones(user_id, limit=3)
        
        return ActivityOverview(
            weekly_activity=weekly_activity,
            platform_breakdown=platform_breakdown,
            favorite_categories=favorite_categories,
            favorite_tones=favorite_tones
        )
    
    # ==================== COLLECTIONS ====================
    
    def get_user_collections(self, user_id: str) -> List[Collection]:
        """Get all user collections"""
        collections = self.db.query(CollectionModel).filter(
            CollectionModel.user_id == user_id
        ).order_by(desc(CollectionModel.updated_at)).all()
        
        result = []
        for coll in collections:
            hooks_count = self.db.query(func.count(CollectionHook.id)).filter(
                CollectionHook.collection_id == coll.id
            ).scalar() or 0
            
            result.append(Collection(
                id=coll.id,
                name=coll.name,
                description=coll.description,
                is_public=coll.is_public,
                hooks_count=hooks_count,
                created_at=coll.created_at,
                updated_at=coll.updated_at
            ))
        
        return result
    
    def create_collection(self, user_id: str, data: CollectionCreate) -> Collection:
        """Create new collection"""
        collection = CollectionModel(
            user_id=user_id,
            name=data.name,
            description=data.description,
            is_public=data.is_public,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(collection)
        self.db.commit()
        self.db.refresh(collection)
        
        self._log_activity(user_id, "collection_created", f"Created collection '{data.name}'")
        self._check_collection_achievement(user_id)
        
        return Collection(
            id=collection.id,
            name=collection.name,
            description=collection.description,
            is_public=collection.is_public,
            hooks_count=0,
            created_at=collection.created_at,
            updated_at=collection.updated_at
        )
    
    def update_collection(self, user_id: str, collection_id: str, data: CollectionUpdate) -> Collection:
        """Update collection"""
        collection = self.db.query(CollectionModel).filter(
            CollectionModel.id == collection_id,
            CollectionModel.user_id == user_id
        ).first()
        
        if not collection:
            raise ValueError("Collection not found")
        
        if data.name:
            collection.name = data.name
        if data.description is not None:
            collection.description = data.description
        if data.is_public is not None:
            collection.is_public = data.is_public
        
        collection.updated_at = datetime.utcnow()
        self.db.commit()
        
        return self._collection_to_schema(collection)
    
    def delete_collection(self, user_id: str, collection_id: str) -> dict:
        """Delete collection"""
        collection = self.db.query(CollectionModel).filter(
            CollectionModel.id == collection_id,
            CollectionModel.user_id == user_id
        ).first()
        
        if not collection:
            raise ValueError("Collection not found")
        
        # Delete all collection hooks
        self.db.query(CollectionHook).filter(
            CollectionHook.collection_id == collection_id
        ).delete()
        
        self.db.delete(collection)
        self.db.commit()
        
        return {"message": "Collection deleted successfully"}
    
    # ==================== SCRAPING HISTORY ====================
    
    def get_scraping_history(self, user_id: str, limit: int = 50) -> List[ScrapeRecord]:
        """Get scraping history"""
        scrapes = self.db.query(ScrapeHistory).filter(
            ScrapeHistory.user_id == user_id
        ).order_by(desc(ScrapeHistory.created_at)).limit(limit).all()
        
        return [
            ScrapeRecord(
                id=scrape.id,
                platform=scrape.platform,
                hooks_fetched=scrape.hooks_fetched,
                status=scrape.status,
                created_at=scrape.created_at,
                filters_used=json.loads(scrape.filters_used) if scrape.filters_used else None
            )
            for scrape in scrapes
        ]
    
    def get_scraping_stats(self, user_id: str) -> ScrapingStats:
        """Get scraping statistics"""
        total_scrapes = self.db.query(func.count(ScrapeHistory.id)).filter(
            ScrapeHistory.user_id == user_id
        ).scalar() or 0
        
        successful_scrapes = self.db.query(func.count(ScrapeHistory.id)).filter(
            ScrapeHistory.user_id == user_id,
            ScrapeHistory.status == 'success'
        ).scalar() or 0
        
        success_rate = (successful_scrapes / total_scrapes * 100) if total_scrapes > 0 else 0
        
        avg_hooks = self.db.query(func.avg(ScrapeHistory.hooks_fetched)).filter(
            ScrapeHistory.user_id == user_id,
            ScrapeHistory.status == 'success'
        ).scalar() or 0
        
        last_scrape = self.db.query(ScrapeHistory).filter(
            ScrapeHistory.user_id == user_id
        ).order_by(desc(ScrapeHistory.created_at)).first()
        
        last_scrape_data = None
        if last_scrape:
            last_scrape_data = {
                'platform': last_scrape.platform,
                'time_ago': self._time_ago(last_scrape.created_at),
                'hooks_fetched': last_scrape.hooks_fetched
            }
        
        return ScrapingStats(
            total_scrapes=total_scrapes,
            success_rate=round(success_rate, 2),
            average_hooks_per_scrape=round(float(avg_hooks), 2),
            last_scrape=last_scrape_data
        )
    
    # ==================== SETTINGS ====================
    
    def get_account_settings(self, user_id: str) -> AccountSettings:
        """Get user account settings"""
        user = self._get_user_by_id(user_id)
        settings = user.settings or {}
        
        return AccountSettings(
            email=user.email,
            two_factor_enabled=user.two_factor_enabled,
            notification_preferences=NotificationPreferences(**settings.get('notifications', {})),
            display_preferences=DisplayPreferences(**settings.get('display', {})),
            scraping_preferences=ScrapingPreferences(**settings.get('scraping', {}))
        )
    
    def update_settings(self, user_id: str, settings_data: dict) -> dict:
        """Update account settings"""
        user = self._get_user_by_id(user_id)
        
        current_settings = user.settings or {}
        current_settings.update(settings_data)
        user.settings = current_settings
        user.updated_at = datetime.utcnow()
        
        self.db.commit()
        
        return {"message": "Settings updated successfully"}
    
    # ==================== USAGE & LIMITS ====================
    
    def get_usage_stats(self, user_id: str) -> UsageStats:
        """Get usage statistics"""
        user = self._get_user_by_id(user_id)
        plan = self._get_user_plan(user_id)
        
        # Calculate scrapes this month
        first_day = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0)
        scrapes_used = self.db.query(func.count(ScrapeHistory.id)).filter(
            ScrapeHistory.user_id == user_id,
            ScrapeHistory.created_at >= first_day
        ).scalar() or 0
        
        # Calculate storage
        total_hooks = self.db.query(func.count(SavedHook.id)).filter(
            SavedHook.user_id == user_id
        ).scalar() or 0
        storage_used_mb = (total_hooks * 0.5)  # Rough estimate
        
        return UsageStats(
            scrapes_remaining=plan['scrapes_limit'] - scrapes_used,
            scrapes_used=scrapes_used,
            scrapes_limit=plan['scrapes_limit'],
            storage_used_mb=round(storage_used_mb, 2),
            storage_limit_mb=plan['storage_limit'] * 1024,
            rate_limit_status="normal"
        )
    
    def get_plan_info(self, user_id: str) -> PlanInfo:
        """Get user plan information"""
        plan = self._get_user_plan(user_id)
        
        return PlanInfo(**plan)
    
    # ==================== ACHIEVEMENTS ====================
    
    def get_achievements(self, user_id: str) -> List[Achievement]:
        """Get user achievements"""
        achievements_data = [
            {
                'id': 'hook_hunter',
                'name': 'Hook Hunter',
                'description': 'Save your first 10 hooks',
                'icon': '🎯',
                'required': 10
            },
            {
                'id': 'content_curator',
                'name': 'Content Curator',
                'description': 'Save 100 hooks',
                'icon': '📚',
                'required': 100
            },
            {
                'id': 'platform_master',
                'name': 'Platform Master',
                'description': 'Scrape all 3 platforms',
                'icon': '🌟',
                'required': 3
            },
            {
                'id': 'streak_keeper',
                'name': 'Streak Keeper',
                'description': 'Maintain 7-day active streak',
                'icon': '🔥',
                'required': 7
            },
            {
                'id': 'collection_builder',
                'name': 'Collection Builder',
                'description': 'Create 5 collections',
                'icon': '📁',
                'required': 5
            }
        ]
        
        stats = self.get_quick_stats(user_id)
        platforms_scraped = self._get_platforms_scraped_count(user_id)
        
        achievements = []
        for ach in achievements_data:
            progress = 0
            unlocked = False
            unlocked_at = None
            
            if ach['id'] == 'hook_hunter':
                progress = min(stats.total_hooks_saved, 10)
                unlocked = stats.total_hooks_saved >= 10
            elif ach['id'] == 'content_curator':
                progress = min(stats.total_hooks_saved, 100)
                unlocked = stats.total_hooks_saved >= 100
            elif ach['id'] == 'platform_master':
                progress = platforms_scraped
                unlocked = platforms_scraped >= 3
            elif ach['id'] == 'streak_keeper':
                progress = min(stats.days_active_streak, 7)
                unlocked = stats.days_active_streak >= 7
            elif ach['id'] == 'collection_builder':
                progress = min(stats.collections_created, 5)
                unlocked = stats.collections_created >= 5
            
            if unlocked:
                unlocked_at = self._get_achievement_unlock_date(user_id, ach['id'])
            
            achievements.append(Achievement(
                id=ach['id'],
                name=ach['name'],
                description=ach['description'],
                icon=ach['icon'],
                unlocked=unlocked,
                unlocked_at=unlocked_at,
                progress=progress,
                required=ach['required']
            ))
        
        return achievements
    
    def get_user_level(self, user_id: str) -> UserLevel:
        """Calculate user level based on XP"""
        xp = self._calculate_user_xp(user_id)
        
        # Level thresholds
        levels = [
            (0, UserRole.HOOK_ROOKIE),
            (100, UserRole.HOOK_HUNTER),
            (500, UserRole.CONTENT_CURATOR),
            (1000, UserRole.HOOK_MASTER),
            (2000, UserRole.PLATFORM_MASTER)
        ]
        
        current_level = 0
        current_title = UserRole.HOOK_ROOKIE
        required_xp = 100
        
        for i, (threshold, title) in enumerate(levels):
            if xp >= threshold:
                current_level = i
                current_title = title
                if i < len(levels) - 1:
                    required_xp = levels[i + 1][0]
        
        progress = xp - levels[current_level][0] if current_level < len(levels) else 0
        
        return UserLevel(
            level=current_level,
            title=current_title,
            progress=progress,
            required_xp=required_xp,
            current_xp=xp
        )
    
    # ==================== EXPORT ====================
    
    def export_data(self, user_id: str, format: ExportFormat, collection_ids: Optional[List[str]] = None) -> str:
        """Export user data"""
        if collection_ids:
            hooks = self._get_hooks_from_collections(user_id, collection_ids)
        else:
            hooks = self._get_all_saved_hooks(user_id)
        
        if format == ExportFormat.CSV:
            return self._export_to_csv(hooks)
        else:
            return self._export_to_json(hooks)
    
    # ==================== ACTIVITY FEED ====================
    
    def get_recent_activity(self, user_id: str, limit: int = 20) -> List[ActivityItem]:
        """Get recent activity feed"""
        activities = self.db.query(ActivityLog).filter(
            ActivityLog.user_id == user_id
        ).order_by(desc(ActivityLog.created_at)).limit(limit).all()
        
        return [
            ActivityItem(
                id=act.id,
                activity_type=act.activity_type,
                description=act.description,
                metadata=json.loads(act.metadata) if act.metadata else None,
                created_at=act.created_at
            )
            for act in activities
        ]
    
    # ==================== INTEGRATIONS ====================
    
    def get_connected_accounts(self, user_id: str) -> List[Dict[str, Any]]:
        """Get connected social accounts"""
        connections = self.db.query(ConnectedAccount).filter(
            ConnectedAccount.user_id == user_id
        ).all()
        
        platforms = ['youtube', 'reddit', 'instagram']
        result = []
        
        for platform in platforms:
            conn = next((c for c in connections if c.platform == platform), None)
            result.append({
                'platform': platform,
                'connected': conn is not None,
                'username': conn.username if conn else None,
                'connected_at': conn.connected_at if conn else None
            })
        
        return result
    
    # ==================== HELPER METHODS ====================
    
    def _get_user_by_id(self, user_id: str):
        """Get user from database"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        return user
    
    def _get_user_role(self, user_id: str) -> UserRole:
        """Determine user role based on level"""
        level = self.get_user_level(user_id)
        return level.title
    
    def _calculate_active_streak(self, user_id: str) -> int:
        """Calculate consecutive active days"""
        today = datetime.utcnow().date()
        streak = 0
        
        for i in range(365):  # Check up to 1 year
            check_date = today - timedelta(days=i)
            activity = self.db.query(SavedHook).filter(
                SavedHook.user_id == user_id,
                func.date(SavedHook.created_at) == check_date
            ).first()
            
            if activity:
                streak += 1
            elif i > 0:  # Break if no activity (but not on first day)
                break
        
        return streak
    
    def _get_favorite_categories(self, user_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get user's favorite categories"""
        categories = self.db.query(
            Hook.niche,
            func.count(SavedHook.id).label('count')
        ).join(SavedHook).filter(
            SavedHook.user_id == user_id
        ).group_by(Hook.niche).order_by(desc('count')).limit(limit).all()
        
        return [{'niche': cat.niche, 'count': cat.count} for cat in categories]
    
    def _get_favorite_tones(self, user_id: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Get user's favorite tones"""
        tones = self.db.query(
            Hook.tone,
            func.count(SavedHook.id).label('count')
        ).join(SavedHook).filter(
            SavedHook.user_id == user_id
        ).group_by(Hook.tone).order_by(desc('count')).limit(limit).all()
        
        return [{'tone': tone.tone, 'count': tone.count} for tone in tones]
    
    def _calculate_user_xp(self, user_id: str) -> int:
        """Calculate total user XP"""
        stats = self.get_quick_stats(user_id)
        
        xp = 0
        xp += stats.total_hooks_saved * 5
        xp += stats.hooks_copied * 2
        xp += stats.collections_created * 20
        xp += stats.days_active_streak * 10
        
        return xp
    
    def _get_user_plan(self, user_id: str) -> dict:
        """Get user's subscription plan"""
        user = self._get_user_by_id(user_id)
        
        plans = {
            PlanType.FREE: {
                'plan_type': PlanType.FREE,
                'features': ['10 scrapes/month', '100 hooks storage', 'Basic analytics'],
                'scrapes_per_month': 10,
                'scrapes_limit': 10,
                'storage_limit_gb': 0.1,
                'storage_limit': 0.1,
                'api_access': False,
                'price': 0.0
            },
            PlanType.PRO: {
                'plan_type': PlanType.PRO,
                'features': ['Unlimited scrapes', 'Unlimited storage', 'Advanced analytics', 'API access'],
                'scrapes_per_month': 999999,
                'scrapes_limit': 999999,
                'storage_limit_gb': 10,
                'storage_limit': 10,
                'api_access': True,
                'price': 19.99
            },
            PlanType.ENTERPRISE: {
                'plan_type': PlanType.ENTERPRISE,
                'features': ['Everything in Pro', 'Priority support', 'Custom integrations', 'Team features'],
                'scrapes_per_month': 999999,
                'scrapes_limit': 999999,
                'storage_limit_gb': 100,
                'storage_limit': 100,
                'api_access': True,
                'price': 99.99
            }
        }
        
        return plans.get(user.plan_type, plans[PlanType.FREE])
    
    def _time_ago(self, dt: datetime) -> str:
        """Convert datetime to 'time ago' string"""
        now = datetime.utcnow()
        diff = now - dt
        
        if diff.days > 365:
            return f"{diff.days // 365} year(s) ago"
        elif diff.days > 30:
            return f"{diff.days // 30} month(s) ago"
        elif diff.days > 0:
            return f"{diff.days} day(s) ago"
        elif diff.seconds > 3600:
            return f"{diff.seconds // 3600} hour(s) ago"
        elif diff.seconds > 60:
            return f"{diff.seconds // 60} minute(s) ago"
        else:
            return "just now"
    
    def _log_activity(self, user_id: str, activity_type: str, description: str, metadata: dict = None):
        """Log user activity"""
        activity = ActivityLog(
            user_id=user_id,
            activity_type=activity_type,
            description=description,
            metadata=json.dumps(metadata) if metadata else None,
            created_at=datetime.utcnow()
        )
        self.db.add(activity)
        self.db.commit()
    
    def _check_collection_achievement(self, user_id: str):
        """Check if user unlocked collection achievement"""
        count = self.db.query(func.count(CollectionModel.id)).filter(
            CollectionModel.user_id == user_id
        ).scalar()
        
        if count == 5:
            self._log_activity(user_id, "achievement_unlocked", 
                             "Unlocked Collection Builder achievement! 🎉")
    
    def _get_platforms_scraped_count(self, user_id: str) -> int:
        """Get count of unique platforms scraped"""
        platforms = self.db.query(func.count(func.distinct(ScrapeHistory.platform))).filter(
            ScrapeHistory.user_id == user_id
        ).scalar() or 0
        return platforms
    
    def _get_achievement_unlock_date(self, user_id: str, achievement_id: str) -> Optional[datetime]:
        """Get when achievement was unlocked"""
        # Would query achievement_unlocks table in production
        return datetime.utcnow()
    
    def _export_to_csv(self, hooks: List) -> str:
        """Export hooks to CSV"""
        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow(['ID', 'Platform', 'Hook Text', 'Niche', 'Tone', 'Saved At'])
        for hook in hooks:
            writer.writerow([
                hook.id,
                hook.platform,
                hook.hook_text,
                hook.niche,
                hook.tone,
                hook.saved_at.isoformat()
            ])
        
        return output.getvalue()