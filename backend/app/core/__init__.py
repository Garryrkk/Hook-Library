from backend.app.core.database import Base, engine
from backend.app.models import hook_model

print("🛠 Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")
