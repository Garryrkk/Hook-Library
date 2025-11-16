# essential_features/EssentialFeaturesRoutes.py

from flask import Blueprint, jsonify, request, Blueprint, g
from flask_jwt_extended import current_user, jwt_required
from http import HTTPStatus
from EssentialFeatures.EssentialFeaturesService import MetricsService
from EssentialFeatures.EssentialFeaturesSchemas import MetricsResponseSchema, ErrorResponseSchema, PlatformBreakdownSchema
from core.database import db
from functools import wraps

from EssentialFeatures.EssentialFeaturesService import (
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
metrics_bp = Blueprint('metrics', __name__, url_prefix='/api/v1')

# Initialize service
metrics_service = MetricsService(db)

from EssentialFeaturesSchemas import EssentialHook, EssentialPost, EssentialHookComment
essential_features_bp = Blueprint("essential_features", __name__)
hook_schema = EssentialHook
hooks_schema = EssentialHook(many=True)
post_schema = EssentialPost
comment_schema = EssentialHookComment

@essential_features_bp.route("/api/hooks", methods=["GET"])
def get_filtered_hooks():
    """
    Frontend calls:
    /api/hooks?q=fitness&platform=YouTube&tone=Emotional&sort_by=Most+Popular
    """

    search_query = request.args.get("q", default=None)
    platform = request.args.get("platform", default="All Platforms")
    niche = request.args.get("niche", default="All Niches")
    tone = request.args.get("tone", default="All Tones")
    sort_by = request.args.get("sort_by", default="Newest First")

    hooks = fetch_filtered_hooks_service(
        search_query=search_query,
        platform=platform,
        niche=niche,
        tone=tone,
        sort_by=sort_by
    )

    return jsonify(hooks), 200

@essential_features_bp.route("/api/posts/<int:post_id>/like", methods=["POST"])
@jwt_required()
def toggle_like(post_id):
    result = toggle_like_service(post_id, current_user)
    return jsonify(result), 200

@essential_features_bp.route("/api/hooksrefresh", methods=["POST"])
def refresh_hooks():
    hooks = refresh_hooks_service()
    return jsonify(hooks), 200

@essential_features_bp.route("/api/hooks/reset-filters", methods=["POST"])
def reset_filters():
    hooks = reset_filters_service()
    return jsonify(hooks), 200


@essential_features_bp.route("/api/hooks/<int:hook_id>/view", methods=["POST"])
def record_hook_view(hook_id):
    res = record_hook_view_service(hook_id)
    return jsonify(res), 200


@essential_features_bp.route("/api/hooks/<int:hook_id>/like", methods=["POST"])
@jwt_required(optional=True)
def like_hook(hook_id):
    res = like_hook_service(hook_id)
    return jsonify(res), 200


@essential_features_bp.route("/api/hooks/<int:hook_id>/copy", methods=["POST"])
def record_hook_copy(hook_id):
    res = record_hook_copy_service(hook_id)
    return jsonify(res), 200


@essential_features_bp.route("/api/hooks/<int:hook_id>/comment", methods=["POST"])
@jwt_required()
def add_comment(hook_id):
    payload = request.get_json() or {}
    text = payload.get("text", "").strip()
    if not text:
        return jsonify({"message": "Comment text required."}), 400

    res = add_hook_comment_service(hook_id, current_user.id, text)
    return jsonify(res), 201



@essential_features_bp.route("/api/posts/<int:post_id>/save", methods=["POST"])
@jwt_required()
def toggle_save(post_id):
    result = toggle_save_service(post_id, current_user)
    return jsonify(result), 200


@essential_features_bp.route("/api/posts/<int:post_id>/share", methods=["POST"])
@jwt_required(optional=True)
def record_share(post_id):
    result = record_share_service(post_id)
    return jsonify(result), 202


# -------------------------------------------
#   DASHBOARD METRICS API
# -------------------------------------------
@essential_features_bp.route("/api/dashboard/metrics", methods=["GET"])
def dashboard_metrics():
    data = get_dashboard_metrics_service()
    return jsonify(data), 200

def login_required(f):
    """
    Decorator to ensure user is authenticated.
    Assumes authentication middleware sets g.user
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(g, 'user') or not g.user:
            return jsonify({
                "status": "error",
                "message": "Authentication required",
                "code": "UNAUTHORIZED"
            }), HTTPStatus.UNAUTHORIZED
        return f(*args, **kwargs)
    return decorated_function


@metrics_bp.route("/user/metrics", methods=["GET"])
@login_required
def get_dashboard_metrics():
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
        user_id = g.user.id
        
        # Fetch metrics from service
        metrics_data = metrics_service.get_dashboard_metrics(user_id)
        
        # Validate and serialize response
        schema = MetricsResponseSchema()
        response = schema.dump({
            "status": "success",
            "data": metrics_data
        })
        
        return jsonify(response), HTTPStatus.OK
        
    except Exception as e:
        # Log error (use your logging system)
        # logger.error(f"Error fetching metrics for user {user_id}: {str(e)}")
        
        error_schema = ErrorResponseSchema()
        error_response = error_schema.dump({
            "status": "error",
            "message": "Failed to retrieve dashboard metrics",
            "code": "METRICS_FETCH_FAILED"
        })
        
        return jsonify(error_response), HTTPStatus.INTERNAL_SERVER_ERROR


@metrics_bp.route("/user/metrics/platform/<platform>", methods=["GET"])
@login_required
def get_platform_metrics(platform: str):
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
        return jsonify({
            "status": "error",
            "message": f"Invalid platform. Must be one of: {', '.join(valid_platforms)}",
            "code": "INVALID_PLATFORM"
        }), HTTPStatus.BAD_REQUEST
    
    try:
        user_id = g.user.id
        
        # Fetch platform-specific breakdown
        platform_data = metrics_service.get_platform_breakdown(user_id, platform_capitalized)
        
        if not platform_data:
            return jsonify({
                "status": "error",
                "message": f"No data found for platform: {platform_capitalized}",
                "code": "PLATFORM_DATA_NOT_FOUND"
            }), HTTPStatus.NOT_FOUND
        
        schema = PlatformBreakdownSchema()
        response = schema.dump({
            "status": "success",
            "data": platform_data
        })
        
        return jsonify(response), HTTPStatus.OK
        
    except Exception as e:
        error_schema = ErrorResponseSchema()
        error_response = error_schema.dump({
            "status": "error",
            "message": "Failed to retrieve platform metrics",
            "code": "PLATFORM_METRICS_FETCH_FAILED"
        })
        
        return jsonify(error_response), HTTPStatus.INTERNAL_SERVER_ERROR


@metrics_bp.route("/user/metrics/summary", methods=["GET"])
@login_required
def get_metrics_summary():
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
        user_id = g.user.id
        metrics_data = metrics_service.get_dashboard_metrics(user_id)
        
        # Return only summary fields
        summary = {
            "totalGenerated": metrics_data["totalGenerated"],
            "totalSaved": metrics_data["totalSaved"],
            "totalScore": metrics_data["totalGeneratedScore"]
        }
        
        return jsonify({
            "status": "success",
            "data": summary
        }), HTTPStatus.OK
        
    except Exception as e:
        error_schema = ErrorResponseSchema()
        error_response = error_schema.dump({
            "status": "error",
            "message": "Failed to retrieve metrics summary",
            "code": "SUMMARY_FETCH_FAILED"
        })
        
        return jsonify(error_response), HTTPStatus.INTERNAL_SERVER_ERROR


# Error handlers for the blueprint
@metrics_bp.errorhandler(404)
def not_found(error):
    """Handle 404 errors within this blueprint"""
    return jsonify({
        "status": "error",
        "message": "Resource not found",
        "code": "NOT_FOUND"
    }), HTTPStatus.NOT_FOUND


@metrics_bp.errorhandler(500)
def internal_error(error):
    """Handle 500 errors within this blueprint"""
    return jsonify({
        "status": "error",
        "message": "Internal server error",
        "code": "INTERNAL_ERROR"
    }), HTTPStatus.INTERNAL_SERVER_ERROR