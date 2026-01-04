"""
Focus Guardian Backend - Main Entry Point
File location: backend/main.py (NOT backend/app/main.py)
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from pydantic import BaseModel
import json
import base64
import traceback
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, get_db, Base
from app.models import User, FocusSession, Detection
from app.auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SECRET_KEY,
    ALGORITHM
)
try:
    from app.services.detector import FocusDetector
    focus_detector = FocusDetector()
    DETECTOR_AVAILABLE = True
except ImportError:
    focus_detector = None
    DETECTOR_AVAILABLE = False
    print("⚠️ Running without AI detector (mediapipe not available)")
from pydantic import BaseModel, EmailStr
from jose import jwt

# ⚠️ TEMPORARY: Reset database schema (REMOVE AFTER FIRST RUN)
#print("🔄 Resetting database schema...")
#Base.metadata.drop_all(bind=engine)
#print("✅ Old tables dropped")

# Create database tables
print("🗄️ Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Database tables created")

# Initialize FastAPI app
app = FastAPI(
    title="Focus Guardian API",
    description="Real-time focus tracking system",
    version="1.0.0"
)

# CORS Configuration - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)
# Initialize focus detector
print("🧠 Initializing focus detector...")
DETECTOR_ENABLED = False
focus_detector = None

try:
    from app.services.detector import FocusDetector
    focus_detector = FocusDetector()
    DETECTOR_ENABLED = True
    print("✅ Focus detector ready")
except ImportError as e:
    print(f"⚠️ Running without AI detector (mediapipe not available)")
    DETECTOR_ENABLED = False
    focus_detector = None
except Exception as e:
    print(f"⚠️ Focus detector initialization failed: {e}")
    DETECTOR_ENABLED = False
    focus_detector = None

# ==================== Pydantic Models ====================

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    created_at: datetime = None  # Add this
    xp: int = 0  # Add this
    level: int = 1  # Add this

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class SessionStats(BaseModel):
    total_focused: int
    total_distracted: int
    total_drowsy: int
    avg_score: float

class XPUpdate(BaseModel):
    xp: int
    level: int
# ==================== WebSocket Manager ====================

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}
    
    async def connect(self, websocket: WebSocket, user_id: int, db: Session):
        await websocket.accept()
        
        # Create new focus session
        session = FocusSession(user_id=user_id)
        db.add(session)
        db.commit()
        db.refresh(session)
        
        self.active_connections[websocket] = {
            'session_id': session.id,
            'user_id': user_id
        }
        
        print(f"✅ WebSocket connected: User {user_id}, Session {session.id}")
        
        return session.id
    
    def disconnect(self, websocket: WebSocket, db: Session):
        if websocket in self.active_connections:
            connection_info = self.active_connections[websocket]
            session_id = connection_info['session_id']
            
            # End the session
            session = db.query(FocusSession).filter(FocusSession.id == session_id).first()
            if session:
                session.end_time = datetime.utcnow()
                db.commit()
                print(f"🛑 Session {session_id} ended")
            
            del self.active_connections[websocket]
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        try:
            await websocket.send_json(message)
        except Exception as e:
            print(f"❌ Error sending message: {e}")

manager = ConnectionManager()
if DETECTOR_AVAILABLE and focus_detector:
    result = focus_detector.detect_focus(image_bytes)
else:
    # Mock response for demo
    result = {
        "status": "focused",
        "focus_score": 85
    }
# ==================== API Routes ====================

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "message": "Focus Guardian API is running",
        "status": "ok",
        "version": "1.0.0"
    }

@app.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    print(f"📝 Registration attempt: {user.username}")
    
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    
    if existing_user:
        print(f"❌ User already exists: {user.username}")
        raise HTTPException(
            status_code=400,
            detail="Email or username already registered"
        )
    
    # Create new user with all fields
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password,
        xp=0,  # Initialize XP
        level=1  # Initialize level
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print(f"✅ User registered successfully: {new_user.username} (ID: {new_user.id})")
        
        return new_user
    except Exception as e:
        db.rollback()
        print(f"❌ Registration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
# Add this with your other routes
@app.put("/api/auth/update-profile")
def update_profile(
    username: str = None,
    email: str = None,
    full_name: str = None,
    current_password: str = None,
    new_password: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        # Update basic info
        if username:
            current_user.username = username
        if email:
            current_user.email = email
        if full_name:
            current_user.full_name = full_name
        
        # Update password if provided
        if new_password and current_password:
            if not verify_password(current_password, current_user.hashed_password):
                raise HTTPException(status_code=400, detail="Current password is incorrect")
            current_user.hashed_password = get_password_hash(new_password)
        
        db.commit()
        return {"message": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Create new user
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    print(f"✅ User registered successfully: {new_user.username}")
    
    return new_user

@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login user and return access token"""
    print(f"🔐 Login attempt: {form_data.username}")
    
    # Find user
    user = db.query(User).filter(User.username == form_data.username).first()
    
    if not user:
        print(f"❌ User not found: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user.hashed_password):
        print(f"❌ Invalid password for: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, 
        expires_delta=access_token_expires
    )
    
    print(f"✅ Login successful: {user.username}")
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return { "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "created_at": current_user.created_at.isoformat() if hasattr(current_user, 'created_at') and current_user.created_at else None,
        "xp": getattr(current_user, 'xp', 0),
        "level": getattr(current_user, 'level', 1)}

@app.get("/api/stats", response_model=SessionStats)
def get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's focus statistics"""
    sessions = db.query(FocusSession).filter(
        FocusSession.user_id == current_user.id
    ).all()
    
    total_focused = sum(s.total_focused for s in sessions)
    total_distracted = sum(s.total_distracted for s in sessions)
    total_drowsy = sum(s.total_drowsy for s in sessions)
    avg_score = sum(s.avg_score for s in sessions) / len(sessions) if sessions else 0
    
    return {
        "total_focused": total_focused,
        "total_distracted": total_distracted,
        "total_drowsy": total_drowsy,
        "avg_score": avg_score
    }

# ==================== Users Endpoint (NEW) ====================

# Add this to your main.py, replacing the existing /api/users endpoint

@app.get("/api/users")
def get_all_users(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Get all registered users for social features"""
    try:
        users = db.query(User).all()
        
        result = []
        for user in users:
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "created_at": user.created_at.isoformat() if hasattr(user, 'created_at') and user.created_at else None,
                "xp": getattr(user, 'xp', 0),
                "level": getattr(user, 'level', 1)
            }
            result.append(user_data)
            print(f"📊 User {user.username}: XP={user_data['xp']}, Level={user_data['level']}")
        
        return result
        
    except Exception as e:
        print(f"❌ Error fetching users: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class UpdateProfileRequest(BaseModel):
    username: str = None
    email: str = None
    full_name: str = None
    current_password: str = None
    new_password: str = None

@app.put("/api/auth/update-profile")
def update_profile(
    update_data: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        # Update basic info
        if update_data.username:
            current_user.username = update_data.username
        if update_data.email:
            current_user.email = update_data.email
        if update_data.full_name:
            current_user.full_name = update_data.full_name
        
        # Update password if provided
        if update_data.new_password and update_data.current_password:
            if not verify_password(update_data.current_password, current_user.hashed_password):
                raise HTTPException(status_code=400, detail="Current password is incorrect")
            current_user.hashed_password = get_password_hash(update_data.new_password)
        
        db.commit()
        return {"message": "Profile updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/user/update-xp")
def update_user_xp(
    xp_data: XPUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user XP and level from frontend gamification"""
    try:
        current_user.xp = xp_data.xp
        current_user.level = xp_data.level
        db.commit()
        db.refresh(current_user)
        
        print(f"✅ Updated XP for {current_user.username}: XP={xp_data.xp}, Level={xp_data.level}")
        
        return {
            "success": True,
            "message": "XP updated successfully",
            "xp": current_user.xp,
            "level": current_user.level
        }
    except Exception as e:
        db.rollback()
        print(f"❌ Error updating XP: {e}")
        raise HTTPException(status_code=500, detail=str(e))    
# ==================== WebSocket Endpoint ====================

@app.websocket("/ws/focus")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    """WebSocket endpoint for real-time focus tracking"""
    print(f"🔌 WebSocket connection attempt...")
    
    if not token:
        print("❌ No token provided")
        await websocket.close(code=1008, reason="No token provided")
        return
    
    print(f"Token: {token[:20]}...")
    
    db = next(get_db())
    
    try:
        # Verify JWT token
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username = payload.get("sub")
            current_user = db.query(User).filter(User.username == username).first()
            
            if not current_user:
                print("❌ Invalid token - user not found")
                await websocket.close(code=1008, reason="Invalid token")
                return
                
            print(f"✅ User authenticated: {current_user.username}")
            
        except Exception as e:
            print(f"❌ Token verification failed: {e}")
            await websocket.close(code=1008, reason="Invalid token")
            return
        
        # Connect WebSocket and create session
        session_id = await manager.connect(websocket, current_user.id, db)
        session = db.query(FocusSession).filter(FocusSession.id == session_id).first()
        
        # Send connection success message
        await manager.send_personal_message({
            "type": "connected",
            "message": "WebSocket connected successfully"
        }, websocket)
        
        # Main message loop
        try:
            while True:
                # Receive message from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                if message.get("type") == "frame":
                    try:
                        # Extract and decode base64 image
                        image_data_str = message.get("data", "")
                        if "," in image_data_str:
                            image_data_str = image_data_str.split(",")[1]
                        
                        image_bytes = base64.b64decode(image_data_str)
                        print(f"📸 Frame received: {len(image_bytes)} bytes")
                        
                        # Detect focus status
                        result = focus_detector.detect_focus(image_bytes)
                        print(f"🎯 Detection: {result['status']} (score: {result['focus_score']})")
                        
                        # Update session statistics
                        if result["status"] == "focused":
                            session.total_focused += 1
                        elif result["status"] == "distracted":
                            session.total_distracted += 1
                        elif result["status"] == "drowsy":
                            session.total_drowsy += 1
                        
                        # Calculate running average score
                        total_detections = (session.total_focused + 
                                          session.total_distracted + 
                                          session.total_drowsy)
                        
                        if total_detections > 0:
                            session.avg_score = (
                                (session.avg_score * (total_detections - 1)) + 
                                result["focus_score"]
                            ) / total_detections
                        
                        db.commit()
                        
                        # Save individual detection
                        detection = Detection(
                            session_id=session_id,
                            status=result["status"],
                            focus_score=result["focus_score"]
                        )
                        db.add(detection)
                        db.commit()
                        
                        # Send response back to client
                        response = {
                            "type": "detection",
                            "status": result["status"],
                            "focus_score": result["focus_score"],
                            "stats": {
                                "totalFocused": session.total_focused,
                                "totalDistracted": session.total_distracted,
                                "totalDrowsy": session.total_drowsy,
                                "avgScore": int(session.avg_score)
                            }
                        }
                        
                        await manager.send_personal_message(response, websocket)
                        
                    except Exception as e:
                        print(f"❌ Error processing frame: {e}")
                        print(traceback.format_exc())
                        await manager.send_personal_message({
                            "type": "error",
                            "message": str(e)
                        }, websocket)
                        
        except WebSocketDisconnect:
            print("🔌 Client disconnected")
            manager.disconnect(websocket, db)
            
    except Exception as e:
        print(f"❌ WebSocket error: {e}")
        print(traceback.format_exc())
        try:
            await websocket.close()
        except:
            pass
    finally:
        db.close()

# ==================== Startup ====================

if __name__ == "__main__":
    import uvicorn
    
    print("=" * 60)
    print("🚀 Starting Focus Guardian API")
    print("=" * 60)
    print("📍 Server: http://127.0.0.1:8000")
    print("📍 API Docs: http://127.0.0.1:8000/docs")
    print("📍 WebSocket: ws://127.0.0.1:8000/ws/focus")
    print("=" * 60)
    
    uvicorn.run(
        app, 
        host="127.0.0.1", 
        port=8000, 
        log_level="info"
    )