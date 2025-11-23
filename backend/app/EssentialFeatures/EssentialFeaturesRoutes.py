# essential_features/routes.py
"""
FastAPI routes for Essential Features module.
Defines API endpoints for hooks, posts, comments, likes, and metrics.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Body, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any

from ..core.database import get_db
from .models import User
from .EssentialFeaturesSchemas import (
    MetricsResponseSchema,
    ErrorResponseSchema,
    PlatformBreakdownSchema,
    CommentCreateRequest,
    LikeToggleResponse,
    SaveToggleResponse,
    ShareRecordResponse,
    ViewRecordResponse,
    CommentAddResponse,
    CopyRecordResponse
)
from .EssentialFeaturesService import (
    toggle_like_service,
    toggle_save_service,
    record_share_service,
    get_dashboard_metrics_service,
    record_hook_copy_service,
    record_hook_view_service,
    refresh_hooks_service,
    reset_filters_service,
    add_hook_comment_service,
    like_hook_service,
    fetch_filtered_hooks_service,
    MetricsService
)


# ========================
# Router Initialization
# ========================

# Main features router
essential_features_bp = APIRouter(prefix="/api", tags=["Essential Features"])

# Metrics router
metrics_bp = APIRouter(prefix="/api/v1", tags=["Metrics"])


# ========================
# Authentication Dependencies
# ========================

async def get_current_user(request: Request) -> Optional[User]:
    """
    Dependency to get current authenticated user.
    
    Args:
        request: FastAPI request object
        
    Returns:
        User object if authenticated, None otherwise
        
    Note:
        Replace with your actual JWT authentication logic.
        This is a placeholder implementation.
    """
    # Example: Extract token from Authorization header
    # token = request.headers.get("Authorization")
    # user = verify_jwt_token(token)
    # return user
    
    return getattr(request.state, 'user', None)


async def require_auth(request: Request) -> User:
    """
    Dependency that requires authentication.
    
    Args:
        request: FastAPI request object
        
    Returns:
        Authenticated User object
        
    Raises:
        HTTPException: If user is not authenticated (401)
    """
    user = await get_current_user(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return user


# ========================
# Hook Endpoints
# ========================

@essential_features_bp.get(
    "/hooks",
    summary="Get filtered hooks",
    description="Retrieve hooks with optional filtering and sorting"
)
async def get_filtered_hooks(
    q: Optional[str] = Query(None, description="Search query for title, text, or niche"),
    platform: str = Query("All Platforms", description="Filter by platform"),
    niche: str = Query("All Niches", description="Filter by niche"),
    tone: str = Query("All Tones", description="Filter by tone"),
    sort_by: str = Query("Newest First", description="Sort order"),
    db: Session = Depends(get_db)
):
    """
    Get hooks with filtering and sorting.
    
    Example:
        GET /api/hooks?q=fitness&platform=YouTube&tone=Emotional&sort_by=Most Popular
    """
    hooks = fetch_filtered_hooks_service(
        db=db,
        search_query=q,
        platform=platform,
        niche=niche,
        tone=tone,
        sort_by=sort_by
    )
    
    return JSONResponse(content=hooks, status_code=status.HTTP_200_OK)


@essential_features_bp.post(
    "/hooksrefresh",
    summary="Refresh hooks",
    description="Reload all hooks without filters"
)
async def refresh_hooks(db: Session = Depends(get_db)):
    """Refresh and return all hooks."""
    hooks = refresh_hooks_service(db)
    return JSONResponse(content=hooks, status_code=status.HTTP_200_OK)


@essential_features_bp.post(
    "/hooks/reset-filters",
    summary="Reset filters",
    description="Clear all filters and return all hooks"
)
async def reset_filters(db: Session = Depends(get_db)):
    """Reset filters and return all hooks."""
    hooks = reset_filters_service(db)
    return JSONResponse(content=hooks, status_code=status.HTTP_200_OK)


@essential_features_bp.post(
    "/hooks/{hook_id}/view",
    summary="Record hook view",
    response_model=ViewRecordResponse
)
async def record_hook_view(
    hook_id: int,
    db: Session = Depends(get_db)
):
    """Record a view event for a specific hook."""
    result = record_hook_view_service(db, hook_id)
    return JSONResponse(content=result, status_code=status.HTTP_200_OK)


@essential_features_bp.post(
    "/hooks/{hook_id}/like",
    summary="Like a hook",
    response_model=ViewRecordResponse
)
async def like_hook(
    hook_id: int,
    db: Session = Depends(get_db)
):
    """Increment the like count for a hook."""
    result = like_hook_service(db, hook_id)
    return JSONResponse(content=result, status_code=status.HTTP_200_OK)


@essential_features_bp.post(
    "/hooks/{hook_id}/copy",
    summary="Record hook copy",
    response_model=CopyRecordResponse
)
async def record_hook_copy(
    hook_id: int,
    db: Session = Depends(get_db)
):
    """Record when a user copies a hook."""
    result = record_hook_copy_service(db, hook_id)
    return JSONResponse(content=result, status_code=status.HTTP_200_OK)


@essential_features_bp.post(
    "/hooks/{hook_id}/comment",
    summary="Add comment to hook",
    response_model=CommentAddResponse,
    status_code=status.HTTP_201_CREATED
)
async def add_comment(
    hook_id: int,
    payload: CommentCreateRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """Add a comment to a specific hook. Requires authentication."""
    user = await require_auth(request)
    
    result = add_hook_comment_service(
        db=db,
        hook_id=hook_id,
        user_id=user.id,
        comment_text=payload.text
    )
    return JSONResponse(content=result, status_code=status.HTTP_201_CREATED)


# ========================
# Post Endpoints
# ========================

@essential_features_bp.post(
    "/posts/{post_id}/like",
    summary="Toggle post like",
    response_model=LikeToggleResponse
)
async def toggle_like(
    post_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """Toggle like status for a post. Requires authentication."""
    user = await require_auth(request)
    result = toggle_like_service(db, post_id, user)
    return JSONResponse(content=result, status_code=status.HTTP_200_OK)


@essential_features_bp.post(
    "/posts/{post_id}/save",
    summary="Toggle post save",
    response_model=SaveToggleResponse
)
async def toggle_save(
    post_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """Toggle save/bookmark status for a post. Requires authentication."""
    user = await require_auth(request)
    result = toggle_save_service(db, post_id, user)
    return JSONResponse(content=result, status_code=status.HTTP_200_OK)


@essential_features_bp.post(
    "/posts/{post_id}/share",
    summary="Record post share",
    response_model=ShareRecordResponse,
    status_code=status.HTTP_202_ACCEPTED
)
async def record_share(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Record a share event for a post."""
    result = record_share_service(db, post_id)
    return JSONResponse(content=result, status_code=status.HTTP_202_ACCEPTED)


