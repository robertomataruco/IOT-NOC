"use client";

import { useState, useEffect, useRef } from "react";
import { AlertTriangle, Server, Zap, Clock, ShieldAlert, CheckCircle2, WifiOff, MapPin } from "lucide-react";

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Agora';
  if (mins < 60) return `${mins} min atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  return `${Math.floor(hrs / 24)}d atrás`;
}

export default function AlertsTVPage() {
  const [data, setData] = useState<{ devices: any[], kron: any[] }>({ devices: [], kron: [] });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Audio ref for alarm sound
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasUnacknowledgedAlarms, setHasUnacknowledgedAlarms] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Create an audio element programmatically
    audioRef.current = new Audio('/alarm.mp3');
    audioRef.current.loop = false;
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(prev => {
            const newTotal = json.data.devices.length + json.data.kron.length;
            const oldTotal = prev.devices.length + prev.kron.length;
            
            // Trigger alarm se os alertas subirem
            if (newTotal > oldTotal && newTotal > 0) {
              setHasUnacknowledgedAlarms(true);
              try {
                if (audioRef.current) {
                  audioRef.current.play().catch(e => console.log('Audio blocked', e));
                }
              } catch (e) {}
            } else if (newTotal === 0) {
              setHasUnacknowledgedAlarms(false);
            }
            return json.data;
          });
          setLastUpdate(new Date());
        }
      }
    } catch (error) {
      console.error("Failed to fetch alerts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // 30s refresh for TV
    return () => clearInterval(interval);
  }, []);

  const acknowledge = () => {
    setHasUnacknowledgedAlarms(false);
  };

  const totalAlerts = data.devices.length + data.kron.length;
  const isHealthy = !loading && totalAlerts === 0;

  if (!mounted) return null; // Previne hydration error

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 p-6 md:p-10" onClick={acknowledge}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white flex items-center gap-4">
            <ShieldAlert className={`w-10 h-10 md:w-12 md:h-12 ${totalAlerts > 0 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
            Alertas Globais (TV)
          </h1>
          <p className="text-slate-400 mt-3 text-lg md:text-xl">Monitoramento centralizado de incidentes da rede e energia.</p>
        </div>
        <div className="text-right">
          <div className="text-5xl md:text-7xl font-black text-white">{totalAlerts}</div>
          <div className="text-slate-500 text-sm md:text-base font-bold uppercase tracking-widest mt-2">Incidentes Ativos</div>
        </div>
      </div>

      {/* LAST UPDATE INDICATION */}
      <div className="flex items-center justify-end mb-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
        Última atualização: {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-4 border-zabbix-primary/20 border-t-zabbix-primary rounded-full animate-spin mb-6" />
          <p className="text-slate-400 text-2xl font-medium animate-pulse">Sincronizando radares...</p>
        </div>
      ) : isHealthy ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-emerald-950/10 rounded-3xl border border-emerald-900/30">
          <CheckCircle2 className="w-40 h-40 text-emerald-500 mb-8 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
          <h2 className="text-4xl md:text-6xl font-black text-emerald-400 tracking-tight">SISTEMA NORMAL</h2>
          <p className="text-emerald-500/70 mt-4 text-xl md:text-2xl">Nenhum equipamento offline ou alarmado no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* DEVICES (DAS) ALERTS */}
          {data.devices.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 border-b border-red-900/30 pb-3">
                <Server className="w-7 h-7 text-red-400" />
                Equipamentos de Rede (DAS) <span className="ml-2 bg-red-500 text-white text-sm px-3 py-1 rounded-full">{data.devices.length}</span>
              </h2>
              
              <div className="space-y-4">
                {data.devices.map(device => {
                  const isOffline = device.status === 'OFFLINE';
                  return (
                    <div
                      key={device.id}
                      className={`bg-gradient-to-r ${
                        isOffline 
                          ? 'from-red-950/40 to-slate-900/80 border-red-500/50 shadow-red-500/10 animate-[pulse_2s_infinite]' 
                          : 'from-amber-950/30 to-slate-900/80 border-amber-500/50 shadow-amber-500/10 animate-[pulse_3s_infinite]'
                      } border rounded-2xl p-6 flex items-center justify-between shadow-lg`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-xl border ${
                          isOffline 
                            ? 'bg-red-500/20 border-red-500/30 text-red-500 animate-pulse' 
                            : 'bg-amber-500/20 border-amber-500/30 text-amber-500'
                        }`}>
                          {isOffline ? <WifiOff className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8 animate-bounce" />}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{device.name}</h3>
                          <div className="flex items-center gap-3 text-base">
                            <span className="text-slate-400 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {device.city?.name} ({device.city?.state?.uf})
                            </span>
                            <span className="text-slate-600">•</span>
                            <div className="flex items-center gap-2">
                              {isOffline ? (
                                <span className="font-mono text-red-400 bg-red-950/50 px-3 py-1 rounded-full border border-red-500/30 animate-pulse font-extrabold text-xs flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                                  OFFLINE
                                </span>
                              ) : (
                                <>
                                  <span className="font-mono text-green-400 bg-green-950/50 px-3 py-1 rounded-full border border-green-500/30 font-bold text-xs flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    ONLINE
                                  </span>
                                  <span className="font-mono text-red-400 bg-red-950/50 px-3 py-1 rounded-full border border-red-500/40 font-extrabold text-xs flex items-center gap-1.5 animate-[pulse_1s_infinite] shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                                    ALERTA DE ERRO
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-400 text-sm flex items-center justify-end gap-1 mb-1">
                          <Clock className="w-4 h-4" /> Último contato
                        </div>
                        <div className="text-white font-mono text-lg">{device.lastSeen ? timeAgo(device.lastSeen) : 'Nunca'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* KRON ALERTS */}
          {data.kron.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 border-b border-yellow-900/30 pb-3">
                <Zap className="w-7 h-7 text-yellow-500 animate-pulse" />
                Medidores de Energia <span className="ml-2 bg-yellow-500 text-slate-900 font-bold text-sm px-3 py-1 rounded-full">{data.kron.length}</span>
              </h2>
              
              <div className="space-y-4">
                {data.kron.map(k => {
                  const hasData = k.readings && k.readings.length > 0;
                  const lastReading = hasData ? k.readings[0] : null;
                  const isOffline = !hasData || (Date.now() - new Date(lastReading.receivedAt).getTime() > 5 * 60 * 1000);
                  const badFp = lastReading && lastReading.powerFactor1 !== null && lastReading.powerFactor1 < 0.92;
                  
                  return (
                    <div
                      key={k.id}
                      className={`bg-gradient-to-r ${
                        isOffline 
                          ? 'from-red-950/40 to-slate-900/80 border-red-500/50 shadow-red-500/10 animate-[pulse_2s_infinite]' 
                          : 'from-yellow-950/30 to-slate-900/80 border-yellow-500/50 shadow-yellow-500/10 animate-[pulse_3s_infinite]'
                      } border rounded-2xl p-6 flex items-center justify-between shadow-lg`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-xl border ${
                          isOffline 
                            ? 'bg-red-500/20 border-red-500/30 text-red-500 animate-pulse' 
                            : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500'
                        }`}>
                          {isOffline ? <WifiOff className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8 animate-bounce" />}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{k.name}</h3>
                          <div className="flex flex-col gap-2 text-base">
                            <span className="text-slate-400 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {k.city?.name} ({k.city?.state?.uf})
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {isOffline ? (
                                <span className="font-mono text-red-400 bg-red-950/50 px-3 py-1 rounded-full border border-red-500/30 animate-pulse font-extrabold text-xs flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                                  OFFLINE / SEM DADOS
                                </span>
                              ) : (
                                <>
                                  <span className="font-mono text-green-400 bg-green-950/50 px-3 py-1 rounded-full border border-green-500/30 font-bold text-xs flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    ONLINE
                                  </span>
                                  {badFp && (
                                    <span className="font-mono text-yellow-400 bg-yellow-950/50 px-3 py-1 rounded-full border border-yellow-500/40 font-extrabold text-xs flex items-center gap-1.5 animate-[pulse_1.5s_infinite]">
                                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
                                      FP BAIXO ({lastReading.powerFactor1.toFixed(3)})
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-400 text-sm flex items-center justify-end gap-1 mb-1">
                          <Clock className="w-4 h-4" /> Última leitura
                        </div>
                        <div className="text-white font-mono text-lg">{lastReading ? timeAgo(lastReading.receivedAt) : 'Nunca'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}
      
      {/* Overlay to catch attention if unacknowledged alarms exist */}
      {hasUnacknowledgedAlarms && (
        <div className="fixed inset-0 pointer-events-none border-[12px] border-red-500/60 animate-pulse z-50"></div>
      )}
    </div>
  );
}
