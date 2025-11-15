# essential_features/EssentialFeaturesService.py

from ..core.database import db
from sqlalchemy import func

from EssentialFeatures.EssentialFeaturesSchemas import (
    EssentialHook,
    EssentialPost,
    EssentialPostLike,
    EssentialPostSave
)



def toggle_like_service(post_id, user):
    post = EssentialPost.query.get_or_404(post_id)

    existing_like = EssentialPostLike.query.filter_by(
        user_id=user.id, post_id=post.id
    ).first()

    if existing_like:
        db.session.delete(existing_like)
        post.like_count = max(0, post.like_count - 1)
        db.session.commit()

        return {
            "message": "Post unliked successfully.",
            "is_liked": False,
            "new_like_count": post.like_count
        }

    # Like the post
    new_like = EssentialPostLike(user_id=user.id, post_id=post.id)
    db.session.add(new_like)

    post.like_count += 1
    db.session.commit()

    return {
        "message": "Post liked successfully.",
        "is_liked": True,
        "new_like_count": post.like_count
    }


def toggle_save_service(post_id, user):
    post = EssentialPost.query.get_or_404(post_id)

    existing_save = EssentialPostSave.query.filter_by(
        user_id=user.id, post_id=post.id
    ).first()

    if existing_save:
        db.session.delete(existing_save)
        db.session.commit()
        return {"message": "Post unsaved.", "is_saved": False}

    # Save the post
    db.session.add(EssentialPostSave(user_id=user.id, post_id=post.id))
    db.session.commit()

    return {"message": "Post saved.", "is_saved": True}

def record_share_service(post_id):
    post = EssentialPost.query.get_or_404(post_id)
    post.share_count += 1
    db.session.commit()

    return {"message": "Share recorded."}


def get_dashboard_metrics_service():
    # Total hooks (no time fields involved)
    total_hooks = db.session.query(EssentialHook).count()

    # Total score of all hooks
    total_score_result = db.session.query(func.sum(EssentialHook.score)).scalar()
    total_score = total_score_result or 0

    # Count YouTube hooks
    youtube_count = db.session.query(EssentialHook).filter(
        EssentialHook.platform == "YouTube"
    ).count()

    return {
        "totalHooks": total_hooks,
        "youtubeCount": youtube_count,
        "totalHookScore": int(total_score)
    }
