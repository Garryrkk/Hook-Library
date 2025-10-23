from sqlalchemy import Column, Integer, String
from app.core.database import Base  # Make sure you have Base defined in database.py

class Hook(Base):
    __tablename__ = "hooks"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    tone = Column(String, index=True)
    niche = Column(String, index=True)
    platform = Column(String, index=True)
