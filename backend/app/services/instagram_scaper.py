import instaloader
from app.models.hook_model import Hook
from app.core.database import SessionLocal

L = instaloader.Instaloader()

def fetch_instagram_posts(username: str, limit: int = 10):
    """Fetch recent Instagram posts for a given public account."""
    profile = instaloader.Profile.from_username(L.context, username)
    posts = []
    
    for i, post in enumerate(profile.get_posts()):
        if i >= limit:
            break
        posts.append({
            "caption": post.caption if post.caption else "",
            "likes": post.likes,
            "url": f"https://www.instagram.com/p/{post.shortcode}/"
        })
    return posts

def save_hooks_to_db(posts, niche: str):
    """Save scraped Instagram captions as hooks in DB."""
    db = SessionLocal()
    try:
        for p in posts:
            if p["caption"]:
                hook = Hook(
                    text=p["caption"],
                    tone="unknown",
                    niche=niche,
                    platform="Instagram"
                )
                db.add(hook)
        db.commit()
        print(f"✅ Saved {len(posts)} hooks from @{niche}")
    finally:
        db.close()

def scrape_and_store(username: str, limit: int = 10):
    """End-to-end: fetch and save Instagram posts."""
    posts = fetch_instagram_posts(username, limit)
    if posts:
        save_hooks_to_db(posts, niche=username)
    else:
        print(f"⚠️ No posts found for @{username}")

def scrape_instagram_all():
    """Scrape a few default public accounts."""
    accounts = ["garyvee", "garimakalraaa", "hubspot", "marketingharry", "creators", "themodernimbecile"]
    for acc in accounts:
        print(f"📸 Scraping Instagram user: {acc}")
        scrape_and_store(acc, 5)

if __name__ == "__main__":
    scrape_instagram_all()
