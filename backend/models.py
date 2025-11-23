from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
# Re-use canonical User model from the EssentialFeatures module
try:
    from app.EssentialFeatures.EsssentialFeatures import User  # canonical User model
except Exception:
    # Fallback placeholder if import path differs
    User = None
from datetime import datetime


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    session_id = Column(String(128), nullable=True)
    token = Column(String(512), nullable=False, unique=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used = Column(DateTime, nullable=True)
    revoked = Column(Boolean, default=False)


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    token = Column(String(512), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Session(Base):
    __tablename__ = "sessions"
    id = Column(String(128), primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    ip_address = Column(String(64), nullable=True)
    user_agent = Column(String(512), nullable=True)
    location = Column(String(255), nullable=True)
    last_active = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    activity_type = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class CollectionModel(Base):
    __tablename__ = "collections"
    id = Column(String(128), primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


class CollectionHook(Base):
    __tablename__ = "collection_hooks"
    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(String(128), ForeignKey("collections.id"), nullable=False)
    hook_id = Column(String(128), nullable=False)
    notes = Column(Text, nullable=True)
    tags = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class SavedHook(Base):
    __tablename__ = "saved_hooks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    hook_id = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class APIKeyModel(Base):
    __tablename__ = "api_keys"
    id = Column(String(128), primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    name = Column(String(255), nullable=False)
    key = Column(String(512), nullable=False)
    scopes = Column(String(512), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used = Column(DateTime, nullable=True)


class ConnectedAccount(Base):
    __tablename__ = "connected_accounts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    platform = Column(String(64), nullable=False)
    username = Column(String(255), nullable=True)
    access_token = Column(String(1024), nullable=True)
    connected_at = Column(DateTime, default=datetime.utcnow)


class ScrapeHistory(Base):
    __tablename__ = "scrape_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    platform = Column(String(64), nullable=True)
    target = Column(String(255), nullable=True)
    result_count = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