# ========================
# Dashboard Endpoints
# ========================

@essential_features_bp.get(
    "/dashboard/metrics",
    summary="Get basic dashboard metrics",
    description="Get overall dashboard metrics (no user filtering)"
)
async def dashboard_metrics(db: Session = Depends(get_db)):
    """Get basic dashboard metrics for all hooks."""
    data = get_dashboard_metrics_service(db)
    return JSONResponse(content=data, status_code=status.HTTP_200_OK)


# ========================
# User Metrics Endpoints
# ========================

@metrics_bp.get(
    "/user/metrics",
    response_model=MetricsResponseSchema,
    summary="Get user dashboard metrics",
    description="Retrieve aggregated metrics for the authenticated user"
)
async def get_user_metrics(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Get comprehensive dashboard metrics for the authenticated user.
    
    Returns:
        - totalGenerated: Total hooks generated
        - totalSaved: Total hooks saved
        - totalGeneratedScore: Sum of all scores
        - Platform-specific counts
    """
    user = await require_auth(request)
    
    try:
        metrics_service = MetricsService(db)
        metrics_data = metrics_service.get_dashboard_metrics(user.id)
        
        return JSONResponse(
            content={
                "status": "success",
                "data": metrics_data
            },
            status_code=status.HTTP_200_OK
        )
        
    except Exception as e:
        return JSONResponse(
            content={
                "status": "error",
                "message": "Failed to retrieve dashboard metrics",
                "code": "METRICS_FETCH_FAILED",
                "details": {"error": str(e)}
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@metrics_bp.get(
    "/user/metrics/platform/{platform}",
    response_model=PlatformBreakdownSchema,
    summary="Get platform-specific metrics",
    description="Retrieve detailed metrics for a specific platform"
)
async def get_platform_metrics(
    platform: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Get metrics breakdown for a specific platform (YouTube, Reddit, Instagram).
    
    Args:
        platform: Platform name (case-insensitive)
    """
    # Validate platform
    valid_platforms = ["YouTube", "Reddit", "Instagram"]
    platform_capitalized = platform.capitalize()
    
    if platform_capitalized not in valid_platforms:
        return JSONResponse(
            content={
                "status": "error",
                "message": f"Invalid platform. Must be one of: {', '.join(valid_platforms)}",
                "code": "INVALID_PLATFORM"
            },
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    user = await require_auth(request)
    
    try:
        metrics_service = MetricsService(db)
        platform_data = metrics_service.get_platform_breakdown(user.id, platform_capitalized)
        
        if not platform_data:
            return JSONResponse(
                content={
                    "status": "error",
                    "message": f"No data found for platform: {platform_capitalized}",
                    "code": "PLATFORM_DATA_NOT_FOUND"
                },
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        return JSONResponse(
            content={
                "status": "success",
                "data": platform_data
            },
            status_code=status.HTTP_200_OK
        )
        
    except Exception as e:
        return JSONResponse(
            content={
                "status": "error",
                "message": "Failed to retrieve platform metrics",
                "code": "PLATFORM_METRICS_FETCH_FAILED",
                "details": {"error": str(e)}
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@metrics_bp.get(
    "/user/metrics/summary",
    summary="Get metrics summary",
    description="Get simplified metrics summary for quick views"
)
async def get_metrics_summary(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Get a simplified summary of user metrics.
    Useful for dashboard previews or mobile views.
    """
    user = await require_auth(request)
    
    try:
        metrics_service = MetricsService(db)
        metrics_data = metrics_service.get_dashboard_metrics(user.id)
        
        # Return only summary fields
        summary = {
            "totalGenerated": metrics_data["totalGenerated"],
            "totalSaved": metrics_data["totalSaved"],
            "totalScore": metrics_data["totalGeneratedScore"]
        }
        
        return JSONResponse(
            content={
                "status": "success",
                "data": summary
            },
            status_code=status.HTTP_200_OK
        )
        
    except Exception as e:
        return JSONResponse(
            content={
                "status": "error",
                "message": "Failed to retrieve metrics summary",
                "code": "SUMMARY_FETCH_FAILED",
                "details": {"error": str(e)}
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ========================
# Error Handlers (exported)
# NOTE: APIRouter does not support `exception_handler` decorator. These
# handler functions are provided for registration on the FastAPI `app`
# via `app.add_exception_handler` (see `app/main.py`).
# ========================

async def not_found_handler(request: Request, exc: HTTPException):
    """Handle 404 errors."""
    # Only handle actual 404 HTTPExceptions; re-raise others
    if getattr(exc, "status_code", None) == status.HTTP_404_NOT_FOUND:
        return JSONResponse(
            content={
                "status": "error",
                "message": "Resource not found",
                "code": "NOT_FOUND"
            },
            status_code=status.HTTP_404_NOT_FOUND
        )

    raise exc


async def internal_error_handler(request: Request, exc: Exception):
    """Handle internal server errors (500)."""
    return JSONResponse(
        content={
            "status": "error",
            "message": "Internal server error",
            "code": "INTERNAL_ERROR",
            "details": {"error": str(exc)}
        },
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
    )