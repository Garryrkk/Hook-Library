from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Reddit API
    REDDIT_CLIENT_ID: str
    REDDIT_CLIENT_SECRET: str
    REDDIT_USER_AGENT: str

    # YouTube API
    YOUTUBE_API_KEY: str | None = None

    # Database
    DATABASE_URL: str = "sqlite:///./hooks.db"

    class Config:
        env_file = ".env"
        extra = "ignore"  # ✅ Ignore extra env variables

# Create a single instance
settings = Settings()
