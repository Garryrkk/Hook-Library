from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers (make sure these exist)
# from app.routers import hooks, search

app = FastAPI(title="Hook Library API")

# CORS middleware so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers if you have them
# app.include_router(hooks.router, prefix="/hooks", tags=["Hooks"])
# app.include_router(search.router, prefix="/search", tags=["Search"])

@app.get("/")
def root():
    return {"message": "Welcome to The Hook Library API"}
