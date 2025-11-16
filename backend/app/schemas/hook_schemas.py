from pydantic import BaseModel
from datetime import datetime

class HookBase(BaseModel):
    text: str
    tone: str
    niche: str
    platform: str

class HookCreate(BaseModel):
    pass 

class HookResponse(BaseModel):
    id: int

    class Config:
        orm_model = True