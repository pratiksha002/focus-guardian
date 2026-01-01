import { useState, useEffect } from 'react';
import useWebSocket from './useWebSocket';

function useFocusTracker(wsUrl) {
  const [focusData, setFocusData] = useState({
    score: 0,
    status: 'idle',
    stats: { 
      totalFocused: 0, 
      totalDistracted: 0, 
      totalDrowsy: 0, 
      avgScore: 0 
    },
    history: []
  });
  
  const { status: wsStatus, lastMessage, sendMessage } = useWebSocket(wsUrl);
  
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'connected') {
        console.log('✅ Connection confirmed:', lastMessage.message);
      } else if (lastMessage.type === 'detection') {
        console.log('🎯 Updating focus data:', lastMessage);
        setFocusData(prev => ({
          score: lastMessage.focus_score,
          status: lastMessage.status,
          stats: lastMessage.stats,
          history: [...prev.history.slice(-19), {
            timestamp: new Date().toLocaleTimeString(),
            status: lastMessage.status,
            score: lastMessage.focus_score
          }]
        }));
      } else if (lastMessage.type === 'error') {
        console.error('❌ Server error:', lastMessage.message);
      }
    }
  }, [lastMessage]);
  
  return { focusData, wsStatus, sendMessage };
}

export default useFocusTracker;