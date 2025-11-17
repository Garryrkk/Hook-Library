from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


# ==================== ENUMS ====================

class ReportFormat(str, Enum):
    CSV = "csv"
    JSON = "json"
    PDF = "pdf"


class ReportFrequency(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class HookType(str, Enum):
    CONTROVERSIAL = "controversial"
    CURIOSITY_GAP = "curiosity_gap"
    BOLD_CLAIM = "bold_claim"
    QUESTION = "question"
    STORY_HOOK = "story_hook"
    STATISTIC = "statistic"
    PATTERN_INTERRUPT = "pattern_interrupt"
    EMOTIONAL = "emotional"


class ToneType(str, Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    HUMOROUS = "humorous"
    SERIOUS = "serious"
    INSPIRATIONAL = "inspirational"
    EDUCATIONAL = "educational"
    CONVERSATIONAL = "conversational"


class NicheCategory(str, Enum):
    MARKETING = "marketing"
    FINANCE = "finance"
    FITNESS = "fitness"
    TECHNOLOGY = "technology"
    LIFESTYLE = "lifestyle"
    BUSINESS = "business"
    EDUCATION = "education"
    ENTERTAINMENT = "entertainment"
    HEALTH = "health"
    TRAVEL = "travel"


# ==================== USER SETTINGS SCHEMAS ====================

class UserSettingsUpdate(BaseModel):
    # Weekly Report Settings
    weekly_report_enabled: Optional[bool] = None
    report_format: Optional[ReportFormat] = None
    report_frequency: Optional[ReportFrequency] = None
    report_email: Optional[str] = None
    
    # AI Generation Defaults
    default_hook_type: Optional[HookType] = None
    default_tone: Optional[ToneType] = None
    default_niche: Optional[NicheCategory] = None
    
    # Notification Settings
    email_notifications: Optional[bool] = None
    desktop_notifications: Optional[bool] = None
    scrape_completion_alerts: Optional[bool] = None
    
    # Display Preferences
    theme: Optional[str] = Field(None, pattern="^(dark|light)$")
    cards_per_page: Optional[int] = Field(None, ge=9, le=27)
    default_view: Optional[str] = Field(None, pattern="^(grid|list)$")
    
    # Privacy Settings
    profile_visibility: Optional[str] = Field(None, pattern="^(public|private|friends)$")
    show_activity: Optional[bool] = None
    
    class Config:
        use_enum_values = True


class UserSettingsResponse(BaseModel):
    id: str
    user_id: str
    
    # Report Settings
    weekly_report_enabled: bool
    report_format: ReportFormat
    report_frequency: ReportFrequency
    report_email: Optional[str]
    last_report_generated: Optional[datetime]
    
    # AI Generation Defaults
    default_hook_type: HookType
    default_tone: ToneType
    default_niche: NicheCategory
    
    # Notification Settings
    email_notifications: bool
    desktop_notifications: bool
    scrape_completion_alerts: bool
    
    # Display Preferences
    theme: str
    cards_per_page: int
    default_view: str
    
    # Privacy Settings
    profile_visibility: str
    show_activity: bool
    
    created_at: datetime
    updated_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# ==================== REPORT SCHEMAS ====================

class ReportGenerationRequest(BaseModel):
    report_type: str = Field(..., pattern="^(weekly|monthly|custom)$")
    format: ReportFormat
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    include_sections: List[str] = ["hooks", "collections", "activity", "scraping"]
    
    @validator('end_date')
    def end_date_after_start(cls, v, values):
        if v and 'start_date' in values and values['start_date']:
            if v < values['start_date']:
                raise ValueError('End date must be after start date')
        return v


class WeeklyReportData(BaseModel):
    period_start: datetime
    period_end: datetime
    total_hooks_saved: int
    total_scrapes: int
    total_collections_created: int
    favorite_platform: str
    top_niches: List[Dict[str, Any]]
    daily_activity: List[Dict[str, Any]]
    achievements_unlocked: List[str]
    most_active_day: str


class MonthlyReportData(BaseModel):
    period_start: datetime
    period_end: datetime
    total_hooks_saved: int
    total_scrapes: int
    collections_created: int
    hooks_by_platform: Dict[str, int]
    hooks_by_niche: Dict[str, int]
    weekly_breakdown: List[Dict[str, Any]]
    growth_metrics: Dict[str, Any]


class ReportDownloadResponse(BaseModel):
    report_id: str
    format: ReportFormat
    generated_at: datetime
    download_url: str
    expires_at: datetime


# ==================== AI GENERATION SCHEMAS ====================

class AIGenerationRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=500)
    hook_type: HookType
    tone: ToneType
    niche: NicheCategory
    target_audience: Optional[str] = Field(None, max_length=200)
    additional_context: Optional[str] = Field(None, max_length=1000)
    num_variations: int = Field(default=3, ge=1, le=10)
    temperature: float = Field(default=0.7, ge=0.0, le=1.0)
    
    class Config:
        use_enum_values = True


class GeneratedHook(BaseModel):
    id: str
    content: str
    hook_type: HookType
    tone: ToneType
    niche: NicheCategory
    confidence_score: float
    engagement_prediction: str
    explanation: Optional[str]
    
    class Config:
        use_enum_values = True


class AIGenerationResponse(BaseModel):
    request_id: str
    generated_hooks: List[GeneratedHook]
    topic: str
    parameters: Dict[str, Any]
    generation_time: float
    credits_used: int
    
    
class SaveGeneratedHookRequest(BaseModel):
    hook_id: str
    collection_id: Optional[str] = None
    add_to_favorites: bool = False
    custom_notes: Optional[str] = Field(None, max_length=500)


# ==================== BULK OPERATIONS ====================

class BulkHookOperation(BaseModel):
    hook_ids: List[str] = Field(..., min_items=1)
    operation: str = Field(..., pattern="^(delete|favorite|unfavorite|move|export)$")
    target_collection_id: Optional[str] = None


class BulkOperationResponse(BaseModel):
    success_count: int
    failed_count: int
    failed_ids: List[str]
    message: str


# ==================== EXPORT SCHEMAS ====================

class ExportRequest(BaseModel):
    format: ReportFormat
    include_collections: bool = True
    include_favorites_only: bool = False
    include_metadata: bool = True
    date_range: Optional[Dict[str, datetime]] = None


class ExportResponse(BaseModel):
    export_id: str
    format: ReportFormat
    status: str
    file_size_bytes: Optional[int]
    download_url: Optional[str]
    expires_at: datetime
    created_at: datetime


# ==================== ANALYTICS SCHEMAS ====================

class HookAnalytics(BaseModel):
    hook_id: str
    views: int
    copies: int
    shares: int
    favorites: int
    engagement_rate: float
    best_performing_time: Optional[str]


class CollectionAnalytics(BaseModel):
    collection_id: str
    total_hooks: int
    total_views: int
    average_engagement: float
    growth_rate: float
    most_popular_hook: Optional[str]


class PlatformAnalytics(BaseModel):
    platform: str
    total_scrapes: int
    total_hooks: int
    success_rate: float
    average_hooks_per_scrape: float
    last_scrape: Optional[datetime]
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# ==================== SHUFFLE HELPERS ====================

class ShufflePromptRequest(BaseModel):
    niche: Optional[NicheCategory] = None
    hook_type: Optional[HookType] = None


class ShufflePromptResponse(BaseModel):
    prompts: List[str]
    examples: List[Dict[str, str]]


# ==================== SCHEDULE SETTINGS ====================

class ScheduledScrapeSettings(BaseModel):
    enabled: bool
    platforms: List[str]
    frequency: str = Field(..., pattern="^(daily|weekly|monthly)$")
    time_of_day: str = Field(..., pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
    niches: List[str]
    max_hooks_per_scrape: int = Field(default=50, ge=10, le=200)


class ScheduledReportSettings(BaseModel):
    enabled: bool
    frequency: ReportFrequency
    delivery_time: str = Field(..., pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
    recipients: List[str]
    format: ReportFormat
    include_charts: bool = True