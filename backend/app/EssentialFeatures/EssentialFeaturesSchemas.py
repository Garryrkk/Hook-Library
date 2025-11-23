# essential_features/schemas.py
# Re-export SQLAlchemy models defined in EsssentialFeatures.py so service modules
# that import model names from this module continue to work.
from .EsssentialFeatures import (
    User,
    EssentialHook,
    EssentialPost,
    EssentialPostLike,
    EssentialPostSave,
    EssentialHookComment,
)

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any, Literal
from enum import Enum


class PlatformEnum(str, Enum):
    """Enum for valid platforms"""
    YOUTUBE = "YouTube"
    REDDIT = "Reddit"
    INSTAGRAM = "Instagram"


# Request Schemas
class EssentialHookCommentCreate(BaseModel):
    """Schema for creating a hook comment"""
    hook_id: int = Field(..., gt=0)
    comment_text: str = Field(..., min_length=1, max_length=2000)


class PlatformParamSchema(BaseModel):
    """Schema for validating platform parameter"""
    platform: str = Field(..., description="Platform name (case-insensitive)")
    
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


# Response Schemas
class EssentialHookCommentSchema(BaseModel):
    """Schema for Essential Hook Comment"""
    id: int
    hook_id: int
    user_id: int
    comment_text: str
    
    class Config:
        from_attributes = True


class EssentialHookSchema(BaseModel):
    """Schema for Essential Hook"""
    id: int
    title: str
    platform: Optional[str] = None
    score: int
    
    class Config:
        from_attributes = True


class EssentialPostSchema(BaseModel):
    """Schema for Essential Post"""
    id: int
    title: str
    content: Optional[str] = None
    like_count: int
    share_count: int
    
    class Config:
        from_attributes = True


class MetricsDataSchema(BaseModel):
    """Schema for the metrics data object"""
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
    """Schema for successful metrics response"""
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
    """Schema for platform-specific metrics data"""
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
    """Schema for platform breakdown response"""
    status: Literal["success"] = "success"
    data: PlatformDataSchema


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


