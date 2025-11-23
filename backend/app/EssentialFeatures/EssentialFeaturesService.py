# essential_features/service.py
"""
Service layer for Essential Features module.
Contains business logic for hooks, posts, comments, likes, and metrics.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_, or_
from typing import Dict, Optional, List
from fastapi import HTTPException, status

from .models import (
    EssentialHook,
    EssentialPost,
    EssentialPostLike,
    EssentialPostSave,
    EssentialHookComment,
    User
)


# ========================
# Post Services
# ========================

def toggle_like_service(db: Session, post_id: int, user: User) -> Dict:
    """
    Toggle like status for a post.
    
    Args:
        db: Database session
        post_id: ID of the post to like/unlike
        user: Current authenticated user
        
    Returns:
        Dictionary with message, is_liked status, and new like count
    """
    post = db.query(EssentialPost).filter(EssentialPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    existing_like = db.query(EssentialPostLike).filter_by(
        user_id=user.id, post_id=post.id
    ).first()

    if existing_like:
        # Unlike the post
        db.delete(existing_like)
        post.like_count = max(0, post.like_count - 1)
        db.commit()

        return {
            "message": "Post unliked successfully.",
            "is_liked": False,
            "new_like_count": post.like_count
        }

    # Like the post
    new_like = EssentialPostLike(user_id=user.id, post_id=post.id)
    db.add(new_like)
    post.like_count += 1
    db.commit()

    return {
        "message": "Post liked successfully.",
        "is_liked": True,
        "new_like_count": post.like_count
    }


def toggle_save_service(db: Session, post_id: int, user: User) -> Dict:
    """
    Toggle save/bookmark status for a post.
    
    Args:
        db: Database session
        post_id: ID of the post to save/unsave
        user: Current authenticated user
        
    Returns:
        Dictionary with message and is_saved status
    """
    post = db.query(EssentialPost).filter(EssentialPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    existing_save = db.query(EssentialPostSave).filter_by(
        user_id=user.id, post_id=post.id
    ).first()

    if existing_save:
        # Unsave the post
        db.delete(existing_save)
        db.commit()
        return {"message": "Post unsaved.", "is_saved": False}

    # Save the post
    new_save = EssentialPostSave(user_id=user.id, post_id=post.id)
    db.add(new_save)
    db.commit()

    return {"message": "Post saved.", "is_saved": True}


def record_share_service(db: Session, post_id: int) -> Dict:
    """
    Record a share action for a post.
    
    Args:
        db: Database session
        post_id: ID of the post being shared
        
    Returns:
        Dictionary with success message
    """
    post = db.query(EssentialPost).filter(EssentialPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    post.share_count += 1
    db.commit()

    return {"message": "Share recorded."}


# ========================
# Hook Services
# ========================

def record_hook_view_service(db: Session, hook_id: int) -> Dict:
    """
    Record a view for a hook.
    
    Args:
        db: Database session
        hook_id: ID of the hook being viewed
        
    Returns:
        Dictionary with message and total views
    """
    hook = db.query(EssentialHook).filter(EssentialHook.id == hook_id).first()
    if not hook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hook not found"
        )
    
    hook.view_count += 1
    db.commit()
    return {"message": "Hook view recorded.", "total_views": hook.view_count}


def like_hook_service(db: Session, hook_id: int) -> Dict:
    """
    Increment like count for a hook.
    
    Args:
        db: Database session
        hook_id: ID of the hook being liked
        
    Returns:
        Dictionary with message and total likes
    """
    hook = db.query(EssentialHook).filter(EssentialHook.id == hook_id).first()
    if not hook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hook not found"
        )
    
    hook.like_count += 1
    db.commit()
    return {"message": "Hook liked.", "likes": hook.like_count}


def add_hook_comment_service(db: Session, hook_id: int, user_id: int, comment_text: str) -> Dict:
    """
    Add a comment to a hook.
    
    Args:
        db: Database session
        hook_id: ID of the hook to comment on
        user_id: ID of the user adding the comment
        comment_text: Content of the comment
        
    Returns:
        Dictionary with message and total comments
    """
    hook = db.query(EssentialHook).filter(EssentialHook.id == hook_id).first()
    if not hook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hook not found"
        )
    
    # Create comment
    comment = EssentialHookComment(
        hook_id=hook_id,
        user_id=user_id,
        comment_text=comment_text
    )
    db.add(comment)
    
    # Increment comment count
    hook.comment_count += 1
    db.commit()
    
    return {"message": "Comment added.", "comments": hook.comment_count}


def record_hook_copy_service(db: Session, hook_id: int) -> Dict:
    """
    Record a copy action for a hook.
    
    Args:
        db: Database session
        hook_id: ID of the hook being copied
        
    Returns:
        Dictionary with message and total copies
    """
    hook = db.query(EssentialHook).filter(EssentialHook.id == hook_id).first()
    if not hook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hook not found"
        )
    
    hook.copy_count += 1
    db.commit()
    return {"message": "Copy recorded.", "copies": hook.copy_count}


def fetch_filtered_hooks_service(
    db: Session,
    search_query: Optional[str] = None,
    platform: str = "All Platforms",
    niche: str = "All Niches",
    tone: str = "All Tones",
    sort_by: str = "Newest"
) -> List[Dict]:
    """
    Fetch hooks with filters and sorting applied.
    
    Args:
        db: Database session
        search_query: Text search query (searches title, text, niche)
        platform: Platform filter
        niche: Niche/category filter
        tone: Tone filter
        sort_by: Sorting method
        
    Returns:
        List of hook dictionaries
    """
    query = db.query(EssentialHook)

    # Apply search filter
    if search_query and search_query.strip():
        search_term = f"%{search_query.strip()}%"
        query = query.filter(
            or_(
                EssentialHook.title.ilike(search_term),
                EssentialHook.text.ilike(search_term),
                EssentialHook.niche.ilike(search_term)
            )
        )

    # Apply platform filter
    if platform and platform != "All Platforms":
        query = query.filter(EssentialHook.platform == platform)

    # Apply niche filter
    if niche and niche != "All Niches":
        query = query.filter(EssentialHook.niche == niche)

    # Apply tone filter
    if tone and tone != "All Tones":
        query = query.filter(EssentialHook.tone == tone)

    # Apply sorting
    if sort_by == "Newest":
        query = query.order_by(EssentialHook.id.desc())
    elif sort_by == "Most Popular":
        query = query.order_by(EssentialHook.view_count.desc())
    elif sort_by == "Most Copied":
        query = query.order_by(EssentialHook.copy_count.desc())
    elif sort_by == "Highest Engagement":
        # Calculate engagement as sum of interactions
        engagement = (
            EssentialHook.like_count +
            EssentialHook.comment_count +
            EssentialHook.view_count
        )
        query = query.order_by(engagement.desc())
    else:
        query = query.order_by(EssentialHook.id.desc())

    hooks = query.all()
    return [hook.to_dict() for hook in hooks]


def reset_filters_service(db: Session) -> List[Dict]:
    """
    Reset all filters and return all hooks.
    
    Args:
        db: Database session
        
    Returns:
        List of all hook dictionaries
    """
    hooks = db.query(EssentialHook).order_by(EssentialHook.id.desc()).all()
    return [hook.to_dict() for hook in hooks]


def refresh_hooks_service(db: Session) -> List[Dict]:
    """
    Refresh and return all hooks.
    
    Args:
        db: Database session
        
    Returns:
        List of all hook dictionaries
    """
    hooks = db.query(EssentialHook).order_by(EssentialHook.id.desc()).all()
    return [hook.to_dict() for hook in hooks]


def get_dashboard_metrics_service(db: Session) -> Dict:
    """
    Get basic dashboard metrics (no user filtering).
    
    Args:
        db: Database session
        
    Returns:
        Dictionary with total hooks, YouTube count, and total score
    """
    # Total hooks
    total_hooks = db.query(EssentialHook).count()

    # Total score of all hooks
    total_score_result = db.query(func.sum(EssentialHook.score)).scalar()
    total_score = total_score_result or 0

    # Count YouTube hooks
    youtube_count = db.query(EssentialHook).filter(
        EssentialHook.platform == "YouTube"
    ).count()

    return {
        "totalHooks": total_hooks,
        "youtubeCount": youtube_count,
        "totalHookScore": int(total_score)
    }


# ========================
# Metrics Service Class
# ========================

class MetricsService:
    """Service class for handling user-specific dashboard metrics operations."""
    
    def __init__(self, db: Session):
        """
        Initialize metrics service.
        
        Args:
            db: Database session
        """
        self.db = db
    
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
            query = self.db.query(
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
        """Returns a dictionary with all metrics set to zero."""
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
        Get detailed breakdown for a specific platform.
        
        Args:
            user_id: The ID of the user
            platform: Platform name (YouTube, Reddit, Instagram)
            
        Returns:
            Dictionary with platform-specific metrics or None
        """
        try:
            is_user = EssentialHook.user_id == user_id
            is_platform = EssentialHook.platform == platform
            
            query = self.db.query(
                func.sum(case((EssentialHook.status == "Generated", 1), else_=0)).label("generated"),
                func.sum(case((EssentialHook.status == "Saved", 1), else_=0)).label("saved"),
                func.avg(case((EssentialHook.status == "Generated", EssentialHook.score), else_=None)).label("avg_score"),
            ).filter(and_(is_user, is_platform))
            
            result = query.first()
            
            if not result or result.generated == 0:
                return None
                
            return {
                "platform": platform,
                "generated": int(result.generated or 0),
                "saved": int(result.saved or 0),
                "averageScore": round(float(result.avg_score or 0), 2),
            }
            
        except Exception as e:
            raise Exception(f"Failed to fetch platform breakdown: {str(e)}")