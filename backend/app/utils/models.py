from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    sessions = relationship("FocusSession", back_populates="user")

class FocusSession(Base):
    __tablename__ = "focus_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    total_focused = Column(Integer, default=0)
    total_distracted = Column(Integer, default=0)
    total_drowsy = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)
    
    user = relationship("User", back_populates="sessions")
    detections = relationship("Detection", back_populates="session")

class Detection(Base):
    __tablename__ = "detections"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("focus_sessions.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String)  # focused, distracted, drowsy
    focus_score = Column(Integer)
    
    session = relationship("FocusSession", back_populates="detections")