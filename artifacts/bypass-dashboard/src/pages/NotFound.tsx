import React from 'react';
import { Terminal, Home } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-in fade-in zoom-in-95">
      <div className="relative">
        <h1 className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 leading-none tracking-tighter">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center blur-lg opacity-50 text-[120px] font-black text-primary mix-blend-screen pointer-events-none">
          404
        </div>
      </div>
      
      <div className="bg-black/50 border border-white/10 p-4 rounded-lg inline-flex items-center gap-3 font-mono text-sm max-w-md w-full">
        <Terminal className="w-5 h-5 text-red-500" />
        <span className="text-red-500">ERR_RESOURCE_NOT_FOUND</span>
      </div>

      <p className="text-white/60 font-mono max-w-md mx-auto">
        The sector you're trying to access does not exist or has been wiped from the database.
      </p>

      <Link href="/" className="glow-btn bg-white text-black px-8 py-4 rounded-md font-bold uppercase tracking-wider text-sm flex items-center gap-3 mt-8 hover:scale-105 transition-transform">
        <Home className="w-5 h-5" /> Return to Base
      </Link>
    </div>
  );
}
