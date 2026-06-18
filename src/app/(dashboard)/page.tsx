"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Server, Activity, AlertOctagon, Cpu, CheckCircle2, WifiOff, AlertTriangle, Zap, Clock, ShieldAlert } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Agora';
  if (mins < 60) return `${mins} min atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  return `${Math.floor(hrs / 24)}d atrás`;
}

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [hostsCount, setHostsCount] = useState(0);
  const [traps, setTraps] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<{ devices: any[], kron: any[] }>({ devices: [], kron: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user && (session.user as any).role === 'TECHNICIAN') {
      router.push('/os');
    }
  }, [session, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Busca os dispositivos locais (Novo)
        const resDevices = await axios.get('/api/admin/devices');
        if (resDevices.data.success && resDevices.data.data) {
          setHostsCount(resDevices.data.data.length);
        }

        // Busca os Traps Processados (Novo Coletor)
        const resTraps = await axios.get('/api/traps');
        if (resTraps.data.success && resTraps.data.data) {
          setTraps(resTraps.data.data);
        }

        // Busca os Alertas Globais (Ativos para a TV)
        const resAlerts = await axios.get('/api/alerts');
        if (resAlerts.data.success && resAlerts.data.data) {
          setAlerts(resAlerts.data.data);
        }
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError("Erro ao conectar com a API interna.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Dispositivos Cadastrados', value: loading ? '...' : hostsCount, icon: Server, color: 'text-zabbix-primary', bg: 'bg-zabbix-primary/10' },
          { title: 'Traps Processados', value: loading ? '...' : traps.length, icon: Activity, color: 'text-zabbix-accent', bg: 'bg-zabbix-accent/10' },
          { title: 'Uso Médio CPU', value: '45%', icon: Cpu, color: 'text-zabbix-warning', bg: 'bg-zabbix-warning/10' },
          { title: 'Alertas Ativos', value: loading ? '...' : (alerts.devices.length + alerts.kron.length), icon: AlertOctagon, color: 'text-zabbix-critical', bg: 'bg-zabbix-critical/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 flex items-start justify-between group hover:border-slate-600 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-400">{stat.title}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500">
          {error} (Verifique se o banco de dados e o coletor estão ativos).
        </div>
      )}

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 h-[480px] flex flex-col relative overflow-hidden">
          {/* Logo Marca d'água */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <img 
              src="/logo-ricas-new.png?v=8" 
              alt="Marca d'água Ricas" 
              style={{ opacity: 0.15 }}
              className="w-3/4 max-w-md object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" 
            />
          </div>

          <div className="relative z-10 flex flex-col h-full flex-1">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                Site em Alerta
              </h2>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest font-mono">
                {alerts.devices.length + alerts.kron.length} Ocorrências
              </span>
            </div>

            {/* List with internal scrollbar only */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full py-10">
                  <span className="text-zabbix-primary animate-pulse font-mono text-sm">Sincronizando alertas...</span>
                </div>
              ) : (alerts.devices.length === 0 && alerts.kron.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full py-10">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-3 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                  <h3 className="text-sm font-bold text-emerald-400">SISTEMA NORMAL</h3>
                  <p className="text-xs text-emerald-500/70 text-center mt-0.5">Nenhum equipamento offline ou alarmado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rede / DAS Column */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Server className="w-4 h-4 text-red-400" />
                      Equipamentos (Rede/DAS)
                      <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                        {alerts.devices.length}
                      </span>
                    </h3>
                    
                    {alerts.devices.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2 pl-1">Sem ocorrências de rede.</p>
                    ) : (
                      <div className="space-y-2">
                        {alerts.devices.map(device => {
                          const isOffline = device.status === 'OFFLINE';
                          return (
                            <div key={device.id} className={`p-3 rounded-xl border bg-slate-900/60 transition-all flex flex-col justify-between gap-1.5 ${isOffline ? 'border-red-500/35 shadow-[0_0_8px_rgba(239,68,68,0.05)]' : 'border-amber-500/35'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-lg ${isOffline ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                    {isOffline ? <WifiOff className="w-4 h-4 animate-pulse" /> : <AlertTriangle className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-white leading-none truncate max-w-[150px]" title={device.name}>{device.name}</h4>
                                    <span className="text-[10px] text-slate-400 mt-1 block leading-none">{device.city?.name} ({device.city?.state?.uf})</span>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${isOffline ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                  {device.status}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1 pt-1 border-t border-slate-800/40">
                                <span>Último contato</span>
                                <span className="font-mono text-slate-300 font-semibold">{device.lastSeen ? timeAgo(device.lastSeen) : 'Nunca'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* KRON Column */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
                      Medidores (Energia)
                      <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                        {alerts.kron.length}
                      </span>
                    </h3>
                    
                    {alerts.kron.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2 pl-1">Sem ocorrências de energia.</p>
                    ) : (
                      <div className="space-y-2">
                        {alerts.kron.map(k => {
                          const lastReading = k.readings?.[0];
                          const isOffline = !lastReading || (Date.now() - new Date(lastReading.receivedAt).getTime() > 5 * 60 * 1000);
                          const badFp = lastReading && lastReading.powerFactor1 !== null && lastReading.powerFactor1 < 0.92;
                          return (
                            <div key={k.id} className={`p-3 rounded-xl border bg-slate-900/60 transition-all flex flex-col justify-between gap-1.5 ${isOffline ? 'border-red-500/35 shadow-[0_0_8px_rgba(239,68,68,0.05)]' : 'border-yellow-500/35'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-lg ${isOffline ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                    {isOffline ? <WifiOff className="w-4 h-4" /> : <Zap className="w-4 h-4 animate-pulse" />}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-white leading-none truncate max-w-[150px]" title={k.name}>{k.name}</h4>
                                    <span className="text-[10px] text-slate-400 mt-1 block leading-none">{k.city?.name} ({k.city?.state?.uf})</span>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${isOffline ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                  {isOffline ? 'OFFLINE' : badFp ? 'FP BAIXO' : 'ALERTA'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1 pt-1 border-t border-slate-800/40">
                                <span>Última leitura</span>
                                <span className="font-mono text-slate-300 font-semibold">{lastReading ? timeAgo(lastReading.receivedAt) : 'Nunca'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="glass-panel rounded-2xl p-6 h-[480px] flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Últimos Eventos & Traps</h2>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {loading && traps.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-zabbix-primary animate-pulse">Sincronizando...</span>
              </div>
            ) : traps.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-slate-500">Nenhum evento ativo no momento.</span>
              </div>
            ) : (
              <>
                {/* Exibir Traps Internos */}
                {traps.map((trap: any) => {
                  const severityColors = [
                    'bg-blue-500',    // 0: Notification
                    'bg-zabbix-warning', // 1: Minor
                    'bg-orange-500',  // 2: Major
                    'bg-zabbix-critical' // 3: Critical
                  ];
                  return (
                    <div key={trap.id} className="flex items-start gap-3 p-3 rounded-lg border bg-slate-800/40 border-slate-700/50 hover:border-slate-600 transition-all">
                      <div className={`mt-1.5 w-2 h-2 shrink-0 rounded-full ${severityColors[trap.severity] || 'bg-slate-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-white truncate">{trap.alarmName}</p>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zabbix-primary/10 text-zabbix-primary uppercase tracking-tighter">INTERNAL</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5" title={trap.description}>{trap.description}</p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {trap.device?.name || trap.ctrlName || 'Desconhecido'} • {new Date(trap.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
