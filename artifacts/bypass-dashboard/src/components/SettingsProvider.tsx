import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
type Accent = 'red' | 'blue' | 'purple' | 'green';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
  animations: boolean;
  setAnimations: (val: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('bypass-theme') as Theme) || 'dark'
  );
  const [accent, setAccent] = useState<Accent>(
    (localStorage.getItem('bypass-accent') as Accent) || 'red'
  );
  const [animations, setAnimations] = useState<boolean>(
    localStorage.getItem('bypass-anim') !== 'false'
  );

  useEffect(() => {
    localStorage.setItem('bypass-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bypass-accent', accent);
    document.body.className = `theme-${accent}`;
  }, [accent]);

  useEffect(() => {
    localStorage.setItem('bypass-anim', animations.toString());
  }, [animations]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme, accent, setAccent, animations, setAnimations }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
