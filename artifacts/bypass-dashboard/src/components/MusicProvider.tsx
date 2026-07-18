import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { MusicTrack } from '@/types';

export const TRACKS: MusicTrack[] = [
  // ── PHONK / TRAP ──────────────────────────────────────────────────────────
  {
    id: '1',
    title: 'BEATBOX',
    artist: 'Spottemgottem',
    genre: 'Phonk Trap',
    duration: '3:45',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '2',
    title: 'Death Note',
    artist: 'Ghostemane',
    genre: 'Dark Trap',
    duration: '2:49',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '3',
    title: 'Hellboy',
    artist: 'Ghostemane',
    genre: 'Dark Trap',
    duration: '2:20',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '4',
    title: 'Phonk Drive',
    artist: 'NXGHT',
    genre: 'Phonk',
    duration: '3:12',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '5',
    title: 'Rave Phonk',
    artist: 'SPLYXER',
    genre: 'Phonk Rave',
    duration: '4:05',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    cover: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '6',
    title: 'Demon Time',
    artist: 'TrapGod',
    genre: 'Trap',
    duration: '3:30',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '7',
    title: 'Slander',
    artist: 'GothBoiClique',
    genre: 'Emo Trap',
    duration: '3:55',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    cover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '8',
    title: 'Chainsaw',
    artist: 'Ghostemane',
    genre: 'Metal Trap',
    duration: '2:40',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=300',
  },

  // ── FUNK / GROOVE ─────────────────────────────────────────────────────────
  {
    id: '9',
    title: 'Electric Funk',
    artist: 'Groove Master',
    genre: 'Funk',
    duration: '4:28',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '10',
    title: 'Bass Drop Funk',
    artist: 'FunkLord',
    genre: 'Funk',
    duration: '5:10',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    cover: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '11',
    title: 'Parliament Flow',
    artist: 'FunkNation',
    genre: 'G-Funk',
    duration: '4:48',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    cover: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&q=80&w=300',
  },

  // ── CYBERPUNK / SYNTHWAVE ─────────────────────────────────────────────────
  {
    id: '12',
    title: 'Neon Grid',
    artist: 'CyberCore',
    genre: 'Synthwave',
    duration: '3:50',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '13',
    title: 'Mainframe Breach',
    artist: 'ZeroDay',
    genre: 'Cyberpunk',
    duration: '2:55',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '14',
    title: 'Data Stream',
    artist: 'Hax0r',
    genre: 'Electronic',
    duration: '4:20',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '15',
    title: 'Retrowave Nights',
    artist: 'SynthKing',
    genre: 'Retrowave',
    duration: '5:05',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    cover: 'https://images.unsplash.com/photo-1534081333815-ae5019a08e5e?auto=format&fit=crop&q=80&w=300',
  },

  // ── DARK / AMBIENT ────────────────────────────────────────────────────────
  {
    id: '16',
    title: 'Void Walker',
    artist: '$UICIDEBOY$',
    genre: 'Dark Trap',
    duration: '3:02',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: '17',
    title: 'Lost in the Grid',
    artist: 'Night Crawler',
    genre: 'Ambient',
    duration: '6:15',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
    cover: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=300',
  },
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
  const [volume, setVolumeState] = useState(() =>
    Number(localStorage.getItem('bypass-volume') || '0.5'),
  );
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // stable ref so event handlers inside useEffect can call nextTrack
  const currentTrackRef = useRef<MusicTrack | null>(null);
  currentTrackRef.current = currentTrack;

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      const cur = currentTrackRef.current;
      if (!cur) return;
      const idx = TRACKS.findIndex((t) => t.id === cur.id);
      const next = TRACKS[(idx + 1) % TRACKS.length];
      audio.src = next.src;
      audio.play();
      setCurrentTrack(next);
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTrack = (track: MusicTrack) => {
    if (!audioRef.current) return;
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }
    audioRef.current.src = track.src;
    audioRef.current.play();
    setCurrentTrack(track);
    setIsPlaying(true);
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
    const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
    playTrack(TRACKS[(idx + 1) % TRACKS.length]);
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
    playTrack(TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length]);
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack, isPlaying, volume, progress, duration,
        playTrack, togglePlay, setVolume, seek, nextTrack, prevTrack,
        queue: TRACKS,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
};
