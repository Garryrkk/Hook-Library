from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from .core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # relationships
    refresh_tokens = relationship("RefreshToken", back_populates="user")
    sessions = relationship("Session", back_populates="user")
    reset_tokens = relationship("PasswordResetToken", back_populates="user")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True)
    expires_at = Column(DateTime)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="refresh_tokens")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True)
    expires_at = Column(DateTime)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="reset_tokens")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_agent = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="sessions")
