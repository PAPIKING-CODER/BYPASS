import React from 'react';
import { useMusic } from '@/components/MusicProvider';
import { Play, Pause, Disc, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Music() {
  const { currentTrack, isPlaying, playTrack, togglePlay, queue } = useMusic();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
          <Disc className="w-8 h-8 text-primary" /> Audio Core
        </h1>
        <p className="text-white/50 font-mono text-sm">Royalty-free cyberpunk vibes for your hacking sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 flex-1">
        {/* Now Playing Giant Card */}
        <div className="lg:col-span-1 glass-panel rounded-xl border border-primary/20 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
          
          <div className="relative z-10 w-full max-w-[300px] aspect-square rounded-xl overflow-hidden mb-6 sm:mb-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 group-hover:border-primary/50 transition-colors">
            {currentTrack ? (
              <img src={currentTrack.cover} alt="Cover" className={cn("w-full h-full object-cover transition-transform duration-700", isPlaying ? "scale-105" : "scale-100")} />
            ) : (
              <div className="w-full h-full bg-black/50 flex items-center justify-center">
                <Disc className="w-20 h-20 text-white/10" />
              </div>
            )}
            
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                 <Waves className="w-16 h-16 text-primary animate-pulse" />
              </div>
            )}
          </div>

          <div className="text-center relative z-10 w-full">
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2 truncate neon-text">{currentTrack?.title || 'No Track Selected'}</h2>
            <p className="text-primary font-mono text-xs sm:text-sm mb-6">{currentTrack?.artist || '---'}</p>
            
            <button 
              onClick={currentTrack ? togglePlay : () => playTrack(queue[0])}
              className="touch-target glow-btn bg-white text-black w-full sm:w-auto px-8 sm:px-12 py-4 rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-3 mx-auto hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
              {isPlaying ? 'PAUSE SYSTEM' : 'INITIALIZE PLAYBACK'}
            </button>
          </div>
        </div>

        {/* Playlist */}
        <div className="lg:col-span-2 glass-panel rounded-xl border border-white/5 flex flex-col">
          <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-white uppercase tracking-wider">Local Database</h3>
            <span className="text-xs font-mono text-white/40">{queue.length} TRACKS</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono text-white/30 uppercase tracking-widest hidden sm:table-row">
                  <th className="pb-2 pl-4 w-12">#</th>
                  <th className="pb-2">Title</th>
                  <th className="pb-2 hidden md:table-cell">Genre</th>
                  <th className="pb-2 text-right pr-4">Duration</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((track, i) => {
                  const active = currentTrack?.id === track.id;
                  return (
                    <tr 
                      key={track.id} 
                      className={cn(
                        "group cursor-pointer transition-colors border-b border-white/5 sm:last:border-0 block sm:table-row py-3 sm:py-0 px-2 sm:px-0",
                        active ? "bg-primary/10 rounded-md sm:rounded-none" : "hover:bg-white/[0.02] rounded-md sm:rounded-none"
                      )}
                      onClick={() => playTrack(track)}
                    >
                      <td className="sm:py-3 sm:pl-4 hidden sm:table-cell">
                        {active && isPlaying ? (
                          <div className="flex gap-0.5 h-4 items-end">
                            <div className="w-1 bg-primary eq-bar h-[40%]"></div>
                            <div className="w-1 bg-primary eq-bar h-[80%]"></div>
                            <div className="w-1 bg-primary eq-bar h-[60%]"></div>
                          </div>
                        ) : (
                          <span className={cn("text-xs font-mono", active ? "text-primary" : "text-white/30 group-hover:text-white")}>
                            {(i + 1).toString().padStart(2, '0')}
                          </span>
                        )}
                      </td>
                      <td className="sm:py-3 block sm:table-cell w-full">
                        <div className="flex items-center gap-3">
                          <img src={track.cover} className="w-10 h-10 sm:w-12 sm:h-12 rounded shadow-md shrink-0" alt="" />
                          <div className="flex-1 min-w-0">
                            <div className={cn("font-bold text-sm truncate", active ? "text-primary" : "text-white")}>{track.title}</div>
                            <div className="text-[10px] sm:text-xs font-mono text-white/50 truncate flex items-center justify-between mt-0.5">
                              <span>{track.artist}</span>
                              <span className="sm:hidden">{track.duration}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 hidden md:table-cell">
                        <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/60 uppercase border border-white/10">
                          {track.genre}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right hidden sm:table-cell">
                        <span className="text-xs font-mono text-white/50">{track.duration}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
