import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, Music } from 'lucide-react';

export const MusicPlayer = ({ compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const isChangingTrack = useRef(false);

  // Updated with working lofi tracks
  const musicSources = [
    {
      url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
      name: 'Lofi Study 1'
    },
    {
      url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_1e9a7c4b02.mp3',
      name: 'Lofi Study 2'
    },
    {
      url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3',
      name: 'Lofi Study 3'
    }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Reset audio when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.currentTime = 0; // Start from beginning
    }
  }, [currentTrack]);

  const togglePlay = async () => {
    if (!audioRef.current || isChangingTrack.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Playback error:', err);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    if (!audioRef.current || isChangingTrack.current) return;

    isChangingTrack.current = true;
    const wasPlaying = isPlaying;

    audioRef.current.pause();
    setIsPlaying(false);
    setIsLoading(true);

    const next = (currentTrack + 1) % musicSources.length;
    setCurrentTrack(next);

    setTimeout(() => {
      if (audioRef.current && wasPlaying) {
        audioRef.current.currentTime = 0; // Reset to start
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error('Auto-play error:', err);
            setIsPlaying(false);
          })
          .finally(() => {
            setIsLoading(false);
            isChangingTrack.current = false;
          });
      } else {
        setIsLoading(false);
        isChangingTrack.current = false;
      }
    }, 100);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = (e) => {
    console.error('Audio error:', e);
    setIsLoading(false);
    setIsPlaying(false);
    isChangingTrack.current = false;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <Pause className="w-4 h-4 text-purple-400" />
          ) : (
            <Play className="w-4 h-4 text-purple-400" />
          )}
        </button>
        <button
          onClick={toggleMute}
          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all duration-300"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-purple-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-purple-400" />
          )}
        </button>
        <audio
          ref={audioRef}
          src={musicSources[currentTrack].url}
          loop
          onCanPlay={handleCanPlay}
          onError={handleError}
          preload="auto"
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Music className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm">Focus Music</h3>
          <p className="text-xs text-gray-400">Lo-fi Beats to Study</p>
        </div>
      </div>

      <div className="bg-black/20 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Music className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">
              {musicSources[currentTrack].name}
            </div>
            <div className="text-xs text-gray-400">
              {isPlaying ? '♪ Playing...' : 'Paused'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 rounded-full transition-all duration-300 shadow-lg disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>
        <button
          onClick={nextTrack}
          disabled={isLoading}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 disabled:opacity-50"
        >
          <SkipForward className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-gray-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-purple-400" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      <audio
        ref={audioRef}
        src={musicSources[currentTrack].url}
        loop
        onCanPlay={handleCanPlay}
        onError={handleError}
        preload="auto"
      />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(to right, #a855f7, #ec4899);
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(to right, #a855f7, #ec4899);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};