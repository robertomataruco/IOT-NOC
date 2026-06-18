"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Server, Activity, AlertOctagon, Cpu, Globe, Loader2, MapPin, TrendingUp, History } from 'lucide-react';
import DeviceSidebar from "@/components/DeviceSidebar";

export default function SiteDashboard() {
  const { id } = useParams();
  const [city, setCity] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [traps, setTraps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  const mappedDevice = devices.find(d => d.latitude && d.longitude);

  const fetchCityData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      // 1. Buscar detalhes do site e seus dispositivos
      const resCity = await axios.get(`/api/cities/${id}`);
      if (!resCity.data.success) {
        setError("Site não encontrado.");
        return;
      }
      const currentCity = resCity.data.data;
      setCity(currentCity);
      setDevices(currentCity.devices || []);

      // 2. Buscar traps locais deste site
      const resTraps = await axios.get(`/api/traps?cityId=${id}`);
      if (resTraps.data.success) {
        setTraps(resTraps.data.data);
      }
      
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao carregar dados do site.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityData();
    const interval = setInterval(fetchCityData, 30000); // Auto-refresh a cada 30s
    return () => clearInterval(interval);
  }, [id]);

  if (loading && !city) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-10 h-10 text-zabbix-primary animate-spin" />
        <p className="text-slate-400 animate-pulse font-medium">Carregando dados do site...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-2xl border-red-500/20 text-center">
        <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado</h2>
        <p className="text-slate-400">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl transition-all">Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Site Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-zabbix-primary/10 border border-zabbix-primary/20">
          <MapPin className="w-8 h-8 text-zabbix-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{city?.name}</h1>
          <p className="text-slate-400 flex flex-wrap items-center gap-2 mt-1 uppercase text-xs font-bold tracking-widest">
            <span className="w-2 h-2 rounded-full bg-zabbix-accent"></span>
            {city?.state?.name} ({city?.state?.uf}) • {devices.length} Dispositivos
            {mappedDevice?.address && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 normal-case">{mappedDevice.address}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Dispositivos', value: devices.length, icon: Server, color: 'text-zabbix-primary', bg: 'bg-zabbix-primary/10' },
          { title: 'Traps Recebidas', value: traps.length, icon: Activity, color: 'text-zabbix-accent', bg: 'bg-zabbix-accent/10' },
          { title: 'Alarmes Ativos', value: traps.filter(t => t.severity > 0).length, icon: AlertOctagon, color: 'text-zabbix-critical', bg: 'bg-zabbix-critical/10' },
          { title: 'Sinal de Rede', value: 'Excelente', icon: Cpu, color: 'text-zabbix-warning', bg: 'bg-zabbix-warning/10' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Dispositivos List */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Dispositivos no Site</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map(device => {
              const isInactive = device.active === false;
              return (
                <div 
                  key={device.id} 
                  onClick={() => setSelectedDevice(device)}
                  className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all group ${
                    isInactive
                      ? 'bg-slate-950/40 border border-dashed border-slate-800/80 opacity-55 hover:opacity-75'
                      : 'bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/40 hover:border-zabbix-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Server className={`w-5 h-5 transition-colors ${
                      isInactive 
                        ? 'text-slate-700' 
                        : 'text-slate-500 group-hover:text-zabbix-primary'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${isInactive ? 'text-slate-500 line-through' : 'text-white'}`}>{device.name}</p>
                        {isInactive && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/20 text-red-400">Inativo</span>
                        )}
                      </div>
                      <p className={`text-[10px] font-mono ${isInactive ? 'text-slate-650' : 'text-zabbix-accent'}`}>{device.ip}</p>
                      {device.vpnUsername && !isInactive && (
                        <div className="flex items-center gap-1.5 mt-1 bg-slate-950/40 border border-slate-800/60 px-2 py-0.5 rounded-lg w-max">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            device.vpnStatus === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                          }`} />
                          <span className={`text-[9px] font-extrabold uppercase ${
                            device.vpnStatus === 'ONLINE' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            VPN: {device.vpnStatus === 'ONLINE' ? 'ON' : 'OFF'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Status</span>
                    {(() => {
                      if (isInactive) {
                        return (
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] font-bold flex items-center gap-1.5 text-red-400/80">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500/60"></div>
                              SUSPENSO
                            </span>
                          </div>
                        );
                      }

                      const deviceStatus = (device as any).status || 'ONLINE';
                      const isOnline = deviceStatus === 'ONLINE';
                      const isAlert = deviceStatus === 'ALERTA';
                      const isOffline = deviceStatus === 'OFFLINE';
                      const hasAlarm = (device as any).hasAlarm;
                      const syncError = (device as any).syncError;
                      
                      let statusColor = 'text-slate-500';
                      let dotColor = 'bg-slate-600';
                      let statusText = 'Offline';

                      if (isOffline) {
                        statusColor = 'text-red-500 font-bold';
                        dotColor = 'bg-red-500 animate-ping';
                        statusText = 'OFFLINE';
                      } else if (isAlert) {
                        statusColor = 'text-amber-400';
                        dotColor = 'bg-amber-500 animate-ping';
                        statusText = 'ALERTA DE FALHA';
                      } else if (isOnline) {
                        if (hasAlarm) {
                          statusColor = 'text-red-500';
                          dotColor = 'bg-red-500 animate-pulse';
                          statusText = 'ONLINE c/ ERROS';
                        } else {
                          statusColor = 'text-green-500';
                          dotColor = 'bg-green-500 animate-pulse';
                          statusText = 'Online';
                        }
                      }
                      
                      return (
                        <div className="flex flex-col items-end gap-0.5">
                          <span className={`text-[10px] font-bold flex items-center gap-1.5 ${statusColor}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
                            {statusText}
                          </span>
                          {isAlert && syncError && (
                            <span className="text-[8px] text-amber-400/70 max-w-[100px] text-right leading-tight" title={syncError}>
                              Falha no Sync
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
            {devices.length === 0 && (
              <p className="text-slate-500 text-sm col-span-2 text-center py-8">Nenhum dispositivo cadastrado neste site.</p>
            )}
          </div>
        </div>
        
        {/* Recent Events */}
        <div className="glass-panel rounded-2xl p-6 min-h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Eventos Recentes</h2>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {traps.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-slate-500">Nenhum evento registrado.</span>
              </div>
            ) : (
              <>
                {traps.map((trap: any) => {
                  const severityColors = ['bg-blue-500', 'bg-zabbix-warning', 'bg-orange-500', 'bg-zabbix-critical'];
                  return (
                    <div key={trap.id} className="flex items-start gap-3 p-3 rounded-lg border bg-slate-800/40 border-slate-700/50">
                      <div className={`mt-1.5 w-2 h-2 shrink-0 rounded-full ${severityColors[trap.severity] || 'bg-slate-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-white truncate">{trap.alarmName}</p>
                          <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-zabbix-primary/10 text-zabbix-primary">INTERNAL</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{trap.description}</p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {trap.device?.name || trap.deviceSerial} • {new Date(trap.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {mappedDevice && (
        <div className="glass-panel rounded-2xl p-6 mt-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-zabbix-primary" />
                Localização do Equipamento ({mappedDevice.name})
              </h2>
              {mappedDevice.address && <p className="text-sm text-slate-400 mt-1">{mappedDevice.address}</p>}
            </div>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${mappedDevice.latitude},${mappedDevice.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-zabbix-primary px-3 py-2 rounded-lg border border-slate-700 hover:border-zabbix-primary/30 transition-all font-bold w-max"
            >
              Abrir no Google Maps
            </a>
          </div>
          <div className="w-full h-[350px] rounded-xl overflow-hidden border border-slate-800/80 relative bg-slate-950">
            <iframe
              title="Site Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${mappedDevice.longitude - 0.005}%2C${mappedDevice.latitude - 0.0025}%2C${mappedDevice.longitude + 0.005}%2C${mappedDevice.latitude + 0.0025}&layer=mapnik&marker=${mappedDevice.latitude}%2C${mappedDevice.longitude}`}
            ></iframe>
          </div>
        </div>
      )}

      {selectedDevice && (
        <DeviceSidebar 
          device={selectedDevice} 
          onClose={() => setSelectedDevice(null)}
          onSync={fetchCityData}
        />
      )}
    </div>
  );
}
