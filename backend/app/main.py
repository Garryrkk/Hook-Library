# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import reddit, youtube, instagram
from app.EssentialFeatures.EssentialFeaturesRoutes import (
    essential_features_bp,
    metrics_bp,
    metrics_not_found,
    metrics_internal_error,
)
from app.UserProfile.userprofileroutes import router as user_profile_router
from app.Settings.Settingsreportsroutes import router as settings_reports_router
from app.Auth.authroutes import router as auth_router

app = FastAPI(title="Hook Library API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(reddit.router, prefix="/reddit", tags=["reddit"])
app.include_router(youtube.router, prefix="/youtube", tags=["YouTube"])
app.include_router(instagram.router, prefix="/instagram", tags=["Instagram"])
app.include_router(auth_router)
app.include_router(user_profile_router)
app.include_router(settings_reports_router)
app.include_router(essential_features_bp)
app.include_router(metrics_bp)

# Register error handlers exported by the metrics module at app-level
app.add_exception_handler(404, metrics_not_found)
app.add_exception_handler(500, metrics_internal_error)

@app.get("/")
def root():
    return {"message": "Welcome to The Hook Library API"}

# ✅ Uvicorn run
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",   # "filename:app" (no .py)
        host="0.0.0.0",   # use "127.0.0.1" for local only
        port=8000,        # change port if needed
        reload=True       # auto-reload in dev
    )
