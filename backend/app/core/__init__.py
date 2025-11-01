from app.core.database import Base, engine
from app.models import hook_model

print("🛠 Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")
