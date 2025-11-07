from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import SQLAlchemyError

from dotenv import load_dotenv
import os

# Load environment variables from .env (optional but good practice)
load_dotenv()

# Your PostgreSQL connection string
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:Garima123@localhost:5432/hookbank"
)

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Session for DB operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that yields a DB session and ensures it is closed.
    Usage:
        def endpoint(db: Session = Depends(get_db))
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """
    Create database tables for all models that inherit from Base.
    Call this at app startup (e.g. in main.py startup event) if you want automatic table creation.
    """
    try:
        print("🛠 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
    except SQLAlchemyError as exc:
        print("❌ Failed to create tables:", exc)
        raise