"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { X, Activity, AlertCircle, CheckCircle2, History, Clock, Thermometer, Info, Server, Cpu, Link, Loader2, FileText, Printer } from "lucide-react";
interface DeviceSidebarProps {
  device: { id: string, name: string, ip: string, active?: boolean };
  onClose: () => void;
  onSync?: () => void;
}

export default function DeviceSidebar({ device, onClose, onSync }: DeviceSidebarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [realtime, setRealtime] = useState<{ 
    temperature: any[], 
    power: any[], 
    sfps: any[], 
    rfChannels: any[],
    universalInputs?: any[],
    digitalInputs?: any[],
    digitalOutputs?: any[]
  }>({ temperature: [], power: [], sfps: [], rfChannels: [] });
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [dbDevice, setDbDevice] = useState<any>(null);
  const [rawTraps, setRawTraps] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [globalOsData, setGlobalOsData] = useState<any | null>(null);
  const [showOsModal, setShowOsModal] = useState(false);
  const [osToast, setOsToast] = useState<{ osId: string; site: string; time: string } | null>(null);

  const handleGenerateGlobalOs = () => {
    const activeTraps = rawTraps.filter(t => !t.isCleared);
    if (activeTraps.length === 0) return;

    // 1. Calculate oldest timestamp and duration
    const oldestTime = Math.min(...activeTraps.map(t => new Date(t.timestamp).getTime()));
    const oldestDate = new Date(oldestTime);
    const timeDiff = Date.now() - oldestTime;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let durationString = "";
    if (daysDiff > 0) {
      durationString = `${daysDiff} dia(s) e ${hoursDiff} hora(s)`;
    } else {
      durationString = `${hoursDiff} hora(s)`;
    }

    // 2. Group alerts by name
    const alarmGroups: any[] = [];
    const groupedMap: { [key: string]: any } = {};

    activeTraps.forEach(trap => {
      const name = trap.alarmName;
      const time = new Date(trap.timestamp);
      if (!groupedMap[name]) {
        groupedMap[name] = {
          name,
          severity: trap.severity,
          description: trap.description,
          probableCause: trap.probableCause,
          handleMeasures: trap.handleMeasures,
          firstSeen: time,
          lastSeen: time,
          count: 0
        };
        alarmGroups.push(groupedMap[name]);
      }
      groupedMap[name].count += 1;
      if (time < groupedMap[name].firstSeen) groupedMap[name].firstSeen = time;
      if (time > groupedMap[name].lastSeen) groupedMap[name].lastSeen = time;
    });

    const osId = `OS-2026-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const newOs = {
      osId,
      oldestDate: oldestDate.toISOString(),
      durationString,
      alarmGroups: alarmGroups.map(g => ({
        ...g,
        firstSeen: g.firstSeen.toISOString(),
        lastSeen: g.lastSeen.toISOString()
      })),
      equipment: device.name,
      ip: device.ip,
      deviceId: device.id,
      cityId: dbDevice?.cityId || '',
      site: dbDevice?.city?.name || (deviceInfo?.site && deviceInfo.site !== "NA" ? deviceInfo.site : device.name),
      model: deviceInfo?.model || "AU",
      sn: deviceInfo?.sn || "AA2470153359"
    };

    axios.post('/api/os', newOs).catch(err => console.error("Erro ao registrar OS no banco:", err));

    const generatedData = {
      osId,
      oldestDate,
      durationString,
      alarmGroups,
      equipment: device.name,
      ip: device.ip,
      deviceId: device.id,
      cityId: dbDevice?.cityId || '',
      site: dbDevice?.city?.name || (deviceInfo?.site && deviceInfo.site !== "NA" ? deviceInfo.site : device.name),
      model: deviceInfo?.model || "AU",
      sn: deviceInfo?.sn || "AA2470153359"
    };

    setGlobalOsData(generatedData);
    setShowOsModal(false); // Don't open automatically

    setOsToast({
      osId,
      site: generatedData.site,
      time: new Date().toLocaleString('pt-BR')
    });
    setTimeout(() => setOsToast(null), 8000);
  };

  const handleSendWhatsApp = (phone: string, targetName: string) => {
    if (!globalOsData) return;
    
    const text = `*RICAS TECNOLOGIA - ORDEM DE SERVIÇO TÉCNICA*\n` +
      `*Nº OS:* ${globalOsData.osId}\n` +
      `*Status:* ABERTA (PENDENTE)\n` +
      `------------------------------------------\n` +
      `*1. EQUIPAMENTO E SITE*\n` +
      `• *Site:* ${globalOsData.site}\n` +
      `• *Equipamento:* ${globalOsData.equipment} (${globalOsData.ip})\n` +
      `• *Modelo:* ${globalOsData.model} (S/N: ${globalOsData.sn})\n` +
      `------------------------------------------\n` +
      `*2. DIAGNÓSTICO (ALERTAS ATIVOS)*\n` +
      globalOsData.alarmGroups.map((g: any) => 
        `• *Alerta:* ${g.name} (Ocorreu ${g.count}x)\n` +
        `  - *Desde:* ${g.firstSeen.toLocaleString('pt-BR')} (Há ${globalOsData.durationString})\n` +
        `  - *Ações Recomendadas:* ${g.handleMeasures ? g.handleMeasures.substring(0, 100) : "Verificar conexões"}...`
      ).join('\n') + `\n` +
      `------------------------------------------\n` +
      `*Por favor, verifique e informe o status final.*`;

    const encodedText = encodeURIComponent(text);
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`, '_blank');
  };

  const handleSendEmail = (email: string, targetName: string) => {
    if (!globalOsData) return;

    const subject = `[RICAS NOC] ORDEM DE SERVIÇO TÉCNICA - ${globalOsData.osId} - ${globalOsData.site}`;
    const body = `RICAS TECNOLOGIA - ORDEM DE SERVIÇO TÉCNICA\n` +
      `Nº OS: ${globalOsData.osId}\n` +
      `Status: ABERTA (PENDENTE)\n` +
      `Data de Emissão: ${new Date().toLocaleString('pt-BR')}\n\n` +
      `1. INFORMAÇÕES DO SITE E EQUIPAMENTO\n` +
      `==========================================\n` +
      `Site/Local: ${globalOsData.site}\n` +
      `Equipamento: ${globalOsData.equipment}\n` +
      `Endereço IP: ${globalOsData.ip}\n` +
      `Modelo: ${globalOsData.model} | S/N: ${globalOsData.sn}\n\n` +
      `2. DIAGNÓSTICO DA OCORRÊNCIA\n` +
      `==========================================\n` +
      globalOsData.alarmGroups.map((g: any) => 
        `Alerta: ${g.name} (Detectado ${g.count} vez(es))\n` +
        `Desde: ${g.firstSeen.toLocaleString('pt-BR')} (Há ${globalOsData.durationString})\n` +
        `Descrição: ${g.description}\n` +
        `Ação Corretiva Recomendada:\n${g.handleMeasures}\n`
      ).join('\n') + `\n` +
      `3. RELATÓRIO DO CAMPO\n` +
      `==========================================\n` +
      `Técnico Responsável: _______________________\n` +
      `Ações executadas no local: _________________\n\n` +
      `Atenciosamente,\n` +
      `NOC - Ricas Tecnologia`;

    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const fetchData = async (force: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const dbDevRes = await axios.get(`/api/admin/devices/${device.id}`).catch(() => null);
      if (dbDevRes?.data?.success) {
        setDbDevice(dbDevRes.data.data);
      }

      if (device.active === false) {
        setError("Este dispositivo está INATIVO. Sincronismo SNMP e monitoramento estão suspensos.");
        const historyRes = await axios.get(`/api/traps?deviceId=${device.id}`);
        if (historyRes.data.success) {
          setRawTraps(historyRes.data.data);
        }
        return;
      }

      const results = await Promise.allSettled([
        axios.get(`/api/admin/devices/${device.id}/snmp${force ? '?force=true' : ''}`),
        axios.get(`/api/traps?deviceId=${device.id}`)
      ]);

      const snmpResult = results[0];
      const historyResult = results[1];

      if (snmpResult.status === 'fulfilled' && snmpResult.value.data.success) {
        const snmpData = snmpResult.value.data;
        setMetrics(snmpData.metrics);
        if (snmpData.realtime) {
          setRealtime({
            temperature: snmpData.realtime.temperature || [],
            power: snmpData.realtime.power || [],
            sfps: snmpData.realtime.sfps || [],
            rfChannels: snmpData.realtime.rfChannels || [],
            universalInputs: snmpData.realtime.universalInputs || [],
            digitalInputs: snmpData.realtime.digitalInputs || [],
            digitalOutputs: snmpData.realtime.digitalOutputs || []
          });
        }
        if (snmpData.deviceInfo) {
          setDeviceInfo(snmpData.deviceInfo);
        }
      } else {
        const reason = snmpResult.status === 'rejected' ? snmpResult.reason : null;
        const errMsg = reason?.response?.data?.error || reason?.message || "Equipamento inalcançável (Timeout SNMP)";
        setError(errMsg);
        console.warn("Falha ao obter dados SNMP do equipamento:", errMsg);
      }

      if (historyResult.status === 'fulfilled' && historyResult.value.data.success) {
        setRawTraps(historyResult.value.data.data);
      } else {
        console.error("Falha ao carregar histórico de alertas locais.");
      }
    } catch (err: any) {
      setError("Falha ao sincronizar dados.");
    } finally {
      setLoading(false);
      router.refresh();
      onSync?.();
    }
  };


  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 300000);
    return () => clearInterval(interval);
  }, [device.id]);

  // Auxiliar para mapear índice de SFP para Letra ou Número (Porta A-F ou 1-8)
  const getSfpPortLabel = (index: number) => {
    if (index >= 1 && index <= 6) {
      return `Porta ${String.fromCharCode(64 + index)} (Óptica)`;
    }
    return `Porta ${index - 6} (Óptica)`;
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-4xl bg-slate-950/95 backdrop-blur-xl border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="flex flex-col h-full">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zabbix-primary/20 flex items-center justify-center text-zabbix-primary">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white leading-tight">{device.name}</h2>
                {(() => {
                  const currentStatus = dbDevice?.status || (device.active === false ? 'INATIVO' : 'ONLINE');
                  let badgeColors = 'bg-green-500/10 text-green-400 border-green-500/20';
                  if (currentStatus === 'OFFLINE') {
                    badgeColors = 'bg-red-500/10 text-red-400 border-red-500/20';
                  } else if (currentStatus === 'ALERTA') {
                    badgeColors = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  } else if (currentStatus === 'INATIVO') {
                    badgeColors = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                  }
                  return (
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase border rounded-md tracking-wider flex items-center gap-1.5 ${badgeColors}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        currentStatus === 'ONLINE' ? 'bg-green-500 animate-pulse' :
                        currentStatus === 'OFFLINE' ? 'bg-red-500' :
                        currentStatus === 'ALERTA' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                      }`} />
                      {currentStatus}
                    </span>
                  );
                })()}
              </div>
              <p className="text-xs text-slate-500 font-mono tracking-tighter mt-1">{device.ip}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => !loading && device.active !== false && fetchData(true)}
              disabled={loading || device.active === false}
              className={`relative overflow-hidden px-4 py-2 border font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${
                device.active === false
                ? 'bg-slate-900 text-slate-550 border-slate-800/85 cursor-not-allowed opacity-40'
                : loading 
                ? 'bg-zabbix-primary/20 text-zabbix-primary border-zabbix-primary/50 cursor-wait'
                : 'bg-zabbix-primary/10 text-zabbix-primary border-zabbix-primary/20 hover:bg-zabbix-primary hover:text-black'
              }`}
            >
              {loading && device.active !== false && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-zabbix-primary shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse w-full" />
              )}
              {loading && device.active !== false ? <Loader2 className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
              {device.active === false ? 'Suspenso' : loading ? 'Sincronizando...' : 'Sync'}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 animate-in fade-in duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 animate-pulse text-red-500" />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider">Equipamento Inalcançável</p>
                <p className="text-[11px] text-red-300/90 mt-0.5 font-medium">{error}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: Info & Realtime Metrics */}
            <div className="space-y-8">
              
              {/* Informações do Dispositivo */}
              <section>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Info className="w-3 h-3 text-blue-400" /> Informações do Equipamento
                </h3>
                {loading && !deviceInfo ? (
                  <div className="space-y-2">
                    {[1,2,3].map(i => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse"></div>)}
                  </div>
                ) : deviceInfo ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Modelo</span>
                      <span className="text-xs font-bold text-slate-200 mt-1 truncate">{deviceInfo.model}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Número de Série</span>
                      <span className="text-xs font-bold text-slate-200 mt-1 truncate">{deviceInfo.sn}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col col-span-2">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Informação do Site</span>
                      <span className="text-xs font-bold text-slate-200 mt-1 truncate">{deviceInfo.site}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Versão do Sistema</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 truncate" title={deviceInfo.systemVersion}>{deviceInfo.systemVersion}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Versão do Firmware</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 truncate" title={deviceInfo.firmwareVersion}>{deviceInfo.firmwareVersion}</span>
                    </div>
                    {/* Velocidade do Ventilador */}
                    {deviceInfo.fanSpeed && deviceInfo.fanSpeed !== "N/A" && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col col-span-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5 text-sky-400 animate-spin [animation-duration:3s]" /> Velocidade do Ventilador (FAN SPEED)
                        </span>
                        <span className="text-sm font-black text-sky-400 mt-1">
                          {deviceInfo.fanSpeed} <span className="text-[10px] font-normal text-slate-500">RPM</span>
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-slate-500">
                    Nenhuma informação disponível
                  </div>
                )}
              </section>

              {/* Módulos SFP (Portas Ópticas) */}
              {realtime.sfps && realtime.sfps.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Link className="w-3 h-3 text-cyan-400" /> Módulos Ópticos SFP (AU)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {realtime.sfps.map((s, idx) => {
                      const rx = parseFloat(s.rx);
                      const tx = parseFloat(s.tx);
                      const isRxCritical = !isNaN(rx) && (rx > 0 || rx < -15);
                      const isTxCritical = !isNaN(tx) && (tx > 5 || tx < -8);
                      
                      return (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                          <div className="flex items-center justify-between border-b border-white/5 pb-1">
                            <span className="text-[10px] font-black text-cyan-400">{getSfpPortLabel(s.index)}</span>
                            {s.temp && s.temp !== -99 && (
                              <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                                <Thermometer className="w-2.5 h-2.5 text-orange-400" /> {s.temp}°C
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-slate-500 uppercase">RX Power</span>
                              <span className={`text-xs font-black ${isRxCritical ? 'text-red-400' : 'text-slate-200'}`}>
                                {rx === -99 ? "Sem Sinal" : `${rx} dBm`}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-slate-500 uppercase">TX Power</span>
                              <span className={`text-xs font-black ${isTxCritical ? 'text-red-400' : 'text-slate-200'}`}>
                                {tx === -99 ? "Desligado" : `${tx} dBm`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* AUFR - Canais de Potência RF (DL / UL) */}
              {realtime.rfChannels && realtime.rfChannels.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Server className="w-3 h-3 text-indigo-400" /> Canais de Potência RF (AUFR)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {realtime.rfChannels.map((r, idx) => {
                      const dlVal = parseFloat(r.dl);
                      const ulVal = parseFloat(r.ul);
                      return (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5">
                          <span className="text-[10px] font-black text-indigo-400">Canal {r.channel}</span>
                          <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-1.5">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-slate-500 uppercase">DL Power</span>
                              <span className="text-xs font-black text-slate-200">
                                {dlVal === -99 ? "Inativo" : `${dlVal} dBm`}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-slate-500 uppercase">UL Power</span>
                              <span className="text-xs font-black text-slate-200">
                                {ulVal === -99 ? "Inativo" : `${ulVal} dBm`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Sensores de Temperatura */}
              <section>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Thermometer className="w-3 h-3 text-orange-400" /> Sensores de Temperatura
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {realtime.temperature.map((t, idx) => {
                    const val = parseFloat(t.value);
                    const isCritical = !isNaN(val) && val > 80;
                    const isWarning = !isNaN(val) && !isCritical && val > 65;
                    const tempColor = isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-amber-400' : 'text-slate-200';
                    const displayValue = isNaN(val) ? "N/A" : `${t.value}°C`;
                    return (
                      <div key={idx} className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[8px] font-bold text-slate-500 mb-1">{t.name.split(' ')[1] || t.name}</span>
                        <span className={`text-xs font-black ${tempColor}`}>
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* AGST Conflex Inputs & Outputs */}
              {deviceInfo?.manufacturer?.toLowerCase() === 'agst' && (
                <div className="space-y-6 border-t border-white/5 pt-6">
                  {/* Entradas Universais */}
                  {realtime.universalInputs && realtime.universalInputs.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-cyan-400" /> Entradas Universais (EUs)
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {realtime.universalInputs.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex flex-col gap-0.5 max-w-[70%]">
                              <span className="text-[9px] font-extrabold text-cyan-500 uppercase">EU {item.index}</span>
                              <span className="text-xs font-bold text-slate-200 truncate" title={item.name}>{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-350 bg-black/35 px-2 py-0.5 rounded border border-white/5">{item.value}</span>
                              <div className={`w-2 h-2 rounded-full ${item.status === 'OK' ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Entradas Digitais */}
                  {realtime.digitalInputs && realtime.digitalInputs.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Server className="w-3 h-3 text-emerald-400" /> Entradas Digitais (EDs)
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {realtime.digitalInputs.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex flex-col gap-0.5 max-w-[70%]">
                              <span className="text-[9px] font-extrabold text-emerald-500 uppercase">ED {item.index}</span>
                              <span className="text-xs font-bold text-slate-200 truncate" title={item.name}>{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-350 bg-black/35 px-2 py-0.5 rounded border border-white/5">{item.value}</span>
                              <div className={`w-2 h-2 rounded-full ${item.status === 'OK' ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Saídas Digitais */}
                  {realtime.digitalOutputs && realtime.digitalOutputs.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-purple-400" /> Saídas Digitais (SDs)
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {realtime.digitalOutputs.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex flex-col gap-0.5 max-w-[70%]">
                              <span className="text-[9px] font-extrabold text-purple-500 uppercase">SD {item.index}</span>
                              <span className="text-xs font-bold text-slate-200 truncate" title={item.name}>{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-350 bg-black/35 px-2 py-0.5 rounded border border-white/5">{item.value}</span>
                              <div className={`w-2 h-2 rounded-full ${item.status === 'OK' ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Real-time Status Grid (Alarmes via SNMP GET) */}
              <section>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-zabbix-primary" /> Status em Tempo Real
                </h3>
                {loading && metrics.length === 0 ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-12 w-full bg-white/5 rounded-xl animate-pulse"></div>)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {metrics.map((m, idx) => (
                      <div key={idx} className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">{m.name}</span>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-lg text-[9px] font-black flex items-center gap-1.5 ${
                              m.status === 'OK' ? 'text-green-500 bg-green-500/10 border border-green-500/20' : 'text-red-500 bg-red-500/10 border border-red-500/20 animate-pulse'
                            }`}>
                              {m.status === 'OK' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                              {m.status === 'OK' ? 'OK' : 'PROBLEMA'}
                            </div>
                          </div>
                        </div>
                        {m.status !== 'OK' && m.cause && (
                          <div className="mt-1 p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex flex-col gap-2">
                            <div>
                              <p className="text-[9px] font-black text-red-400 uppercase mb-0.5">Causa Provável</p>
                              <p className="text-[11px] text-slate-300 leading-relaxed">{m.cause}</p>
                            </div>
                            {m.action && (
                              <div className="pt-2 border-t border-red-500/10">
                                <p className="text-[9px] font-black text-amber-400 uppercase mb-0.5">Ação Recomendada (Técnico)</p>
                                <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">{m.action}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>

            {/* RIGHT COLUMN: DB Traps History - Consolidated O.S. Generation */}
            <div className="space-y-8">
              
              {/* Traps List from DB */}
              <section className="space-y-4">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-zabbix-warning" /> Histórico de Alertas
                  </h3>
                  {rawTraps.filter((t: any) => !t.isCleared).length > 0 && (
                    <button
                      onClick={handleGenerateGlobalOs}
                      className="px-3.5 py-1.5 bg-zabbix-primary/20 hover:bg-zabbix-primary text-zabbix-primary hover:text-black font-black text-[9px] uppercase tracking-wider rounded-xl border border-zabbix-primary/30 transition-all flex items-center gap-1.5 shadow-lg shadow-zabbix-primary/10 animate-in fade-in"
                    >
                      <FileText className="w-3.5 h-3.5" /> Gerar O.S. Técnica
                    </button>
                  )}
                </div>
                <div className="space-y-3 h-[700px] overflow-y-auto custom-scrollbar pr-2">
                  {loading && rawTraps.length === 0 ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 animate-pulse flex flex-col gap-3">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <div className="h-4 w-28 bg-white/10 rounded"></div>
                            <div className="h-4 w-12 bg-white/10 rounded-full"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 w-full bg-white/10 rounded"></div>
                            <div className="h-3 w-5/6 bg-white/10 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : rawTraps.length > 0 ? rawTraps.map((trap: any) => {
                    const severityColors = [
                      'text-sky-400 bg-sky-500/10 border-sky-500/20',
                      'text-zabbix-warning bg-zabbix-warning/10 border-zabbix-warning/20',
                      'text-orange-500 bg-orange-500/10 border-orange-500/20',
                      'text-zabbix-critical bg-zabbix-critical/10 border-zabbix-critical/20 animate-pulse'
                    ];
                    const severityLabels = ['Informação', 'Menor', 'Maior', 'Crítico'];
                    const colorClass = severityColors[trap.severity] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                    const severityLabel = severityLabels[trap.severity] || 'Desconhecido';

                    return (
                      <div key={trap.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white truncate max-w-[180px]" title={trap.alarmName}>
                              {trap.alarmName}
                            </span>
                            <span className="text-[9px] text-slate-500 mt-0.5">{new Date(trap.timestamp).toLocaleString('pt-BR')}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border ${colorClass}`}>
                            {severityLabel}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Descrição</span>
                            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{trap.description}</p>
                          </div>

                          {/* Localização específica para o Técnico */}
                          {trap.locationDetails && (
                            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/30 flex flex-col gap-1.5">
                              <span className="text-[8px] font-bold text-zabbix-accent uppercase tracking-wider">Localização do Problema</span>
                              <div className="flex flex-wrap gap-1.5">
                                {trap.locationDetails.moduleName && trap.locationDetails.moduleName !== "NA" && trap.locationDetails.moduleName !== "N/A" && (
                                  <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono text-blue-300">
                                    Módulo: {trap.locationDetails.moduleName}
                                  </span>
                                )}
                                {trap.locationDetails.channelId && trap.locationDetails.channelId !== "NA" && trap.locationDetails.channelId !== "N/A" && trap.locationDetails.channelId !== "0" && (
                                  <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono text-purple-300">
                                    Canal/Porta: {trap.locationDetails.channelDesc ? `${trap.locationDetails.channelDesc} ` : ""}{trap.locationDetails.channelId}
                                  </span>
                                )}
                                {trap.locationDetails.bandId && trap.locationDetails.bandId !== "NA" && trap.locationDetails.bandId !== "N/A" && trap.locationDetails.bandId !== "Geral" && trap.locationDetails.bandId !== "0" && (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-300">
                                    Frequência (Band): {trap.locationDetails.bandId}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {trap.probableCause && trap.probableCause !== 'Causa indeterminada.' && (
                            <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                              <span className="text-[8px] font-bold text-red-400 uppercase tracking-wider">Causa Provável (MIB)</span>
                              <p className="text-[10px] text-slate-300 mt-0.5 font-mono leading-relaxed">{trap.probableCause}</p>
                            </div>
                          )}
                          
                          {trap.handleMeasures && trap.handleMeasures !== 'Verificar conexões físicas do equipamento.' && (
                            <div className="p-2 rounded-xl bg-zabbix-primary/5 border border-zabbix-primary/10">
                              <span className="text-[8px] font-bold text-zabbix-primary uppercase tracking-wider">Ação Corretiva Recomendada</span>
                              <p className="text-[10.5px] text-slate-200 mt-1 leading-relaxed whitespace-pre-line font-medium">{trap.handleMeasures}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="flex flex-col items-center justify-center h-48 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                      <CheckCircle2 className="w-8 h-8 text-green-500/50 mb-2" />
                      <p className="text-center text-xs text-slate-500">Nenhum alerta registrado no histórico do equipamento.</p>
                    </div>
                  )}
                </div>
              </section>


            </div>
          </div>
        </div>

      {/* OS Printable Modal */}
      {showOsModal && globalOsData && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 print:p-0 print:bg-white overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black print:rounded-none">
            
            {/* Modal Header (Hidden on print) */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40 print:hidden shrink-0">
              <div className="flex items-center gap-2 text-zabbix-primary">
                <FileText className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider text-xs">Ordem de Serviço Consolidada (O.S.)</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTimeout(() => {
                      window.print();
                    }, 100);
                  }}
                  className="px-4 py-2 bg-zabbix-primary text-black font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-zabbix-primary/80 transition-all"
                >
                  <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
                </button>
                <button
                  onClick={() => setShowOsModal(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* O.S. Ticket Area */}
            <div id="printable-os-area" className="p-8 space-y-6 overflow-y-auto max-h-[75vh] custom-scrollbar bg-slate-950/20 print:max-h-none print:overflow-visible print:p-0 print:bg-white">
              
              {/* OS Header */}
              <div className="flex justify-between items-start border-b border-slate-850 pb-4 print:border-slate-300">
                <div>
                  <h1 className="text-xl font-black text-white uppercase tracking-tight print:text-black">RICAS TECNOLOGIA</h1>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest print:text-slate-600">NOC - Central de Operações de Rede</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest rounded-lg print:border-slate-350 print:text-black">
                    ORDEM DE SERVIÇO TÉCNICA
                  </span>
                  <p className="text-sm font-mono font-bold text-slate-300 mt-1.5 print:text-black">
                    Nº {globalOsData.osId}
                  </p>
                </div>
              </div>

              {/* General Grid */}
              <div className="grid grid-cols-2 gap-4 border-b border-slate-850 pb-6 print:border-slate-300">
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Data de Emissão</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block print:text-black">
                    {new Date().toLocaleString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Status da OS</span>
                  <span className="text-xs font-black text-amber-400 mt-0.5 block print:text-black">
                    ABERTA (PENDENTE CHOC)
                  </span>
                </div>
              </div>

              {/* Target Site / Location */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 print:bg-slate-50 print:border-slate-200">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  1. Localização e Dados do Equipamento
                </h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Nome do Site / Local</span>
                    <span className="font-bold text-slate-200 print:text-black">
                      {globalOsData.site}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Endereço IP</span>
                    <span className="font-bold text-slate-200 font-mono print:text-black">{globalOsData.ip}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Equipamento</span>
                    <span className="font-bold text-slate-300 print:text-black">{globalOsData.equipment}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Número de Série</span>
                    <span className="font-bold text-slate-300 print:text-black">{globalOsData.sn}</span>
                  </div>
                </div>
              </div>

              {/* Grouped Diagnostics */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  2. Diagnóstico Técnico Consolidado ({globalOsData.alarmGroups.length} Ocorrências Ativas)
                </h4>
                
                {globalOsData.alarmGroups.map((g: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 print:bg-slate-50 print:border-slate-200 flex flex-col gap-3">
                    <div className="flex justify-between items-start border-b border-white/5 pb-2 print:border-slate-300">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Alerta Ativo</span>
                        <span className="font-bold text-red-400 print:text-black text-sm block mt-0.5">
                          {g.name}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black rounded-lg print:border-slate-350 print:text-black">
                        Registrado {g.count}x no Histórico
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Primeira Ocorrência</span>
                        <span className="font-semibold text-slate-300 print:text-black">
                          {g.firstSeen.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Tempo com o Problema</span>
                        <span className="font-black text-amber-400 print:text-black">
                          Há {globalOsData.durationString}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Descrição do Alerta</span>
                      <p className="text-slate-300 mt-1 leading-relaxed print:text-black">
                        {g.description}
                      </p>
                    </div>

                    {g.probableCause && g.probableCause !== 'Causa indeterminada.' && (
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Causa Provável (MIB)</span>
                        <p className="text-slate-400 mt-0.5 font-mono text-[10px] print:text-black">
                          {g.probableCause}
                        </p>
                      </div>
                    )}

                    {g.handleMeasures && (
                      <div className="p-3 bg-zabbix-primary/5 rounded-xl border border-zabbix-primary/10 print:bg-white print:border-slate-200">
                        <span className="text-[9px] font-bold text-zabbix-primary uppercase block print:text-slate-600">Ação Corretiva Recomendada</span>
                        <p className="text-slate-200 mt-1 leading-relaxed whitespace-pre-line font-medium print:text-black">
                          {g.handleMeasures}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Notifications and Dispatch Panel (Hidden on print) */}
              <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5 print:hidden">
                <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse" /> 3. Notificação Imediata de Plantão (NOC)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Technician Contacts */}
                  <div className="p-3 bg-slate-955/40 rounded-xl border border-slate-850 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Técnico de Campo (Plantão)</span>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleSendWhatsApp('5511999998888', 'Técnico')}
                        className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-bold text-[10px] uppercase rounded-lg border border-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        Enviar WhatsApp
                      </button>
                      <button
                        onClick={() => handleSendEmail('tecnico@ricastecnologia.com.br', 'Técnico')}
                        className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white font-bold text-[10px] uppercase rounded-lg border border-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        Enviar E-mail
                      </button>
                    </div>
                  </div>

                  {/* Supervisor Contacts */}
                  <div className="p-3 bg-slate-955/40 rounded-xl border border-slate-850 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supervisor do NOC</span>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleSendWhatsApp('5511988887777', 'Supervisor')}
                        className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-bold text-[10px] uppercase rounded-lg border border-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        Enviar WhatsApp
                      </button>
                      <button
                        onClick={() => handleSendEmail('supervisor@ricastecnologia.com.br', 'Supervisor')}
                        className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white font-bold text-[10px] uppercase rounded-lg border border-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        Enviar E-mail
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist Field for Technician */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 print:bg-slate-50 print:border-slate-200">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  4. Relatório do Técnico (Preenchimento no Local)
                </h4>
                <div className="grid grid-cols-1 gap-3 text-xs pt-1">
                  <div className="h-24 border border-dashed border-slate-800 rounded-xl p-3 text-slate-600 print:border-slate-300 print:text-slate-400">
                    Descreva as ações realizadas e o status final do serviço...
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-12 text-xs">
                <div className="text-center space-y-1">
                  <div className="border-t border-slate-850 w-full pt-2 print:border-slate-350" />
                  <span className="font-bold text-slate-400 print:text-black">Assinatura do Técnico</span>
                  <p className="text-[9px] text-slate-600 print:text-slate-500">Ricas Tecnologia</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="border-t border-slate-850 w-full pt-2 print:border-slate-350" />
                  <span className="font-bold text-slate-400 print:text-black">Responsável do Local</span>
                  <p className="text-[9px] text-slate-600 print:text-slate-500">Assinatura / Carimbo</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Specialized Print Styles to ensure beautiful PDF and paper printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-os-area, #printable-os-area * {
            visibility: visible !important;
          }
          #printable-os-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:bg-slate-50 {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:border-slate-200 {
            border-color: #e2e8f0 !important;
          }
          .print\\:border-slate-300 {
            border-color: #cbd5e1 !important;
          }
          .print\\:border-slate-450 {
            border-color: #94a3b8 !important;
          }
        }
      `}} />
      {/* OS Generation Toast */}
      {osToast && (
        <div className="fixed bottom-6 right-6 z-[300] w-full max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-slate-950/98 border border-emerald-500/30 rounded-2xl shadow-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-emerald-400 uppercase tracking-wide">✅ O.S. Gerada com Sucesso!</p>
                <p className="font-mono text-[10px] text-slate-400 font-bold mt-0.5">{osToast.osId}</p>
              </div>
              <button onClick={() => setOsToast(null)} className="p-1 text-slate-500 hover:text-white shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="col-span-2 bg-slate-900/80 rounded-xl p-2.5">
                <span className="block text-slate-500 font-bold uppercase tracking-wider mb-0.5">Site / Local</span>
                <span className="font-bold text-white">{osToast.site}</span>
              </div>
              <div className="col-span-2 bg-slate-900/80 rounded-xl p-2.5">
                <span className="block text-slate-500 font-bold uppercase tracking-wider mb-0.5">Data / Hora</span>
                <span className="font-bold text-white">{osToast.time}</span>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1.5">⚠️ Recomendado</p>
              <ul className="text-[10px] text-slate-300 space-y-1 list-disc list-inside">
                <li>Documente todos os acompanhamentos no módulo O.S.</li>
                <li>Atribua o técnico e registre a causa raiz</li>
                <li>Mantenha o histórico completo para SLA</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowOsModal(true)}
                className="flex-1 py-2 bg-zabbix-primary/10 hover:bg-zabbix-primary text-zabbix-primary hover:text-black border border-zabbix-primary/20 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Ver OS / Imprimir
              </button>
              <button
                onClick={() => setOsToast(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
