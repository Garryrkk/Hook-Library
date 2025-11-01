from fastapi import APIRouter, Query
from app.services.reddit_scraper import scrape_and_store, scrape_reddit_all

router = APIRouter(prefix="/reddit", tags=["Reddit"])

@router.post("/scrape")
def scrape_single(
    subreddit: str = Query(..., description="Subreddit name"),
    limit: int = Query(50, description="Number of posts")
):
    scrape_and_store(subreddit, limit)
    return {"message": f"✅ Scraped {limit} posts from r/{subreddit}"}

@router.post("/scrape-all/")
def scrape_all():
    scrape_reddit_all()
    return {"message": "✅ Scraped all default subreddits"}