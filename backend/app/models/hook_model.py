from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base
from datetime import datetime

class Hook(Base):
    __tablename__ = "hooks"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    tone = Column(String, index=True)
    niche = Column(String, index=True)
    platform = Column(String, index=True)
