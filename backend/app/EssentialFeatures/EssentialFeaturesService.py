# essential_features/EssentialFeaturesService.py

from ..core.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_
from typing import Dict, Optional
from fastapi import HTTPException

from .EssentialFeaturesSchemas import (
    EssentialHook,
    EssentialPost,
    EssentialPostLike,
    EssentialPostSave,
    EssentialHookComment
)


def toggle_like_service(post_id, user):
    """Toggle like status for a post"""
    post = get_db.session.query(EssentialPost).filter(EssentialPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = get_db.session.query(EssentialPostLike).filter_by(
        user_id=user.id, post_id=post.id
    ).first()

    if existing_like:
        get_db.session.delete(existing_like)
        post.like_count = max(0, post.like_count - 1)
        get_db.session.commit()

        return {
            "message": "Post unliked successfully.",
            "is_liked": False,
            "new_like_count": post.like_count
        }

    # Like the post
    new_like = EssentialPostLike(user_id=user.id, post_id=post.id)
    get_db.session.add(new_like)

    post.like_count += 1
    get_db.session.commit()

    return {
        "message": "Post liked successfully.",
        "is_liked": True,
        "new_like_count": post.like_count
    }


def toggle_save_service(post_id, user):
    """Toggle save status for a post"""
    post = get_db.session.query(EssentialPost).filter(EssentialPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_save = get_db.session.query(EssentialPostSave).filter_by(
        user_id=user.id, post_id=post.id
    ).first()

    if existing_save:
        get_db.session.delete(existing_save)
        get_db.session.commit()
        return {"message": "Post unsaved.", "is_saved": False}

    # Save the post
    get_db.session.add(EssentialPostSave(user_id=user.id, post_id=post.id))
    get_db.session.commit()

    return {"message": "Post saved.", "is_saved": True}


def record_share_service(post_id):
    """Record a share for a post"""
    post = get_db.session.query(EssentialPost).filter(EssentialPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post.share_count += 1
    get_db.session.commit()

    return {"message": "Share recorded."}


def record_hook_view_service(hook_id):
    """Record a view for a hook"""
    hook = get_db.session.query(EssentialHook).filter(EssentialHook.id == hook_id).first()
    if not hook:
        raise HTTPException(status_code=404, detail="Hook not found")
    
    hook.view_count = hook.view_count + 1
    get_db.session.commit()
    return {"message": "Hook view recorded.", "total_views": hook.view_count}


def like_hook_service(hook_id):
    """Like a hook"""
    hook = get_db.session.query(EssentialHook).filter(EssentialHook.id == hook_id).first()
    if not hook:
        raise HTTPException(status_code=404, detail="Hook not found")
    
    hook.like_count = hook.like_count + 1
    get_db.session.commit()
    return {"message": "Hook liked.", "likes": hook.like_count}


def add_hook_comment_service(hook_id, user_id, comment_text):
    """Add a comment to a hook"""
    # create comment row and increment comment_count
    comment = EssentialHookComment(hook_id=hook_id, user_id=user_id, comment_text=comment_text)
    get_db.session.add(comment)
    
    hook = get_db.session.query(EssentialHook).filter(EssentialHook.id == hook_id).first()
    if not hook:
        raise HTTPException(status_code=404, detail="Hook not found")
    
    hook.comment_count = hook.comment_count + 1
    get_db.session.commit()
    return {"message": "Comment added.", "comments": hook.comment_count}


def record_hook_copy_service(hook_id):
    """Record a copy action for a hook"""
    hook = get_db.session.query(EssentialHook).filter(EssentialHook.id == hook_id).first()
    if not hook:
        raise HTTPException(status_code=404, detail="Hook not found")
    
    hook.copy_count = hook.copy_count + 1
    get_db.session.commit()
    return {"message": "Copy recorded.", "copies": hook.copy_count}


def fetch_filtered_hooks_service(
    search_query=None,
    platform="All Platforms",
    niche="All Niches",
    tone="All Tones",
    sort_by="Newest"
):
    """Fetch hooks with filters applied"""
    query = get_db.session.query(EssentialHook)

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
        # engagement = like_count + comment_count + view_count (get_db expression)
        query = query.order_by((EssentialHook.like_count + EssentialHook.comment_count + EssentialHook.view_count).desc())
    else:
        query = query.order_by(EssentialHook.id.desc())

    hooks = query.all()
    return [h.to_dict() for h in hooks]


def reset_filters_service():
    """Reset all filters and return all hooks"""
    # just return all hooks ordered by id desc
    hooks = get_db.session.query(EssentialHook).order_by(EssentialHook.id.desc()).all()
    return [h.to_dict() for h in hooks]


def refresh_hooks_service():
    """Refresh and return all hooks"""
    hooks = get_db.session.query(EssentialHook).order_by(EssentialHook.id.desc()).all()
    return [h.to_dict() for h in hooks]


def get_dashboard_metrics_service():
    """Get dashboard metrics for all hooks"""
    # Total hooks (no time fields involved)
    total_hooks = get_db.session.query(EssentialHook).count()

    # Total score of all hooks
    total_score_result = get_db.session.query(func.sum(EssentialHook.score)).scalar()
    total_score = total_score_result or 0

    # Count YouTube hooks
    youtube_count = get_db.session.query(EssentialHook).filter(
        EssentialHook.platform == "YouTube"
    ).count()

    return {
        "totalHooks": total_hooks,
        "youtubeCount": youtube_count,
        "totalHookScore": int(total_score)
    }


class MetricsService:
    """Service class for handling dashboard metrics operations"""
    
    def __init__(self, get_db):
        self.get_db = get_db
    
    def get_dashboard_metrics(self, user_id: int) -> Dict[str, int]:
        """
        Fetches all aggregated dashboard metrics for a user in a single query.
        
        Args:
            user_id: The ID of the user to fetch metrics for
            
        Returns:
            Dictionary containing aggregated metrics:
            - totalGenerated: Total number of generated hooks
            - totalSaved: Total number of saved hooks
            - totalGeneratedScore: Sum of scores for generated hooks
            - youtubeCount: Number of generated YouTube hooks
            - redditCount: Number of generated Reddit hooks
            - instagramCount: Number of generated Instagram hooks
            
        Raises:
            Exception: If database query fails
        """
        try:
            # Define reusable conditions
            is_user = EssentialHook.user_id == user_id
            is_generated = EssentialHook.status == "Generated"
            is_saved = EssentialHook.status == "Saved"

            # Build aggregation query with conditional counting
            query = self.get_db.session.query(
                # Total counts across all platforms
                func.sum(case((is_generated, 1), else_=0)).label("total_generated"),
                func.sum(case((is_saved, 1), else_=0)).label("total_saved"),
                func.sum(case((is_generated, EssentialHook.score), else_=0)).label("total_generated_score"),
                
                # Platform-specific counts (only for generated status)
                func.sum(case((and_(EssentialHook.platform == "YouTube", is_generated), 1), else_=0)).label("youtube_generated"),
                func.sum(case((and_(EssentialHook.platform == "Reddit", is_generated), 1), else_=0)).label("reddit_generated"),
                func.sum(case((and_(EssentialHook.platform == "Instagram", is_generated), 1), else_=0)).label("instagram_generated"),
            ).filter(is_user)

            # Execute query and get single aggregated row
            metrics = query.first()

            # Handle case where user has no hooks
            if not metrics or metrics.total_generated is None:
                return self._get_empty_metrics()

            # Format and return results
            return {
                "totalGenerated": int(metrics.total_generated or 0),
                "totalSaved": int(metrics.total_saved or 0),
                "totalGeneratedScore": int(metrics.total_generated_score or 0),
                "youtubeCount": int(metrics.youtube_generated or 0),
                "redditCount": int(metrics.reddit_generated or 0),
                "instagramCount": int(metrics.instagram_generated or 0),
            }
            
        except Exception as e:
            # Re-raise with context for route handler
            raise Exception(f"Failed to fetch dashboard metrics: {str(e)}")
    
    @staticmethod
    def _get_empty_metrics() -> Dict[str, int]:
        """Returns a dictionary with all metrics set to zero"""
        return {
            "totalGenerated": 0,
            "totalSaved": 0,
            "totalGeneratedScore": 0,
            "youtubeCount": 0,
            "redditCount": 0,
            "instagramCount": 0,
        }
    
    def get_platform_breakdown(self, user_id: int, platform: str) -> Optional[Dict]:
        """
        Get detailed breakdown for a specific platform (optional helper method)
        
        Args:
            user_id: The ID of the user
            platform: Platform name (YouTube, Reddit, Instagram)
            
        Returns:
            Dictionary with platform-specific metrics or None
        """
        try:
            is_user = EssentialHook.user_id == user_id
            is_platform = EssentialHook.platform == platform
            
            query = self.get_db.session.query(
                func.sum(case((EssentialHook.status == "Generated", 1), else_=0)).label("generated"),
                func.sum(case((EssentialHook.status == "Saved", 1), else_=0)).label("saved"),
                func.avg(case((EssentialHook.status == "Generated", EssentialHook.score), else_=None)).label("avg_score"),
            ).filter(and_(is_user, is_platform))
            
            result = query.first()
            
            if not result:
                return None
                
            return {
                "platform": platform,
                "generated": int(result.generated or 0),
                "saved": int(result.saved or 0),
                "averageScore": round(float(result.avg_score or 0), 2),
            }
            
        except Exception as e:
            raise Exception(f"Failed to fetch platform breakdown: {str(e)}")