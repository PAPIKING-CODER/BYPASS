import React, { useState } from 'react';
import { useGetExecutors, getGetExecutorsQueryKey } from '@workspace/api-client-react';
import { Search, Filter, AlertTriangle, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

export default function Executors() {
  const { data: executors, isLoading } = useGetExecutors({ query: { queryKey: getGetExecutorsQueryKey() } });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const tabs = ['All', 'Working', 'Updating', 'Patched'];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'working': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'updating': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'patched': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'working': return <CheckCircle2 className="w-4 h-4" />;
      case 'updating': return <Clock className="w-4 h-4" />;
      case 'patched': return <AlertTriangle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const filtered = executors?.filter(ex => {
    if (filter !== 'All' && ex.status.toLowerCase() !== filter.toLowerCase()) return false;
    if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Executors Status</h1>
        <p className="text-white/50 font-mono text-sm">Real-time status of popular Roblox exploit executors</p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="relative w-full md:max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search executors..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 font-mono text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`touch-target px-4 py-2 rounded-md text-sm font-mono font-bold tracking-wider transition-colors whitespace-nowrap ${
                filter === tab 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_10px_var(--primary-glow)]' 
                  : 'glass-panel text-white/60 hover:text-white border-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="glass-panel p-4 sm:p-6 rounded-xl border-white/5 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-white/10 rounded"></div>
                  <div className="h-3 w-16 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-white/40 font-mono">
              NO EXECUTORS MATCH CRITERIA
            </div>
          ) : (
            filtered.map((ex, i) => (
              <div key={i} className="glass-panel p-4 sm:p-6 rounded-xl border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {ex.logo ? (
                      <img src={ex.logo} alt={ex.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-black/50 border border-white/10 p-1 object-contain shrink-0" />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-xl font-black text-primary shrink-0">
                        {ex.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{ex.name}</h3>
                      <span className="text-xs font-mono text-white/40 block">{ex.platform}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-mono">Status</span>
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] sm:text-xs font-bold font-mono border ${getStatusColor(ex.status)}`}>
                      {getStatusIcon(ex.status)} {ex.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-mono">Version</span>
                    <span className="text-[10px] sm:text-xs font-mono text-white truncate max-w-[100px] text-right">{ex.version || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 uppercase tracking-wider font-mono">Updated</span>
                    <span className="text-[10px] sm:text-xs font-mono text-white/70">{new Date(ex.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
