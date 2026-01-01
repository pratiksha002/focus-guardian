# Backend Configuration
# File: backend/app/config.py

from pydantic_settings import BaseSettings
from pydantic_settings import SettingsConfigDict

from typing import Optional

class Settings(BaseSettings):
    """Application settings and configuration"""
    model_config = SettingsConfigDict(extra="allow")
    # API Settings
    API_TITLE: str = "Focus Guardian API"
    API_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS Settings
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]
    
    # WebSocket Settings
    WS_HEARTBEAT_INTERVAL: int = 30
    WS_MESSAGE_QUEUE_SIZE: int = 100
    
    # Detection Settings
    DETECTION_CONFIDENCE: float = 0.5
    FRAME_PROCESS_INTERVAL: float = 0.5  # seconds
    EYE_ASPECT_RATIO_THRESHOLD: float = 0.25
    HEAD_POSE_THRESHOLD: float = 30  # degrees
    
    # Focus Scoring
    FOCUS_HIGH_THRESHOLD: int = 70
    FOCUS_MEDIUM_THRESHOLD: int = 40
    
    # Session Settings
    MAX_SESSION_DURATION: int = 14400  # 4 hours in seconds
    HISTORY_LIMIT: int = 100
    
    # Database (Optional)
    DATABASE_URL: Optional[str] = None

# Create global settings instance
settings = Settings()