# essential_features/EssentialFeaturesRoutes.py

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Body
from fastapi.responses import JSONResponse
from http import HTTPStatus
from .EssentialFeaturesService import MetricsService
from .EssentialFeaturesSchemas import MetricsResponseSchema, ErrorResponseSchema, PlatformBreakdownSchema
from ..core.database import get_db
from functools import wraps
from typing import Optional, Dict, Any

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
    fetch_filtered_hooks_service
)

metrics_bp = APIRouter(prefix='/api/v1', tags=['metrics'])

# Initialize service
metrics_service = MetricsService(get_db)

from .EssentialFeaturesSchemas import EssentialHook, EssentialPost, EssentialHookComment
essential_features_bp = APIRouter(tags=['essential_features'])
hook_schema = EssentialHook
hooks_schema = EssentialHook(many=True)
post_schema = EssentialPost
comment_schema = EssentialHookComment


# Dependency for JWT authentication (you'll need to implement this based on your auth setup)
async def get_current_user(request: Request):
    """
    Dependency to get current authenticated user.
    Replace with your actual JWT authentication logic.
    """
    # Placeholder - implement your JWT verification here
    # Example: verify token from Authorization header
    # token = request.headers.get("Authorization")
    # user = verify_jwt_token(token)
    # return user
    return request.state.user if hasattr(request.state, 'user') else None


async def jwt_required_dependency():
    """Dependency that requires authentication"""
    async def dependency(user=Depends(get_current_user)):
        if not user:
            raise HTTPException(status_code=401, detail="Authentication required")
        return user
    return dependency


async def jwt_required_optional_dependency():
    """Dependency for optional authentication"""
    async def dependency(user=Depends(get_current_user)):
        return user
    return dependency


@essential_features_bp.get("/api/hooks")
async def get_filtered_hooks(
    q: Optional[str] = Query(None),
    platform: str = Query("All Platforms"),
    niche: str = Query("All Niches"),
    tone: str = Query("All Tones"),
    sort_by: str = Query("Newest First")
):
    """
    Frontend calls:
    /api/hooks?q=fitness&platform=YouTube&tone=Emotional&sort_by=Most+Popular
    """

    search_query = q

    hooks = fetch_filtered_hooks_service(
        search_query=search_query,
        platform=platform,
        niche=niche,
        tone=tone,
        sort_by=sort_by
    )

    return JSONResponse(content=hooks, status_code=200)


