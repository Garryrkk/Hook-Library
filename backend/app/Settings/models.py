from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid
import enum

Base = declarative_base()

# ==================== ENUMS ====================

class UserRole(str, enum.Enum):
    HOOK_ROOKIE = "hook_rookie"
    HOOK_HUNTER = "hook_hunter"
    CONTENT_CURATOR = "content_curator"
    HOOK_MASTER = "hook_master"
    PLATFORM_MASTER = "platform_master"


class PlanType(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class ReportFormat(str, enum.Enum):
    CSV = "csv"
    JSON = "json"
    PDF = "pdf"


class ReportFrequency(str, enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class HookType(str, enum.Enum):
    CONTROVERSIAL = "controversial"
    CURIOSITY_GAP = "curiosity_gap"
    BOLD_CLAIM = "bold_claim"
    QUESTION = "question"
    STORY_HOOK = "story_hook"
    STATISTIC = "statistic"
    PATTERN_INTERRUPT = "pattern_interrupt"
    EMOTIONAL = "emotional"


class ToneType(str, enum.Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    HUMOROUS = "humorous"
    SERIOUS = "serious"
    INSPIRATIONAL = "inspirational"
    EDUCATIONAL = "educational"
    CONVERSATIONAL = "conversational"


class NicheCategory(str, enum.Enum):
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


# ==================== MODELS ====================

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(255), nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    email_verified = Column(Boolean, default=False)
    profile_picture = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    two_factor_enabled = Column(Boolean, default=False)
    plan_type = Column(Enum(PlanType), default=PlanType.FREE)
    ai_credits = Column(Integer, default=100)
    is_public = Column(Boolean, default=False)
    settings = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    saved_hooks = relationship("SavedHook", back_populates="user", cascade="all, delete-orphan")
    collections = relationship("CollectionModel", back_populates="user", cascade="all, delete-orphan")
    scrape_history = relationship("ScrapeHistory", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
    connected_accounts = relationship("ConnectedAccount", back_populates="user", cascade="all, delete-orphan")
    user_settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Hook(Base):
    __tablename__ = "hooks"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text, nullable=False)
    hook_text = Column(Text, nullable=False)  # Alias for content
    source = Column(String(500), nullable=True)
    platform = Column(String(50), nullable=False)
    niche = Column(String(100), nullable=True)
    tone = Column(String(50), nullable=True)
    hook_type = Column(Enum(HookType), nullable=True)
    engagement_score = Column(Float, nullable=True)
    hook_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    saved_by = relationship("SavedHook", back_populates="hook", cascade="all, delete-orphan")
    collections = relationship("CollectionHook", back_populates="hook", cascade="all, delete-orphan")
    copies = relationship("HookCopy", back_populates="hook", cascade="all, delete-orphan")


class SavedHook(Base):
    __tablename__ = "saved_hooks"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    hook_id = Column(String(36), ForeignKey("hooks.id", ondelete="CASCADE"), nullable=False)
    is_favorite = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    view_count = Column(Integer, default=0)
    saved_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="saved_hooks")
    hook = relationship("Hook", back_populates="saved_by")


class CollectionModel(Base):
    __tablename__ = "collections"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="collections")
    hooks = relationship("CollectionHook", back_populates="collection", cascade="all, delete-orphan")


class CollectionHook(Base):
    __tablename__ = "collection_hooks"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    collection_id = Column(String(36), ForeignKey("collections.id", ondelete="CASCADE"), nullable=False)
    hook_id = Column(String(36), ForeignKey("hooks.id", ondelete="CASCADE"), nullable=False)
    position = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    collection = relationship("CollectionModel", back_populates="hooks")
    hook = relationship("Hook", back_populates="collections")


class ScrapeHistory(Base):
    __tablename__ = "scrape_history"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String(50), nullable=False)
    hooks_fetched = Column(Integer, default=0)
    status = Column(String(50), default="success")
    filters_used = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="scrape_history")


class HookCopy(Base):
    __tablename__ = "hook_copies"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    hook_id = Column(String(36), ForeignKey("hooks.id", ondelete="CASCADE"), nullable=False)
    copied_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    hook = relationship("Hook", back_populates="copies")


class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    activity_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="activity_logs")


class ConnectedAccount(Base):
    __tablename__ = "connected_accounts"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String(50), nullable=False)
    username = Column(String(255), nullable=True)
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    connected_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="connected_accounts")


class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Weekly Report Settings
    weekly_report_enabled = Column(Boolean, default=True)
    report_format = Column(Enum(ReportFormat), default=ReportFormat.CSV)
    report_frequency = Column(String(50), default="weekly")
    report_email = Column(String(255), nullable=True)
    last_report_generated = Column(DateTime, nullable=True)
    
    # AI Generation Defaults
    default_hook_type = Column(Enum(HookType), default=HookType.CURIOSITY_GAP)
    default_tone = Column(Enum(ToneType), default=ToneType.PROFESSIONAL)
    default_niche = Column(Enum(NicheCategory), default=NicheCategory.MARKETING)
    
    # Notification Settings
    email_notifications = Column(Boolean, default=True)
    desktop_notifications = Column(Boolean, default=False)
    scrape_completion_alerts = Column(Boolean, default=True)
    
    # Display Preferences
    theme = Column(String(20), default="dark")
    cards_per_page = Column(Integer, default=18)
    default_view = Column(String(20), default="grid")
    
    # Privacy Settings
    profile_visibility = Column(String(20), default="private")
    show_activity = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="user_settings")


class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    achievement_id = Column(String(100), nullable=False)
    achievement_name = Column(String(255), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    
    
class ExportJob(Base):
    __tablename__ = "export_jobs"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    export_type = Column(String(50), nullable=False)
    format = Column(Enum(ReportFormat), nullable=False)
    status = Column(String(50), default="pending")
    file_url = Column(Text, nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)