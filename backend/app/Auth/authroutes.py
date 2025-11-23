from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
import jwt

from .authservice import AuthService
from .authschemas import (
    SignUpRequest, SignInRequest, TokenResponse, RefreshTokenRequest,
    PasswordResetRequest, PasswordResetConfirm, ChangePasswordRequest,
    DeleteAccountRequest, EmailVerificationRequest, ResendVerificationRequest,
    TwoFactorVerifyRequest, TwoFactorLoginRequest, UserProfileResponse,
    SessionInfo, LogoutAllRequest, TwoFactorSetupResponse
)
from app.core.database import get_db
from app.core.config import settings


router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()


# ==================== DEPENDENCY: GET CURRENT USER ====================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Dependency to get current authenticated user"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_session(
    request: Request,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user session"""
    # Extract session from request or create new one
    session_id = request.headers.get("X-Session-ID")
    if session_id:
        session = db.query(SessionModel).filter(
            SessionModel.id == session_id,
            SessionModel.user_id == current_user['id']
        ).first()
        if session:
            return session.id
    return None


# ==================== SIGN UP ====================

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def sign_up(
    signup_data: SignUpRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Register a new user account
    
    - **full_name**: Full name of the user
    - **username**: Unique username (3-30 chars, alphanumeric + underscore)
    - **email**: Valid email address
    - **password**: Strong password (min 8 chars, uppercase, lowercase, digit, special char)
    - **confirm_password**: Must match password
    
    Returns access token and user information
    """
    try:
        service = AuthService(db)
        ip_address = request.client.host
        user_agent = request.headers.get("user-agent", "")
        
        result = service.sign_up(signup_data, ip_address, user_agent)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


# ==================== SIGN IN ====================

