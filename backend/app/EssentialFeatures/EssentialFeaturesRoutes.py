# essential_features/EssentialFeaturesRoutes.py

from flask import Blueprint, jsonify
from flask_jwt_extended import current_user, jwt_required

from EssentialFeatures.EssentialFeaturesService import (
    toggle_like_service,
    toggle_save_service,
    record_share_service,
    get_dashboard_metrics_service
)

essential_features_bp = Blueprint("essential_features", __name__)


# -------------------------------------------
#   LIKE / UNLIKE
# -------------------------------------------
@essential_features_bp.route("/api/posts/<int:post_id>/like", methods=["POST"])
@jwt_required()
def toggle_like(post_id):
    result = toggle_like_service(post_id, current_user)
    return jsonify(result), 200


# -------------------------------------------
#   SAVE / UNSAVE
# -------------------------------------------
@essential_features_bp.route("/api/posts/<int:post_id>/save", methods=["POST"])
@jwt_required()
def toggle_save(post_id):
    result = toggle_save_service(post_id, current_user)
    return jsonify(result), 200


# -------------------------------------------
#   SHARE COUNTER
# -------------------------------------------
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
