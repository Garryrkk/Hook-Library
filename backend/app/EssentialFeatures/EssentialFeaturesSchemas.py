# essential_features/EssentialFeatures.py
from ..core.database import db
from EssentialFeatures.EsssentialFeatures import EssentialHook, EssentialPost, EssentialHookComment
from marshmallow import Schema, fields, validate, post_load

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

class MetricsDataSchema(Schema):
    """Schema for the metrics data object"""
    totalGenerated = fields.Integer(
        required=True,
        validate=validate.Range(min=0),
        description="Total number of generated hooks across all platforms"
    )
    totalSaved = fields.Integer(
        required=True,
        validate=validate.Range(min=0),
        description="Total number of saved hooks across all platforms"
    )
    totalGeneratedScore = fields.Integer(
        required=True,
        validate=validate.Range(min=0),
        description="Sum of all scores for generated hooks"
    )
    youtubeCount = fields.Integer(
        required=True,
        validate=validate.Range(min=0),
        description="Number of generated YouTube hooks"
    )
    redditCount = fields.Integer(
        required=True,
        validate=validate.Range(min=0),
        description="Number of generated Reddit hooks"
    )
    instagramCount = fields.Integer(
        required=True,
        validate=validate.Range(min=0),
        description="Number of generated Instagram hooks"
    )
    
    class Meta:
        ordered = True


class MetricsResponseSchema(Schema):
    """Schema for successful metrics response"""
    status = fields.String(
        required=True,
        validate=validate.OneOf(["success"]),
        description="Response status"
    )
    data = fields.Nested(
        MetricsDataSchema,
        required=True,
        description="Metrics data object"
    )
    
    class Meta:
        ordered = True


class PlatformDataSchema(Schema):
    """Schema for platform-specific metrics data"""
    platform = fields.String(
        required=True,
        validate=validate.OneOf(["YouTube", "Reddit", "Instagram"]),
        description="Platform name"
    )
    generated = fields.Integer(
        required=True,
        validate=validate.Range(min=0),
        description="Number of generated hooks for this platform"
    )
    saved = fields.Integer(
        required=True,
        validate=validate.Range(min=0),
        description="Number of saved hooks for this platform"
    )
    averageScore = fields.Float(
        required=True,
        validate=validate.Range(min=0),
        description="Average score of generated hooks for this platform"
    )
    
    class Meta:
        ordered = True


class PlatformBreakdownSchema(Schema):
    """Schema for platform breakdown response"""
    status = fields.String(
        required=True,
        validate=validate.OneOf(["success"]),
        description="Response status"
    )
    data = fields.Nested(
        PlatformDataSchema,
        required=True,
        description="Platform-specific metrics"
    )
    
    class Meta:
        ordered = True


class MetricsSummarySchema(Schema):
    """Schema for simplified metrics summary"""
    totalGenerated = fields.Integer(
        required=True,
        validate=validate.Range(min=0)
    )
    totalSaved = fields.Integer(
        required=True,
        validate=validate.Range(min=0)
    )
    totalScore = fields.Integer(
        required=True,
        validate=validate.Range(min=0)
    )
    
    class Meta:
        ordered = True


class ErrorResponseSchema(Schema):
    """Schema for error responses"""
    status = fields.String(
        required=True,
        validate=validate.OneOf(["error"]),
        description="Response status"
    )
    message = fields.String(
        required=True,
        description="Human-readable error message"
    )
    code = fields.String(
        required=True,
        description="Machine-readable error code"
    )
    details = fields.Dict(
        required=False,
        description="Additional error details (optional)"
    )
    
    class Meta:
        ordered = True


class PlatformParamSchema(Schema):
    """Schema for validating platform parameter"""
    platform = fields.String(
        required=True,
        validate=validate.OneOf(
            ["youtube", "reddit", "instagram", "YouTube", "Reddit", "Instagram"]
        ),
        description="Platform name (case-insensitive)"
    )
    
    @post_load
    def capitalize_platform(self, data, **kwargs):
        """Capitalize platform name after validation"""
        data['platform'] = data['platform'].capitalize()
        return data


# Schema instances for reuse
metrics_response_schema = MetricsResponseSchema()
platform_breakdown_schema = PlatformBreakdownSchema()
metrics_summary_schema = MetricsSummarySchema()
error_response_schema = ErrorResponseSchema()
platform_param_schema = PlatformParamSchema()