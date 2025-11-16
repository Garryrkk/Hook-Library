# essential_features/EssentialFeaturesService.py

from ..core.database import db
from sqlalchemy import func

from EssentialFeatures.EssentialFeaturesSchemas import (
    EssentialHook,
    EssentialPost,
    EssentialPostLike,
    EssentialPostSave,
    EssentialHookComment
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

def record_hook_view_service(hook_id):
    hook = EssentialHook.query.get_or_404(hook_id)
    hook.view_count = hook.view_count + 1
    db.session.commit()
    return {"message": "Hook view recorded.", "total_views": hook.view_count}


def like_hook_service(hook_id):
    hook = EssentialHook.query.get_or_404(hook_id)
    hook.like_count = hook.like_count + 1
    db.session.commit()
    return {"message": "Hook liked.", "likes": hook.like_count}


def add_hook_comment_service(hook_id, user_id, comment_text):
    # create comment row and increment comment_count
    comment = EssentialHookComment(hook_id=hook_id, user_id=user_id, comment_text=comment_text)
    db.session.add(comment)
    hook = EssentialHook.query.get_or_404(hook_id)
    hook.comment_count = hook.comment_count + 1
    db.session.commit()
    return {"message": "Comment added.", "comments": hook.comment_count}


def record_hook_copy_service(hook_id):
    hook = EssentialHook.query.get_or_404(hook_id)
    hook.copy_count = hook.copy_count + 1
    db.session.commit()
    return {"message": "Copy recorded.", "copies": hook.copy_count}


def fetch_filtered_hooks_service(
    search_query=None,
    platform="All Platforms",
    niche="All Niches",
    tone="All Tones",
    sort_by="Newest"
):
    query = EssentialHook.query

    if search_query and search_query.strip():
        q = f"%{search_query.strip()}%"
        query = query.filter(
            (EssentialHook.title.ilike(q)) |
            (EssentialHook.text.ilike(q)) |
            (EssentialHook.niche.ilike(q))
        )

    if platform and platform != "All Platforms":
        query = query.filter(EssentialHook.platform == platform)

    if niche and niche != "All Niches":
        query = query.filter(EssentialHook.niche == niche)

    if tone and tone != "All Tones":
        query = query.filter(EssentialHook.tone == tone)

    # Sorting
    if sort_by == "Newest":
        query = query.order_by(EssentialHook.id.desc())  # id desc approximates newest
    elif sort_by == "Most Popular":
        query = query.order_by(EssentialHook.view_count.desc())
    elif sort_by == "Most Copied":
        query = query.order_by(EssentialHook.copy_count.desc())
    elif sort_by == "Highest Engagement":
        # engagement = like_count + comment_count + view_count (DB expression)
        query = query.order_by((EssentialHook.like_count + EssentialHook.comment_count + EssentialHook.view_count).desc())
    else:
        query = query.order_by(EssentialHook.id.desc())

    hooks = query.all()
    return [h.to_dict() for h in hooks]



def reset_filters_service():
    # just return all hooks ordered by id desc
    hooks = EssentialHook.query.order_by(EssentialHook.id.desc()).all()
    return [h.to_dict() for h in hooks]



def refresh_hooks_service():
    hooks = EssentialHook.query.order_by(EssentialHook.id.desc()).all()
    return [h.to_dict() for h in hooks]

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
