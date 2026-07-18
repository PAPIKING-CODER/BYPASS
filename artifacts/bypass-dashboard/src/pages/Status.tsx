import React from 'react';
import { useGetRobloxStatus, useGetServiceStatus, getGetRobloxStatusQueryKey, getGetServiceStatusQueryKey } from '@workspace/api-client-react';
import { Server, ShieldAlert, MonitorPlay, Activity, RefreshCw } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';

export default function Status() {
  const { data: rbxStatus, isLoading: rbxLoading } = useGetRobloxStatus({ query: { queryKey: getGetRobloxStatusQueryKey() } });
  const { data: services, isLoading: srvLoading } = useGetServiceStatus({ query: { queryKey: getGetServiceStatusQueryKey() } });

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500 shadow-[0_0_8px_#00ff00]';
      case 'degraded': return 'bg-yellow-500 shadow-[0_0_8px_#eab308]';
      case 'offline': return 'bg-red-500 shadow-[0_0_8px_#ef4444]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">System Status</h1>
        <p className="text-white/50 font-mono text-sm">Real-time infrastructure health and version monitoring</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Roblox Status */}
        <div className="glass-panel p-4 sm:p-6 rounded-xl border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px]" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center shrink-0">
              <MonitorPlay className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Roblox Network</h2>
              <p className="text-xs text-primary font-mono flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Auto-sync enabled
              </p>
            </div>
          </div>

          {rbxLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded-md w-full"></div>)}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-black/50 border border-primary/30 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <div>
                  <span className="text-xs font-mono text-white/50 block mb-1 uppercase">Current Client Version</span>
                  <span className="text-2xl font-black text-white font-mono word-break break-all">{rbxStatus?.currentVersion || 'version-unknown'}</span>
                </div>
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)] animate-pulse hidden sm:block" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                  <span className="text-[10px] font-mono text-white/40 block mb-1 uppercase">Windows</span>
                  <span className="text-sm font-mono text-white/90 truncate block">{rbxStatus?.windowsVersion || 'N/A'}</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                  <span className="text-[10px] font-mono text-white/40 block mb-1 uppercase">Mac OS</span>
                  <span className="text-sm font-mono text-white/90 truncate block">{rbxStatus?.macVersion || 'N/A'}</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                  <span className="text-[10px] font-mono text-white/40 block mb-1 uppercase">Android</span>
                  <span className="text-sm font-mono text-white/90 truncate block">{rbxStatus?.androidVersion || 'N/A'}</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                  <span className="text-[10px] font-mono text-white/40 block mb-1 uppercase">iOS</span>
                  <span className="text-sm font-mono text-white/90 truncate block">{rbxStatus?.iosVersion || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-4 text-right">
                <span className="text-xs text-white/30 font-mono">Last updated: {rbxStatus?.updatedAt ? formatDate(rbxStatus.updatedAt) : 'Unknown'}</span>
              </div>
            </div>
          )}
        </div>

        {/* API Services */}
        <div className="glass-panel p-4 sm:p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Microservices</h2>
              <p className="text-xs text-white/40 font-mono">Core infrastructure health</p>
            </div>
          </div>

          {srvLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/5 rounded-md w-full"></div>)}
            </div>
          ) : (
            <div className="space-y-3">
              {services?.map((srv, i) => (
                <div key={i} className="bg-black/40 border border-white/5 rounded-lg p-3 sm:p-4 flex items-center justify-between group hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${getStatusDot(srv.status)} shrink-0`} />
                    <div>
                      <span className="font-bold text-sm text-white block">{srv.name}</span>
                      <span className="text-[10px] sm:text-xs font-mono text-white/40 block uppercase">{srv.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {srv.latency !== null && srv.latency !== undefined && (
                      <span className="text-xs font-mono text-white block">{srv.latency}ms</span>
                    )}
                    <span className="text-[10px] font-mono text-white/30 block">
                      {formatDate(srv.lastChecked)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
