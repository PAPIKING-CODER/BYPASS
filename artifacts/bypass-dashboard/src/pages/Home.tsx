import React, { useState, useEffect } from 'react';
import { useGetBotStats, getGetBotStatsQueryKey } from '@workspace/api-client-react';
import { Shield, Users, Server, Zap, Copy, ExternalLink, Activity, ArrowRight, Play, Terminal, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { formatNumber } from '@/lib/utils';
import { toast } from 'sonner';
import { useMusic } from '@/components/MusicProvider';
import { BOT_INVITE_URL } from '@/lib/constants';

interface BypassResult {
  originalUrl: string;
  bypassedUrl?: string | null;
  error?: string | null;
  service?: string | null;
}

interface HistoryItem {
  id: string;
  url: string;
  bypassed: string;
  date: string;
  favorite: boolean;
}

function StatValue({ value, loading }: { value: number | null | undefined; loading: boolean }) {
  if (loading) return <div className="h-8 w-28 bg-white/10 rounded animate-pulse" />;
  if (value === null || value === undefined) {
    return <span className="text-xl font-mono text-white/30">Unavailable</span>;
  }
  return <>{formatNumber(value)}</>;
}

function UptimeValue({ seconds, loading }: { seconds: number | null | undefined; loading: boolean }) {
  if (loading) return <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />;
  if (seconds === null || seconds === undefined) {
    return <span className="text-xl font-mono text-white/30">Unavailable</span>;
  }
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return <>{`${days}d ${hours}h`}</>;
  if (hours > 0) return <>{`${hours}h ${mins}m`}</>;
  return <>{`${mins}m`}</>;
}

export default function Home() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useGetBotStats({
    query: { queryKey: getGetBotStatsQueryKey(), refetchInterval: 30_000 },
  });

  const [url, setUrl] = useState('');
  const [isBypassing, setIsBypassing] = useState(false);
  const [result, setResult] = useState<BypassResult | null>(null);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);

  const { playTrack, queue } = useMusic();

  // Load the last 4 bypass history entries from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('bypass_history');
      if (raw) setRecentHistory((JSON.parse(raw) as HistoryItem[]).slice(0, 4));
    } catch { /* ignore parse errors */ }
  }, []);

  const handleBypass = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    // Client-side URL validation
    try {
      const parsed = new URL(trimmed);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsBypassing(true);
    setResult(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);

      const response = await fetch(
        `/api/bypass/proxy?url=${encodeURIComponent(trimmed)}`,
        { signal: controller.signal, credentials: 'include' },
      );
      clearTimeout(timeoutId);

      if (response.status === 429) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        toast.error(data.error ?? 'Rate limit reached. Wait a moment and try again.');
        setResult({ originalUrl: trimmed, error: data.error ?? 'Rate limit reached.' });
        return;
      }

      const data = await response.json() as {
        success: boolean;
        bypassedUrl?: string | null;
        error?: string | null;
        service?: string | null;
      };

      if (data.success && data.bypassedUrl) {
        setResult({ originalUrl: trimmed, bypassedUrl: data.bypassedUrl, service: data.service });
        toast.success('Link bypassed successfully');

        // Persist to history
        const newItem: HistoryItem = {
          id: crypto.randomUUID(),
          url: trimmed,
          bypassed: data.bypassedUrl,
          date: new Date().toISOString(),
          favorite: false,
        };
        const existing: HistoryItem[] = (() => {
          try { return JSON.parse(localStorage.getItem('bypass_history') ?? '[]') as HistoryItem[]; }
          catch { return []; }
        })();
        const updated = [newItem, ...existing].slice(0, 50);
        localStorage.setItem('bypass_history', JSON.stringify(updated));
        setRecentHistory(updated.slice(0, 4));
      } else {
        const errMsg = data.error ?? 'Bypass failed — this link may not be supported.';
        setResult({ originalUrl: trimmed, error: errMsg });
        toast.error(errMsg);
      }
    } catch (err: unknown) {
      const isAbort = err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError');
      const msg = isAbort ? 'Request timed out. Try again.' : 'Connection failed. Check your network.';
      setResult({ originalUrl: trimmed, error: msg });
      toast.error(msg);
    } finally {
      setIsBypassing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  const statCards = [
    { label: 'Total Servers', rawValue: stats?.servers ?? null, icon: Server, color: 'text-blue-500', isUptime: false },
    { label: 'Active Users',  rawValue: stats?.users ?? null,   icon: Users,  color: 'text-green-500', isUptime: false },
    { label: 'Links Bypassed', rawValue: stats?.totalBypasses ?? null, icon: Zap, color: 'text-primary', isUptime: false },
    { label: 'Server Uptime', rawValue: stats?.uptime ?? null,  icon: Activity, color: 'text-purple-500', isUptime: true },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Hero */}
      <section className="relative glass-panel-glow rounded-xl p-4 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4 sm:mb-6">
              <Shield className="w-3 h-3" />
              <span>
                {statsLoading ? 'LOADING...' : statsError ? 'STATUS UNKNOWN' : `SYSTEM ONLINE${stats?.version ? ` v${stats.version}` : ''}`}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight uppercase leading-none">
              The Ultimate <br />
              <span className="text-gradient">Bypass Engine</span>
            </h1>
            <p className="text-white/60 mb-6 sm:mb-8 max-w-md text-base sm:text-lg">
              Instantly bypass link shorteners, ad-links, and trackers.
              Integrated directly with Discord and your favorite executors.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer" className="glow-btn bg-primary text-primary-foreground px-5 sm:px-6 py-3 rounded-md font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" /> Add to Discord
              </a>
              <Link href="/commands" className="glass-panel px-5 sm:px-6 py-3 rounded-md font-bold uppercase tracking-wider text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2">
                View Commands
              </Link>
            </div>
          </div>

          {/* Right — Quick Bypass */}
          <div className="glass-panel rounded-lg p-4 sm:p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            <h3 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2 relative z-10">
              <Terminal className="w-5 h-5 text-primary" /> QUICK BYPASS
            </h3>
            <form onSubmit={handleBypass} className="space-y-4 relative z-10">
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://linkvertise.com/..."
                required
                maxLength={2048}
                className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-primary/50 font-mono text-sm"
              />
              <button
                type="submit"
                disabled={isBypassing || !url.trim()}
                className="w-full bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest py-3 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isBypassing
                  ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Processing...</>
                  : <><Zap className="w-4 h-4" /> Initialize Bypass</>}
              </button>
            </form>

            {result && (
              <div className="mt-4 p-3 sm:p-4 bg-black/50 border border-white/10 rounded-md animate-in slide-in-from-top-2 relative z-10">
                {result.error
                  ? <div className="flex items-start gap-2 text-destructive text-sm font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{result.error}</span>
                    </div>
                  : result.bypassedUrl && (
                    <div className="space-y-2">
                      {result.service && (
                        <div className="text-xs text-white/40 uppercase font-mono">
                          Service: <span className="text-primary">{result.service}</span>
                        </div>
                      )}
                      <div className="font-mono text-green-400 text-sm break-all">{result.bypassedUrl}</div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => copyToClipboard(result.bypassedUrl!)} className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded flex items-center justify-center gap-2 transition-colors">
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                        <a href={result.bypassedUrl} target="_blank" rel="noreferrer" className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded flex items-center justify-center gap-2 transition-colors">
                          <ExternalLink className="w-3 h-3" /> Open
                        </a>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-panel p-4 md:p-6 rounded-lg border border-white/5 hover:border-primary/30 transition-colors group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-white/50 text-xs sm:text-sm font-mono uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {stat.isUptime
                ? <UptimeValue seconds={stat.rawValue} loading={statsLoading} />
                : <StatValue value={stat.rawValue} loading={statsLoading} />}
            </div>
            {statsError && !statsLoading && (
              <div className="text-[10px] text-red-400/60 font-mono mt-1">API error</div>
            )}
          </div>
        ))}
      </section>

      {/* Recent activity + audio card */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent bypass log */}
        <div className="lg:col-span-2 glass-panel rounded-lg border border-white/5 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg font-bold text-white font-mono uppercase">Recent Bypasses</h3>
            <Link href="/bypass" className="text-primary text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentHistory.length === 0 ? (
              <div className="py-8 text-center text-white/30 font-mono text-sm">
                No bypass history yet — use the bypass tool above.
              </div>
            ) : (
              recentHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-black/40 rounded border border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#00ff00] shrink-0" />
                    <span className="text-sm text-white/60 font-mono truncate max-w-[140px] sm:max-w-[250px] md:max-w-sm">
                      {item.url}
                    </span>
                  </div>
                  <span className="text-xs text-white/40 font-mono whitespace-nowrap ml-2">
                    {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audio card */}
        <div className="glass-panel rounded-lg border border-white/5 p-4 sm:p-6 relative overflow-hidden group min-h-[220px] flex flex-col justify-end">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
            style={{ backgroundImage: queue[0]?.cover ? `url(${queue[0].cover})` : undefined }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end h-full">
            <div className="mb-auto flex items-center justify-between pt-1">
              <span className="px-2 py-1 bg-white/10 backdrop-blur rounded text-[10px] font-mono text-white uppercase border border-white/10">Audio Core</span>
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="w-1 h-2 bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
            {queue[0] ? (
              <div className="mt-6">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-1 neon-text">{queue[0].title}</h4>
                <p className="text-white/60 text-sm font-mono mb-4">{queue[0].artist}</p>
                <button
                  onClick={() => playTrack(queue[0])}
                  className="touch-target w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 py-2 rounded font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all group-hover:shadow-[0_0_15px_var(--primary-glow)]"
                >
                  <Play className="w-4 h-4 fill-current" /> Initialize Playback
                </button>
              </div>
            ) : (
              <p className="text-white/30 font-mono text-sm mt-6">No tracks loaded</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
