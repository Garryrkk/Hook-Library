# essential_features/models.py
"""
SQLAlchemy ORM models for Essential Features module.
Defines database schema for hooks, posts, comments, likes, and saves.
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from ..core.database import Base


class User(Base):
    """User model - defines the users table."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)

    # Relationships
    post_likes = relationship("EssentialPostLike", back_populates="user", cascade="all, delete-orphan")
    post_saves = relationship("EssentialPostSave", back_populates="user", cascade="all, delete-orphan")
    hook_comments = relationship("EssentialHookComment", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        """Convert user instance to dictionary."""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }


class EssentialHook(Base):
    """Hook model - stores content hooks across different platforms."""
    __tablename__ = "essential_hooks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String(400), nullable=False)
    text = Column(Text, nullable=True)
    platform = Column(String(64), nullable=True, index=True)
    niche = Column(String(64), nullable=True, index=True)
    tone = Column(String(64), nullable=True)
    status = Column(String(32), default="Generated", index=True)  # "Generated" or "Saved"
    score = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    copy_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)

    # Relationships
    comments = relationship("EssentialHookComment", back_populates="hook", cascade="all, delete-orphan")

    def to_dict(self):
        """Convert hook instance to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "text": self.text,
            "platform": self.platform,
            "niche": self.niche,
            "tone": self.tone,
            "status": self.status,
            "score": self.score,
            "view_count": self.view_count,
            "like_count": self.like_count,
            "comment_count": self.comment_count,
            "copy_count": self.copy_count,
            "share_count": self.share_count
        }


class EssentialPost(Base):
    """Post model - stores user posts/content."""
    __tablename__ = "essential_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(400), nullable=False)
    content = Column(Text, nullable=True)
    like_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)

    # Relationships
    likes = relationship("EssentialPostLike", back_populates="post", cascade="all, delete-orphan")
    saves = relationship("EssentialPostSave", back_populates="post", cascade="all, delete-orphan")

    def to_dict(self):
        """Convert post instance to dictionary."""
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "like_count": self.like_count,
            "share_count": self.share_count
        }


class EssentialPostLike(Base):
    """Post like junction table - tracks user likes on posts."""
    __tablename__ = "essential_post_likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    post_id = Column(Integer, ForeignKey("essential_posts.id"), nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="post_likes")
    post = relationship("EssentialPost", back_populates="likes")

    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_user_post_like"),
    )

    def to_dict(self):
        """Convert like instance to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id
        }


class EssentialPostSave(Base):
    """Post save junction table - tracks user saves/bookmarks on posts."""
    __tablename__ = "essential_post_saves"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    post_id = Column(Integer, ForeignKey("essential_posts.id"), nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="post_saves")
    post = relationship("EssentialPost", back_populates="saves")

    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_user_post_save"),
    )

    def to_dict(self):
        """Convert save instance to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id
        }


class EssentialHookComment(Base):
    """Hook comment model - stores user comments on hooks."""
    __tablename__ = "essential_hook_comments"

    id = Column(Integer, primary_key=True, index=True)
    hook_id = Column(Integer, ForeignKey("essential_hooks.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    comment_text = Column(Text, nullable=False)

    # Relationships
    hook = relationship("EssentialHook", back_populates="comments")
    user = relationship("User", back_populates="hook_comments")

    def to_dict(self):
        """Convert comment instance to dictionary."""
        return {
            "id": self.id,
            "hook_id": self.hook_id,
            "user_id": self.user_id,
            "comment_text": self.comment_text
        }