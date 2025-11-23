from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import io
import json

from ..Settings.Settingsreportsservice import SettingsReportsService
from ..Settings.Settingsreportsschemas import (
    UserSettingsUpdate, UserSettingsResponse, ReportGenerationRequest,
    WeeklyReportData, MonthlyReportData, AIGenerationRequest,
    AIGenerationResponse, SaveGeneratedHookRequest, BulkHookOperation,
    BulkOperationResponse, ExportRequest, ExportResponse,
    HookAnalytics, CollectionAnalytics, PlatformAnalytics,
    ShufflePromptRequest, ShufflePromptResponse, ReportFormat,
    ScheduledScrapeSettings, ScheduledReportSettings
)
from app.core.database import get_db
from Auth.authroutes import get_current_user



router = APIRouter(prefix="/api", tags=["Settings & Reports"])


# ==================== USER SETTINGS ====================

@router.get("/settings", response_model=UserSettingsResponse)
async def get_user_settings(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user settings
    
    Returns all user preferences including:
    - Report settings
    - AI generation defaults
    - Notification preferences
    - Display preferences
    """
    try:
        service = SettingsReportsService(db)
        return service.get_user_settings(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/settings", response_model=UserSettingsResponse)
async def update_user_settings(
    settings_data: UserSettingsUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user settings
    
    Update any combination of user preferences.
    Only provided fields will be updated.
    """
    try:
        service = SettingsReportsService(db)
        return service.update_user_settings(current_user['id'], settings_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/settings/scheduled-scraping")
async def update_scheduled_scraping(
    settings: ScheduledScrapeSettings,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Configure scheduled scraping
    
    Set up automatic scraping at specified intervals.
    """
    try:
        # Store scheduled scraping settings
        user = db.query(User).filter(User.id == current_user['id']).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.scheduled_scrape_settings = settings.dict()
        db.commit()
        
        return {"message": "Scheduled scraping configured successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/settings/scheduled-reports")
async def update_scheduled_reports(
    settings: ScheduledReportSettings,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Configure scheduled reports
    
    Set up automatic report generation and delivery.
    """
    try:
        user = db.query(User).filter(User.id == current_user['id']).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.scheduled_report_settings = settings.dict()
        db.commit()
        
        return {"message": "Scheduled reports configured successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== REPORT GENERATION ====================

@router.get("/reports/weekly", response_model=WeeklyReportData)
async def get_weekly_report(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate weekly activity report
    
    Returns comprehensive statistics for the past 7 days including:
    - Total hooks saved
    - Scraping activity
    - Collections created
    - Daily breakdown
    - Top categories and platforms
    """
    try:
        service = SettingsReportsService(db)
        return service.generate_weekly_report(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reports/monthly", response_model=MonthlyReportData)
async def get_monthly_report(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate monthly activity report
    
    Returns comprehensive statistics for the past 30 days including:
    - Total activity metrics
    - Platform breakdown
    - Niche analysis
    - Weekly trends
    - Growth metrics
    """
    try:
        service = SettingsReportsService(db)
        return service.generate_monthly_report(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reports/export")
async def export_report(
    report_request: ReportGenerationRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Export report in specified format
    
    - **report_type**: weekly, monthly, or custom
    - **format**: csv, json, or pdf
    - **start_date**: For custom reports (optional)
    - **end_date**: For custom reports (optional)
    
    Returns downloadable file in requested format.
    """
    try:
        service = SettingsReportsService(db)
        data = service.export_report(current_user['id'], report_request)
        
        # Set appropriate content type and filename
        if report_request.format == ReportFormat.CSV:
            media_type = "text/csv"
            filename = f"{report_request.report_type}_report.csv"
        elif report_request.format == ReportFormat.JSON:
            media_type = "application/json"
            filename = f"{report_request.report_type}_report.json"
        else:  # PDF
            media_type = "application/pdf"
            filename = f"{report_request.report_type}_report.pdf"
        
        return Response(
            content=data,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reports/download/{report_type}")
async def download_report_quick(
    report_type: str,
    format: ReportFormat = Query(default=ReportFormat.CSV),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Quick download report
    
    Simplified endpoint for downloading reports without full configuration.
    - **report_type**: weekly or monthly
    - **format**: csv, json, or pdf (default: csv)
    """
    try:
        service = SettingsReportsService(db)
        
        if report_type == "weekly":
            report_data = service.generate_weekly_report(current_user['id'])
        elif report_type == "monthly":
            report_data = service.generate_monthly_report(current_user['id'])
        else:
            raise HTTPException(status_code=400, detail="Invalid report type")
        
        # Export based on format
        if format == ReportFormat.CSV:
            data = service._export_to_csv(report_data)
            media_type = "text/csv"
            filename = f"{report_type}_report.csv"
        elif format == ReportFormat.JSON:
            data = service._export_to_json(report_data)
            media_type = "application/json"
            filename = f"{report_type}_report.json"
        else:
            data = service._export_to_pdf(report_data)
            media_type = "application/pdf"
            filename = f"{report_type}_report.pdf"
        
        return Response(
            content=data,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== AI HOOK GENERATION ====================

@router.post("/ai/generate", response_model=AIGenerationResponse)
async def generate_hooks_with_ai(
    generation_request: AIGenerationRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate content hooks using AI
    
    - **topic**: Main topic or subject (3-500 chars)
    - **hook_type**: Type of hook (controversial, curiosity_gap, bold_claim, etc.)
    - **tone**: Desired tone (professional, casual, humorous, etc.)
    - **niche**: Target niche/category
    - **target_audience**: Optional specific audience description
    - **additional_context**: Optional context for better generation
    - **num_variations**: Number of variations to generate (1-10, default: 3)
    - **temperature**: AI creativity level (0.0-1.0, default: 0.7)
    
    Returns generated hooks with confidence scores and engagement predictions.
    Credits will be deducted based on number of variations.
    """
    try:
        # Check if user has enough credits
        user = db.query(User).filter(User.id == current_user['id']).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        required_credits = generation_request.num_variations
        if (user.ai_credits or 0) < required_credits:
            raise HTTPException(
                status_code=402,
                detail=f"Insufficient credits. Required: {required_credits}, Available: {user.ai_credits or 0}"
            )
        
        service = SettingsReportsService(db)
        result = service.generate_hooks_with_ai(current_user['id'], generation_request)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@router.post("/ai/save-hook")
async def save_generated_hook(
    save_request: SaveGeneratedHookRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save AI-generated hook to collection
    
    - **hook_id**: ID of generated hook
    - **collection_id**: Optional collection to add to
    - **add_to_favorites**: Mark as favorite (default: false)
    - **custom_notes**: Optional notes for the hook
    """
    try:
        # Get the generated hook content from cache/session
        # In production, you'd store generated hooks temporarily
        
        service = SettingsReportsService(db)
        result = service.save_generated_hook(
            current_user['id'],
            save_request.hook_id,
            save_request.dict()
        )
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ai/credits")
async def get_ai_credits(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get remaining AI generation credits
    
    Returns current credit balance and usage statistics.
    """
    try:
        user = db.query(User).filter(User.id == current_user['id']).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get usage this month
        first_day = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0)
        credits_used = db.query(func.count(ActivityLog.id)).filter(
            ActivityLog.user_id == current_user['id'],
            ActivityLog.activity_type == 'ai_generation',
            ActivityLog.created_at >= first_day
        ).scalar() or 0
        
        return {
            "credits_remaining": user.ai_credits or 0,
            "credits_used_this_month": credits_used,
            "plan_type": user.plan_type,
            "monthly_limit": 100 if user.plan_type == 'pro' else 10
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== BULK OPERATIONS ====================

@router.post("/hooks/bulk", response_model=BulkOperationResponse)
async def perform_bulk_operation(
    operation: BulkHookOperation,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Perform bulk operations on hooks
    
    - **hook_ids**: List of hook IDs to operate on
    - **operation**: delete, favorite, unfavorite, move, or export
    - **target_collection_id**: Required for move operation
    
    Returns count of successful and failed operations.
    """
    try:
        service = SettingsReportsService(db)
        result = service.perform_bulk_operation(current_user['id'], operation)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== ANALYTICS ====================

@router.get("/analytics/hook/{hook_id}", response_model=HookAnalytics)
async def get_hook_analytics(
    hook_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get analytics for specific hook
    
    Returns engagement metrics including views, copies, and performance data.
    """
    try:
        service = SettingsReportsService(db)
        return service.get_hook_analytics(current_user['id'], hook_id)
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analytics/collection/{collection_id}", response_model=CollectionAnalytics)
async def get_collection_analytics(
    collection_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get analytics for collection
    
    Returns collection performance metrics and growth statistics.
    """
    try:
        service = SettingsReportsService(db)
        return service.get_collection_analytics(current_user['id'], collection_id)
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analytics/platforms", response_model=List[PlatformAnalytics])
async def get_platform_analytics(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get analytics for all platforms
    
    Returns scraping performance and hook statistics for each platform.
    """
    try:
        service = SettingsReportsService(db)
        return service.get_platform_analytics(current_user['id'])
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analytics/dashboard")
async def get_analytics_dashboard(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive analytics dashboard
    
    Returns all analytics data in one response for dashboard view.
    """
    try:
        service = SettingsReportsService(db)
        
        # Get all analytics
        weekly_report = service.generate_weekly_report(current_user['id'])
        platform_analytics = service.get_platform_analytics(current_user['id'])
        
        return {
            "weekly_summary": weekly_report,
            "platform_analytics": platform_analytics,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SHUFFLE BUTTON FEATURES ====================

@router.post("/ai/shuffle-prompts", response_model=ShufflePromptResponse)
async def shuffle_prompt_ideas(
    shuffle_request: Optional[ShufflePromptRequest] = None,
    db: Session = Depends(get_db)
):
    """
    Get random prompt ideas for AI generation (Shuffle button)
    
    Returns 5 random prompt ideas with examples.
    Optionally filter by niche or hook type.
    """
    import random
    
    prompt_templates = {
        "marketing": [
            "The one marketing strategy that tripled my conversion rate",
            "Why most businesses fail at social media (and how to fix it)",
            "The secret weapon of successful brands",
            "5 marketing myths that are killing your growth",
            "How to get 10x more engagement with half the effort"
        ],
        "fitness": [
            "The workout routine nobody talks about",
            "Why your diet isn't working (science-backed explanation)",
            "The 5-minute morning habit that changed everything",
            "What personal trainers don't want you to know",
            "The truth about burning fat that nobody tells you"
        ],
        "technology": [
            "The AI tool that will replace 90% of your work",
            "Why everyone is switching to this new framework",
            "The security flaw in your favorite app",
            "The coding technique that saves 10 hours per week",
            "The future of tech is not what you think"
        ],
        "business": [
            "The business model that's quietly disrupting entire industries",
            "Why 90% of startups fail (and how to be in the 10%)",
            "The negotiation tactic that closed my biggest deal",
            "What successful entrepreneurs do differently",
            "The productivity system that 10x'd my output"
        ]
    }
    
    # Select random niche
    niche = shuffle_request.niche if shuffle_request and shuffle_request.niche else random.choice(list(prompt_templates.keys()))
    
    # Get 5 random prompts
    all_prompts = []
    for category_prompts in prompt_templates.values():
        all_prompts.extend(category_prompts)
    
    selected_prompts = random.sample(all_prompts, min(5, len(all_prompts)))
    
    # Create examples
    examples = [
        {
            "prompt": prompt,
            "niche": random.choice(list(prompt_templates.keys())),
            "hook_type": random.choice(["curiosity_gap", "bold_claim", "question", "controversial"])
        }
        for prompt in selected_prompts
    ]
    
    return ShufflePromptResponse(
        prompts=selected_prompts,
        examples=examples
    )


@router.get("/ai/shuffle-settings")
async def shuffle_ai_settings():
    """
    Get random AI generation settings (Shuffle button)
    
    Returns randomized but sensible AI generation parameters.
    """
    import random
    
    hook_types = ["controversial", "curiosity_gap", "bold_claim", "question", "story_hook", "statistic"]
    tones = ["professional", "casual", "humorous", "serious", "inspirational", "conversational"]
    niches = ["marketing", "finance", "fitness", "technology", "lifestyle", "business"]
    
    return {
        "hook_type": random.choice(hook_types),
        "tone": random.choice(tones),
        "niche": random.choice(niches),
        "num_variations": random.randint(2, 5),
        "temperature": round(random.uniform(0.6, 0.9), 1)
    }


@router.get("/reports/shuffle-format")
async def shuffle_report_format():
    """
    Get random report configuration (Shuffle button)
    
    Returns randomized report settings for testing.
    """
    import random
    
    formats = ["csv", "json", "pdf"]
    frequencies = ["daily", "weekly", "monthly"]
    
    return {
        "report_format": random.choice(formats),
        "report_frequency": random.choice(frequencies),
        "weekly_report_enabled": random.choice([True, False]),
        "include_charts": random.choice([True, False])
    }


# ==================== DATA EXPORT ====================

@router.post("/export/hooks")
async def export_hooks(
    export_request: ExportRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Export hooks data
    
    Export saved hooks in specified format (CSV, JSON, PDF).
    """
    try:
        # Get hooks based on filters
        query = db.query(SavedHook).join(Hook).filter(
            SavedHook.user_id == current_user['id']
        )
        
        if export_request.include_favorites_only:
            query = query.filter(SavedHook.is_favorite == True)
        
        if export_request.date_range:
            if export_request.date_range.get('start'):
                query = query.filter(SavedHook.created_at >= export_request.date_range['start'])
            if export_request.date_range.get('end'):
                query = query.filter(SavedHook.created_at <= export_request.date_range['end'])
        
        hooks = query.all()
        
        # Export based on format
        if export_request.format == ReportFormat.CSV:
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write header
            headers = ['Hook ID', 'Content', 'Platform', 'Niche', 'Tone', 'Saved At', 'Is Favorite']
            if export_request.include_metadata:
                headers.extend(['Source', 'Notes'])
            writer.writerow(headers)
            
            # Write data
            for hook in hooks:
                row = [
                    hook.hook.id,
                    hook.hook.content,
                    hook.hook.platform,
                    hook.hook.niche,
                    hook.hook.tone,
                    hook.created_at.isoformat(),
                    hook.is_favorite
                ]
                if export_request.include_metadata:
                    row.extend([hook.hook.source, hook.notes or ''])
                writer.writerow(row)
            
            data = output.getvalue()
            media_type = "text/csv"
            filename = "hooks_export.csv"
            
        elif export_request.format == ReportFormat.JSON:
            hooks_data = [
                {
                    'id': hook.hook.id,
                    'content': hook.hook.content,
                    'platform': hook.hook.platform,
                    'niche': hook.hook.niche,
                    'tone': hook.hook.tone,
                    'saved_at': hook.created_at.isoformat(),
                    'is_favorite': hook.is_favorite,
                    'source': hook.hook.source if export_request.include_metadata else None,
                    'notes': hook.notes if export_request.include_metadata else None
                }
                for hook in hooks
            ]
            data = json.dumps(hooks_data, indent=2)
            media_type = "application/json"
            filename = "hooks_export.json"
        
        else:  # PDF
            # Implement PDF export
            raise HTTPException(status_code=501, detail="PDF export not yet implemented")
        
        return Response(
            content=data,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SCHEDULED TASKS INFO ====================

@router.get("/schedules/info")
async def get_scheduled_tasks_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get information about scheduled tasks
    
    Returns configuration and next run times for scheduled scraping and reports.
    """
    try:
        user = db.query(User).filter(User.id == current_user['id']).first()
        
        return {
            "scheduled_scraping": user.scheduled_scrape_settings or {},
            "scheduled_reports": user.scheduled_report_settings or {},
            "last_auto_scrape": None,  # Implement tracking
            "next_auto_scrape": None,  # Calculate based on settings
            "last_report_sent": user.last_report_generated if hasattr(user, 'last_report_generated') else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== HEALTH CHECK ====================

@router.get("/settings/health")
async def settings_health_check():
    """
    Health check for settings & reports service
    """
    return {
        "status": "healthy",
        "service": "settings_reports",
        "features": [
            "user_settings",
            "report_generation",
            "ai_generation",
            "bulk_operations",
            "analytics",
            "data_export"
        ],
        "timestamp": datetime.utcnow().isoformat()
    }