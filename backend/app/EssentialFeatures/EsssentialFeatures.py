# essential_features/EssentialFeatures.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from ..core.database import db


class EssentialHook(db.Model):
    __tablename__ = "essential_hooks"

    id = Column(Integer, primary_key=True)
    title = Column(String(400), nullable=False)
    text = Column(Text, nullable=True)        # hook content/body
    platform = Column(String(64), nullable=True)  # YouTube, Reddit, Instagram...
    niche = Column(String(128), nullable=True)
    tone = Column(String(64), nullable=True)

    # Counters / analytics
    score = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    copy_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "text": self.text,
            "platform": self.platform,
            "niche": self.niche,
            "tone": self.tone,
            "score": self.score,
            "view_count": self.view_count,
            "like_count": self.like_count,
            "comment_count": self.comment_count,
            "copy_count": self.copy_count,
            "share_count": self.share_count
        }


class EssentialPost(db.Model):
    __tablename__ = "essential_posts"

    id = Column(Integer, primary_key=True)
    title = Column(String(400), nullable=False)
    content = Column(Text, nullable=True)

    like_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "like_count": self.like_count,
            "share_count": self.share_count
        }


class EssentialPostLike(db.Model):
    __tablename__ = "essential_post_likes"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("essential_posts.id"), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "post_id", name="uq_user_post_like"),)


class EssentialPostSave(db.Model):
    __tablename__ = "essential_post_saves"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("essential_posts.id"), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "post_id", name="uq_user_post_save"),)


class EssentialHookComment(db.Model):
    __tablename__ = "essential_hook_comments"
    id = Column(Integer, primary_key=True)
    hook_id = Column(Integer, ForeignKey("essential_hooks.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    comment_text = Column(Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "hook_id": self.hook_id,
            "user_id": self.user_id,
            "comment_text": self.comment_text
        }