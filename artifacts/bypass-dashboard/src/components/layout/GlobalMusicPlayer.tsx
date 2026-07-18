import React from 'react';
import { useMusic } from '../MusicProvider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GlobalMusicPlayer() {
  const { currentTrack, isPlaying, togglePlay, progress, duration, seek, volume, setVolume, nextTrack, prevTrack } = useMusic();

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 glass-panel border-t border-white/10 z-50 flex items-center px-2 sm:px-4 lg:px-6 justify-between transform transition-transform">
      {/* Track Info */}
      <div className="flex items-center gap-2 sm:gap-4 w-1/3 md:w-1/4 md:min-w-[200px] flex-shrink-0">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden flex-shrink-0 group">
          <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-end justify-center gap-0.5 pb-1 sm:pb-2">
              <div className="w-0.5 sm:w-1 bg-primary eq-bar h-[40%]"></div>
              <div className="w-0.5 sm:w-1 bg-primary eq-bar h-[80%]"></div>
              <div className="w-0.5 sm:w-1 bg-primary eq-bar h-[60%]"></div>
              <div className="w-0.5 sm:w-1 bg-primary eq-bar h-[30%]"></div>
            </div>
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-white text-xs sm:text-sm font-bold truncate neon-text">{currentTrack.title}</span>
          <span className="text-white/50 text-[10px] sm:text-xs truncate font-mono hidden sm:block">{currentTrack.artist}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 max-w-2xl flex flex-col items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <button onClick={prevTrack} className="touch-target text-white/60 hover:text-white hover:scale-110 transition-all flex items-center justify-center">
            <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] shrink-0"
          >
            {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-1" />}
          </button>
          <button onClick={nextTrack} className="touch-target text-white/60 hover:text-white hover:scale-110 transition-all flex items-center justify-center">
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <div className="w-full flex items-center gap-2 sm:gap-3">
          <span className="text-[10px] font-mono text-white/50 w-6 sm:w-8 text-right hidden sm:block">{formatTime(progress)}</span>
          <div 
            className="flex-1 h-2 sm:h-1.5 bg-white/10 rounded-full cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              seek(percent * duration);
            }}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_10px_var(--primary-glow)]"
              style={{ width: `${(progress / (duration || 1)) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/2 shadow-lg" />
            </div>
          </div>
          <span className="text-[10px] font-mono text-white/50 w-6 sm:w-8 hidden sm:block">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="w-1/4 flex items-center justify-end gap-3 hidden md:flex shrink-0">
        <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="text-white/60 hover:text-white">
          {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div 
          className="w-24 h-1.5 bg-white/10 rounded-full cursor-pointer relative group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
          }}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-white/80 rounded-full"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
