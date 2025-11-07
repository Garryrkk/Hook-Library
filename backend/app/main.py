from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import reddit, youtube, instagram  # ✅ Import your Reddit scraping router

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

@app.get("/")
def root():
    return {"message": "Welcome to The Hook Library API"}
