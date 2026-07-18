import React, { useState } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { SettingsProvider } from '@/components/SettingsProvider';
import { MusicProvider } from '@/components/MusicProvider';
import { Shell } from '@/components/layout/Shell';
import { SplashScreen } from '@/components/layout/SplashScreen';

// Pages
import Home from '@/pages/Home';
import Bypass from '@/pages/Bypass';
import Executors from '@/pages/Executors';
import Status from '@/pages/Status';
import Commands from '@/pages/Commands';
import Discord from '@/pages/Discord';
import Music from '@/pages/Music';
import Statistics from '@/pages/Statistics';
import Settings from '@/pages/Settings';
import Support from '@/pages/Support';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {!showSplash && (
        <Shell>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/bypass" component={Bypass} />
            <Route path="/executors" component={Executors} />
            <Route path="/status" component={Status} />
            <Route path="/commands" component={Commands} />
            <Route path="/discord" component={Discord} />
            <Route path="/music" component={Music} />
            <Route path="/statistics" component={Statistics} />
            <Route path="/settings" component={Settings} />
            <Route path="/support" component={Support} />
            <Route component={NotFound} />
          </Switch>
        </Shell>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <MusicProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <AppContent />
          </WouterRouter>
          <Toaster 
            theme="dark" 
            toastOptions={{
              className: 'glass-panel border-primary/20 text-white font-mono rounded-none border-l-4 border-l-primary',
            }}
          />
        </MusicProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
