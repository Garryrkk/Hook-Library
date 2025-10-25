from transformers import pipeline
from app.core.database import SessionLocal
from app.models.hook_model import Hook

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def label_hooks():
    db = SessionLocal()
    hooks = db.query(Hook).filter(Hook.tone == "unknown").limit(20).all()

    tone_labels = ["motivational", "educational", "relatable", "shock", "funny"]
    niche_labels = ["business", "fitness", "self-improvement", "tech", "finance", "general"]

    for hook in hooks:
        tone_result = classifier(hook.text, tone_labels)
        niche_result = classifier(hook.text, niche_labels)
        hook.tone = tone_result["labels"][0]
        hook.niche = niche_result["labels"][0]
        print(f"Labeled: {hook.text[:50]}... → Tone={hook.tone}, Niche={hook.niche}")

    db.commit()
    db.close()

if __name__ == "__main__":
    label_hooks()
