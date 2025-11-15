# essential_features/EssentialFeaturesRoutes.py

from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required

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

from EssentialFeaturesSchemas import EssentialHook, EssentialPost, EssentialHookComment
essential_features_bp = Blueprint("essential_features", __name__)
hook_schema = EssentialHook
hooks_schema = EssentialHook(many=True)
post_schema = EssentialPost
comment_schema = EssentialPost

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
