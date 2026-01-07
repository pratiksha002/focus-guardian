import React, { useState, useRef, useEffect, useContext } from 'react';
import { Video, VideoOff, AlertCircle } from 'lucide-react';
import useFocusTracker from '../../hooks/useFocusTracker';
import { AuthContext } from '../../context/AuthContext';
import { GamificationContext } from '../../context/GamificationContext';
import { PomodoroTimer } from '../features/PomodoroTimer';
import { FocusPet } from '../features/FocusPet';
import { MusicPlayer } from '../features/MusicPlayer';

export const FocusModePage = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const captureIntervalRef = useRef(null);
  
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const wsUrl = API_URL.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws/focus';
  const { focusData, wsStatus, sendMessage } = useFocusTracker(wsUrl);
  const { onFocusDetection, onSessionComplete } = useContext(GamificationContext);
  
  const startCamera = async () => {
    try {
      console.log('🎥 Starting camera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
      setStream(mediaStream);
      setCameraError(null);
      console.log('✅ Camera started');
    } catch (err) {
      console.error('❌ Camera error:', err);
      setCameraError('Failed to access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      console.log('🛑 Camera stopped');
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || wsStatus !== 'connected') {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frameData = canvas.toDataURL('image/jpeg', 0.8);
    sendMessage({ type: 'frame', data: frameData });
  };

  const handleStartTracking = async () => {
    console.log('▶️ Starting tracking...');
    
    if (!token) {
      alert('Please login first');
      return;
    }

    if (wsStatus !== 'connected') {
      alert('WebSocket not connected. Please wait or check backend.');
      return;
    }

    await startCamera();
    setIsTracking(true);
    captureIntervalRef.current = setInterval(captureFrame, 2000);
  };

  const handleStopTracking = () => {
    console.log('⏹️ Stopping tracking...');
    setIsTracking(false);
    
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    
    stopCamera();
    onSessionComplete(focusData.stats);
  };

  useEffect(() => {
    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (focusData?.status && focusData.status !== 'idle') {
      onFocusDetection(focusData.status);
    }
  }, [focusData.status, onFocusDetection]);

  const getStatusColor = () => {
    switch (focusData.status) {
      case 'focused': return 'text-green-400';
      case 'distracted': return 'text-yellow-400';
      case 'drowsy': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusEmoji = () => {
    switch (focusData.status) {
      case 'focused': return '👀';
      case 'distracted': return '😵';
      case 'drowsy': return '😴';
      default: return '❓';
    }
  };

  const getConnectionStatusColor = () => {
    switch (wsStatus) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">Focus Mode</h1>
          <p className="text-gray-400 text-sm">Real-time focus tracking with Pomodoro timer</p>
        </div>

        {wsStatus !== 'connected' && (
          <div className={`mb-6 p-3 rounded-lg transition-all duration-300 ${
            wsStatus === 'error' ? 'bg-red-500/20 border border-red-500/50' :
            'bg-yellow-500/20 border border-yellow-500/50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${getConnectionStatusColor()}`}></div>
              <span className="text-white text-sm font-medium">
                {wsStatus === 'error' ? '🔴 Connection Error - Check Backend' : '🟡 Connecting...'}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Camera Section */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Live Camera Feed</h2>
                {wsStatus === 'connected' && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Connected
                  </div>
                )}
              </div>
              
              <div className="relative bg-black rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                {!stream && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
                    <VideoOff className="w-20 h-20 text-gray-600 mb-4" />
                    <p className="text-gray-500">Camera inactive</p>
                  </div>
                )}
                
                {isTracking && stream && (
                  <>
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/50">
                      <div className="text-xs text-gray-400 mb-1">Current Status</div>
                      <div className={`text-lg font-bold ${getStatusColor()} capitalize flex items-center gap-2`}>
                        <span className="text-2xl">{getStatusEmoji()}</span>
                        {focusData.status}
                      </div>
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/50">
                      <div className="text-xs text-gray-400 mb-1">Focus Score</div>
                      <div className="text-2xl font-bold text-white">{focusData.score}</div>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 bg-red-500 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-bold">RECORDING</span>
                    </div>
                  </>
                )}
              </div>

              {cameraError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{cameraError}</p>
                </div>
              )}

              <div>
                {!isTracking ? (
                  <button
                    onClick={handleStartTracking}
                    disabled={wsStatus !== 'connected'}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50"
                  >
                    <Video className="w-5 h-5" />
                    Start Detection
                  </button>
                ) : (
                  <button
                    onClick={handleStopTracking}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-red-500/50"
                  >
                    <VideoOff className="w-5 h-5" />
                    Stop Detection
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Pomodoro Timer */}
            <PomodoroTimer isTracking={isTracking} /><MusicPlayer />

            {/* Current Status */}
            <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Current Status</h2>
              
              <div className="text-center">
                <div className="text-7xl mb-3">{getStatusEmoji()}</div>
                <div className={`text-2xl font-bold mb-2 ${getStatusColor()} capitalize`}>
                  {focusData.status}
                </div>
                <div className="text-sm text-gray-400">
                  Score: <span className="text-white font-bold text-lg">{focusData.score}</span>
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Session Stats</h2>
              
              <div className="space-y-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 hover:bg-green-500/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="text-green-400 text-sm font-medium">Focused</div>
                    <div className="text-2xl font-bold text-white">{focusData.stats.totalFocused}</div>
                  </div>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 hover:bg-yellow-500/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="text-yellow-400 text-sm font-medium">Distracted</div>
                    <div className="text-2xl font-bold text-white">{focusData.stats.totalDistracted}</div>
                  </div>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 hover:bg-red-500/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="text-red-400 text-sm font-medium">Drowsy</div>
                    <div className="text-2xl font-bold text-white">{focusData.stats.totalDrowsy}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Pet */}
            <FocusPet />
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.6);
        }
      `}</style>
    </div>
  );
};