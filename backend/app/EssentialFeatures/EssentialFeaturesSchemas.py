# essential_features/schemas.py
"""
Pydantic schemas for request/response validation in Essential Features module.
Defines data validation, serialization, and API documentation models.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any, Literal, List
from enum import Enum


# ========================
# Enums
# ========================

class PlatformEnum(str, Enum):
    """Valid platform options."""
    YOUTUBE = "YouTube"
    REDDIT = "Reddit"
    INSTAGRAM = "Instagram"


class StatusEnum(str, Enum):
    """Valid hook status options."""
    GENERATED = "Generated"
    SAVED = "Saved"


# ========================
# Request Schemas
# ========================

class EssentialHookCommentCreate(BaseModel):
    """Schema for creating a hook comment."""
    hook_id: int = Field(..., gt=0, description="ID of the hook to comment on")
    comment_text: str = Field(..., min_length=1, max_length=2000, description="Comment text")


class PlatformParamSchema(BaseModel):
    """Schema for validating platform parameter."""
    platform: str = Field(..., description="Platform name (case-insensitive)")
    
    @field_validator('platform')
    @classmethod
    def validate_and_capitalize_platform(cls, v: str) -> str:
        """Validate and capitalize platform name."""
        valid_platforms = ["youtube", "reddit", "instagram"]
        if v.lower() not in valid_platforms:
            raise ValueError(
                f"Platform must be one of: {', '.join(valid_platforms)}"
            )
        return v.capitalize()


class CommentCreateRequest(BaseModel):
    """Schema for comment creation request body."""
    text: str = Field(..., min_length=1, max_length=2000, description="Comment text")


# ========================
# Response Schemas
# ========================

class UserSchema(BaseModel):
    """Schema for User response."""
    id: int
    username: str
    email: str
    
    class Config:
        from_attributes = True


class EssentialHookCommentSchema(BaseModel):
    """Schema for Essential Hook Comment response."""
    id: int
    hook_id: int
    user_id: int
    comment_text: str
    
    class Config:
        from_attributes = True


class EssentialHookSchema(BaseModel):
    """Schema for Essential Hook response."""
    id: int
    user_id: Optional[int] = None
    title: str
    text: Optional[str] = None
    platform: Optional[str] = None
    niche: Optional[str] = None
    tone: Optional[str] = None
    status: str = "Generated"
    score: int = 0
    view_count: int = 0
    like_count: int = 0
    comment_count: int = 0
    copy_count: int = 0
    share_count: int = 0
    
    class Config:
        from_attributes = True


class EssentialPostSchema(BaseModel):
    """Schema for Essential Post response."""
    id: int
    title: str
    content: Optional[str] = None
    like_count: int = 0
    share_count: int = 0
    
    class Config:
        from_attributes = True


class EssentialPostLikeSchema(BaseModel):
    """Schema for Post Like response."""
    id: int
    user_id: int
    post_id: int
    
    class Config:
        from_attributes = True


class EssentialPostSaveSchema(BaseModel):
    """Schema for Post Save response."""
    id: int
    user_id: int
    post_id: int
    
    class Config:
        from_attributes = True


# ========================
# Metrics Schemas
# ========================

class MetricsDataSchema(BaseModel):
    """Schema for the metrics data object."""
    totalGenerated: int = Field(..., ge=0, description="Total number of generated hooks")
    totalSaved: int = Field(..., ge=0, description="Total number of saved hooks")
    totalGeneratedScore: int = Field(..., ge=0, description="Sum of all scores")
    youtubeCount: int = Field(..., ge=0, description="Number of YouTube hooks")
    redditCount: int = Field(..., ge=0, description="Number of Reddit hooks")
    instagramCount: int = Field(..., ge=0, description="Number of Instagram hooks")
    
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
    """Schema for successful metrics response."""
    status: Literal["success"] = "success"
    data: MetricsDataSchema
    
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


class PlatformDataSchema(BaseModel):
    """Schema for platform-specific metrics data."""
    platform: PlatformEnum
    generated: int = Field(..., ge=0)
    saved: int = Field(..., ge=0)
    averageScore: float = Field(..., ge=0)
    
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
    """Schema for platform breakdown response."""
    status: Literal["success"] = "success"
    data: PlatformDataSchema


class MetricsSummarySchema(BaseModel):
    """Schema for simplified metrics summary."""
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


# ========================
# Generic Response Schemas
# ========================

class SuccessResponseSchema(BaseModel):
    """Generic success response."""
    status: Literal["success"] = "success"
    message: str
    data: Optional[Dict[str, Any]] = None


class ErrorResponseSchema(BaseModel):
    """Schema for error responses."""
    status: Literal["error"] = "error"
    message: str
    code: str
    details: Optional[Dict[str, Any]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "error",
                "message": "Failed to retrieve dashboard metrics",
                "code": "METRICS_FETCH_FAILED",
                "details": {}
            }
        }


# ========================
# Action Response Schemas
# ========================

class LikeToggleResponse(BaseModel):
    """Response for like toggle action."""
    message: str
    is_liked: bool
    new_like_count: int


class SaveToggleResponse(BaseModel):
    """Response for save toggle action."""
    message: str
    is_saved: bool


class ShareRecordResponse(BaseModel):
    """Response for share recording."""
    message: str


class ViewRecordResponse(BaseModel):
    """Response for view recording."""
    message: str
    total_views: int


class CommentAddResponse(BaseModel):
    """Response for comment addition."""
    message: str
    comments: int


class CopyRecordResponse(BaseModel):
    """Response for copy recording."""
    message: str
    copies: int


class HookListResponse(BaseModel):
    """Response for hook list queries."""
    hooks: List[EssentialHookSchema]
    total: int