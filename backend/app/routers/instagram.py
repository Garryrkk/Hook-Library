from fastapi import APIRouter, Query
from backend.app.services.instagram_scaper import scrape_and_store, scrape_instagram_all

router = APIRouter(prefix="/instagram", tags=["Instagram"])

@router.post("/scrape")
def scrape_user(
    username: str = Query(..., description="Instagram username"),
    limit: int = Query(5, description="Number of posts")
):
    scrape_and_store(username, limit)
    return {"message": f"✅ Scraped {limit} posts from @{username}"}

@router.post("/scrape-all")
def scrape_all():
    scrape_instagram_all()
    return {"message": "✅ Scraped all default Instagram accounts"}
