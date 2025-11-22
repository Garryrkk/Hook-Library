from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import reddit, youtube, instagram  # ✅ Import your Reddit scraping router
from app.EssentialFeatures.EssentialFeaturesRoutes import essential_features_bp, metrics_bp, metrics_service
from app.UserProfile.userprofileroutes import router as user_profile_router
from app.Settings.Settingsreportsroutes import router as settings_reports_router
from ..Auth.authroutes import router as auth_router
app = FastAPI(title="Hook Library API")

# CORS middleware so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routers here
app.include_router(reddit.router, prefix="/reddit", tags=["reddit"])
app.include_router(youtube.router, prefix="/youtube", tags=["YouTube"])
app.include_router(instagram.router, prefix="/instagram", tags=["Instagram"])

###Auth Routers

app.include_router(auth_router)
app.include_router(user_profile_router)
app.include_router(settings_reports_router)

###blueprints
app.register_blueprint(metrics_bp)
app.register_blueprint(essential_features_bp)

@app.get("/")
def root():
    return {"message": "Welcome to The Hook Library API"}
