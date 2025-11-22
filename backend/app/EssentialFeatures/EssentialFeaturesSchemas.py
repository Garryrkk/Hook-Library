# essential_features/EssentialFeatures.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from ..core.database import db
from pydantic import BaseModel, Field, validator, field_validator
from typing import Optional, Dict, Any, Literal
from enum import Enum


class EssentialHook(db.Model):
    __tablename__ = "essential_hooks"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)

    # For the Dashboard Metrics
    score = Column(Integer, default=0)

    platform = Column(String(50))  

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "platform": self.platform,
            "score": self.score
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

    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("essential_posts.id"))

    user = relationship("User")
    post = relationship("EssentialPost")

    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="unique_user_post_like"),
    )


class EssentialPostSave(db.Model):
    __tablename__ = "essential_post_saves"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("essential_posts.id"))

    user = relationship("User")
    post = relationship("EssentialPost")

    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="unique_user_post_save"),
    )


class EssentialHookComment(db.Model):
    __tablename__ = "essential_hook_comments"
    
    id = Column(Integer, primary_key=True)
    hook_id = Column(Integer, ForeignKey("essential_hooks.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment_text = Column(Text, nullable=False)
    
    hook = relationship("EssentialHook")
    user = relationship("User")


# Pydantic Schemas (replacing Marshmallow)

class EssentialHookCommentSchema(BaseModel):
    """Schema for Essential Hook Comment"""
    id: int
    hook_id: int
    user_id: int
    comment_text: str
    
    class Config:
        from_attributes = True  # Allows converting from ORM models
        orm_mode = True  # For Pydantic v1 compatibility


class MetricsDataSchema(BaseModel):
    """Schema for the metrics data object"""
    totalGenerated: int = Field(
        ...,
        ge=0,
        description="Total number of generated hooks across all platforms"
    )
    totalSaved: int = Field(
        ...,
        ge=0,
        description="Total number of saved hooks across all platforms"
    )
    totalGeneratedScore: int = Field(
        ...,
        ge=0,
        description="Sum of all scores for generated hooks"
    )
    youtubeCount: int = Field(
        ...,
        ge=0,
        description="Number of generated YouTube hooks"
    )
    redditCount: int = Field(
        ...,
        ge=0,
        description="Number of generated Reddit hooks"
    )
    instagramCount: int = Field(
        ...,
        ge=0,
        description="Number of generated Instagram hooks"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "totalGenerated": 150,
                "totalSaved": 45,
                "totalGeneratedScore": 7250,
                "youtubeCount": 80,
                "redditCount": 50,
                "instagramCount": 20
            }
        }


class MetricsResponseSchema(BaseModel):
    """Schema for successful metrics response"""
    status: Literal["success"] = Field(
        ...,
        description="Response status"
    )
    data: MetricsDataSchema = Field(
        ...,
        description="Metrics data object"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "success",
                "data": {
                    "totalGenerated": 150,
                    "totalSaved": 45,
                    "totalGeneratedScore": 7250,
                    "youtubeCount": 80,
                    "redditCount": 50,
                    "instagramCount": 20
                }
            }
        }


class PlatformEnum(str, Enum):
    """Enum for valid platforms"""
    YOUTUBE = "YouTube"
    REDDIT = "Reddit"
    INSTAGRAM = "Instagram"


class PlatformDataSchema(BaseModel):
    """Schema for platform-specific metrics data"""
    platform: PlatformEnum = Field(
        ...,
        description="Platform name"
    )
    generated: int = Field(
        ...,
        ge=0,
        description="Number of generated hooks for this platform"
    )
    saved: int = Field(
        ...,
        ge=0,
        description="Number of saved hooks for this platform"
    )
    averageScore: float = Field(
        ...,
        ge=0,
        description="Average score of generated hooks for this platform"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "platform": "YouTube",
                "generated": 80,
                "saved": 25,
                "averageScore": 90.5
            }
        }


class PlatformBreakdownSchema(BaseModel):
    """Schema for platform breakdown response"""
    status: Literal["success"] = Field(
        ...,
        description="Response status"
    )
    data: PlatformDataSchema = Field(
        ...,
        description="Platform-specific metrics"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "success",
                "data": {
                    "platform": "YouTube",
                    "generated": 80,
                    "saved": 25,
                    "averageScore": 90.5
                }
            }
        }


class MetricsSummarySchema(BaseModel):
    """Schema for simplified metrics summary"""
    totalGenerated: int = Field(..., ge=0)
    totalSaved: int = Field(..., ge=0)
    totalScore: int = Field(..., ge=0)
    
    class Config:
        json_schema_extra = {
            "example": {
                "totalGenerated": 150,
                "totalSaved": 45,
                "totalScore": 7250
            }
        }


class ErrorResponseSchema(BaseModel):
    """Schema for error responses"""
    status: Literal["error"] = Field(
        ...,
        description="Response status"
    )
    message: str = Field(
        ...,
        description="Human-readable error message"
    )
    code: str = Field(
        ...,
        description="Machine-readable error code"
    )
    details: Optional[Dict[str, Any]] = Field(
        None,
        description="Additional error details (optional)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "error",
                "message": "Failed to retrieve dashboard metrics",
                "code": "METRICS_FETCH_FAILED",
                "details": {}
            }
        }


class PlatformParamSchema(BaseModel):
    """Schema for validating platform parameter"""
    platform: str = Field(
        ...,
        description="Platform name (case-insensitive)"
    )
    
    @field_validator('platform')
    @classmethod
    def validate_and_capitalize_platform(cls, v: str) -> str:
        """Validate and capitalize platform name"""
        valid_platforms = ["youtube", "reddit", "instagram"]
        if v.lower() not in valid_platforms:
            raise ValueError(
                f"Platform must be one of: {', '.join(valid_platforms)}"
            )
        return v.capitalize()
    
    class Config:
        json_schema_extra = {
            "example": {
                "platform": "YouTube"
            }
        }


# Schema instances for reuse (if needed for backward compatibility)
# Note: In FastAPI/Pydantic, you typically instantiate schemas in route handlers
# But keeping these for compatibility with existing code
metrics_response_schema = MetricsResponseSchema
platform_breakdown_schema = PlatformBreakdownSchema
metrics_summary_schema = MetricsSummarySchema
error_response_schema = ErrorResponseSchema
platform_param_schema = PlatformParamSchema