@essential_features_bp.post("/api/posts/{post_id}/like")
async def toggle_like(post_id: int, current_user=Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    result = toggle_like_service(post_id, current_user)
    return JSONResponse(content=result, status_code=200)


@essential_features_bp.post("/api/hooksrefresh")
async def refresh_hooks():
    hooks = refresh_hooks_service()
    return JSONResponse(content=hooks, status_code=200)


@essential_features_bp.post("/api/hooks/reset-filters")
async def reset_filters():
    hooks = reset_filters_service()
    return JSONResponse(content=hooks, status_code=200)


@essential_features_bp.post("/api/hooks/{hook_id}/view")
async def record_hook_view(hook_id: int):
    res = record_hook_view_service(hook_id)
    return JSONResponse(content=res, status_code=200)


@essential_features_bp.post("/api/hooks/{hook_id}/like")
async def like_hook(hook_id: int, current_user=Depends(get_current_user)):
    res = like_hook_service(hook_id)
    return JSONResponse(content=res, status_code=200)


@essential_features_bp.post("/api/hooks/{hook_id}/copy")
async def record_hook_copy(hook_id: int):
    res = record_hook_copy_service(hook_id)
    return JSONResponse(content=res, status_code=200)


@essential_features_bp.post("/api/hooks/{hook_id}/comment")
async def add_comment(
    hook_id: int,
    payload: Dict[str, Any] = Body(...),
    current_user=Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    text = payload.get("text", "").strip()
    if not text:
        return JSONResponse(content={"message": "Comment text required."}, status_code=400)

    res = add_hook_comment_service(hook_id, current_user.id, text)
    return JSONResponse(content=res, status_code=201)


@essential_features_bp.post("/api/posts/{post_id}/save")
async def toggle_save(post_id: int, current_user=Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    result = toggle_save_service(post_id, current_user)
    return JSONResponse(content=result, status_code=200)


@essential_features_bp.post("/api/posts/{post_id}/share")
async def record_share(post_id: int, current_user=Depends(get_current_user)):
    result = record_share_service(post_id)
    return JSONResponse(content=result, status_code=202)


# -------------------------------------------
#   DASHBOARD METRICS API
# -------------------------------------------
@essential_features_bp.get("/api/dashboard/metrics")
async def dashboard_metrics():
    data = get_dashboard_metrics_service()
    return JSONResponse(content=data, status_code=200)


def login_required(f):
    """
    Decorator to ensure user is authenticated.
    Assumes authentication middleware sets g.user
    """
    @wraps(f)
    async def decorated_function(*args, **kwargs):
        request = kwargs.get('request')
        if not hasattr(request.state, 'user') or not request.state.user:
            return JSONResponse(
                content={
                    "status": "error",
                    "message": "Authentication required",
                    "code": "UNAUTHORIZED"
                },
                status_code=HTTPStatus.UNAUTHORIZED
            )
        return await f(*args, **kwargs)
    return decorated_function


@metrics_bp.get("/user/metrics")
async def get_dashboard_metrics(request: Request):
    """
    GET /api/v1/user/metrics
    
    Retrieves aggregated dashboard metrics for the authenticated user.
    
    Returns:
        200: Success with metrics data
        401: Unauthorized (not authenticated)
        500: Internal server error
        
    Response Example:
        {
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
    """
    try:
        # Get user ID from authentication context
        if not hasattr(request.state, 'user') or not request.state.user:
            return JSONResponse(
                content={
                    "status": "error",
                    "message": "Authentication required",
                    "code": "UNAUTHORIZED"
                },
                status_code=HTTPStatus.UNAUTHORIZED
            )
        
        user_id = request.state.user.id
        
        # Fetch metrics from service
        metrics_data = metrics_service.get_dashboard_metrics(user_id)
        
        # Validate and serialize response
        schema = MetricsResponseSchema()
        response = schema.dump({
            "status": "success",
            "data": metrics_data
        })
        
        return JSONResponse(content=response, status_code=HTTPStatus.OK)
        
    except Exception as e:
        # Log error (use your logging system)
        # logger.error(f"Error fetching metrics for user {user_id}: {str(e)}")
        
        error_schema = ErrorResponseSchema()
        error_response = error_schema.dump({
            "status": "error",
            "message": "Failed to retrieve dashboard metrics",
            "code": "METRICS_FETCH_FAILED"
        })
        
        return JSONResponse(content=error_response, status_code=HTTPStatus.INTERNAL_SERVER_ERROR)


@metrics_bp.get("/user/metrics/platform/{platform}")
async def get_platform_metrics(platform: str, request: Request):
    """
    GET /api/v1/user/metrics/platform/<platform>
    
    Retrieves detailed metrics for a specific platform.
    
    Args:
        platform: Platform name (youtube, reddit, instagram)
        
    Returns:
        200: Success with platform-specific metrics
        400: Invalid platform name
        401: Unauthorized
        404: No data found for platform
        500: Internal server error
    """
    # Validate platform parameter
    valid_platforms = ["YouTube", "Reddit", "Instagram"]
    platform_capitalized = platform.capitalize()
    
    if platform_capitalized not in valid_platforms:
        return JSONResponse(
            content={
                "status": "error",
                "message": f"Invalid platform. Must be one of: {', '.join(valid_platforms)}",
                "code": "INVALID_PLATFORM"
            },
            status_code=HTTPStatus.BAD_REQUEST
        )
    
    try:
        if not hasattr(request.state, 'user') or not request.state.user:
            return JSONResponse(
                content={
                    "status": "error",
                    "message": "Authentication required",
                    "code": "UNAUTHORIZED"
                },
                status_code=HTTPStatus.UNAUTHORIZED
            )
        
        user_id = request.state.user.id
        
        # Fetch platform-specific breakdown
        platform_data = metrics_service.get_platform_breakdown(user_id, platform_capitalized)
        
        if not platform_data:
            return JSONResponse(
                content={
                    "status": "error",
                    "message": f"No data found for platform: {platform_capitalized}",
                    "code": "PLATFORM_DATA_NOT_FOUND"
                },
                status_code=HTTPStatus.NOT_FOUND
            )
        
        schema = PlatformBreakdownSchema()
        response = schema.dump({
            "status": "success",
            "data": platform_data
        })
        
        return JSONResponse(content=response, status_code=HTTPStatus.OK)
        
    except Exception as e:
        error_schema = ErrorResponseSchema()
        error_response = error_schema.dump({
            "status": "error",
            "message": "Failed to retrieve platform metrics",
            "code": "PLATFORM_METRICS_FETCH_FAILED"
        })
        
        return JSONResponse(content=error_response, status_code=HTTPStatus.INTERNAL_SERVER_ERROR)


@metrics_bp.get("/user/metrics/summary")
async def get_metrics_summary(request: Request):
    """
    GET /api/v1/user/metrics/summary
    
    Returns a simplified summary of user metrics (total generated and saved only).
    Useful for quick dashboard previews or mobile views.
    
    Returns:
        200: Success with summary data
        401: Unauthorized
        500: Internal server error
    """
    try:
        if not hasattr(request.state, 'user') or not request.state.user:
            return JSONResponse(
                content={
                    "status": "error",
                    "message": "Authentication required",
                    "code": "UNAUTHORIZED"
                },
                status_code=HTTPStatus.UNAUTHORIZED
            )
        
        user_id = request.state.user.id
        metrics_data = metrics_service.get_dashboard_metrics(user_id)
        
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
            status_code=HTTPStatus.OK
        )
        
    except Exception as e:
        error_schema = ErrorResponseSchema()
        error_response = error_schema.dump({
            "status": "error",
            "message": "Failed to retrieve metrics summary",
            "code": "SUMMARY_FETCH_FAILED"
        })
        
        return JSONResponse(content=error_response, status_code=HTTPStatus.INTERNAL_SERVER_ERROR)


# Error handlers for the blueprint
@metrics_bp.exception_handler(404)
async def not_found(request: Request, exc: HTTPException):
    """Handle 404 errors within this blueprint"""
    return JSONResponse(
        content={
            "status": "error",
            "message": "Resource not found",
            "code": "NOT_FOUND"
        },
        status_code=HTTPStatus.NOT_FOUND
    )


@metrics_bp.exception_handler(500)
async def internal_error(request: Request, exc: HTTPException):
    """Handle 500 errors within this blueprint"""
    return JSONResponse(
        content={
            "status": "error",
            "message": "Internal server error",
            "code": "INTERNAL_ERROR"
        },
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR
    )