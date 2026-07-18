import React, { useState, useEffect } from 'react';
import { Search, Star, Copy, Trash2, Download, ExternalLink, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface HistoryItem {
  id: string;
  url: string;
  bypassed: string;
  date: string;
  favorite: boolean;
}

export default function Bypass() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterFav, setFilterFav] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bypass_history');
    if (saved) {
      const parsed = JSON.parse(saved).map((item: any, i: number) => ({
        id: item.id || `hist-${i}-${Date.now()}`,
        url: item.url,
        bypassed: item.bypassed,
        date: item.date,
        favorite: item.favorite || false,
      }));
      setHistory(parsed);
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('bypass_history', JSON.stringify(newHistory));
  };

  const toggleFav = (id: string) => {
    saveHistory(history.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item));
  };

  const deleteItem = (id: string) => {
    saveHistory(history.filter(item => item.id !== id));
    toast.success("Record deleted");
  };

  const clearHistory = () => {
    if(confirm("Clear all history? Favorites will be kept.")) {
      saveHistory(history.filter(item => item.favorite));
      toast.success("History cleared");
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bypass_history.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Exported to JSON");
  };

  const filtered = history.filter(item => {
    if (filterFav && !item.favorite) return false;
    if (search && !item.url.toLowerCase().includes(search.toLowerCase()) && !item.bypassed.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Bypass Tool</h1>
          <p className="text-white/50 font-mono text-sm">Advanced link decryption and history</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={exportData} className="touch-target sm:h-auto glass-panel px-3 sm:px-4 py-2 rounded flex items-center justify-center gap-2 text-sm text-white/80 hover:text-white transition-colors" title="Export">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={clearHistory} className="touch-target sm:h-auto glass-panel border-destructive/30 px-3 sm:px-4 py-2 rounded flex items-center justify-center gap-2 text-sm text-destructive hover:bg-destructive/10 transition-colors" title="Clear">
            <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4 sm:p-6 border-white/5">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search URLs..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 font-mono text-sm"
            />
          </div>
          <button 
            onClick={() => setFilterFav(!filterFav)}
            className={`touch-target sm:h-auto px-4 py-2 rounded flex items-center justify-center gap-2 text-sm transition-colors border ${filterFav ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'glass-panel text-white/60 border-white/10 hover:text-white'}`}
          >
            <Star className={`w-4 h-4 ${filterFav ? 'fill-current' : ''}`} /> Favorites
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono text-white/40 uppercase tracking-wider">
                <th className="pb-3 pl-2 w-10">Fav</th>
                <th className="pb-3">Original Link</th>
                <th className="pb-3">Bypassed Result</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-white/40 font-mono text-sm">
                    NO RECORDS FOUND
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 pl-2">
                      <button onClick={() => toggleFav(item.id)} className="text-white/20 hover:text-yellow-500 transition-colors">
                        <Star className={`w-5 h-5 ${item.favorite ? 'text-yellow-500 fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="py-4 font-mono text-sm text-white/60 truncate max-w-[200px]">
                      {item.url}
                    </td>
                    <td className="py-4 font-mono text-sm text-green-400 truncate max-w-[250px]">
                      {item.bypassed}
                    </td>
                    <td className="py-4 font-mono text-xs text-white/40">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => copyText(item.bypassed)} className="p-1.5 text-white/40 hover:text-white rounded hover:bg-white/10" title="Copy">
                          <Copy className="w-4 h-4" />
                        </button>
                        <a href={item.bypassed} target="_blank" rel="noreferrer" className="p-1.5 text-white/40 hover:text-white rounded hover:bg-white/10" title="Open">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button onClick={() => deleteItem(item.id)} className="p-1.5 text-white/40 hover:text-destructive rounded hover:bg-destructive/10" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-white/40 font-mono text-sm">
              NO RECORDS FOUND
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="bg-black/40 border border-white/5 p-4 rounded-lg flex flex-col gap-3 relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs text-white/60 truncate mb-1" title={item.url}>{item.url}</div>
                    <div className="font-mono text-sm text-green-400 truncate" title={item.bypassed}>{item.bypassed}</div>
                  </div>
                  <button onClick={() => toggleFav(item.id)} className="touch-target -m-2 p-2 text-white/20 hover:text-yellow-500 transition-colors shrink-0 flex items-start justify-end">
                    <Star className={`w-5 h-5 ${item.favorite ? 'text-yellow-500 fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                  <span className="font-mono text-xs text-white/40">{new Date(item.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => copyText(item.bypassed)} className="touch-target p-2 text-white/40 hover:text-white rounded flex items-center justify-center" title="Copy">
                      <Copy className="w-4 h-4" />
                    </button>
                    <a href={item.bypassed} target="_blank" rel="noreferrer" className="touch-target p-2 text-white/40 hover:text-white rounded flex items-center justify-center" title="Open">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => deleteItem(item.id)} className="touch-target p-2 text-white/40 hover:text-destructive rounded flex items-center justify-center" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
