import React from 'react';
import { useSettings } from '@/components/SettingsProvider';
import { Monitor, Palette, Zap, Volume2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { theme, setTheme, accent, setAccent, animations, setAnimations } = useSettings();

  const handleSave = () => {
    toast.success("Settings saved to local storage");
  };

  const accents = [
    { id: 'red', color: 'bg-[#ff0040]', label: 'Neon Red' },
    { id: 'blue', color: 'bg-[#0080ff]', label: 'Electric Blue' },
    { id: 'purple', color: 'bg-[#8000ff]', label: 'Cyber Purple' },
    { id: 'green', color: 'bg-[#00ff40]', label: 'Matrix Green' },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">System Config</h1>
        <p className="text-white/50 font-mono text-sm">Personalize your terminal experience</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Appearance */}
        <div className="glass-panel p-4 sm:p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-white/5">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">Appearance</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] sm:text-sm font-mono text-white/60 uppercase block mb-3">Accent Color</label>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {accents.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAccent(a.id)}
                    className={`touch-target flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all ${accent === a.id ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'}`}
                  >
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${a.color} shadow-[0_0_10px_${a.color}] shrink-0`} />
                    <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] sm:text-sm font-mono text-white/60 uppercase block mb-3">Interface Theme</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setTheme('dark')}
                  className={`touch-target flex-1 flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 rounded-lg border transition-all ${theme === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-white/60 hover:text-white'}`}
                >
                  <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm font-bold uppercase">Dark Void</span>
                </button>
                <button
                  onClick={() => { toast.error("Light mode is disabled for safety reasons."); }}
                  className="touch-target flex-1 flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 rounded-lg border border-white/5 text-white/20 cursor-not-allowed"
                >
                  <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm font-bold uppercase text-center">Light Mode (Locked)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="glass-panel p-4 sm:p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-white/5">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">Performance</h2>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-sm font-bold text-white uppercase block mb-1">Hardware Acceleration</label>
              <span className="text-[10px] sm:text-xs font-mono text-white/40 block leading-tight">Enable smooth page transitions and particle effects.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 touch-target">
              <input type="checkbox" className="sr-only peer" checked={animations} onChange={(e) => setAnimations(e.target.checked)} />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-panel p-4 sm:p-6 rounded-xl border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-red-500/20">
            <Shield className="w-5 h-5 text-red-500" />
            <h2 className="text-base sm:text-lg font-bold text-red-500 uppercase tracking-wider">Danger Zone</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-sm font-bold text-white block mb-1">Factory Reset</label>
              <span className="text-[10px] sm:text-xs font-mono text-white/40 block leading-tight">Clear all local data including bypass history and settings.</span>
            </div>
            <button 
              onClick={() => { if(confirm("Are you sure?")) { localStorage.clear(); window.location.reload(); } }}
              className="touch-target w-full sm:w-auto bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded text-xs sm:text-sm font-bold uppercase transition-colors shrink-0"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleSave} className="touch-target glow-btn bg-white text-black w-full sm:w-auto px-8 py-3 sm:py-4 rounded font-bold uppercase tracking-wider text-xs sm:text-sm transition-transform hover:scale-105">
          Save Configuration
        </button>
      </div>
    </div>
  );
}
