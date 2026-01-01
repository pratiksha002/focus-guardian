import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';

function useWebSocket(url) {
  const { token } = useContext(AuthContext);
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const wsRef = useRef(null);
  
  useEffect(() => {
    if (!token) {
      console.error('❌ No token available for WebSocket connection');
      return;
    }

    const connectWebSocket = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      console.log('🔌 Attempting to connect to WebSocket...');
      console.log('URL:', `${url}?token=${token.substring(0, 20)}...`);
      
      const websocket = new WebSocket(`${url}?token=${token}`);
      wsRef.current = websocket;
      
      websocket.onopen = () => {
        setStatus('connected');
        console.log('✅ WebSocket connected successfully!');
      };
      
      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received message:', data);
          setLastMessage(data);
        } catch (err) {
          console.error('❌ Error parsing message:', err);
        }
      };
      
      websocket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setStatus('error');
      };
      
      websocket.onclose = (event) => {
        console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
        setStatus('disconnected');
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connectWebSocket();
        }, 3000);
      };
      
      setWs(websocket);
    };
    
    connectWebSocket();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [url, token]);
  
  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('📤 Sending message:', message.type);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected. Status:', status);
    }
  }, [status]);
  
  return { ws, status, lastMessage, sendMessage };
}

export default useWebSocket;