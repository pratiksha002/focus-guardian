# WebSocket Routes
# File: backend/app/routes/websocket.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import base64
import numpy as np
import cv2
from typing import Dict
import asyncio
from app.services.detector import FocusDetector
from app.config import settings
from app.database import SessionCRUD, get_db
from app.auth import get_current_user_ws

router = APIRouter()

# Store active connections and their detectors
active_connections: Dict[str, tuple] = {}

class ConnectionManager:
    """Manage WebSocket connections"""
    
    def __init__(self):
        self.active_connections: list = []
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections.append((client_id, websocket))
        print(f"Client {client_id} connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, client_id: str):
        self.active_connections = [
            (cid, ws) for cid, ws in self.active_connections if cid != client_id
        ]
        if client_id in active_connections:
            del active_connections[client_id]
        print(f"Client {client_id} disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_message(self, message: dict, websocket: WebSocket):
        await websocket.send_text(json.dumps(message))

manager = ConnectionManager()

def decode_frame(base64_data: str) -> np.ndarray:
    """Decode base64 image to numpy array"""
    try:
        # Remove data URL prefix if present
        if ',' in base64_data:
            base64_data = base64_data.split(',')[1]
        
        # Decode base64
        img_bytes = base64.b64decode(base64_data)
        
        # Convert to numpy array
        nparr = np.frombuffer(img_bytes, np.uint8)
        
        # Decode image
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        return frame
    except Exception as e:
        print(f"Error decoding frame: {e}")
        return None

#@router.websocket("/ws/focus")
#async def websocket_focus_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time focus detection
    
    Expected message format:
    {
        "type": "frame",
        "data": "base64_encoded_image"
    }
    
    Response format:
    {
        "focus_score": 85,
        "status": "focused",
        "details": {...},
        "stats": {...},
        "timestamp": 1234567890.123
    }
    """
    
    # Generate unique client ID
    client_id = f"client_{id(websocket)}"
    
    # Create detector for this connection
    detector = FocusDetector()
    active_connections[client_id] = (websocket, detector)
    
    # Accept connection
    await manager.connect(websocket, client_id)
    
    # Send welcome message
    await manager.send_message({
        "type": "connection",
        "status": "connected",
        "client_id": client_id,
        "message": "Focus Guardian is ready!"
    }, websocket)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message['type'] == 'frame':
                # Decode the frame
                frame = decode_frame(message['data'])
                
                if frame is None:
                    await manager.send_message({
                        "type": "error",
                        "message": "Failed to decode frame"
                    }, websocket)
                    continue
                
                # Perform focus detection
                result = detector.detect_focus(frame)
                
                # Get session statistics
                stats = detector.get_session_stats()
                
                # Send response
                response = {
                    "type": "detection",
                    "focus_score": result['focus_score'],
                    "status": result['status'],
                    "details": result['details'],
                    "stats": stats,
                    "timestamp": result['timestamp']
                }
                
                await manager.send_message(response, websocket)
            
            elif message['type'] == 'reset':
                # Reset session statistics
                detector.reset_session()
                await manager.send_message({
                    "type": "reset",
                    "status": "success",
                    "message": "Session statistics reset"
                }, websocket)
            
            elif message['type'] == 'ping':
                # Heartbeat
                await manager.send_message({
                    "type": "pong",
                    "timestamp": message.get('timestamp')
                }, websocket)
            
            elif message['type'] == 'get_stats':
                # Get current stats without processing frame
                stats = detector.get_session_stats()
                await manager.send_message({
                    "type": "stats",
                    "stats": stats
                }, websocket)
    
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        print(f"Client {client_id} disconnected normally")
    
    except Exception as e:
        print(f"Error in WebSocket connection for {client_id}: {e}")
        manager.disconnect(client_id)
        try:
            await manager.send_message({
                "type": "error",
                "message": str(e)
            }, websocket)
        except:
            pass

@router.get("/ws/status")
async def websocket_status():
    """Get WebSocket server status"""
    return {
        "status": "online",
        "active_connections": len(manager.active_connections),
        "settings": {
            "detection_confidence": settings.DETECTION_CONFIDENCE,
            "frame_interval": settings.FRAME_PROCESS_INTERVAL
        }
    }
# In websocket endpoint, add user authentication
#@router.websocket("/ws/focus/{token}")
async def websocket_focus_endpoint(websocket: WebSocket, token: str):
    # Get user from token
    db = next(get_db())
    user = await get_current_user_ws(token, db)
    
    if not user:
        await websocket.close(code=1008)
        return
    
    # Create session
    session = SessionCRUD.create_session(db, user.id)
    
    # ... rest of your websocket code
    
    # When saving detection results:
    SessionCRUD.add_event(db, session.id, result)