# essential_features/EssentialFeatures.py
from ..core.database import db

class EssentialHook(db.Model):
    __tablename__ = "essential_hooks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(400), nullable=False)
    text = db.Column(db.Text, nullable=True)        # hook content/body
    platform = db.Column(db.String(64), nullable=True)  # YouTube, Reddit, Instagram...
    niche = db.Column(db.String(128), nullable=True)
    tone = db.Column(db.String(64), nullable=True)

    # Counters / analytics
    score = db.Column(db.Integer, default=0)
    view_count = db.Column(db.Integer, default=0)
    like_count = db.Column(db.Integer, default=0)
    comment_count = db.Column(db.Integer, default=0)
    copy_count = db.Column(db.Integer, default=0)
    share_count = db.Column(db.Integer, default=0)

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

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(400), nullable=False)
    content = db.Column(db.Text, nullable=True)

    like_count = db.Column(db.Integer, default=0)
    share_count = db.Column(db.Integer, default=0)

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
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("essential_posts.id"), nullable=False)

    __table_args__ = (db.UniqueConstraint("user_id", "post_id", name="uq_user_post_like"),)



class EssentialPostSave(db.Model):
    __tablename__ = "essential_post_saves"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("essential_posts.id"), nullable=False)

    __table_args__ = (db.UniqueConstraint("user_id", "post_id", name="uq_user_post_save"),)


class EssentialHookComment(db.Model):
    __tablename__ = "essential_hook_comments"
    id = db.Column(db.Integer, primary_key=True)
    hook_id = db.Column(db.Integer, db.ForeignKey("essential_hooks.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    comment_text = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "hook_id": self.hook_id,
            "user_id": self.user_id,
            "comment_text": self.comment_text
        }
