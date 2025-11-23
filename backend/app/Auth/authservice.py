from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
import secrets
import jwt
import pyotp
import qrcode
import io
import base64
from passlib.hash import bcrypt

from .authschemas import (
    SignUpRequest, SignInRequest, TokenResponse, PasswordResetRequest,
    PasswordResetConfirm, ChangePasswordRequest, DeleteAccountRequest,
    UserProfileResponse, SessionInfo, TwoFactorSetupResponse
)
from models import User, RefreshToken, PasswordResetToken, Session as SessionModel
from config import settings


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.SECRET_KEY = settings.SECRET_KEY
        self.ALGORITHM = "HS256"
        self.ACCESS_TOKEN_EXPIRE_MINUTES = 30
        self.REFRESH_TOKEN_EXPIRE_DAYS = 30
        
    
    def sign_up(self, signup_data: SignUpRequest, ip_address: str, user_agent: str) -> TokenResponse:
        """Register new user account"""
        # Check if email exists
        existing_email = self.db.query(User).filter(User.email == signup_data.email).first()
        if existing_email:
            raise ValueError("Email already registered")
        
        # Check if username exists
        existing_username = self.db.query(User).filter(User.username == signup_data.username).first()
        if existing_username:
            raise ValueError("Username already taken")
        
        # Hash password
        password_hash = bcrypt.hash(signup_data.password)
        
        # Generate email verification token
        verification_token = secrets.token_urlsafe(32)
        
        # Create user
        new_user = User(
            full_name=signup_data.full_name,
            username=signup_data.username,
            email=signup_data.email,
            password_hash=password_hash,
            email_verified=False,
            email_verification_token=verification_token,
            profile_picture=None,
            bio=None,
            role="Hook Rookie",
            plan_type="free",
            is_public=False,
            two_factor_enabled=False,
            settings={},
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        
        # Send verification email
        self._send_verification_email(new_user.email, verification_token)
        
        # Log activity
        self._log_activity(new_user.id, "account_created", "Account created successfully")
        
        # Create session
        session = self._create_session(new_user.id, ip_address, user_agent)
        
        # Generate tokens
        access_token = self._create_access_token({"user_id": new_user.id})
        refresh_token = self._create_refresh_token(new_user.id, session.id)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=self.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=self._user_to_dict(new_user)
        )
    
    # ==================== SIGN IN ====================
    
    def sign_in(self, signin_data: SignInRequest, ip_address: str, user_agent: str) -> TokenResponse | Dict:
        """Authenticate user and create session"""
        # Find user by email or username
        user = self.db.query(User).filter(
            (User.email == signin_data.email_or_username) | 
            (User.username == signin_data.email_or_username)
        ).first()
        
        if not user:
            raise ValueError("Invalid credentials")
        
        # Verify password
        if not bcrypt.verify(signin_data.password, user.password_hash):
            # Log failed attempt
            self._log_failed_login(user.id, ip_address)
            raise ValueError("Invalid credentials")
        
        # Check if account is locked
        if user.is_locked:
            raise ValueError("Account is locked. Please contact support.")
        
        # Check if 2FA is enabled
        if user.two_factor_enabled:
            # Generate temporary token for 2FA
            temp_token = self._create_temp_token(user.id)
            return {
                "requires_2fa": True,
                "temp_token": temp_token,
                "message": "Please enter your 2FA code"
            }
        
        # Update last login
        user.last_login = datetime.utcnow()
        user.last_login_ip = ip_address
        self.db.commit()
        
        # Create session
        session = self._create_session(user.id, ip_address, user_agent, signin_data.remember_me)
        
        # Generate tokens
        access_token = self._create_access_token({"user_id": user.id})
        refresh_token = self._create_refresh_token(user.id, session.id)
        
        # Log activity
        self._log_activity(user.id, "logged_in", f"Logged in from {ip_address}")
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=self.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=self._user_to_dict(user)
        )
    
    # ==================== TWO-FACTOR AUTHENTICATION ====================
    
    def verify_2fa_login(self, temp_token: str, code: str, ip_address: str, user_agent: str) -> TokenResponse:
        """Verify 2FA code and complete login"""
        try:
            # Decode temp token
            payload = jwt.decode(temp_token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            user_id = payload.get("user_id")
            
            if not user_id:
                raise ValueError("Invalid token")
            
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                raise ValueError("User not found")
            
            # Verify 2FA code
            totp = pyotp.TOTP(user.two_factor_secret)
            if not totp.verify(code, valid_window=1):
                raise ValueError("Invalid 2FA code")
            
            # Update last login
            user.last_login = datetime.utcnow()
            user.last_login_ip = ip_address
            self.db.commit()
            
            # Create session
            session = self._create_session(user.id, ip_address, user_agent)
            
            # Generate tokens
            access_token = self._create_access_token({"user_id": user.id})
            refresh_token = self._create_refresh_token(user.id, session.id)
            
            # Log activity
            self._log_activity(user.id, "logged_in_2fa", f"Logged in with 2FA from {ip_address}")
            
            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                expires_in=self.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                user=self._user_to_dict(user)
            )
            
        except jwt.ExpiredSignatureError:
            raise ValueError("2FA session expired. Please login again.")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")
    
    def setup_2fa(self, user_id: str) -> TwoFactorSetupResponse:
        """Setup two-factor authentication"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Generate secret
        secret = pyotp.random_base32()
        
        # Generate QR code
        totp = pyotp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(
            name=user.email,
            issuer_name="HookScraper"
        )
        
        # Create QR code image
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        # Generate backup codes
        backup_codes = [secrets.token_hex(4).upper() for _ in range(10)]
        
        # Store temporarily (confirm later)
        user.two_factor_secret_temp = secret
        user.backup_codes = ','.join(bcrypt.hash(code) for code in backup_codes)
        self.db.commit()
        
        return TwoFactorSetupResponse(
            secret=secret,
            qr_code_url=f"data:image/png;base64,{qr_code_base64}",
            backup_codes=backup_codes
        )
    
    def confirm_2fa_setup(self, user_id: str, code: str) -> Dict:
        """Confirm 2FA setup with verification code"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or not user.two_factor_secret_temp:
            raise ValueError("2FA setup not initiated")
        
        # Verify code
        totp = pyotp.TOTP(user.two_factor_secret_temp)
        if not totp.verify(code, valid_window=1):
            raise ValueError("Invalid verification code")
        
        # Enable 2FA
        user.two_factor_secret = user.two_factor_secret_temp
        user.two_factor_secret_temp = None
        user.two_factor_enabled = True
        self.db.commit()
        
        self._log_activity(user_id, "2fa_enabled", "Two-factor authentication enabled")
        
        return {"message": "2FA enabled successfully"}
    
    def disable_2fa(self, user_id: str, password: str) -> Dict:
        """Disable two-factor authentication"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Verify password
        if not bcrypt.verify(password, user.password_hash):
            raise ValueError("Invalid password")
        
        user.two_factor_enabled = False
        user.two_factor_secret = None
        user.backup_codes = None
        self.db.commit()
        
        self._log_activity(user_id, "2fa_disabled", "Two-factor authentication disabled")
        
        return {"message": "2FA disabled successfully"}
    
    # ==================== PASSWORD RESET ====================
    
    def request_password_reset(self, email: str) -> Dict:
        """Send password reset email"""
        user = self.db.query(User).filter(User.email == email).first()
        
        # Always return success (security best practice)
        if not user:
            return {"message": "If the email exists, a reset link has been sent"}
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=1)
        
        # Delete old tokens
        self.db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id
        ).delete()
        
        # Create new token
        token_record = PasswordResetToken(
            user_id=user.id,
            token=bcrypt.hash(reset_token),
            expires_at=expires_at,
            created_at=datetime.utcnow()
        )
        self.db.add(token_record)
        self.db.commit()
        
        # Send email
        self._send_password_reset_email(user.email, reset_token)
        
        self._log_activity(user.id, "password_reset_requested", "Password reset requested")
        
        return {"message": "If the email exists, a reset link has been sent"}
    
    def reset_password(self, reset_data: PasswordResetConfirm) -> Dict:
        """Reset password with token"""
        # Find valid token
        token_records = self.db.query(PasswordResetToken).filter(
            PasswordResetToken.expires_at > datetime.utcnow(),
            PasswordResetToken.used == False
        ).all()
        
        valid_token = None
        for record in token_records:
            if bcrypt.verify(reset_data.token, record.token):
                valid_token = record
                break
        
        if not valid_token:
            raise ValueError("Invalid or expired reset token")
        
        # Update password
        user = self.db.query(User).filter(User.id == valid_token.user_id).first()
        user.password_hash = bcrypt.hash(reset_data.new_password)
        user.updated_at = datetime.utcnow()
        
        # Mark token as used
        valid_token.used = True
        
        # Invalidate all sessions
        self.db.query(SessionModel).filter(SessionModel.user_id == user.id).delete()
        self.db.query(RefreshToken).filter(RefreshToken.user_id == user.id).delete()
        
        self.db.commit()
        
        self._log_activity(user.id, "password_reset", "Password reset successfully")
        
        return {"message": "Password reset successfully. Please login with your new password."}
    
    # ==================== CHANGE PASSWORD ====================
    
    def change_password(self, user_id: str, change_data: ChangePasswordRequest) -> Dict:
        """Change user password"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Verify current password
        if not bcrypt.verify(change_data.current_password, user.password_hash):
            raise ValueError("Current password is incorrect")
        
        # Update password
        user.password_hash = bcrypt.hash(change_data.new_password)
        user.updated_at = datetime.utcnow()
        self.db.commit()
        
        self._log_activity(user_id, "password_changed", "Password changed successfully")
        
        # Send notification email
        self._send_password_changed_email(user.email)
        
        return {"message": "Password changed successfully"}
    
    # ==================== DELETE ACCOUNT ====================
    
    def delete_account(self, user_id: str, delete_data: DeleteAccountRequest) -> Dict:
        """Permanently delete user account"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Verify password
        if not bcrypt.verify(delete_data.password, user.password_hash):
            raise ValueError("Invalid password")
        
        # Log deletion reason
        if delete_data.reason:
            self._log_activity(user_id, "account_deletion_reason", delete_data.reason)
        
        # Delete all user data
        try:
            # Delete saved hooks
            self.db.query(SavedHook).filter(SavedHook.user_id == user_id).delete()
            
            # Delete collections
            collections = self.db.query(CollectionModel).filter(CollectionModel.user_id == user_id).all()
            for collection in collections:
                self.db.query(CollectionHook).filter(CollectionHook.collection_id == collection.id).delete()
            self.db.query(CollectionModel).filter(CollectionModel.user_id == user_id).delete()
            
            # Delete scraping history
            self.db.query(ScrapeHistory).filter(ScrapeHistory.user_id == user_id).delete()
            
            # Delete activity logs
            self.db.query(ActivityLog).filter(ActivityLog.user_id == user_id).delete()
            
            # Delete sessions and tokens
            self.db.query(SessionModel).filter(SessionModel.user_id == user_id).delete()
            self.db.query(RefreshToken).filter(RefreshToken.user_id == user_id).delete()
            
            # Delete connected accounts
            self.db.query(ConnectedAccount).filter(ConnectedAccount.user_id == user_id).delete()
            
            # Delete API keys
            self.db.query(APIKeyModel).filter(APIKeyModel.user_id == user_id).delete()
            
            # Delete password reset tokens
            self.db.query(PasswordResetToken).filter(PasswordResetToken.user_id == user_id).delete()
            
            # Finally, delete user
            self.db.delete(user)
            self.db.commit()
            
            # Send confirmation email
            self._send_account_deleted_email(user.email, user.full_name)
            
            return {"message": "Account deleted successfully"}
            
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Error deleting account: {str(e)}")
    
    # ==================== SIGN OUT ====================
    
    def sign_out(self, user_id: str, session_id: str) -> Dict:
        """Sign out from current session"""
        # Delete current session
        self.db.query(SessionModel).filter(
            SessionModel.id == session_id,
            SessionModel.user_id == user_id
        ).delete()
        
        # Delete refresh tokens for this session
        self.db.query(RefreshToken).filter(
            RefreshToken.session_id == session_id
        ).delete()
        
        self.db.commit()
        
        self._log_activity(user_id, "logged_out", "Logged out successfully")
        
        return {"message": "Logged out successfully"}
    
    def sign_out_all(self, user_id: str, password: str) -> Dict:
        """Sign out from all sessions"""
        user = self.db.query(User).filter(User.id == user_id).first()
        
        # Verify password
        if not bcrypt.verify(password, user.password_hash):
            raise ValueError("Invalid password")
        
        # Delete all sessions
        self.db.query(SessionModel).filter(SessionModel.user_id == user_id).delete()
        
        # Delete all refresh tokens
        self.db.query(RefreshToken).filter(RefreshToken.user_id == user_id).delete()
        
        self.db.commit()
        
        self._log_activity(user_id, "logged_out_all", "Logged out from all devices")
        
        return {"message": "Logged out from all devices successfully"}
    
    # ==================== EMAIL VERIFICATION ====================
    
    def verify_email(self, token: str) -> Dict:
        """Verify user email"""
        user = self.db.query(User).filter(
            User.email_verification_token == token,
            User.email_verified == False
        ).first()
        
        if not user:
            raise ValueError("Invalid or expired verification token")
        
        user.email_verified = True
        user.email_verification_token = None
        user.email_verified_at = datetime.utcnow()
        self.db.commit()
        
        self._log_activity(user.id, "email_verified", "Email verified successfully")
        
        return {"message": "Email verified successfully"}
    
    def resend_verification_email(self, email: str) -> Dict:
        """Resend verification email"""
        user = self.db.query(User).filter(User.email == email).first()
        
        if not user:
            return {"message": "If the email exists, a verification link has been sent"}
        
        if user.email_verified:
            raise ValueError("Email already verified")
        
        # Generate new token
        verification_token = secrets.token_urlsafe(32)
        user.email_verification_token = verification_token
        self.db.commit()
        
        # Send email
        self._send_verification_email(user.email, verification_token)
        
        return {"message": "Verification email sent"}
    
    # ==================== SESSION MANAGEMENT ====================
    
    def get_active_sessions(self, user_id: str, current_session_id: str) -> list[SessionInfo]:
        """Get all active sessions"""
        sessions = self.db.query(SessionModel).filter(
            SessionModel.user_id == user_id,
            SessionModel.expires_at > datetime.utcnow()
        ).order_by(SessionModel.last_active.desc()).all()
        
        return [
            SessionInfo(
                id=session.id,
                device=session.user_agent[:50] if session.user_agent else "Unknown",
                ip_address=session.ip_address,
                location=session.location,
                last_active=session.last_active,
                is_current=session.id == current_session_id
            )
            for session in sessions
        ]
    
    def revoke_session(self, user_id: str, session_id: str) -> Dict:
        """Revoke specific session"""
        session = self.db.query(SessionModel).filter(
            SessionModel.id == session_id,
            SessionModel.user_id == user_id
        ).first()
        
        if not session:
            raise ValueError("Session not found")
        
        self.db.delete(session)
        self.db.query(RefreshToken).filter(RefreshToken.session_id == session_id).delete()
        self.db.commit()
        
        return {"message": "Session revoked successfully"}
    
    # ==================== TOKEN MANAGEMENT ====================
    
    def refresh_access_token(self, refresh_token: str) -> TokenResponse:
        """Refresh access token"""
        token_record = self.db.query(RefreshToken).filter(
            RefreshToken.token == refresh_token,
            RefreshToken.expires_at > datetime.utcnow(),
            RefreshToken.revoked == False
        ).first()
        
        if not token_record:
            raise ValueError("Invalid or expired refresh token")
        
        user = self.db.query(User).filter(User.id == token_record.user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Generate new access token
        access_token = self._create_access_token({"user_id": user.id})
        
        # Update token last used
        token_record.last_used = datetime.utcnow()
        self.db.commit()
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=self.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=self._user_to_dict(user)
        )
    
    # ==================== HELPER METHODS ====================
    
    def _create_access_token(self, data: dict) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire, "type": "access"})
        return jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)
    
    def _create_refresh_token(self, user_id: str, session_id: str) -> str:
        """Create refresh token"""
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(days=self.REFRESH_TOKEN_EXPIRE_DAYS)
        
        refresh_token = RefreshToken(
            user_id=user_id,
            session_id=session_id,
            token=token,
            expires_at=expires_at,
            created_at=datetime.utcnow()
        )
        self.db.add(refresh_token)
        self.db.commit()
        
        return token
    
    def _create_temp_token(self, user_id: str) -> str:
        """Create temporary token for 2FA"""
        to_encode = {"user_id": user_id, "type": "temp"}
        expire = datetime.utcnow() + timedelta(minutes=5)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)
    
    def _create_session(self, user_id: str, ip_address: str, user_agent: str, remember_me: bool = False) -> SessionModel:
        """Create user session"""
        expires_days = 30 if remember_me else 1
        expires_at = datetime.utcnow() + timedelta(days=expires_days)
        
        session = SessionModel(
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            location=None,  # Implement geolocation if needed
            last_active=datetime.utcnow(),
            expires_at=expires_at,
            created_at=datetime.utcnow()
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        
        return session
    
    def _user_to_dict(self, user: User) -> dict:
        """Convert user to dictionary"""
        return {
            "id": user.id,
            "full_name": user.full_name,
            "username": user.username,
            "email": user.email,
            "email_verified": user.email_verified,
            "profile_picture": user.profile_picture,
            "role": user.role,
            "plan_type": user.plan_type,
            "two_factor_enabled": user.two_factor_enabled
        }
    
    def _log_activity(self, user_id: str, activity_type: str, description: str):
        """Log user activity"""
        activity = ActivityLog(
            user_id=user_id,
            activity_type=activity_type,
            description=description,
            created_at=datetime.utcnow()
        )
        self.db.add(activity)
        self.db.commit()
    
    def _log_failed_login(self, user_id: str, ip_address: str):
        """Log failed login attempt"""
        # Implement login attempt tracking
        # Lock account after X failed attempts
        pass
    
    def _send_verification_email(self, email: str, token: str):
        """Send email verification email"""
        # Implement email sending
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        # Send email with verification_url
        pass
    
    def _send_password_reset_email(self, email: str, token: str):
        """Send password reset email"""
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        # Send email with reset_url
        pass
    
    def _send_password_changed_email(self, email: str):
        """Send password changed notification"""
        # Send notification email
        pass
    
    def _send_account_deleted_email(self, email: str, name: str):
        """Send account deletion confirmation"""
        # Send confirmation email
        pass