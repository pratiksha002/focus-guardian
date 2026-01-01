import React, { useEffect, useRef, useState } from 'react';

const useCamera = () => {
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  
  const startCamera = async () => {
    try {
      console.log('🎥 Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
        setError(null);
        console.log('✅ Camera started successfully');
      }
    } catch (err) {
      const errorMessage = 'Camera access denied. Please allow camera access.';
      setError(errorMessage);
      console.error('❌ Camera error:', err);
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      console.log('🛑 Stopping camera...');
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
      console.log('✅ Camera stopped');
    }
  };
  
  return { videoRef, isActive, error, startCamera, stopCamera };
};

export const CameraView = ({ onFrameCapture, isActive }) => {
  const { videoRef, error, startCamera, stopCamera } = useCamera();
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const frameCountRef = useRef(0);
  
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isActive]);
  
  useEffect(() => {
    if (!isActive || !onFrameCapture) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('🛑 Frame capture stopped');
      }
      return;
    }
    
    console.log('🎬 Starting frame capture...');
    
    // Wait for video to be ready
    const checkVideoReady = setInterval(() => {
      if (videoRef.current && 
          videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
          videoRef.current.videoWidth > 0) {
        
        clearInterval(checkVideoReady);
        console.log('✅ Video ready, starting frame capture');
        console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
        
        // Start capturing frames every 1 second
        intervalRef.current = setInterval(() => {
          if (videoRef.current && 
              canvasRef.current && 
              videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            if (canvas.width > 0 && canvas.height > 0) {
              // Draw video frame to canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Convert to base64
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              
              frameCountRef.current++;
              console.log(`📸 Frame ${frameCountRef.current} captured (${dataUrl.length} bytes)`);
              
              // Send frame
              onFrameCapture(dataUrl);
            }
          }
        }, 1000); // Capture every 1 second
      }
    }, 100);
    
    return () => {
      clearInterval(checkVideoReady);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onFrameCapture]);
  
  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-2xl"
      />
      <canvas ref={canvasRef} className="hidden" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl">
          <div className="text-center p-6">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={startCamera}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};