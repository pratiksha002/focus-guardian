# reset_database.py
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.models import User, FocusSession, Detection

print("🔄 Dropping all tables...")
Base.metadata.drop_all(bind=engine)

print("✅ Creating all tables with new schema...")
Base.metadata.create_all(bind=engine)

print("✅ Database reset complete!")