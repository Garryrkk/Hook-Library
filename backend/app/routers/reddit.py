from fastapi import APIRouter, Query, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List

from app.services.reddit_scraper import scrape_and_store, scrape_reddit_all
from app.core.database import get_db
from app.models.hook_model import Hook
from app.schemas.hook_schemas import HookResponse

router = APIRouter(prefix="/reddit", tags=["Reddit"])


# ✅ Scrape a single subreddit
@router.post("/scrape")
def scrape_single(
    subreddit: str = Query(..., description="Subreddit name"),
    limit: int = Query(50, description="Number of posts"),
):
    posts = scrape_and_store(subreddit, limit)
    return JSONResponse(
        status_code=200,
        content={
            "status": "success",
            "message": f"✅ Scraped {len(posts)} posts from r/{subreddit}",
            "data": posts,
        },
    )


# ✅ Scrape all default subreddits
@router.post("/scrape-all")
def scrape_all():
    scrape_reddit_all()
    return {"message": "✅ Scraped all default subreddits"}


# ✅ Get all hooks from DB
@router.get("/hooks", response_model=List[HookResponse])
def get_hooks(db: Session = Depends(get_db)):
    hooks = db.query(Hook).all()
    return hooks


# ✅ Search hooks by niche
@router.get("/hooks/search", response_model=List[HookResponse])
def search_hooks(niche: str, db: Session = Depends(get_db)):
    results = db.query(Hook).filter(Hook.niche.ilike(f"%{niche}%")).all()
    if not results:
        raise HTTPException(status_code=404, detail="No Hooks Found For This Niche.")
    return results
