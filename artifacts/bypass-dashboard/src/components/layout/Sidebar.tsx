import React from 'react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { LayoutDashboard, Link as LinkIcon, Box, Activity, Terminal, Disc, BarChart3, Settings, ShieldAlert, HeartHandshake, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetMe, useGetBotStats } from '@workspace/api-client-react';

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const { data: user } = useGetMe();
  const { data: stats } = useGetBotStats();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Bypass Tool', icon: LinkIcon, path: '/bypass' },
    { label: 'Executors', icon: Box, path: '/executors' },
    { label: 'Status', icon: Activity, path: '/status' },
    { label: 'Commands', icon: Terminal, path: '/commands' },
    { label: 'Music Player', icon: Disc, path: '/music' },
    { label: 'Statistics', icon: BarChart3, path: '/statistics' },
  ];

  const bottomItems = [
    { label: 'Discord Auth', icon: ShieldAlert, path: '/discord' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Support', icon: HeartHandshake, path: '/support' },
  ];

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )} 
        onClick={onClose}
      />
      <aside 
        className={cn(
          "fixed top-0 left-0 h-[100dvh] w-64 glass-panel border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 sm:p-6 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_10px_var(--primary-glow)]">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <span className="font-mono font-bold text-xl tracking-wider text-white neon-text">
            BYPASS<span className="text-primary">.OS</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3 custom-scrollbar">
          <div className="text-xs font-mono text-white/40 mb-2 px-3 tracking-widest uppercase">Core Systems</div>
          {navItems.map((item) => {
            const active = location === item.path || (item.path !== '/' && location.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path} className="block" onClick={() => onClose()}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-md transition-all duration-200 group relative overflow-hidden",
                  active ? "bg-primary/10 text-primary border border-primary/20" : "text-white/60 hover:text-white hover:bg-white/5"
                )}>
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
                  )}
                  <item.icon className={cn("w-5 h-5", active ? "text-primary drop-shadow-[0_0_5px_var(--primary-glow)]" : "group-hover:scale-110 transition-transform")} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            )
          })}

          <div className="text-xs font-mono text-white/40 mt-6 mb-2 px-3 tracking-widest uppercase">System & User</div>
          {bottomItems.map((item) => {
            const active = location === item.path;
            return (
              <Link key={item.path} href={item.path} className="block" onClick={() => onClose()}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-md transition-all duration-200 group relative overflow-hidden",
                  active ? "bg-primary/10 text-primary border border-primary/20" : "text-white/60 hover:text-white hover:bg-white/5"
                )}>
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
                  )}
                  <item.icon className={cn("w-5 h-5", active ? "text-primary" : "group-hover:scale-110 transition-transform")} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20 shrink-0">
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="Avatar" className="w-10 h-10 rounded-full border border-primary/30" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white truncate max-w-[120px]">{user.displayName}</span>
                  <span className="text-xs font-mono text-primary truncate">@{user.username}</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-white/50" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Guest User</span>
                  <span className="text-xs font-mono text-white/40">Not authenticated</span>
                </div>
              </>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-mono text-white/40">
            <span>SYS.VER: {stats?.version || '2.0.4'}</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#00ff00]"></span>
              ONLINE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
