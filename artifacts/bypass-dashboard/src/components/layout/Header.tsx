import React, { useState, useEffect } from 'react';
import { Menu, Bell, Download } from 'lucide-react';
import { useLocation } from 'wouter';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PAGE_TITLES: Record<string, string> = {
  '/':           'Command Center',
  '/bypass':     'Bypass Tool',
  '/executors':  'Executors',
  '/status':     'Status',
  '/commands':   'Commands',
  '/discord':    'Discord Auth',
  '/music':      'Music Player',
  '/statistics': 'Statistics',
  '/settings':   'Settings',
  '/support':    'Support',
};

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [location] = useLocation();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const pageTitle = PAGE_TITLES[location] ?? location.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? 'Dashboard';

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Detect if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

  return (
    <header className="h-14 sm:h-16 border-b border-white/5 glass-panel sticky top-0 z-30 flex items-center justify-between px-3 sm:px-4 lg:px-8">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden p-2 text-white/60 hover:text-white rounded-md hover:bg-white/5 transition-colors touch-target shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm sm:text-base lg:text-lg font-bold font-mono tracking-wide text-white uppercase flex items-center gap-2 truncate">
          <span className="text-primary shrink-0">&gt;</span>
          <span className="truncate">{pageTitle}</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* PWA install button — only show when installable and not yet installed */}
        {installPrompt && !isInstalled && (
          <button
            onClick={handleInstall}
            title="Install app"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20 transition-colors"
          >
            <Download className="w-3 h-3" />
            Install App
          </button>
        )}

        {/* Notifications bell */}
        <button
          aria-label="Notifications"
          className="relative p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors touch-target"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_4px_var(--primary-glow)] border border-black" />
        </button>
      </div>
    </header>
  );
}
