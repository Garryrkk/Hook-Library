from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import hooks  # ✅ Import your Reddit scraping router

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
app.include_router(hooks.router, prefix="/hooks", tags=["Hooks"])

@app.get("/")
def root():
    return {"message": "Welcome to The Hook Library API"}
