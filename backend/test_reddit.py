import os
import praw
from dotenv import load_dotenv

load_dotenv()

reddit = praw.Reddit(
    client_id=os.getenv("DLCXyT-e2gU2BjsUbV9-PA"),
    client_secret=os.getenv("hY5DsXL_zgr7qHEnbGwUOKk8cvcDPw"),
    user_agent=os.getenv("hooklibrary:1.0 (by u/Careless_Nebula_4368)")
)

print("✅ Authenticated as:", reddit.user.me())
