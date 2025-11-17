from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from .userprofileservice import UserProfileService
from UserProfile.userprofileschemas import (
    UserProfile, ProfileSummary, UserInfoUpdate, ProfilePictureUpdate,
    CollectionCreate, CollectionUpdate, Collection, AddHookToCollection,
    PasswordChange, NotificationPreferences, DisplayPreferences,
    ScrapingPreferences, AccountSettings, ExportFormat, ExportRequest,
    QuickStats, ActivityOverview, ScrapingStats, Achievement, UserLevel,
    UsageStats, PlanInfo, ActivityItem, APIKeyCreate, APIKey,
    ConnectedAccount, ScrapeRecord
)
from ..core.database import get_db
from ...Auth.authroutes import get_current_user  # Your auth dependency


router = APIRouter(prefix="/api/profile", tags=["User Profile"])


# ==================== PROFILE ENDPOINTS ====================

@router.get("/", response_model=UserProfile)
async def get_user_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get complete user profile with all data"""
    try:
        service = UserProfileService(db)
        profile = service.get_user_profile(current_user['id'])
        return profile
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")


@router.get("/summary", response_model=ProfileSummary)
async def get_profile_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get lightweight profile summary"""
    try:
        service = UserProfileService(db)
        summary = service.get_profile_summary(current_user['id'])
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/public", response_model=ProfileSummary)
async def get_public_profile(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get public profile of another user"""
    try:
        service = UserProfileService(db)
        profile = service.get_profile_summary(user_id)
        
        if not profile.is_public:
            raise HTTPException(status_code=403, detail="Profile is private")
        
        return profile
    except ValueError:
        raise HTTPException(status_code=404, detail="User not found")


@router.put("/info")
async def update_profile_info(
    update_data: UserInfoUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    try:
        service = UserProfileService(db)
        result = service.update_profile_info(current_user['id'], update_data)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/picture")
async def update_profile_picture(
    picture_data: ProfilePictureUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile picture"""
    try:
        service = UserProfileService(db)
        result = service.update_profile_picture(current_user['id'], picture_data.image_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/visibility")
async def toggle_profile_visibility(
    is_public: bool,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle profile public/private visibility"""
    try:
        user = db.query(User).filter(User.id == current_user['id']).first()
        user.is_public = is_public
        user.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": f"Profile is now {'public' if is_public else 'private'}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== STATS ENDPOINTS ====================

@router.get("/stats/quick", response_model=QuickStats)
async def get_quick_stats(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get quick stats for profile header"""
    try:
        service = UserProfileService(db)
        return service.get_quick_stats(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats/activity", response_model=ActivityOverview)
async def get_activity_overview(
    days: int = Query(default=7, ge=1, le=90),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get activity overview dashboard"""
    try:
        service = UserProfileService(db)
        return service.get_activity_overview(current_user['id'], days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats/usage", response_model=UsageStats)
async def get_usage_stats(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get API usage and limits"""
    try:
        service = UserProfileService(db)
        return service.get_usage_stats(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats/scraping", response_model=ScrapingStats)
async def get_scraping_stats(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get scraping statistics"""
    try:
        service = UserProfileService(db)
        return service.get_scraping_stats(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== COLLECTIONS ENDPOINTS ====================

@router.get("/collections", response_model=List[Collection])
async def get_collections(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all user collections"""
    try:
        service = UserProfileService(db)
        return service.get_user_collections(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/collections", response_model=Collection, status_code=status.HTTP_201_CREATED)
async def create_collection(
    collection_data: CollectionCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new collection"""
    try:
        service = UserProfileService(db)
        return service.create_collection(current_user['id'], collection_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/collections/{collection_id}", response_model=Collection)
async def get_collection(
    collection_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific collection"""
    try:
        collection = db.query(CollectionModel).filter(
            CollectionModel.id == collection_id,
            CollectionModel.user_id == current_user['id']
        ).first()
        
        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")
        
        service = UserProfileService(db)
        return service._collection_to_schema(collection)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/collections/{collection_id}", response_model=Collection)
async def update_collection(
    collection_id: str,
    update_data: CollectionUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update collection"""
    try:
        service = UserProfileService(db)
        return service.update_collection(current_user['id'], collection_id, update_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/collections/{collection_id}")
async def delete_collection(
    collection_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete collection"""
    try:
        service = UserProfileService(db)
        return service.delete_collection(current_user['id'], collection_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/collections/{collection_id}/hooks")
async def add_hook_to_collection(
    collection_id: str,
    hook_data: AddHookToCollection,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add hook to collection"""
    try:
        # Verify collection ownership
        collection = db.query(CollectionModel).filter(
            CollectionModel.id == collection_id,
            CollectionModel.user_id == current_user['id']
        ).first()
        
        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")
        
        # Add hook to collection
        collection_hook = CollectionHook(
            collection_id=collection_id,
            hook_id=hook_data.hook_id,
            notes=hook_data.notes,
            tags=','.join(hook_data.tags) if hook_data.tags else None,
            created_at=datetime.utcnow()
        )
        db.add(collection_hook)
        
        # Update collection timestamp
        collection.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Hook added to collection", "collection_id": collection_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/collections/{collection_id}/hooks/{hook_id}")
async def remove_hook_from_collection(
    collection_id: str,
    hook_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove hook from collection"""
    try:
        # Verify collection ownership
        collection = db.query(CollectionModel).filter(
            CollectionModel.id == collection_id,
            CollectionModel.user_id == current_user['id']
        ).first()
        
        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")
        
        # Remove hook
        db.query(CollectionHook).filter(
            CollectionHook.collection_id == collection_id,
            CollectionHook.hook_id == hook_id
        ).delete()
        
        collection.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Hook removed from collection"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SCRAPING HISTORY ENDPOINTS ====================

@router.get("/scraping/history", response_model=List[ScrapeRecord])
async def get_scraping_history(
    limit: int = Query(default=50, ge=1, le=200),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get scraping history"""
    try:
        service = UserProfileService(db)
        return service.get_scraping_history(current_user['id'], limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SETTINGS ENDPOINTS ====================

@router.get("/settings", response_model=AccountSettings)
async def get_settings(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get account settings"""
    try:
        service = UserProfileService(db)
        return service.get_account_settings(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/settings/notifications")
async def update_notification_preferences(
    preferences: NotificationPreferences,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update notification preferences"""
    try:
        service = UserProfileService(db)
        settings_data = {'notifications': preferences.dict()}
        return service.update_settings(current_user['id'], settings_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/settings/display")
async def update_display_preferences(
    preferences: DisplayPreferences,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update display preferences"""
    try:
        service = UserProfileService(db)
        settings_data = {'display': preferences.dict()}
        return service.update_settings(current_user['id'], settings_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/settings/scraping")
async def update_scraping_preferences(
    preferences: ScrapingPreferences,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update scraping preferences"""
    try:
        service = UserProfileService(db)
        settings_data = {'scraping': preferences.dict()}
        return service.update_settings(current_user['id'], settings_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/settings/password")
async def change_password(
    password_data: PasswordChange,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    try:
        user = db.query(User).filter(User.id == current_user['id']).first()
        
        # Verify current password (use your password hashing utility)
        from passlib.hash import bcrypt
        if not bcrypt.verify(password_data.current_password, user.password_hash):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Update password
        user.password_hash = bcrypt.hash(password_data.new_password)
        user.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Password changed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/settings/2fa/enable")
async def enable_two_factor(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enable two-factor authentication"""
    try:
        user = db.query(User).filter(User.id == current_user['id']).first()
        
        # Generate 2FA secret (use pyotp or similar)
        import pyotp
        secret = pyotp.random_base32()
        
        user.two_factor_secret = secret
        user.two_factor_enabled = True
        db.commit()
        
        # Generate QR code URI
        totp = pyotp.TOTP(secret)
        qr_uri = totp.provisioning_uri(
            name=user.email,
            issuer_name="HookScraper"
        )
        
        return {
            "message": "2FA enabled",
            "secret": secret,
            "qr_uri": qr_uri
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/settings/2fa/disable")
async def disable_two_factor(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Disable two-factor authentication"""
    try:
        user = db.query(User).filter(User.id == current_user['id']).first()
        user.two_factor_enabled = False
        user.two_factor_secret = None
        db.commit()
        
        return {"message": "2FA disabled"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/settings/account")
async def delete_account(
    password: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user account"""
    try:
        user = db.query(User).filter(User.id == current_user['id']).first()
        
        # Verify password
        from passlib.hash import bcrypt
        if not bcrypt.verify(password, user.password_hash):
            raise HTTPException(status_code=400, detail="Password is incorrect")
        
        # Delete all user data
        db.query(SavedHook).filter(SavedHook.user_id == user.id).delete()
        db.query(CollectionModel).filter(CollectionModel.user_id == user.id).delete()
        db.query(ScrapeHistory).filter(ScrapeHistory.user_id == user.id).delete()
        db.query(ActivityLog).filter(ActivityLog.user_id == user.id).delete()
        
        # Delete user
        db.delete(user)
        db.commit()
        
        return {"message": "Account deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ==================== PLAN & USAGE ENDPOINTS ====================

@router.get("/plan", response_model=PlanInfo)
async def get_plan_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get plan information"""
    try:
        service = UserProfileService(db)
        return service.get_plan_info(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/plan/upgrade")
async def upgrade_plan(
    plan_type: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upgrade subscription plan"""
    try:
        user = db.query(User).filter(User.id == current_user['id']).first()
        
        # Validate plan type
        from .userprofileschemas import PlanType
        if plan_type not in [p.value for p in PlanType]:
            raise HTTPException(status_code=400, detail="Invalid plan type")
        
        # Process payment (integrate with Stripe/PayPal)
        # For now, just update the plan
        user.plan_type = plan_type
        user.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": f"Plan upgraded to {plan_type}", "plan_type": plan_type}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== ACHIEVEMENTS ENDPOINTS ====================

@router.get("/achievements", response_model=List[Achievement])
async def get_achievements(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user achievements"""
    try:
        service = UserProfileService(db)
        return service.get_achievements(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/level", response_model=UserLevel)
async def get_user_level(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user level and progress"""
    try:
        service = UserProfileService(db)
        return service.get_user_level(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== EXPORT ENDPOINTS ====================

@router.post("/export")
async def export_data(
    export_request: ExportRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export user data"""
    try:
        service = UserProfileService(db)
        data = service.export_data(
            current_user['id'],
            export_request.format,
            export_request.collection_ids
        )
        
        # Set appropriate content type
        media_type = "text/csv" if export_request.format == ExportFormat.CSV else "application/json"
        filename = f"hooks_export_{datetime.utcnow().strftime('%Y%m%d')}.{export_request.format.value}"
        
        return Response(
            content=data,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/export/all")
async def export_all_data(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export all user data (GDPR compliance)"""
    try:
        service = UserProfileService(db)
        profile = service.get_user_profile(current_user['id'])
        
        # Convert to JSON
        import json
        data = json.dumps(profile.dict(), indent=2, default=str)
        
        return Response(
            content=data,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=all_data_{datetime.utcnow().strftime('%Y%m%d')}.json"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== ACTIVITY FEED ENDPOINTS ====================

@router.get("/activity", response_model=List[ActivityItem])
async def get_activity_feed(
    limit: int = Query(default=20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent activity feed"""
    try:
        service = UserProfileService(db)
        return service.get_recent_activity(current_user['id'], limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== INTEGRATIONS ENDPOINTS ====================

@router.get("/integrations", response_model=List[dict])
async def get_connected_accounts(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get connected social accounts"""
    try:
        service = UserProfileService(db)
        return service.get_connected_accounts(current_user['id'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/integrations/{platform}/connect")
async def connect_account(
    platform: str,
    oauth_code: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect social media account via OAuth"""
    try:
        # Validate platform
        if platform not in ['youtube', 'reddit', 'instagram']:
            raise HTTPException(status_code=400, detail="Invalid platform")
        
        # Exchange OAuth code for access token (implement OAuth flow)
        # For now, just create the connection
        connection = ConnectedAccount(
            user_id=current_user['id'],
            platform=platform,
            username=f"{platform}_user",  # Get from OAuth
            access_token="encrypted_token",  # Encrypt in production
            connected_at=datetime.utcnow()
        )
        db.add(connection)
        db.commit()
        
        return {"message": f"{platform} account connected successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/integrations/{platform}/disconnect")
async def disconnect_account(
    platform: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Disconnect social media account"""
    try:
        db.query(ConnectedAccount).filter(
            ConnectedAccount.user_id == current_user['id'],
            ConnectedAccount.platform == platform
        ).delete()
        db.commit()
        
        return {"message": f"{platform} account disconnected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== API KEYS ENDPOINTS ====================

@router.get("/api-keys", response_model=List[APIKey])
async def get_api_keys(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's API keys"""
    try:
        keys = db.query(APIKeyModel).filter(
            APIKeyModel.user_id == current_user['id'],
            APIKeyModel.is_active == True
        ).all()
        
        return [
            APIKey(
                id=key.id,
                name=key.name,
                key=key.key[:8] + "..." + key.key[-4:],  # Mask key
                scopes=key.scopes.split(',') if key.scopes else [],
                created_at=key.created_at,
                last_used=key.last_used
            )
            for key in keys
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api-keys", response_model=APIKey, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    key_data: APIKeyCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate new API key"""
    try:
        import secrets
        
        # Generate secure API key
        api_key = f"hs_{secrets.token_urlsafe(32)}"
        
        key_model = APIKeyModel(
            user_id=current_user['id'],
            name=key_data.name,
            key=api_key,
            scopes=','.join(key_data.scopes),
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(key_model)
        db.commit()
        db.refresh(key_model)
        
        return APIKey(
            id=key_model.id,
            name=key_model.name,
            key=api_key,  # Show full key only once
            scopes=key_data.scopes,
            created_at=key_model.created_at,
            last_used=None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/api-keys/{key_id}")
async def revoke_api_key(
    key_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Revoke API key"""
    try:
        key = db.query(APIKeyModel).filter(
            APIKeyModel.id == key_id,
            APIKeyModel.user_id == current_user['id']
        ).first()
        
        if not key:
            raise HTTPException(status_code=404, detail="API key not found")
        
        key.is_active = False
        db.commit()
        
        return {"message": "API key revoked"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SUPPORT ENDPOINTS ====================

@router.post("/support/contact")
async def contact_support(
    subject: str,
    message: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send message to support"""
    try:
        # Store support ticket
        ticket = SupportTicket(
            user_id=current_user['id'],
            subject=subject,
            message=message,
            status='open',
            created_at=datetime.utcnow()
        )
        db.add(ticket)
        db.commit()
        
        # Send email notification (integrate with email service)
        
        return {"message": "Support ticket created", "ticket_id": ticket.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/support/feature-request")
async def submit_feature_request(
    title: str,
    description: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit feature request"""
    try:
        request = FeatureRequest(
            user_id=current_user['id'],
            title=title,
            description=description,
            votes=1,
            created_at=datetime.utcnow()
        )
        db.add(request)
        db.commit()
        
        return {"message": "Feature request submitted", "request_id": request.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))