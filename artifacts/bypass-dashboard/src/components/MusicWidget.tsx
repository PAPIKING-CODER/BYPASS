import { useEffect } from 'react';

export function MusicWidget() {
  useEffect(() => {
    // Evita cargar el script más de una vez
    const existingScript = document.querySelector('script[src*="elfsightcdn"]');
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="elfsight-app-f9d02f8b-2aa3-4cd5-a29f-ce9ebb0463c9"
      data-elfsight-app-lazy
    />
  );
}