@router.post("/signin", response_model=TokenResponse)
async def sign_in(
    signin_data: SignInRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and create session
    
    - **email_or_username**: Email address or username
    - **password**: User password
    - **remember_me**: Keep session active for 30 days (default: false)
    
    Returns access token, refresh token, and user information.
    If 2FA is enabled, returns temp token and requires_2fa flag.
    """
    try:
        service = AuthService(db)
        ip_address = request.client.host
        user_agent = request.headers.get("user-agent", "")
        
        result = service.sign_in(signin_data, ip_address, user_agent)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


# ==================== TWO-FACTOR AUTHENTICATION ====================

@router.post("/2fa/verify", response_model=TokenResponse)
async def verify_2fa_login(
    verify_data: TwoFactorLoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Complete login with 2FA code
    
    - **temp_token**: Temporary token from initial login
    - **code**: 6-digit 2FA code from authenticator app
    """
    try:
        service = AuthService(db)
        ip_address = request.client.host
        user_agent = request.headers.get("user-agent", "")
        
        result = service.verify_2fa_login(verify_data.temp_token, verify_data.code, ip_address, user_agent)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/2fa/setup", response_model=TwoFactorSetupResponse)
async def setup_2fa(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Setup two-factor authentication
    
    Returns QR code and backup codes. Scan QR code with authenticator app.
    """
    try:
        service = AuthService(db)
        result = service.setup_2fa(current_user['id'])
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/2fa/confirm")
async def confirm_2fa_setup(
    verify_data: TwoFactorVerifyRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirm 2FA setup with verification code
    
    - **code**: 6-digit code from authenticator app
    """
    try:
        service = AuthService(db)
        result = service.confirm_2fa_setup(current_user['id'], verify_data.code)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/2fa/disable")
async def disable_2fa(
    password: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Disable two-factor authentication
    
    Requires password confirmation for security.
    """
    try:
        service = AuthService(db)
        result = service.disable_2fa(current_user['id'], password)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== PASSWORD RESET ====================

@router.post("/password/reset-request")
async def request_password_reset(
    reset_data: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """
    Request password reset email
    
    - **email**: Email address associated with account
    
    For security, always returns success even if email doesn't exist.
    """
    try:
        service = AuthService(db)
        result = service.request_password_reset(reset_data.email)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/password/reset-confirm")
async def reset_password(
    reset_data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """
    Reset password with token
    
    - **token**: Reset token from email
    - **new_password**: New password (min 8 chars, uppercase, lowercase, digit, special char)
    - **confirm_password**: Must match new password
    
    All active sessions will be invalidated.
    """
    try:
        service = AuthService(db)
        result = service.reset_password(reset_data)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== CHANGE PASSWORD ====================

@router.post("/password/change")
async def change_password(
    change_data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change user password
    
    - **current_password**: Current password for verification
    - **new_password**: New password (min 8 chars, uppercase, lowercase, digit, special char)
    - **confirm_password**: Must match new password
    
    Requires authentication. Notification email will be sent.
    """
    try:
        service = AuthService(db)
        result = service.change_password(current_user['id'], change_data)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== EMAIL VERIFICATION ====================

@router.post("/email/verify")
async def verify_email(
    verify_data: EmailVerificationRequest,
    db: Session = Depends(get_db)
):
    """
    Verify email address with token
    
    - **token**: Verification token from email
    """
    try:
        service = AuthService(db)
        result = service.verify_email(verify_data.token)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/email/resend-verification")
async def resend_verification_email(
    resend_data: ResendVerificationRequest,
    db: Session = Depends(get_db)
):
    """
    Resend verification email
    
    - **email**: Email address to resend verification to
    """
    try:
        service = AuthService(db)
        result = service.resend_verification_email(resend_data.email)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SIGN OUT ====================

@router.post("/signout")
async def sign_out(
    current_user: dict = Depends(get_current_user),
    session_id: Optional[str] = Depends(get_current_session),
    db: Session = Depends(get_db)
):
    """
    Sign out from current session
    
    Invalidates access token and refresh token for current session only.
    """
    try:
        service = AuthService(db)
        result = service.sign_out(current_user['id'], session_id)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/signout-all")
async def sign_out_all(
    logout_data: LogoutAllRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Sign out from all devices
    
    - **password**: Password for verification
    
    Invalidates all sessions and refresh tokens. User will be logged out everywhere.
    """
    try:
        service = AuthService(db)
        result = service.sign_out_all(current_user['id'], logout_data.password)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== DELETE ACCOUNT ====================

@router.delete("/account")
async def delete_account(
    delete_data: DeleteAccountRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently delete user account
    
    - **password**: Password for verification
    - **confirmation**: Must type exactly "DELETE MY ACCOUNT"
    - **reason**: Optional reason for deletion
    
    ⚠️ WARNING: This action is irreversible! All data will be permanently deleted.
    
    Deletes:
    - User profile
    - All saved hooks
    - All collections
    - Scraping history
    - Activity logs
    - Sessions and tokens
    - Connected accounts
    - API keys
    """
    try:
        service = AuthService(db)
        result = service.delete_account(current_user['id'], delete_data)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== TOKEN REFRESH ====================

@router.post("/token/refresh", response_model=TokenResponse)
async def refresh_token(
    token_data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Refresh access token
    
    - **refresh_token**: Valid refresh token
    
    Returns new access token. Refresh token remains valid.
    """
    try:
        service = AuthService(db)
        result = service.refresh_access_token(token_data.refresh_token)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SESSION MANAGEMENT ====================

@router.get("/sessions", response_model=list[SessionInfo])
async def get_active_sessions(
    current_user: dict = Depends(get_current_user),
    session_id: Optional[str] = Depends(get_current_session),
    db: Session = Depends(get_db)
):
    """
    Get all active sessions
    
    Returns list of all active sessions with device info, location, and last activity.
    Current session is marked with is_current flag.
    """
    try:
        service = AuthService(db)
        sessions = service.get_active_sessions(current_user['id'], session_id or "")
        return sessions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/sessions/{session_id}")
async def revoke_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Revoke specific session
    
    Logs out the specified device/session. Useful for remote logout.
    """
    try:
        service = AuthService(db)
        result = service.revoke_session(current_user['id'], session_id)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== USER INFO ====================

@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user information
    
    Returns authenticated user's profile information.
    """
    try:
        user = db.query(User).filter(User.id == current_user['id']).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserProfileResponse(
            id=user.id,
            full_name=user.full_name,
            username=user.username,
            email=user.email,
            email_verified=user.email_verified,
            profile_picture=user.profile_picture,
            bio=user.bio,
            role=user.role,
            plan_type=user.plan_type,
            member_since=user.created_at,
            is_public=user.is_public,
            two_factor_enabled=user.two_factor_enabled
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== HEALTH CHECK ====================

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    
    Returns service status. Use for monitoring and load balancers.
    """
    return {
        "status": "healthy",
        "service": "authentication",
        "timestamp": datetime.utcnow().isoformat()
    }


# ==================== TESTING ENDPOINTS (REMOVE IN PRODUCTION) ====================

@router.post("/test/generate-tokens")
async def generate_test_tokens(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    🚨 TESTING ONLY - REMOVE IN PRODUCTION
    
    Generate tokens for testing without login
    """
    try:
        service = AuthService(db)
        access_token = service._create_access_token({"user_id": user_id})
        
        # Create dummy session
        session = SessionModel(
            user_id=user_id,
            ip_address="127.0.0.1",
            user_agent="test",
            last_active=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(days=1),
            created_at=datetime.utcnow()
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
        refresh_token = service._create_refresh_token(user_id, session.id)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "message": "Test tokens generated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SHUFFLE BUTTON ENDPOINTS ====================
# These endpoints ensure shuffle functionality works across all auth features

@router.post("/shuffle/signup-demo")
async def shuffle_signup_demo(db: Session = Depends(get_db)):
    """
    Generate random signup data for UI shuffle button testing
    """
    import random
    import string
    
    username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    
    return {
        "full_name": f"Test User {random.randint(1, 999)}",
        "username": username,
        "email": f"{username}@example.com",
        "password": "TestPass123!",
        "confirm_password": "TestPass123!"
    }


@router.post("/shuffle/password-strength")
async def shuffle_password_demo():
    """
    Generate sample strong passwords for shuffle button
    """
    import random
    import string
    
    passwords = []
    for _ in range(3):
        length = random.randint(12, 16)
        password = ''.join(random.choices(string.ascii_letters + string.digits + "!@#$%^&*", k=length))
        passwords.append(password)
    
    return {"passwords": passwords}


@router.get("/shuffle/session-examples")
async def shuffle_session_examples():
    """
    Generate example session data for shuffle button in session management
    """
    import random
    from datetime import datetime, timedelta
    
    devices = [
        "Chrome on Windows 10",
        "Safari on iPhone 14",
        "Firefox on MacOS",
        "Edge on Windows 11",
        "Chrome on Android",
        "Safari on iPad Pro"
    ]
    
    locations = [
        "New York, USA",
        "London, UK",
        "Tokyo, Japan",
        "Sydney, Australia",
        "Mumbai, India",
        "Paris, France"
    ]
    
    sessions = []
    for i in range(random.randint(2, 5)):
        sessions.append({
            "id": f"session_{i+1}",
            "device": random.choice(devices),
            "ip_address": f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
            "location": random.choice(locations),
            "last_active": (datetime.utcnow() - timedelta(minutes=random.randint(1, 1440))).isoformat(),
            "is_current": i == 0
        })
    
    return {"sessions": sessions}