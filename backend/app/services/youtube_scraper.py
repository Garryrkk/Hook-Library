import os
from googleapiclient.discovery import build
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.models.hook_model import Hook
from app.core.database import SessionLocal, Base, engine  # add engine and Base

load_dotenv()

API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

# --------------------------
# Create tables if they don't exist
# --------------------------
Base.metadata.create_all(bind=engine)

def get_youtube_service():
    return build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=API_KEY)

def fetch_youtube_videos(keyword: str, max_results: int = 20):
    youtube = get_youtube_service()
    request = youtube.search().list(
        q=keyword,
        part="snippet",
        type="video",
        maxResults=max_results,
        order="viewCount"
    )
    response = request.execute()

    videos = []
    for item in response.get("items", []):
        videos.append({
            "title": item["snippet"]["title"],
            "channel": item["snippet"]["channelTitle"],
            "publish_date": item["snippet"]["publishedAt"]
        })
    return videos

def save_hooks_to_db(videos, niche: str):
    db: Session = SessionLocal()
    for v in videos:
        new_hook = Hook(
            text=v["title"],
            tone="unknown",
            niche=niche,
            platform="YouTube"
        )
        db.add(new_hook)
    db.commit()
    db.close()

if __name__ == "__main__":
    niche = input("Enter niche keyword (e.g. motivation, fitness, business): ")
    videos = fetch_youtube_videos(niche)
    save_hooks_to_db(videos, niche)
    print(f"✅ Saved {len(videos)} hooks for niche '{niche}' into DB.")
