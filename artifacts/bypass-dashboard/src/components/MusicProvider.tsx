import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { MusicTrack } from '@/types';

export const TRACKS: MusicTrack[] = [
  { id: '1', title: 'Neon Shadows', artist: 'CyberCore', genre: 'Synthwave', duration: '3:45', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300' },
  { id: '2', title: 'Data Stream', artist: 'Hax0r', genre: 'Phonk', duration: '4:20', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300' },
  { id: '3', title: 'Mainframe Breach', artist: 'ZeroDay', genre: 'Cyberpunk', duration: '2:50', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300' },
  { id: '4', title: 'Lost in the Grid', artist: 'Anon', genre: 'Ambient', duration: '5:10', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cover: 'https://images.unsplash.com/photo-1534081333815-ae5019a08e5e?auto=format&fit=crop&q=80&w=300' },
  { id: '5', title: 'Rogue Protocol', artist: 'SysAdmin', genre: 'Electronic', duration: '3:15', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300' },
];

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  seek: (p: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  queue: MusicTrack[];
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(() => Number(localStorage.getItem('bypass-volume') || '0.5'));
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;
    
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => nextTrack();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const playTrack = (track: MusicTrack) => {
    if (audioRef.current) {
      if (currentTrack?.id === track.id) {
        togglePlay();
        return;
      }
      audioRef.current.src = track.src;
      audioRef.current.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
    localStorage.setItem('bypass-volume', v.toString());
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    const next = TRACKS[(idx + 1) % TRACKS.length];
    playTrack(next);
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    const prev = TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length];
    playTrack(prev);
  };

  return (
    <MusicContext.Provider value={{
      currentTrack, isPlaying, volume, progress, duration,
      playTrack, togglePlay, setVolume, seek, nextTrack, prevTrack, queue: TRACKS
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
};
