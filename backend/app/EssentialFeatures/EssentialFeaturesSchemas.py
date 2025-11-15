# essential_features/EssentialFeatures.py
from ..core.database import db
from EssentialFeatures.EsssentialFeatures import EssentialHook, EssentialPost, EssentialHookComment

class EssentialHook(db.Model):
    __tablename__ = "essential_hooks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)

    # For the Dashboard Metrics
    score = db.Column(db.Integer, default=0)

    platform = db.Column(db.String(50))  

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "platform": self.platform,
            "score": self.score
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

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    post_id = db.Column(db.Integer, db.ForeignKey("essential_posts.id"))

    user = db.relationship("User")
    post = db.relationship("EssentialPost")

    __table_args__ = (
        db.UniqueConstraint("user_id", "post_id", name="unique_user_post_like"),
    )


class EssentialPostSave(db.Model):
    __tablename__ = "essential_post_saves"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    post_id = db.Column(db.Integer, db.ForeignKey("essential_posts.id"))

    user = db.relationship("User")
    post = db.relationship("EssentialPost")

    __table_args__ = (
        db.UniqueConstraint("user_id", "post_id", name="unique_user_post_save"),
    )

    class EssentialHookCommentSchema(SQLAlchemySchema):
        class Meta:
            model = EssentialHookComment
            load_instance = False

        id = auto_field()
        hook_id = auto_field()
        user_id = auto_field()
        comment_text = auto_field()
