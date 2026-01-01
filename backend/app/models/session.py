from sqlalchemy import Column, Integer, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class FocusSession(Base):
    __tablename__ = "focus_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)

    total_focused = Column(Integer, default=0)
    total_distracted = Column(Integer, default=0)
    total_drowsy = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)

    user = relationship("User", backref="sessions")
