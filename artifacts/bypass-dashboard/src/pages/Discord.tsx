import React from 'react';
import { useGetMe, useLogout, getGetMeQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, LogOut, Disc, MessageSquare, ExternalLink, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { BOT_INVITE_URL } from '@/lib/constants';

export default function Discord() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.setQueryData(getGetMeQueryKey(), null);
        toast.success('Logged out successfully');
      },
    },
  });

  const handleLogin = () => {
    window.location.href = '/api/auth/discord';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 p-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_30px_var(--primary-glow)]">
          <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">Discord Auth</h1>
        <p className="text-white/60 font-mono text-xs sm:text-sm leading-relaxed">
          Login with your Discord account to access user‑specific features and manage your bot settings.
        </p>

        <button
          onClick={handleLogin}
          className="touch-target glow-btn bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center gap-3 transition-colors w-full justify-center"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> Login with Discord
        </button>

        <div className="w-full border-t border-white/10 pt-4">
          <p className="text-white/30 text-xs font-mono uppercase mb-3">Or add the bot to your server</p>
          <a
            href={BOT_INVITE_URL}
            target="_blank"
            rel="noreferrer"
            className="touch-target glass-panel border border-white/10 hover:border-primary/40 text-white px-6 py-3 rounded-md font-bold uppercase tracking-wider text-xs flex items-center gap-3 transition-colors w-full justify-center hover:bg-white/5"
          >
            <Plus className="w-4 h-4" /> Add Bot to Server
          </a>
        </div>
      </div>
    );
  }

  // Build Discord CDN avatar URL
  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
    : `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`;

  const bannerUrl = user.banner
    ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${user.banner.startsWith('a_') ? 'gif' : 'png'}?size=600`
    : null;

  // Derive account creation date from Discord snowflake ID
  const createdAt = user.id
    ? new Date(Number(BigInt(user.id) >> 22n) + 1420070400000)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">User Profile</h1>
        <div className="flex items-center gap-2">
          <a
            href={BOT_INVITE_URL}
            target="_blank"
            rel="noreferrer"
            className="touch-target glass-panel px-3 sm:px-4 py-2 rounded flex items-center gap-2 text-xs sm:text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors font-bold uppercase border border-white/10"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Bot</span>
          </a>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="touch-target glass-panel border border-destructive/30 px-3 sm:px-4 py-2 rounded flex items-center gap-2 text-xs sm:text-sm text-destructive hover:bg-destructive/10 transition-colors font-bold uppercase"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{logoutMutation.isPending ? 'Logging out…' : 'Disconnect'}</span>
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-primary/20 relative">
        {/* Banner */}
        <div
          className="h-24 sm:h-32 md:h-48 w-full relative"
          style={
            bannerUrl
              ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : user.accentColor
              ? { backgroundColor: `#${user.accentColor.toString(16).padStart(6, '0')}` }
              : { background: 'linear-gradient(135deg, #ff004020, #5865F220)' }
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* Profile info */}
        <div className="px-4 sm:px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-end -mt-12 sm:-mt-16 md:-mt-20 mb-6 text-center sm:text-left">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-4 border-black bg-black object-cover shadow-[0_0_20px_rgba(0,0,0,0.8)]"
            />
            <div className="flex-1 mt-2 sm:mt-0">
              <h2 className="text-2xl sm:text-3xl font-black text-white flex flex-col sm:flex-row items-center gap-2 sm:gap-3 flex-wrap">
                {user.username}
                {user.discriminator && user.discriminator !== '0' && (
                  <span className="text-white/40 font-mono text-base font-normal">#{user.discriminator}</span>
                )}
                <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded text-[10px] font-mono uppercase tracking-wider sm:translate-y-1">
                  Verified
                </span>
              </h2>
              <p className="text-primary font-mono text-xs sm:text-sm mt-1">ID: {user.id}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left col */}
            <div className="space-y-4">
              <div className="bg-black/50 border border-white/5 rounded-lg p-4">
                <span className="text-[10px] sm:text-xs font-mono text-white/40 block uppercase mb-2">Account Created</span>
                <span className="text-xs sm:text-sm font-mono text-white">
                  {createdAt
                    ? createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Unknown'}
                </span>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-lg p-4">
                <span className="text-[10px] sm:text-xs font-mono text-white/40 block uppercase mb-2">Accent Color</span>
                <div className="flex items-center gap-3">
                  {user.accentColor != null ? (
                    <>
                      <div
                        className="w-6 h-6 rounded border border-white/20"
                        style={{ backgroundColor: `#${user.accentColor.toString(16).padStart(6, '0')}` }}
                      />
                      <span className="font-mono text-xs text-white">
                        #{user.accentColor.toString(16).padStart(6, '0').toUpperCase()}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-mono text-white/30">Not set</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right col — Guilds */}
            <div className="bg-black/50 border border-white/5 rounded-lg p-4">
              <span className="text-[10px] sm:text-xs font-mono text-white/40 block uppercase mb-3 flex items-center gap-2">
                <Disc className="w-3 h-3" /> Mutual Servers ({user.guilds?.length ?? 0})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {user.guilds && user.guilds.length > 0 ? (
                  user.guilds.map((guild) => {
                    const iconUrl = guild.icon
                      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`
                      : null;
                    return (
                      <div key={guild.id} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                        {iconUrl ? (
                          <img src={iconUrl} alt={guild.name} className="w-8 h-8 rounded-full shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {guild.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-xs sm:text-sm font-medium text-white/90 truncate flex-1">{guild.name}</span>
                        {guild.owner && (
                          <span className="text-[8px] sm:text-[10px] font-mono text-yellow-500 uppercase border border-yellow-500/30 px-1 rounded">
                            Owner
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs font-mono text-white/30">No mutual servers</p>
                    <a
                      href={BOT_INVITE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-primary text-xs font-mono hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> Invite the bot to your server
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
