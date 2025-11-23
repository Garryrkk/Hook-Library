# essential_features/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from ..core.database import Base  # your declarative base from core.database

# ----------------------------
# User model
# ----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)

    # Relationships
    post_likes = relationship("EssentialPostLike", back_populates="user")
    post_saves = relationship("EssentialPostSave", back_populates="user")
    hook_comments = relationship("EssentialHookComment", back_populates="user")


# ----------------------------
# Essential Features Models
# ----------------------------
class EssentialHook(Base):
    __tablename__ = "essential_hooks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(400), nullable=False)
    text = Column(Text, nullable=True)
    platform = Column(String(64), nullable=True)
    tone = Column(String(64), nullable=True)
    score = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    copy_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)

    # Relationships
    comments = relationship("EssentialHookComment", back_populates="hook")


class EssentialPost(Base):
    __tablename__ = "essential_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(400), nullable=False)
    content = Column(Text, nullable=True)
    like_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)

    # Relationships
    likes = relationship("EssentialPostLike", back_populates="post")
    saves = relationship("EssentialPostSave", back_populates="post")


class EssentialPostLike(Base):
    __tablename__ = "essential_post_likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("essential_posts.id"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="post_likes")
    post = relationship("EssentialPost", back_populates="likes")

    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_user_post_like"),
    )


class EssentialPostSave(Base):
    __tablename__ = "essential_post_saves"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("essential_posts.id"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="post_saves")
    post = relationship("EssentialPost", back_populates="saves")

    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="uq_user_post_save"),
    )


class EssentialHookComment(Base):
    __tablename__ = "essential_hook_comments"

    id = Column(Integer, primary_key=True, index=True)
    hook_id = Column(Integer, ForeignKey("essential_hooks.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    comment_text = Column(Text, nullable=False)

    # Relationships
    hook = relationship("EssentialHook", back_populates="comments")
    user = relationship("User", back_populates="hook_comments")
