import React, { useState } from 'react';
import { useGetCommands, getGetCommandsQueryKey } from '@workspace/api-client-react';
import { Search, ChevronDown, Terminal, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Commands() {
  const { data: commands, isLoading } = useGetCommands({ query: { queryKey: getGetCommandsQueryKey() } });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expandedCmd, setExpandedCmd] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(commands?.map(c => c.category) || []))];

  const filtered = commands?.filter(cmd => {
    if (category !== 'All' && cmd.category !== category) return false;
    if (search && !cmd.name.toLowerCase().includes(search.toLowerCase()) && !cmd.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Terminal Commands</h1>
        <p className="text-white/50 font-mono text-sm">Complete documentation for the BYPASS bot commands</p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search commands..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 font-mono text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`touch-target px-4 py-2 rounded-md text-sm font-mono font-bold tracking-wider transition-colors whitespace-nowrap ${
                category === cat 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_10px_var(--primary-glow)]' 
                  : 'glass-panel text-white/60 hover:text-white border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-white/40 font-mono">
              NO COMMANDS MATCH CRITERIA
            </div>
          ) : (
            filtered.map((cmd) => (
              <div key={cmd.name} className="glass-panel border border-white/5 rounded-lg overflow-hidden transition-all duration-200 self-start">
                <button 
                  onClick={() => setExpandedCmd(expandedCmd === cmd.name ? null : cmd.name)}
                  className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <Command className="w-5 h-5 text-primary opacity-70 shrink-0" />
                    <div className="text-left flex flex-col">
                      <span className="font-mono font-bold text-white text-sm md:text-base">/{cmd.name}</span>
                      <span className="text-white/40 font-mono text-[10px] sm:text-xs truncate max-w-[180px] sm:max-w-xs">{cmd.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/60 uppercase border border-white/10 hidden sm:inline-block">
                      {cmd.category}
                    </span>
                    <div className="touch-target flex items-center justify-center -mr-2 sm:mr-0">
                      <ChevronDown className={cn("w-5 h-5 text-white/40 transition-transform", expandedCmd === cmd.name && "rotate-180")} />
                    </div>
                  </div>
                </button>
                
                {expandedCmd === cmd.name && (
                  <div className="p-3 md:p-4 border-t border-white/5 bg-black/40 animate-in slide-in-from-top-2">
                    <p className="text-white/80 text-xs sm:text-sm mb-4 leading-relaxed">{cmd.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="text-[10px] sm:text-xs font-mono text-white/40 uppercase mb-2">Usage</h4>
                        <code className="block bg-black border border-white/10 p-2 sm:p-3 rounded font-mono text-xs sm:text-sm text-primary break-all">
                          /{cmd.usage}
                        </code>
                      </div>
                      <div>
                        <h4 className="text-[10px] sm:text-xs font-mono text-white/40 uppercase mb-2">Permissions</h4>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[10px] sm:text-xs font-mono uppercase">
                            {cmd.permissions}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {cmd.examples && cmd.examples.length > 0 && (
                      <div className="mt-4 hidden sm:block">
                        <h4 className="text-xs font-mono text-white/40 uppercase mb-2">Examples</h4>
                        <div className="space-y-2">
                          {cmd.examples.map((ex, i) => (
                            <code key={i} className="block bg-black border border-white/10 p-2 rounded font-mono text-xs text-white/80">
                              /{ex}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
