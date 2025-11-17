from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    HOOK_ROOKIE = "Hook Rookie"
    HOOK_HUNTER = "Hook Hunter"
    CONTENT_CURATOR = "Content Curator"
    HOOK_MASTER = "Hook Master"
    PLATFORM_MASTER = "Platform Master"


class PlanType(str, Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class ViewPreference(str, Enum):
    GRID = "grid"
    LIST = "list"


class FontSize(str, Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"


# Profile Schemas
class ProfilePictureUpdate(BaseModel):
    image_data: str = Field(..., description="Base64 encoded image data")
    
    
class UserInfoUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=100)
    username: Optional[str] = Field(None, min_length=3, max_length=30)
    bio: Optional[str] = Field(None, max_length=500)


class QuickStats(BaseModel):
    total_hooks_saved: int = 0
    hooks_copied: int = 0
    collections_created: int = 0
    days_active_streak: int = 0


class WeeklyActivity(BaseModel):
    date: str
    hooks_saved: int
    scrapes_performed: int


class PlatformBreakdown(BaseModel):
    youtube: float = 0.0
    reddit: float = 0.0
    instagram: float = 0.0


class ActivityOverview(BaseModel):
    weekly_activity: List[WeeklyActivity]
    platform_breakdown: PlatformBreakdown
    favorite_categories: List[Dict[str, Any]]
    favorite_tones: List[Dict[str, Any]]


# Collection Schemas
class CollectionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_public: bool = False


class CollectionUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_public: Optional[bool] = None


class Collection(BaseModel):
    id: str
    name: str
    description: Optional[str]
    is_public: bool
    hooks_count: int
    created_at: datetime
    updated_at: datetime


class AddHookToCollection(BaseModel):
    hook_id: str
    notes: Optional[str] = Field(None, max_length=1000)
    tags: Optional[List[str]] = []


# Scraping History Schemas
class ScrapeRecord(BaseModel):
    id: str
    platform: str
    hooks_fetched: int
    status: str
    created_at: datetime
    filters_used: Optional[Dict[str, Any]]


class ScrapingStats(BaseModel):
    total_scrapes: int
    success_rate: float
    average_hooks_per_scrape: float
    last_scrape: Optional[Dict[str, Any]]


# Settings Schemas
class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)
    
    @validator('new_password')
    def validate_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class NotificationPreferences(BaseModel):
    email_notifications: bool = True
    desktop_notifications: bool = False
    scrape_completion_alerts: bool = True
    new_hooks_alerts: bool = False


class DisplayPreferences(BaseModel):
    view_preference: ViewPreference = ViewPreference.GRID
    cards_per_page: int = Field(default=18, ge=9, le=27)
    font_size: FontSize = FontSize.MEDIUM


class ScrapingPreferences(BaseModel):
    default_platforms: List[str] = []
    auto_scrape_enabled: bool = False
    auto_scrape_frequency: Optional[str] = None  # "daily" or "weekly"
    default_niches: List[str] = []
    default_tones: List[str] = []
    exclude_keywords: List[str] = []


class AccountSettings(BaseModel):
    email: Optional[EmailStr] = None
    two_factor_enabled: bool = False
    notification_preferences: NotificationPreferences
    display_preferences: DisplayPreferences
    scraping_preferences: ScrapingPreferences


# Usage & Limits Schemas
class UsageStats(BaseModel):
    scrapes_remaining: int
    scrapes_used: int
    scrapes_limit: int
    storage_used_mb: float
    storage_limit_mb: float
    rate_limit_status: str


class PlanInfo(BaseModel):
    plan_type: PlanType
    features: List[str]
    scrapes_per_month: int
    storage_limit_gb: int
    api_access: bool
    price: float


# Achievements Schemas
class Achievement(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    unlocked: bool
    unlocked_at: Optional[datetime]
    progress: int
    required: int


class UserLevel(BaseModel):
    level: int
    title: UserRole
    progress: int
    required_xp: int
    current_xp: int


# Export Schemas
class ExportFormat(str, Enum):
    CSV = "csv"
    JSON = "json"


class ExportRequest(BaseModel):
    format: ExportFormat
    collection_ids: Optional[List[str]] = None
    include_metadata: bool = True


# Activity Feed Schemas
class ActivityItem(BaseModel):
    id: str
    activity_type: str
    description: str
    metadata: Optional[Dict[str, Any]]
    created_at: datetime


# Integration Schemas
class ConnectedAccount(BaseModel):
    platform: str
    connected: bool
    username: Optional[str]
    connected_at: Optional[datetime]


class APIKeyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    scopes: List[str] = []


class APIKey(BaseModel):
    id: str
    name: str
    key: str
    scopes: List[str]
    created_at: datetime
    last_used: Optional[datetime]


# Complete Profile Response
class UserProfile(BaseModel):
    # Basic Info
    id: str
    full_name: str
    username: str
    email: EmailStr
    email_verified: bool
    profile_picture: Optional[str]
    bio: Optional[str]
    role: UserRole
    member_since: datetime
    
    # Stats
    quick_stats: QuickStats
    
    # Activity
    activity_overview: ActivityOverview
    
    # Collections
    collections: List[Collection]
    
    # Settings
    settings: AccountSettings
    
    # Usage
    usage_stats: UsageStats
    plan_info: PlanInfo
    
    # Achievements
    achievements: List[Achievement]
    user_level: UserLevel
    
    # Recent Activity
    recent_activity: List[ActivityItem]
    
    # Integrations
    connected_accounts: List[ConnectedAccount]
    
    # Profile Visibility
    is_public: bool = False
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ProfileSummary(BaseModel):
    """Lightweight profile for listings"""
    id: str
    username: str
    full_name: str
    profile_picture: Optional[str]
    role: UserRole
    quick_stats: QuickStats
    is_public: bool