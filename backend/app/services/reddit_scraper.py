import os
import praw
from dotenv import load_dotenv
from app.models.hook_model import Hook
from app.core.database import SessionLocal
from app.core.config import settings  # Make sure you have a config.py file

# Load benvironment variables
load_dotenv()

# Initialize Reddit client once
reddit = praw.Reddit(
    client_id=settings.REDDIT_CLIENT_ID,
    client_secret=settings.REDDIT_CLIENT_SECRET,
    user_agent=settings.REDDIT_USER_AGENT,
)

def fetch_reddit_posts(subreddit_name: str, limit: int = 50):
    """Fetch hot posts from a given subreddit."""
    subreddit = reddit.subreddit(subreddit_name)
    posts = []

    for submission in subreddit.hot(limit=limit):
        if not submission.stickied:  # Skip pinned posts
            posts.append({
                "title": submission.title,
                "score": submission.score,
                "url": submission.url
            })
    return posts


def save_hooks_to_db(posts, niche: str):
    """Save scraped posts as hooks in the database."""
    db = SessionLocal()
    try:
        for p in posts:
            hook = Hook(
                text=p["title"],
                tone="unknown",
                niche=niche,
                platform="Reddit"
            )
            db.add(hook)
        db.commit()
        print(f"✅ Saved {len(posts)} hooks from r/{niche} into DB.")
    finally:
        db.close()


def scrape_and_store(subreddit_name: str, limit: int = 50):
    """End-to-end: fetch from Reddit and save to DB."""
    posts = fetch_reddit_posts(subreddit_name, limit)
    if posts:
        save_hooks_to_db(posts, niche=subreddit_name)
        return posts
    else:
        return[f"⚠️ No posts found for r/{subreddit_name}"]


def scrape_reddit_all():
    """Scrape multiple subreddits and save results."""
    subreddits = [
        "Business",
        "ContentCreators",
        "developersIndia",
        "IndianMakeupAddicts",
        "TeenIndia",
        "InstaCelebsGossip"
    ]
    limit = 50  # number of posts per subreddit

    for sub in subreddits:
        print(f"🔍 Scraping r/{sub} ...")
        scrape_and_store(sub, limit)


if __name__ == "__main__":
    scrape_reddit_all()
