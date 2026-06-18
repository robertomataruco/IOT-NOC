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
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Audio ref for alarm sound
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasUnacknowledgedAlarms, setHasUnacknowledgedAlarms] = useState(false);

  useEffect(() => {
    // Create an audio element programmatically
    audioRef.current = new Audio('/alarm.mp3'); // We'll need to assume there's a sound or use a basic beep
    audioRef.current.loop = false;
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const newTotal = json.data.devices.length + json.data.kron.length;
          const oldTotal = data.devices.length + data.kron.length;
          
          setData(json.data);
          setLastUpdate(new Date());

          // Trigger alarm if new alerts appeared
          if (newTotal > oldTotal && newTotal > 0) {
            setHasUnacknowledgedAlarms(true);
            try {
              if (audioRef.current) {
                // To avoid browser block, user might need to click once on the page to allow audio
                audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
              }
            } catch (e) {}
          } else if (newTotal === 0) {
            setHasUnacknowledgedAlarms(false);
          }
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
  }, []); // eslint-disable-line

  const acknowledge = () => {
    setHasUnacknowledgedAlarms(false);
  };

  const totalAlerts = data.devices.length + data.kron.length;
  const isHealthy = !loading && totalAlerts === 0;

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)]" onClick={acknowledge}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <ShieldAlert className={`w-8 h-8 ${totalAlerts > 0 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
            Alertas Globais (TV)
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Monitoramento centralizado de incidentes da rede e energia.</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-white">{totalAlerts}</div>
          <div className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Incidentes Ativos</div>
        </div>
      </div>

      {/* LAST UPDATE INDICATION */}
      <div className="flex items-center justify-end mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
        Última atualização: {lastUpdate.toLocaleTimeString()}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-zabbix-primary/20 border-t-zabbix-primary rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-xl font-medium animate-pulse">Sincronizando radares...</p>
        </div>
      ) : isHealthy ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-emerald-950/10 rounded-3xl border border-emerald-900/30">
          <CheckCircle2 className="w-32 h-32 text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          <h2 className="text-3xl font-black text-emerald-400 tracking-tight">SISTEMA NORMAL</h2>
          <p className="text-emerald-500/70 mt-2 text-lg">Nenhum equipamento offline ou alarmado no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* DEVICES (DAS) ALERTS */}
          {data.devices.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-red-900/30 pb-2">
                <Server className="w-5 h-5 text-red-400" />
                Equipamentos de Rede (DAS) <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{data.devices.length}</span>
              </h2>
              
              <div className="space-y-3">
                {data.devices.map(device => (
                  <div key={device.id} className="bg-gradient-to-r from-red-950/40 to-slate-900/80 border border-red-900/50 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-red-900/10">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30">
                        {device.status === 'OFFLINE' ? <WifiOff className="w-6 h-6 text-red-500" /> : <AlertTriangle className="w-6 h-6 text-yellow-500" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{device.name}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {device.city?.name} ({device.city?.state?.uf})
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="font-mono text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-900/50">
                            {device.status || (device.hasAlarm ? 'ALERTA' : 'DESCONHECIDO')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-sm flex items-center justify-end gap-1 mb-1">
                        <Clock className="w-3.5 h-3.5" /> Último contato
                      </div>
                      <div className="text-white font-mono">{device.lastSeen ? timeAgo(device.lastSeen) : 'Nunca'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KRON ALERTS */}
          {data.kron.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-yellow-900/30 pb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Medidores de Energia <span className="ml-2 bg-yellow-500 text-slate-900 font-bold text-xs px-2 py-0.5 rounded-full">{data.kron.length}</span>
              </h2>
              
              <div className="space-y-3">
                {data.kron.map(k => {
                  const hasData = k.readings && k.readings.length > 0;
                  const lastReading = hasData ? k.readings[0] : null;
                  const isOffline = !hasData || (Date.now() - new Date(lastReading.receivedAt).getTime() > 5 * 60 * 1000);
                  const badFp = lastReading && lastReading.powerFactor1 !== null && lastReading.powerFactor1 < 0.92;
                  
                  return (
                    <div key={k.id} className={`bg-gradient-to-r ${isOffline ? 'from-red-950/40' : 'from-yellow-950/40'} to-slate-900/80 border ${isOffline ? 'border-red-900/50 shadow-red-900/10' : 'border-yellow-900/50 shadow-yellow-900/10'} rounded-2xl p-5 flex items-center justify-between shadow-lg`}>
                      <div className="flex items-center gap-4">
                        <div className={`${isOffline ? 'bg-red-500/20 border-red-500/30 text-red-500' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500'} p-3 rounded-xl border`}>
                          {isOffline ? <WifiOff className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{k.name}</h3>
                          <div className="flex flex-col gap-1 text-sm">
                            <span className="text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {k.city?.name} ({k.city?.state?.uf})
                            </span>
                            <div className="flex gap-2 mt-1">
                              {isOffline && (
                                <span className="font-mono text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-900/50 text-xs font-bold">
                                  OFFLINE / SEM DADOS
                                </span>
                              )}
                              {badFp && (
                                <span className="font-mono text-yellow-400 bg-yellow-950/50 px-2 py-0.5 rounded border border-yellow-900/50 text-xs font-bold">
                                  FATOR POTÊNCIA BAIXO ({lastReading.powerFactor1.toFixed(3)})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-400 text-sm flex items-center justify-end gap-1 mb-1">
                          <Clock className="w-3.5 h-3.5" /> Última leitura
                        </div>
                        <div className="text-white font-mono">{lastReading ? timeAgo(lastReading.receivedAt) : 'Nunca'}</div>
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
        <div className="fixed inset-0 pointer-events-none border-[8px] border-red-500/50 animate-pulse z-50"></div>
      )}
    </div>
  );
}
