import React, { useState } from 'react';
import { MessageCircle, HelpCircle, ChevronDown, HeartHandshake, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: "How does the bypass engine work?", a: "We use a proprietary array of proxies and decryption algorithms to extract the destination URL from common ad-links like Linkvertise, completely server-side." },
    { q: "Why is an executor marked as 'Updating'?", a: "When Roblox pushes a new client update, executors break. The 'Updating' status means the developers are currently reverse-engineering the new update." },
    { q: "Is the music player synchronized with the Discord bot?", a: "No, the dashboard audio player is local to your browser session to provide background ambiance while you work." },
    { q: "How do I add BYPASS to my server?", a: "Go to the Home page or Discord tab and click the 'Add to Discord' button. You need 'Manage Server' permissions in the target guild." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="text-center mb-8 sm:mb-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-[0_0_30px_var(--primary-glow)] border border-primary/50">
          <HeartHandshake className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mb-2 sm:mb-4">Support & Community</h1>
        <p className="text-white/60 font-mono text-xs sm:text-sm max-w-lg mx-auto">
          Need help? Found a bug? Just want to hang out? Join our networks.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Discord Card */}
        <a 
          href="https://discord.gg/nU9MNnByHH" 
          target="_blank" 
          rel="noreferrer"
          className="glass-panel p-6 sm:p-8 rounded-xl border border-[#5865F2]/30 hover:border-[#5865F2] hover:bg-[#5865F2]/5 transition-all group relative overflow-hidden flex flex-col items-center sm:items-start text-center sm:text-left"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#5865F2]/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#5865F2]/30 transition-colors" />
          <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-[#5865F2] mb-4 sm:mb-6 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide mb-2 flex items-center justify-center sm:justify-start gap-2">
            Discord Server <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h2>
          <p className="text-white/50 font-mono text-xs sm:text-sm mb-6">Join 15,000+ members. Get live support, update pings, and chat with developers.</p>
          <span className="mt-auto inline-block px-4 py-2 bg-[#5865F2] text-white font-bold text-xs uppercase rounded w-full sm:w-auto text-center">Join Network</span>
        </a>

        {/* TikTok Card */}
        <a 
          href="https://www.tiktok.com/@bensonulysess1" 
          target="_blank" 
          rel="noreferrer"
          className="glass-panel p-6 sm:p-8 rounded-xl border border-[#00f2fe]/30 hover:border-[#00f2fe] hover:bg-[#00f2fe]/5 transition-all group relative overflow-hidden flex flex-col items-center sm:items-start text-center sm:text-left"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#00f2fe]/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#00f2fe]/30 transition-colors" />
          <div className="w-10 h-10 sm:w-12 sm:h-12 mb-4 sm:mb-6 flex items-center justify-center sm:justify-start shrink-0">
            {/* Custom TikTok Icon SVG */}
            <svg viewBox="0 0 448 512" className="w-8 h-8 sm:w-10 sm:h-10 fill-current text-white group-hover:text-[#00f2fe] transition-colors" xmlns="http://www.w3.org/2000/svg">
              <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide mb-2 flex items-center justify-center sm:justify-start gap-2">
            TikTok Profile <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h2>
          <p className="text-white/50 font-mono text-xs sm:text-sm mb-6">Watch tutorials, bypass showcases, and behind-the-scenes content.</p>
          <span className="mt-auto inline-block px-4 py-2 bg-white text-black font-bold text-xs uppercase rounded w-full sm:w-auto text-center">Follow Us</span>
        </a>
      </div>

      {/* FAQ */}
      <div className="mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-white/5">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-panel border border-white/5 rounded-lg overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="touch-target w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-bold text-white text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown className={cn("w-4 h-4 sm:w-5 sm:h-5 text-white/40 transition-transform shrink-0", openFaq === i && "rotate-180")} />
              </button>
              {openFaq === i && (
                <div className="p-4 sm:p-5 pt-0 text-white/60 font-mono text-xs sm:text-sm leading-relaxed border-t border-white/5 bg-black/20 mt-2">
                  <div className="pt-3">{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
