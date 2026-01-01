from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("focus_sessions.id"), nullable=False)

    status = Column(String, nullable=False)
    focus_score = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("FocusSession", backref="detections")
