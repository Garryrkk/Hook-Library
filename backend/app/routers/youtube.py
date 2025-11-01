from fastapi import APIRouter, Query
from app.services.youtube_scraper import scrape_and_store, scrape_youtube_all

router = APIRouter(prefix="/youtube", tags=["YouTube"])

@router.post("/scrape")
def scrape_youtube(
    channel_id: str = Query(..., description="YouTube Channel ID"),
    limit: int = Query(10, description="Number of videos to fetch")
):
    """Scrape a specific YouTube channel and save videos as hooks."""
    scrape_and_store(channel_id, limit)
    return {"message": f"✅ Scraped {limit} YouTube videos from channel {channel_id}"}

@router.post("/scrape-all")
def scrape_youtube_default():
    """Scrape a set of predefined YouTube channels."""
    scrape_youtube_all()
    return {"message": "✅ Scraped all default YouTube channels"}
