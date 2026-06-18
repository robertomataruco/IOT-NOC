"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Activity, AlertCircle, CheckCircle2, History, Clock, Thermometer, Info, Server, Cpu, Link, Loader2, FileText, Printer, Globe, Wifi, ShieldAlert, Folder, FolderOpen, ArrowLeft, ChevronRight, ChevronDown, Bell, Gauge, List, ClipboardList, UploadCloud, Trash2, Sliders, Zap, Battery } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from "recharts";

function TemperatureGauge({ value, label }: { value: number; label: string }) {
  const pct = Math.min(100, Math.max(0, value || 0)) / 100;
  const N = 28; // Número de segmentos
  const activeCount = Math.round(pct * N);

  const segments = [];
  for (let i = 0; i < N; i++) {
    const startAngle = 130 * (Math.PI / 180);
    const endAngle = 410 * (Math.PI / 180);
    const angle = startAngle + (i * (endAngle - startAngle) / (N - 1));

    const r_inner = 58;
    const r_outer = 70;

    const x1 = 100 + r_inner * Math.cos(angle);
    const y1 = 100 + r_inner * Math.sin(angle);
    const x2 = 100 + r_outer * Math.cos(angle);
    const y2 = 100 + r_outer * Math.sin(angle);

    const isActive = i < activeCount;
    
    const ratio = i / (N - 1);
    const r = Math.round(6 + (168 - 6) * ratio);
    const g = Math.round(182 + (85 - 182) * ratio);
    const b = Math.round(212 + (247 - 212) * ratio);
    const activeColor = `rgb(${r}, ${g}, ${b})`;
    const color = isActive ? activeColor : "#1e293b";

    segments.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    );
  }

  const isCritical = value > 80;
  const isWarning = value > 65 && !isCritical;
  const statusColor = isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-green-400';
  const statusText = isCritical ? 'Crítico' : isWarning ? 'Alerta' : 'Normal';

  return (
    <div className="flex flex-col items-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 shadow-xl relative overflow-hidden backdrop-blur-sm group hover:border-slate-700/60 transition-all">
      <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="52" className="fill-slate-950/95 stroke-slate-800/40" strokeWidth="1" />

        <path
          d="M 42.15 168.94 A 90 90 0 1 1 157.85 168.94"
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <path
          d="M 42.15 168.94 A 90 90 0 1 1 157.85 168.94"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 90 * 280 / 360}
          strokeDashoffset={2 * Math.PI * 90 * 280 / 360 * (1 - pct)}
          className="transition-all duration-1000 ease-out origin-center"
        />

        {segments}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">{label}</span>
        <div className="flex items-start mt-0.5">
          <span className="text-3xl font-black text-white tracking-tight">{value !== undefined ? Math.round(value) : '--'}</span>
          <span className="text-sm font-bold text-slate-400 mt-1 ml-0.5">°C</span>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-wider mt-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 ${statusColor}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}

interface DeviceMonitorClientProps {
  device: { 
    id: string;
    name: string;
    ip: string;
    vpnUsername?: string | null;
    vpnStatus?: string | null;
    vpnIp?: string | null;
    vpnLastSeen?: string | null;
    active?: boolean;
    company?: {
      name: string;
    } | null;
    city?: {
      name: string;
      state?: {
        uf: string;
      } | null;
    } | null;
  };
}

function TelemetryHistoryChart({ deviceId, hardware }: { deviceId: string; hardware: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState<string>("100");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    let active = true;
    async function loadTelemetry() {
      setLoading(true);
      setError("");
      try {
        let url = `/api/admin/devices/${deviceId}/telemetry?hardware=${hardware}&range=${range}`;
        if (range === "custom") {
          if (startDate) url += `&startDate=${startDate}`;
          if (endDate) url += `&endDate=${endDate}`;
        }
        const res = await axios.get(url);
        if (active) {
          if (res.data?.success) {
            setData(res.data.data);
          } else {
            setError("Falha ao carregar");
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Erro");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTelemetry();

    let timer: any = null;
    if (range !== "custom") {
      timer = setInterval(loadTelemetry, 30000);
    }

    return () => {
      active = false;
      if (timer) clearInterval(timer);
    };
  }, [deviceId, hardware, range, startDate, endDate]);

  const colorMap: { [key: string]: { border: string, fill: string } } = {
    dlPower: { border: "#22c55e", fill: "rgba(34,197,94,0.1)" },
    ulPower: { border: "#a855f7", fill: "rgba(168,85,247,0.1)" },
    rxPower: { border: "#06b6d4", fill: "rgba(6,182,212,0.1)" },
    txPower: { border: "#ec4899", fill: "rgba(236,72,153,0.1)" },
    temperature: { border: "#f97316", fill: "rgba(249,115,22,0.1)" },
    busVoltage: { border: "#3b82f6", fill: "rgba(59,130,246,0.1)" },
    totalLoadCurrent: { border: "#e11d48", fill: "rgba(225,29,72,0.1)" },
    batteryVoltage: { border: "#10b981", fill: "rgba(16,185,129,0.1)" },
    batteryCurrent: { border: "#f59e0b", fill: "rgba(245,158,11,0.1)" },
    batterySOC: { border: "#06b6d4", fill: "rgba(6,182,212,0.1)" },
    batteryTemp: { border: "#ec4899", fill: "rgba(236,72,153,0.1)" },
    acInputVoltage: { border: "#8b5cf6", fill: "rgba(139,92,246,0.1)" },
    rectOutputVoltage: { border: "#14b8a6", fill: "rgba(20,184,166,0.1)" },
    rectOutputCurrent: { border: "#6366f1", fill: "rgba(99,102,241,0.1)" },
    rectPower: { border: "#f43f5e", fill: "rgba(244,63,94,0.1)" }
  };

  const nameMap: { [key: string]: string } = {
    dlPower: "Downlink Power (dBm)",
    ulPower: "Uplink Power (dBm)",
    rxPower: "RX Power (dBm)",
    txPower: "TX Power (dBm)",
    temperature: "Temperature (°C)",
    busVoltage: "Tensão Barramento DC (V)",
    totalLoadCurrent: "Corrente Total da Carga (A)",
    batteryVoltage: "Tensão da Bateria (V)",
    batteryCurrent: "Corrente da Bateria (A)",
    batterySOC: "Capacidade da Bateria (SoC %)",
    batteryTemp: "Temperatura da Bateria (°C)",
    acInputVoltage: "Tensão de Entrada AC (V)",
    rectOutputVoltage: "Tensão de Saída do Retificador (V)",
    rectOutputCurrent: "Corrente de Saída do Retificador (A)",
    rectPower: "Potência dos Retificadores (kW)"
  };

  const firstRec = data[0];
  const keys = firstRec ? Object.keys(firstRec).filter(k => k !== "timestamp") : [];

  const formattedData = data.map(d => ({
    ...d,
    timeLabel: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dateLabel: new Date(d.timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit' }),
    dateTimeLabel: `${new Date(d.timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit' })} ${new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }));

  return (
    <div className="mt-6 border border-slate-800/60 bg-slate-950/60 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h4 className="text-xs font-bold text-slate-300">Histórico de Telemetria</h4>
          {loading && <Loader2 className="w-3 h-3 animate-spin text-slate-500" />}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={range}
            onChange={(e) => {
              setRange(e.target.value);
              if (e.target.value !== "custom") {
                setStartDate("");
                setEndDate("");
              }
            }}
            className="bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="100">Últimos 100 registros</option>
            <option value="today">Hoje</option>
            <option value="yesterday">Ontem</option>
            <option value="24h">Últimas 24 horas</option>
            <option value="3d">Últimos 3 dias</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="custom">Período Personalizado</option>
          </select>

          {range === "custom" && (
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500/50"
              />
              <span className="text-[10px] text-slate-500 font-bold">até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          )}
        </div>
      </div>

      <div className="h-48 w-full flex items-center justify-center">
        {loading && data.length === 0 ? (
          <div className="flex items-center justify-center text-slate-500 text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Carregando histórico...</span>
          </div>
        ) : error && data.length === 0 ? (
          <div className="flex items-center justify-center text-slate-500 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
            <span>{error}</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center text-slate-500 text-xs">
            <Info className="w-4 h-4 text-slate-500 mr-2" />
            <span>Nenhum dado histórico encontrado para o período.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {keys.map((k) => {
                  const colors = colorMap[k] || { border: "#3b82f6", fill: "rgba(59,130,246,0.1)" };
                  return (
                    <linearGradient id={`grad_${k}`} x1="0" y1="0" x2="0" y2="1" key={k}>
                      <stop offset="5%" stopColor={colors.border} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={colors.border} stopOpacity={0}/>
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis 
                dataKey="timeLabel" 
                stroke="#64748b" 
                fontSize={8} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={8} 
                tickLine={false} 
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '10px' }} 
                labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                itemStyle={{ padding: '2px 0' }}
                labelFormatter={(value, payload) => {
                  if (payload && payload[0] && payload[0].payload) {
                    return payload[0].payload.dateTimeLabel;
                  }
                  return value;
                }}
              />
              {keys.map((k) => {
                const colors = colorMap[k] || { border: "#3b82f6", fill: "rgba(59,130,246,0.1)" };
                return (
                  <Area 
                    type="monotone" 
                    dataKey={k} 
                    name={nameMap[k] || k}
                    stroke={colors.border} 
                    fillOpacity={1} 
                    fill={`url(#grad_${k})`} 
                    strokeWidth={2}
                    key={k}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function BatteryStatusCard({ telemetry }: { telemetry: any }) {
  const soc = parseFloat(telemetry.batterySOC) || 0;
  const temp = parseFloat(telemetry.batteryTemp) || 0;
  const voltage = parseFloat(telemetry.batteryVoltage) || 0;
  const current = parseFloat(telemetry.batteryCurrent) || 0;

  // Determine state of charging/discharging
  let stateText = "Flutuação";
  let stateColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (current > 0.1) {
    stateText = "Carregando";
    stateColor = "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 animate-pulse";
  } else if (current < -0.1) {
    stateText = "Descarga (Backup)";
    stateColor = "text-amber-500 bg-amber-500/10 border-amber-500/20 animate-bounce";
  }

  // Color logic for SOC
  const getSocColor = (v: number) => {
    if (v >= 80) return "text-emerald-400 stroke-emerald-500";
    if (v >= 40) return "text-amber-400 stroke-amber-500";
    return "text-red-400 stroke-red-500";
  };
  
  const getSocBarColor = (v: number) => {
    if (v >= 80) return "bg-emerald-500";
    if (v >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Battery className="w-3.5 h-3.5 text-emerald-400" /> Banco de Baterias
        </h3>
        <span className={`px-2.5 py-0.5 rounded text-[9px] font-black border uppercase ${stateColor}`}>
          {stateText}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* SOC Ring */}
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#1e293b" strokeWidth="2.5" />
            <circle 
              cx="18" 
              cy="18" 
              r="16" 
              fill="none" 
              className={`transition-all duration-1000 ease-out ${getSocColor(soc)}`} 
              strokeWidth="2.5" 
              strokeDasharray="100, 100" 
              strokeDashoffset={100 - soc}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-white tracking-tight">{Math.round(soc)}%</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase">Capacidade</span>
          </div>
        </div>

        {/* Battery Details */}
        <div className="flex-1 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold">Tensão da Bateria</span>
            <span className="font-black text-slate-200">{voltage.toFixed(2)} V</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold">Corrente da Bateria</span>
            <span className={`font-black ${current < -0.1 ? 'text-amber-400' : current > 0.1 ? 'text-cyan-400' : 'text-slate-200'}`}>
              {current.toFixed(2)} A
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold">Temperatura</span>
            <span className={`font-black ${temp > 45 ? 'text-red-400' : 'text-slate-200'}`}>{temp.toFixed(1)} °C</span>
          </div>
        </div>
      </div>

      {/* Progress Bar under for visual style */}
      <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-full h-2 overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${getSocBarColor(soc)}`} style={{ width: `${soc}%` }} />
      </div>
    </section>
  );
}

function RectifierStatusCard({ telemetry }: { telemetry: any }) {
  const inputVolts = parseFloat(telemetry.acInputVoltage) || 0;
  const outputVolts = parseFloat(telemetry.rectOutputVoltage) || 0;
  const outputCurrent = parseFloat(telemetry.rectOutputCurrent) || 0;
  const power = parseFloat(telemetry.rectPower) || 0;

  // Determine AC grid status
  const isAcDown = inputVolts < 90;
  const gridStatusText = isAcDown ? "REDE AC INDISPONÍVEL" : "REDE AC NORMAL";
  const gridStatusColor = isAcDown 
    ? "text-red-500 bg-red-500/10 border-red-500/20 animate-pulse" 
    : "text-green-500 bg-green-500/10 border-green-500/20";

  return (
    <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-yellow-400" /> Módulos Retificadores
        </h3>
        <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${gridStatusColor}`}>
          {gridStatusText}
        </span>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Tensão de Entrada (AC)</span>
            <span className={`text-base font-black ${isAcDown ? 'text-red-400' : 'text-slate-200'}`}>
              {inputVolts.toFixed(1)} VAC
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Potência Ativa</span>
            <span className="text-base font-black text-yellow-400">
              {power.toFixed(3)} kW
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950/20 border border-slate-800/80">
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Tensão de Saída (DC)</span>
            <span className="text-sm font-black text-slate-200">{outputVolts.toFixed(2)} V</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/20 border border-slate-800/80">
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Corrente de Saída (DC)</span>
            <span className="text-sm font-black text-slate-200">{outputCurrent.toFixed(2)} A</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function DCConsumptionCard({ telemetry }: { telemetry: any }) {
  const busVoltage = parseFloat(telemetry.busVoltage) || 0;
  const loadCurrent = parseFloat(telemetry.totalLoadCurrent) || 0;
  
  // Power = Voltage * Current
  const consumptionW = busVoltage * loadCurrent;

  return (
    <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Consumo de Carga (DC)
        </h3>
        <span className="px-2.5 py-0.5 rounded text-[9px] font-black bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          ATIVO
        </span>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Consumo Calculado</span>
            <span className="text-xl font-black text-cyan-400">
              {consumptionW.toFixed(1)} W
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Tensão Barramento</span>
            <span className="text-sm font-black text-slate-250">
              {busVoltage.toFixed(2)} VDC
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/80">
          <span className="text-slate-400 font-bold">Corrente Consumida pela Carga</span>
          <span className="font-black text-slate-200">{loadCurrent.toFixed(2)} A</span>
        </div>
      </div>
    </section>
  );
}

function EnergyFlowDiagram({ telemetry, alarms }: { telemetry: any; alarms: any[] }) {
  const acVolts = parseFloat(telemetry.acInputVoltage) || 0;
  const rectPower = parseFloat(telemetry.rectPower) || 0;
  const batteryCurrent = parseFloat(telemetry.batteryCurrent) || 0;
  const batterySOC = parseFloat(telemetry.batterySOC) || 0;
  const busVoltage = parseFloat(telemetry.busVoltage) || 0;
  const loadCurrent = parseFloat(telemetry.totalLoadCurrent) || 0;
  
  const isAcDown = acVolts < 90 || alarms.some(a => a.status === 'PROBLEMA' && (a.name.includes("Mains") || a.name.includes("AC")));
  const isBatteryDischarging = batteryCurrent < -0.1;
  const isBatteryCharging = batteryCurrent > 0.1;

  return (
    <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-blue-400" /> Fluxograma de Energia do Sistema
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 relative">
        
        {/* 1. AC Input Node */}
        <div className={`col-span-1 p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
          isAcDown 
            ? 'bg-red-500/10 border-red-500/30 text-red-400' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <Zap className={`w-8 h-8 mb-2 ${!isAcDown && 'animate-pulse'}`} />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Entrada AC</span>
          <span className="text-xs font-black mt-1">{acVolts.toFixed(1)} V</span>
        </div>

        {/* 2. Flow Arrow 1 */}
        <div className="col-span-1 flex items-center justify-center h-full">
          <div className="relative w-full h-2 bg-slate-950/60 rounded border border-slate-850 overflow-hidden hidden md:block">
            {!isAcDown && (
              <div className="absolute top-0 bottom-0 bg-emerald-500 animate-flow-right h-full w-12" />
            )}
          </div>
          <span className="md:hidden font-black text-slate-500 text-xs">▼</span>
        </div>

        {/* 3. Rectifiers Conversion Node */}
        <div className={`col-span-1 p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
          isAcDown 
            ? 'bg-slate-950/40 border-slate-850 text-slate-500' 
            : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
        }`}>
          <Cpu className="w-8 h-8 mb-2" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Retificador</span>
          <span className="text-xs font-black mt-1">{rectPower.toFixed(2)} kW</span>
        </div>

        {/* 4. Distribution Center Node */}
        <div className="col-span-1 flex flex-col items-center justify-center h-full relative">
          {/* Horizontal lines for flow */}
          <div className="relative w-full h-2 bg-slate-950/60 rounded border border-slate-850 overflow-hidden hidden md:block">
            <div className={`absolute top-0 bottom-0 h-full w-12 ${
              isAcDown ? 'bg-amber-500' : 'bg-emerald-500'
            } animate-flow-right`} />
          </div>
          <span className="md:hidden font-black text-slate-500 text-xs">▼</span>
        </div>

        {/* 5. Barramento DC & Load Node */}
        <div className="col-span-1 p-4 rounded-xl border bg-cyan-500/10 border-cyan-500/30 text-cyan-400 flex flex-col items-center justify-center">
          <Sliders className="w-8 h-8 mb-2" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Consumo (DC)</span>
          <span className="text-xs font-black mt-1">{(busVoltage * loadCurrent).toFixed(0)} W</span>
        </div>

        {/* 6. Bidirectional Flow to Batteries */}
        <div className="col-span-1 flex flex-col items-center justify-center h-full relative">
          <div className="text-center text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1 hidden md:block">
            {isBatteryCharging ? "Recarga" : isBatteryDischarging ? "Alimentando" : "Standby"}
          </div>
          <div className="relative w-full h-2 bg-slate-950/60 rounded border border-slate-850 overflow-hidden hidden md:block">
            {isBatteryCharging && (
              <div className="absolute top-0 bottom-0 bg-cyan-500 h-full w-12 animate-flow-right" />
            )}
            {isBatteryDischarging && (
              <div className="absolute top-0 bottom-0 bg-amber-500 h-full w-12 animate-flow-left" />
            )}
          </div>
          <span className="md:hidden font-black text-slate-500 text-xs">▼</span>
        </div>

        {/* 7. Batteries Node */}
        <div className={`col-span-1 p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
          isBatteryDischarging 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
            : isBatteryCharging 
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <Battery className={`w-8 h-8 mb-2 ${isBatteryDischarging && 'animate-pulse'}`} />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Bateria</span>
          <span className="text-xs font-black mt-1">{batterySOC.toFixed(0)}% ({batteryCurrent.toFixed(1)}A)</span>
        </div>

      </div>
    </section>
  );
}

function BatteryChargeDischargeChart({ deviceId }: { deviceId: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("24h");

  useEffect(() => {
    let active = true;
    async function loadTelemetry() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/admin/devices/${deviceId}/telemetry?hardware=fcc_energy&range=${range}`);
        if (active && res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadTelemetry();
    const timer = setInterval(loadTelemetry, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [deviceId, range]);

  const formattedData = data.map(d => {
    const current = parseFloat(d.batteryCurrent) || 0;
    return {
      timestamp: d.timestamp,
      timeLabel: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateTimeLabel: `${new Date(d.timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit' })} ${new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      current: current,
      stateLabel: current > 0.1 ? "Carregando" : current < -0.1 ? "Descarregando/Uso" : "Flutuação"
    };
  });

  const off = useMemo(() => {
    if (formattedData.length === 0) return 0.5;
    const values = formattedData.map(d => d.current);
    const max = Math.max(...values, 0.1);
    const min = Math.min(...values, -0.1);
    if (max === min) return 0.5;
    return max / (max - min);
  }, [formattedData]);

  return (
    <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-amber-500" /> Histórico de Carga e Uso da Bateria
          </h3>
          <p className="text-[9px] text-slate-400 mt-1">
            Visualização em linha. Valores <span className="text-emerald-400 font-bold">positivos (+)</span> indicam carregamento. Valores <span className="text-amber-500 font-bold">negativos (-)</span> indicam uso da bateria.
          </p>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
        >
          <option value="100">Últimos 100 registros</option>
          <option value="24h">Últimas 24 horas</option>
          <option value="3d">Últimos 3 dias</option>
          <option value="7d">Últimos 7 dias</option>
        </select>
      </div>

      <div className="h-56 w-full">
        {loading && data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span>Carregando gráfico...</span>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs">
            Nenhum registro de corrente encontrado.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="splitColorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset={off} stopColor="#f59e0b" stopOpacity={0.25} />
                </linearGradient>
                <linearGradient id="splitColorLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="#10b981" stopOpacity={1} />
                  <stop offset={off} stopColor="#f59e0b" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={8} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={8} tickLine={false} unit=" A" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '10px' }}
                labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                formatter={(value: any, name: any, props: any) => {
                  const val = parseFloat(value);
                  const state = props.payload.stateLabel;
                  return [
                    <span key="val" className={val > 0.1 ? 'text-emerald-400 font-bold' : val < -0.1 ? 'text-amber-500 font-bold' : 'text-slate-300'}>
                      {val.toFixed(2)} A ({state})
                    </span>,
                    "Corrente da Bateria"
                  ];
                }}
                labelFormatter={(label, items) => {
                  if (items && items[0] && items[0].payload) {
                    return items[0].payload.dateTimeLabel;
                  }
                  return label;
                }}
              />
              <ReferenceLine y={0} stroke="#475569" strokeWidth={1} label={{ value: "Flutuação (0 A)", fill: "#475569", fontSize: 8, position: 'right' }} />
              <Area type="monotone" dataKey="current" stroke="url(#splitColorLine)" fill="url(#splitColorArea)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

export default function DeviceMonitorClient({ device }: DeviceMonitorClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVpnMode = searchParams.get("vpn") === "true";
  const selectedHardware = device.name.startsWith("[FCC]") ? null : searchParams.get("hardware");

  // Pré-população a partir de dados em cache se existirem
  const initialSnmpData = useMemo(() => {
    if (!device.lastSnmpData) return null;
    try {
      return JSON.parse(device.lastSnmpData);
    } catch (e) {
      console.error("Falha ao ler dados em cache:", e);
      return null;
    }
  }, [device.lastSnmpData]);

  const [loading, setLoading] = useState(!initialSnmpData);
  const [innerSelectedNode, setInnerSelectedNode] = useState<string>("Channel 1");
  const [innerTreeExpanded, setInnerTreeExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"alarms" | "properties" | "statuses" | "info" | "documents" | "logs">(
    device.name.startsWith("[FCC]") ? "statuses" : "alarms"
  );
  const [alarmSubTab, setAlarmSubTab] = useState<"active" | "history" | "management">("active");

  // Reset inner sub-tab and manage active tab when selected hardware module changes
  useEffect(() => {
    if (device.name.startsWith("[FCC]")) {
      setActiveTab("statuses");
      return;
    }
    if (selectedHardware) {
      if (selectedHardware.startsWith("apoi")) {
        setInnerSelectedNode("Channel 1");
      } else {
        setInnerSelectedNode("Main");
      }
      setActiveTab("properties");
    } else {
      setActiveTab("alarms");
    }
  }, [selectedHardware, device.name]);

  // Auto-scroll to specific hardware section when clicking from the tree navigation
  useEffect(() => {
    const hw = searchParams?.get("hardware");
    if (!hw) return;

    const timer = setTimeout(() => {
      let targetId = "";
      if (hw.startsWith("apoi")) {
        targetId = "temp-section";
      } else if (hw.startsWith("au")) {
        targetId = "sfp-section";
      } else if (hw.startsWith("eu")) {
        targetId = "rf-section";
      } else if (hw.startsWith("sau")) {
        targetId = "status-section";
      } else if (hw.startsWith("sriu")) {
        targetId = "rf-section";
      }

      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("ring-2", "ring-zabbix-primary/70", "ring-offset-4", "ring-offset-slate-950");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-zabbix-primary/70", "ring-offset-4", "ring-offset-slate-950");
        }, 2500);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const [metrics, setMetrics] = useState<any[]>(initialSnmpData?.metrics || []);
  const [realtime, setRealtime] = useState<{ 
    temperature: any[], 
    power: any[], 
    sfps: any[], 
    rfChannels: any[],
    universalInputs?: any[],
    digitalInputs?: any[],
    digitalOutputs?: any[],
    fccTelemetry?: any
  }>({ 
    temperature: initialSnmpData?.realtime?.temperature || [], 
    power: initialSnmpData?.realtime?.power || [], 
    sfps: initialSnmpData?.realtime?.sfps || [], 
    rfChannels: initialSnmpData?.realtime?.rfChannels || [], 
    universalInputs: initialSnmpData?.realtime?.universalInputs || [],
    digitalInputs: initialSnmpData?.realtime?.digitalInputs || [],
    digitalOutputs: initialSnmpData?.realtime?.digitalOutputs || [],
    fccTelemetry: initialSnmpData?.realtime?.fccTelemetry || null 
  });
  const [deviceInfo, setDeviceInfo] = useState<any>(initialSnmpData?.deviceInfo || null);
  const isAgst = deviceInfo?.manufacturer?.toLowerCase() === 'agst' || 
                  device.name.toLowerCase().includes("agst") || 
                  device.name.toLowerCase().includes("conflex");
  const [rawTraps, setRawTraps] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [globalOsData, setGlobalOsData] = useState<any | null>(null);
  const [showOsModal, setShowOsModal] = useState(false);
  const [osToast, setOsToast] = useState<{ osId: string; site: string; requester: string; time: string } | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [rfChartsData, setRfChartsData] = useState<Record<number, any[]>>({});

  const calculatedAlarmGroups = useMemo(() => {
    const activeTraps = rawTraps.filter(t => !t.isCleared);
    if (activeTraps.length === 0) return [];
    const groupedMap: { [key: string]: any } = {};
    const groups: any[] = [];
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
        groups.push(groupedMap[name]);
      }
      groupedMap[name].count += 1;
      if (time < groupedMap[name].firstSeen) groupedMap[name].firstSeen = time;
      if (time > groupedMap[name].lastSeen) groupedMap[name].lastSeen = time;
    });
    return groups;
  }, [rawTraps]);

  const handleGenerateGlobalOs = () => {
    const activeTraps = rawTraps.filter(t => !t.isCleared);
    if (activeTraps.length === 0) return;

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
      cityId: (device as any).cityId || "",
      site: device.city?.name || (deviceInfo?.site && deviceInfo.site !== "NA" ? deviceInfo.site : device.name),
      model: deviceInfo?.model || "AU",
      sn: deviceInfo?.sn || "AA2470153359"
    };

    axios.post('/api/os', {
      ...newOs,
      requester: 'Operador NOC'
    }).catch(err => console.error("Erro ao registrar OS no banco:", err));

    const generatedData = {
      osId,
      oldestDate,
      durationString,
      alarmGroups,
      equipment: device.name,
      ip: device.ip,
      site: deviceInfo?.site && deviceInfo.site !== "NA" ? deviceInfo.site : device.name,
      model: deviceInfo?.model || "AU",
      sn: deviceInfo?.sn || "AA2470153359"
    };

    // Save data for optional print (via "Ver OS" button) but do NOT open the modal automatically
    setGlobalOsData(generatedData);
    setShowOsModal(false); // keep closed — user opens manually if needed

    // Show toast confirmation instead of print modal
    setOsToast({
      osId,
      site: generatedData.site,
      requester: 'Operador NOC',
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
    if (force || !deviceInfo) {
      setLoading(true);
    }
    setError(null);
    try {
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
            digitalOutputs: snmpData.realtime.digitalOutputs || [],
            fccTelemetry: snmpData.realtime.fccTelemetry || null
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
    }
  };

  useEffect(() => {
    fetchData(false);
    const interval = setInterval(() => fetchData(false), 600000);
    return () => clearInterval(interval);
  }, [device.id]);

  useEffect(() => {
    if (!realtime.temperature || realtime.temperature.length === 0) return;
    
    const baseTemps = realtime.temperature.map(t => parseFloat(t.value) || 45);
    const points = [];
    
    for (let i = 12; i >= 0; i--) {
      const time = new Date(Date.now() - i * 60 * 60 * 1000);
      const timeLabel = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const point: any = { time: timeLabel };
      realtime.temperature.forEach((t, idx) => {
        if (i === 0) {
          point[t.name] = baseTemps[idx];
        } else {
          const base = baseTemps[idx];
          const fluctuation = Math.sin((12 - i) * 0.4 + idx * 1.5) * 2.5 + (Math.random() - 0.5) * 0.5;
          point[t.name] = Math.round((base + fluctuation) * 10) / 10;
        }
      });
      points.push(point);
    }
    setChartData(points);
  }, [realtime.temperature]);

  useEffect(() => {
    if (!realtime.rfChannels || realtime.rfChannels.length === 0) return;
    
    const newChartsData: Record<number, any[]> = {};
    
    realtime.rfChannels.forEach((r) => {
      const channelId = parseInt(r.channel);
      const dlVal = parseFloat(r.dl);
      const ulVal = parseFloat(r.ul);
      
      const points = [];
      for (let i = 8; i >= 0; i--) {
        const time = new Date(Date.now() - i * 30 * 60 * 1000);
        const timeLabel = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        let dlPoint = null;
        let ulPoint = null;
        
        if (dlVal !== -99 && !isNaN(dlVal)) {
          if (i === 0) {
            dlPoint = dlVal;
          } else {
            const fluctuation = Math.sin((8 - i) * 0.6 + channelId) * 0.4 + (Math.random() - 0.5) * 0.15;
            dlPoint = Math.round((dlVal + fluctuation) * 100) / 100;
          }
        }
        
        if (ulVal !== -99 && !isNaN(ulVal)) {
          if (i === 0) {
            ulPoint = ulVal;
          } else {
            const fluctuation = Math.cos((8 - i) * 0.5 + channelId) * 0.6 + (Math.random() - 0.5) * 0.2;
            ulPoint = Math.round((ulVal + fluctuation) * 100) / 100;
          }
        }
        
        points.push({
          time: timeLabel,
          dl: dlPoint,
          ul: ulPoint
        });
      }
      newChartsData[channelId] = points;
    });
    
    setRfChartsData(newChartsData);
  }, [realtime.rfChannels]);

  const getSfpPortLabel = (index: number) => {
    if (index >= 1 && index <= 6) {
      return `Porta ${String.fromCharCode(64 + index)} (Óptica)`;
    }
    return `Porta ${index - 6} (Óptica)`;
  };

  if (isVpnMode) {
    const isOnline = device.vpnStatus === "ONLINE";
    const lastSeenStr = device.vpnLastSeen 
      ? new Date(device.vpnLastSeen).toLocaleString('pt-BR') 
      : "Não registrado";

    return (
      <div className="h-full w-full flex flex-col bg-zabbix-dark text-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-zabbix-card/40 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" /> Monitoramento de Túnel VPN
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Exibindo apenas status de conectividade do túnel para este site.
              </p>
            </div>
          </div>
          <button 
            onClick={() => router.push(`/devices/${device.id}`)}
            className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 border border-slate-700"
          >
            <Server className="w-4 h-4" /> Visualizar DAS Completo
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full">
          <div className="w-full bg-zabbix-card/50 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden backdrop-blur-md">
            
            <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${
              isOnline ? 'bg-emerald-500' : 'bg-red-500'
            }`} />

            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border shadow-inner ${
              isOnline 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-500'
            }`}>
              <Globe className={`w-10 h-10 ${isOnline ? 'animate-pulse' : ''}`} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status do Túnel</span>
              <h2 className={`text-4xl font-black tracking-tight ${
                isOnline ? 'text-emerald-400' : 'text-red-500'
              }`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </h2>
            </div>

            <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-left space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-500">Site Monitorado</span>
                <span className="text-xs font-bold text-white truncate max-w-[200px]">{device.name}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-500">Usuário VPN (Mikrotik)</span>
                <span className="text-xs font-mono font-bold text-cyan-400">{device.vpnUsername || '-'}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-500">IP Dinâmico VPN</span>
                <span className={`text-xs font-mono font-bold ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isOnline && device.vpnIp ? device.vpnIp : 'Nenhum IP atribuído'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Última Atualização</span>
                <span className="text-xs text-slate-400">{lastSeenStr}</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 max-w-sm flex items-start gap-2 text-left">
              <Info className="w-4 h-4 shrink-0 text-slate-600 mt-0.5" />
              <p className="leading-relaxed">
                Este túnel VPN é verificado automaticamente a cada 5 minutos pelo serviço de segundo plano SNMP do portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !deviceInfo) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-zabbix-dark text-slate-200 p-6">
        <div className="max-w-md w-full bg-zabbix-card border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 bg-zabbix-primary" />
          <Loader2 className="w-12 h-12 animate-spin text-zabbix-primary" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Sincronizando Dados</h2>
            <p className="text-xs text-slate-400">
              Comunicando com o equipamento via SNMP para obter as leituras mais recentes e garantir a integridade das informações...
            </p>
          </div>
          <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-zabbix-primary animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !deviceInfo) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-zabbix-dark text-slate-200 p-6">
        <div className="max-w-md w-full bg-zabbix-card border border-red-900/30 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 bg-red-500" />
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Falha de Sincronismo</h2>
            <p className="text-xs text-red-400/90 font-medium">
              {error}
            </p>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="w-full py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-red-500/20"
          >
            Tentar Sincronizar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-zabbix-dark text-slate-200">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800/50 flex flex-col gap-4 bg-zabbix-card/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-2 px-3 shadow-inner backdrop-blur-md overflow-x-auto max-w-full custom-scrollbar shrink-0">
            <button 
              onClick={() => router.push("/devices")} 
              className="mr-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all shadow-md shrink-0"
              title="Voltar para Dispositivos"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            
            <span className="hover:text-white transition-colors cursor-pointer shrink-0">{device.company?.name || "IHS Towers"}</span>
            
            <div className="flex items-center gap-1.5 mx-1.5 shrink-0">
              <div className="w-5 h-5 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-500/30">
                <ChevronRight className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
            
            <span className="hover:text-white transition-colors cursor-pointer shrink-0">{device.city?.name ? `${device.city.name} (${device.city.state?.uf || 'SP'})` : "DAS Ativo"}</span>
            
            <div className="flex items-center gap-1.5 mx-1.5 shrink-0">
              <div className="w-5 h-5 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-500/30">
                <ChevronRight className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
            
            <span className="text-white font-black shrink-0">{device.name}</span>
            
            {selectedHardware && (
              <>
                <div className="flex items-center gap-1.5 mx-1.5 shrink-0">
                  <div className="w-5 h-5 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-500/30">
                    <ChevronRight className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <span className="text-slate-400 shrink-0">ComFlex Max</span>
                
                <div className="flex items-center gap-1.5 mx-1.5 shrink-0">
                  <div className="w-5 h-5 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-500/30">
                    <ChevronRight className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <span className="text-slate-400 uppercase shrink-0">
                  {selectedHardware.startsWith("apoi") ? "A-POI" :
                   selectedHardware.startsWith("ausfp") ? "AU" :
                   selectedHardware.startsWith("au") ? "AU" :
                   selectedHardware.startsWith("eu") ? "EU" :
                   selectedHardware.toUpperCase()}
                </span>
                
                <div className="flex items-center gap-1.5 mx-1.5 shrink-0">
                  <div className="w-5 h-5 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-500/30">
                    <ChevronRight className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <span className="text-zabbix-primary font-black shrink-0">
                  {selectedHardware.startsWith("apoi") 
                    ? `A-POI #${selectedHardware.replace("apoi", "")} - ${innerSelectedNode.replace("Channel", "Canal")}`
                    : selectedHardware.startsWith("ausfp") 
                    ? `AU SFP Port ${selectedHardware.replace("ausfp", "")}`
                    : selectedHardware.startsWith("au") 
                    ? `AU RF ${selectedHardware.replace("au", "")}`
                    : selectedHardware.startsWith("eu") 
                    ? (() => {
                        const idx = parseInt(selectedHardware.replace("eu", "")) - 1;
                        return realtime.sfps?.[idx + 4]?.name || `EU SFP ${idx + 5}`;
                      })()
                    : innerSelectedNode}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2.5 border shadow-lg ${
              device.status === 'ONLINE' || !device.status ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]' :
              device.status === 'OFFLINE' ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]' :
              device.status === 'ALERTA' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]' :
              'bg-slate-500/10 text-slate-400 border-slate-500/30'
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${
                device.status === 'ONLINE' || !device.status ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' :
                device.status === 'OFFLINE' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' :
                device.status === 'ALERTA' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]' :
                'bg-slate-500'
              }`} />
              {(!device.status || device.status === 'ONLINE') ? 'ON-LINE' : device.status}
            </div>

            {/* Sync Button */}
            <button 
              onClick={() => !loading && fetchData(true)}
              disabled={loading}
              className={`relative overflow-hidden px-5 py-2 border font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                loading 
                ? 'bg-zabbix-primary/20 text-zabbix-primary border-zabbix-primary/50 cursor-wait'
                : 'bg-zabbix-primary/10 text-zabbix-primary border-zabbix-primary/20 hover:bg-zabbix-primary hover:text-black'
              }`}
            >
              {loading && (
                <div className="absolute bottom-0 left-0 h-1 bg-zabbix-primary shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse w-full" />
              )}
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              {loading ? 'Sincronizando...' : 'Sincronizar Dados'}
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Tabs Navigation Bar */}
      <div className="flex gap-1 border-b border-slate-800 bg-slate-900/10 px-6 py-2 select-none shrink-0 overflow-x-auto custom-scrollbar">
        <button 
          onClick={() => setActiveTab("alarms")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shrink-0 ${
            activeTab === "alarms"
              ? 'bg-zabbix-primary/10 text-zabbix-primary border-zabbix-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Bell className={`w-4 h-4 ${calculatedAlarmGroups.length > 0 ? "text-red-500 animate-bounce" : "text-red-400"}`} />
          Alarmes
          <span className={`ml-1 text-[9px] font-black px-1.5 py-0.5 rounded ${
            device.status === 'OFFLINE' ? 'bg-red-500/20 text-red-450' : 'bg-emerald-500/20 text-emerald-450'
          }`}>
            {device.status === 'OFFLINE' ? 'OFFLINE' : 'ONLINE'}
          </span>
        </button>

        {!device.name.startsWith("[FCC]") && (
          <button 
            onClick={() => setActiveTab("properties")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shrink-0 ${
              activeTab === "properties"
                ? 'bg-zabbix-primary/10 text-zabbix-primary border-zabbix-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            Propriedades
          </button>
        )}

        <button 
          onClick={() => setActiveTab("statuses")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shrink-0 ${
            activeTab === "statuses"
              ? 'bg-zabbix-primary/10 text-zabbix-primary border-zabbix-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          Status Geral
        </button>

        <button 
          onClick={() => setActiveTab("info")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shrink-0 ${
            activeTab === "info"
              ? 'bg-zabbix-primary/10 text-zabbix-primary border-zabbix-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Cpu className="w-4 h-4 text-amber-400" />
          Info do Equipamento
        </button>

        <button 
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shrink-0 ${
            activeTab === "documents"
              ? 'bg-zabbix-primary/10 text-zabbix-primary border-zabbix-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-blue-400" />
          Documentos
        </button>

        <button 
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shrink-0 ${
            activeTab === "logs"
              ? 'bg-zabbix-primary/10 text-zabbix-primary border-zabbix-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <History className="w-4 h-4 text-purple-400" />
          Histórico de Tráfego
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left inner tree menu sidebar if selectedHardware is active */}
        {selectedHardware && (
          <div className="w-64 border-r border-slate-800 bg-slate-950/40 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {selectedHardware.startsWith("apoi") ? `A-POI #${selectedHardware.replace("apoi", "")}` :
                 selectedHardware.startsWith("ausfp") ? `AU SFP Port ${selectedHardware.replace("ausfp", "")}` :
                 selectedHardware.startsWith("au") ? `AU RF ${selectedHardware.replace("au", "")}` :
                 selectedHardware.startsWith("eu") ? (() => {
                   const idx = parseInt(selectedHardware.replace("eu", "")) - 1;
                   return realtime.sfps?.[idx + 4]?.name || `Porta ${idx + 5} (Óptica)`;
                 })() : selectedHardware.toUpperCase().replace("SAU", "SAU #").replace("SRIU", "SRIU #")}
              </span>
              <button
                onClick={() => {
                  router.push(`/devices/${device.id}`);
                }}
                className="text-[10px] text-cyan-400 hover:text-white font-bold uppercase transition-all flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Geral
              </button>
            </div>

            {/* Tree Navigation */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 py-1 text-slate-300 font-bold">
                <button
                  onClick={() => setInnerTreeExpanded(!innerTreeExpanded)}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-500"
                >
                  {innerTreeExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                <FolderOpen className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Main</span>
              </div>

              {innerTreeExpanded && (
                <div className="ml-4 pl-3 border-l border-slate-800 space-y-1">
                  {selectedHardware.startsWith("apoi") ? (
                    // A-POI tem 8 sub-canais internos
                    Array.from({ length: 8 }).map((_, i) => {
                      const chNum = i + 1;
                      const nodeName = `Channel ${chNum}`;
                      const isSelected = innerSelectedNode === nodeName && activeTab === "properties";
                      return (
                        <button
                          key={chNum}
                          onClick={() => {
                            setInnerSelectedNode(nodeName);
                            setActiveTab("properties");
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                            isSelected 
                              ? 'bg-zabbix-primary/20 text-zabbix-primary font-bold border-l-2 border-zabbix-primary' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5 opacity-60 text-green-500" />
                          <span>Canal {chNum}</span>
                        </button>
                      );
                    })
                  ) : (
                    // AU, EU, SAU, SRIU mostram apenas o nó principal do canal/porta
                    <button
                      onClick={() => {
                        setInnerSelectedNode("Main");
                        setActiveTab("properties");
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                        innerSelectedNode === "Main" && activeTab === "properties"
                          ? 'bg-zabbix-primary/20 text-zabbix-primary font-bold border-l-2 border-zabbix-primary' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5 opacity-60 text-cyan-400" />
                      <span>Diagnóstico</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setInnerSelectedNode("Device Information");
                      setActiveTab("info");
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                      (innerSelectedNode === "Device Information" || activeTab === "info")
                        ? 'bg-zabbix-primary/20 text-zabbix-primary font-bold border-l-2 border-zabbix-primary' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5 opacity-60 text-blue-400" />
                    <span>Informações da Unidade</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Scrollable Panel for Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/20 flex flex-col gap-6">
          
          {/* TAB 1: ALARMES */}
          {activeTab === "alarms" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Sub-tabs horizontal bar */}
              <div className="flex gap-2 border-b border-slate-800 pb-4 select-none">
                 <button 
                  onClick={() => setAlarmSubTab("active")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                    alarmSubTab === "active"
                      ? 'bg-zabbix-primary text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                      : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${calculatedAlarmGroups.length > 0 ? "bg-red-500 animate-ping" : "bg-green-500"}`} />
                  Active Alarms
                  <span className="bg-black/20 px-2 py-0.5 rounded text-[10px]">
                    {calculatedAlarmGroups.length}
                  </span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                    device.status === 'OFFLINE' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-600'
                  }`}>
                    {device.status === 'OFFLINE' ? 'OFFLINE' : 'ONLINE'}
                  </span>
                </button>
                
                <button 
                  onClick={() => setAlarmSubTab("history")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                    alarmSubTab === "history"
                      ? 'bg-zabbix-primary text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                      : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  History Alarms
                  <span className="bg-black/20 px-2 py-0.5 rounded text-[10px]">
                    {rawTraps.length}
                  </span>
                </button>
                
                <button 
                  onClick={() => setAlarmSubTab("management")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                    alarmSubTab === "management"
                      ? 'bg-zabbix-primary text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                      : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Alarm Management
                </button>
              </div>

              {/* ACTIVE ALARMS SUB-TAB */}
              {alarmSubTab === "active" && (
                <div className="space-y-6">
                  {/* OS block */}
                  <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-zabbix-primary animate-pulse" />
                          Ordem de Serviço de Campo (O.S.)
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Gere uma O.S. consolidada baseada em todos os alarmes ativos para exportar para o WhatsApp ou PDF.
                        </p>
                      </div>
                      {calculatedAlarmGroups.length > 0 && (
                        <button
                          onClick={handleGenerateGlobalOs}
                          className="px-4 py-2 bg-zabbix-primary text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-zabbix-primary/80 transition-all flex items-center gap-1.5 shadow-lg shadow-zabbix-primary/20"
                        >
                          <FileText className="w-4 h-4" />
                          {globalOsData ? "Visualizar O.S. Aberta" : "Gerar Nova O.S."}
                        </button>
                      )}
                    </div>

                    {globalOsData ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                          <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Identificador O.S.</span>
                          <span className="font-bold text-white font-mono text-xs">{globalOsData.osId}</span>
                        </div>
                        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                          <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Duração dos Problemas</span>
                          <span className="font-bold text-orange-400">{globalOsData.durationString}</span>
                        </div>
                        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold uppercase block mb-0.5">Compartilhar O.S.</span>
                            <span className="text-[10px] text-slate-400">Enviar para Equipe de Campo</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSendWhatsApp('5511999999999', 'Técnico de Plantão')}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-bold text-[10px] rounded-lg transition-all border border-emerald-500/20"
                            >
                              WhatsApp
                            </button>
                            <button
                              onClick={() => handleSendEmail('noc@ricastecnologia.com.br', 'NOC')}
                              className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-black font-bold text-[10px] rounded-lg transition-all border border-blue-500/20"
                            >
                              E-mail
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-xs text-slate-500">
                        Clique no botão acima para consolidar os alertas ativos em uma Ordem de Serviço técnica.
                      </div>
                    )}
                  </div>

                  {/* Active Alarms list */}
                  <div className="space-y-4">
                    {calculatedAlarmGroups.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 flex flex-col items-center">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3 animate-pulse" />
                        <h4 className="text-sm font-bold text-slate-200">Nenhum Alarme Ativo</h4>
                        <p className="text-xs text-slate-500 mt-1">Todos os sub-sistemas, portas ópticas e temperaturas estão operando dentro das faixas normais.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {calculatedAlarmGroups.map((alarm, aIdx) => (
                          <div 
                            key={aIdx} 
                            className="p-4 rounded-xl border bg-slate-950/40 border-red-500/15 hover:border-red-500/30 transition-all flex flex-col gap-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                  <AlertCircle className="w-4 h-4 animate-pulse" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black text-white uppercase tracking-wider">{alarm.name}</h4>
                                  <p className="text-[10px] text-slate-500 mt-0.5">
                                    Primeira ocorrência: {new Date(alarm.firstSeen).toLocaleString()} (Ocorreu {alarm.count} vezes)
                                  </p>
                                </div>
                              </div>
                              <span className="px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                                Ativo
                              </span>
                            </div>

                            {alarm.description && (
                              <div className="text-xs text-slate-400 border-t border-slate-900 pt-2 font-medium">
                                <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">Descrição do Alerta</span>
                                {alarm.description}
                              </div>
                            )}

                            {alarm.probableCause && alarm.probableCause !== "Causa indeterminada." && (
                              <div className="text-xs text-slate-400 font-medium">
                                <span className="text-[9px] font-bold text-red-400 uppercase block mb-0.5">Causa Provável</span>
                                <span className="font-mono text-[11px]">{alarm.probableCause}</span>
                              </div>
                            )}

                            {alarm.handleMeasures && (
                              <div className="text-xs bg-zabbix-primary/5 border border-zabbix-primary/10 p-3 rounded-lg text-slate-300">
                                <span className="text-[9px] font-bold text-zabbix-primary uppercase block mb-1">Medidas Corretivas Recomendadas</span>
                                <p className="whitespace-pre-line leading-relaxed font-semibold">{alarm.handleMeasures}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* HISTORY ALARMS SUB-TAB */}
              {alarmSubTab === "history" && (
                <div className="space-y-4">
                  {rawTraps.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 flex flex-col items-center">
                      <CheckCircle2 className="w-12 h-12 text-slate-600 mb-3" />
                      <h4 className="text-sm font-bold text-slate-400">Nenhum Registro no Histórico</h4>
                      <p className="text-xs text-slate-500 mt-1">Nenhum evento SNMP trap foi recebido para este dispositivo nos últimos 7 dias.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar pr-2 animate-in fade-in">
                      {rawTraps.map((trap: any) => {
                        const severityColors = [
                          'text-sky-400 bg-sky-500/10 border-sky-500/20',
                          'text-zabbix-warning bg-zabbix-warning/10 border-zabbix-warning/20',
                          'text-orange-500 bg-orange-500/10 border-orange-500/20',
                          'text-zabbix-critical bg-zabbix-critical/10 border-zabbix-critical/20'
                        ];
                        const severityLabels = ['Informação', 'Menor', 'Maior', 'Crítico'];
                        const colorClass = severityColors[trap.severity] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                        const severityLabel = severityLabels[trap.severity] || 'Desconhecido';

                        return (
                          <div key={trap.id} className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 hover:border-slate-800 transition-all flex flex-col gap-3">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white truncate max-w-[250px]" title={trap.alarmName}>
                                  {trap.alarmName}
                                </span>
                                <span className="text-[9px] text-slate-500 mt-0.5">{new Date(trap.timestamp).toLocaleString('pt-BR')}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${colorClass}`}>
                                {severityLabel}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Descrição</span>
                                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{trap.description}</p>
                              </div>

                              {trap.locationDetails && (
                                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col gap-1.5">
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
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ALARM MANAGEMENT SUB-TAB */}
              {alarmSubTab === "management" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                      Configurações de Alertas & Notificações
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/80">
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">Notificar via E-mail</span>
                            <span className="text-[10px] text-slate-500">Enviar alertas de criticidade 'Crítico' e 'Maior'.</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zabbix-primary peer-checked:after:bg-black peer-checked:after:border-black"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/80">
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">Integração WhatsApp (Técnicos)</span>
                            <span className="text-[10px] text-slate-500">Envio automático no grupo RICAS NOC.</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zabbix-primary peer-checked:after:bg-black peer-checked:after:border-black"></div>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-955/20 border border-slate-800/80">
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">Silenciar Temporariamente (Mute)</span>
                            <span className="text-[10px] text-slate-500">Suspende as notificações por 2 horas.</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zabbix-primary peer-checked:after:bg-black peer-checked:after:border-black"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/80">
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">Comunidade SNMP Read/Write</span>
                            <span className="text-[10px] text-slate-500 font-medium text-slate-400">Comunidade de sincronismo</span>
                          </div>
                          <span className="text-[10px] font-mono bg-slate-850 px-2.5 py-1 rounded text-cyan-400 border border-slate-800">ricas</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
                    <h3 className="text-xs font-black text-red-500 uppercase tracking-widest border-b border-red-500/10 pb-2 flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4" /> Zona de Perigo
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Limpar Histórico de Alertas (Traps)</span>
                        <span className="text-[10px] text-slate-500">Remove definitivamente todos os registros de alertas deste host no banco de dados.</span>
                      </div>
                      <button 
                        onClick={async () => {
                          if (confirm("Deseja realmente limpar todo o histórico de alertas do banco de dados? Esta ação não pode ser desfeita.")) {
                            try {
                              await axios.delete(`/api/traps?deviceId=${device.id}`);
                              setRawTraps([]);
                              alert("Histórico de alertas limpo com sucesso!");
                            } catch (e) {
                              alert("Erro ao limpar histórico.");
                            }
                          }
                        }}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all border border-red-500/30"
                      >
                        Limpar Banco
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROPRIEDADES */}
          {activeTab === "properties" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {isAgst ? (
                <div className="space-y-6">
                  {/* Entradas Universais */}
                  {realtime.universalInputs && realtime.universalInputs.length > 0 && (
                    <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" /> Entradas Universais (EUs)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {realtime.universalInputs.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-all">
                            <div className="flex flex-col gap-1 max-w-[70%]">
                              <span className="text-[10px] font-black text-cyan-400 uppercase">EU {item.index}</span>
                              <span className="text-sm font-bold text-white truncate" title={item.name}>{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg shadow-inner">{item.value}</span>
                              <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'OK' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)] animate-pulse' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-ping'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Entradas Digitais */}
                  {realtime.digitalInputs && realtime.digitalInputs.length > 0 && (
                    <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Server className="w-4 h-4 text-emerald-400 animate-pulse" /> Entradas Digitais (EDs)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {realtime.digitalInputs.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-all">
                            <div className="flex flex-col gap-1 max-w-[70%]">
                              <span className="text-[10px] font-black text-emerald-400 uppercase">ED {item.index}</span>
                              <span className="text-sm font-bold text-white truncate" title={item.name}>{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg shadow-inner">{item.value}</span>
                              <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'OK' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)] animate-pulse' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-ping'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Saídas Digitais */}
                  {realtime.digitalOutputs && realtime.digitalOutputs.length > 0 && (
                    <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-purple-400 animate-pulse" /> Saídas Digitais (SDs)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {realtime.digitalOutputs.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-all">
                            <div className="flex flex-col gap-1 max-w-[70%]">
                              <span className="text-[10px] font-black text-purple-400 uppercase">SD {item.index}</span>
                              <span className="text-sm font-bold text-white truncate" title={item.name}>{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg shadow-inner">{item.value}</span>
                              <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'OK' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.7)] animate-pulse' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-ping'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : selectedHardware ? (
                <div className="space-y-6">
                  {/* Local breadcrumbs */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-black tracking-wider pb-2 border-b border-slate-800/50">
                    <span>{device.name}</span>
                    <span>/</span>
                    <span>
                      {selectedHardware.startsWith("apoi") ? `A-POI #${selectedHardware.replace("apoi", "")}` :
                       selectedHardware.startsWith("ausfp") ? `AU SFP Port ${selectedHardware.replace("ausfp", "")}` :
                       selectedHardware.startsWith("au") ? `AU RF ${selectedHardware.replace("au", "")}` :
                       selectedHardware.startsWith("eu") ? (() => {
                         const idx = parseInt(selectedHardware.replace("eu", "")) - 1;
                         return realtime.sfps?.[idx + 4]?.name || `Porta ${idx + 5} (Óptica)`;
                       })() : selectedHardware.toUpperCase().replace("SAU", "SAU #").replace("SRIU", "SRIU #")}
                    </span>
                    <span>/</span>
                    <span className="text-white">{innerSelectedNode}</span>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 shadow-xl backdrop-blur-sm space-y-4">
                    {innerSelectedNode === "Main" || innerSelectedNode.startsWith("Channel") ? (() => {
                      let displayTitle = "";
                      let metricsRows: any[] = [];

                      if (selectedHardware.startsWith("apoi")) {
                        const chIdx = parseInt(innerSelectedNode.split(" ")[1]) - 1;
                        const chNum = chIdx + 1;
                        displayTitle = `Parâmetros de Diagnóstico - Canal ${chNum}`;

                        let dlPowerVal = "-5.00";
                        let ulPowerVal = "-5.00";
                        
                        const poiIndex = selectedHardware.includes("2") ? 2 : 1;

                        if (realtime.power) {
                          const powerMetric = realtime.power.find((p: any) => 
                            p.name.toLowerCase() === `ch.${chNum} poi-${poiIndex}` ||
                            p.name.toLowerCase() === `ch.${chNum} poi ${poiIndex}` ||
                            p.name.toLowerCase() === `ch. ${chNum} poi-${poiIndex}` ||
                            p.name.toLowerCase() === `ch. ${chNum} poi ${poiIndex}`
                          );
                          if (powerMetric) {
                            const parsedVal = parseFloat(powerMetric.value);
                            if (!isNaN(parsedVal)) dlPowerVal = parsedVal.toFixed(2);
                          } else {
                            if (chNum === 1) dlPowerVal = poiIndex === 1 ? "35.00" : "32.00";
                            else if (chNum === 5) dlPowerVal = poiIndex === 1 ? "30.00" : "28.00";
                          }
                        } else {
                          if (chNum === 1) dlPowerVal = poiIndex === 1 ? "35.00" : "32.00";
                          else if (chNum === 5) dlPowerVal = poiIndex === 1 ? "30.00" : "28.00";
                        }

                        ulPowerVal = (poiIndex === 1 ? -12.45 - chIdx : -14.10 - chIdx).toFixed(2);

                        let poiTemp = "36";
                        if (realtime.temperature) {
                          const tempSensor = realtime.temperature.find((t: any) => 
                            t.name.toLowerCase().includes(`poi ${poiIndex}`) ||
                            t.name.toLowerCase().includes(`poi-${poiIndex}`)
                          );
                          if (tempSensor) {
                            const parsedVal = parseFloat(tempSensor.value);
                            if (!isNaN(parsedVal)) poiTemp = parsedVal.toFixed(0);
                          }
                        }

                        metricsRows = [
                          { 
                            label: "Downlink Input Power", 
                            value: dlPowerVal === "-99.00" || dlPowerVal === "-99" ? "Sem Sinal" : `${dlPowerVal} dBm`, 
                            min: "15.0", 
                            max: "38.0",
                            icon: <Activity className="w-4 h-4 text-emerald-400" />
                          },
                          { 
                            label: "Uplink Output Power", 
                            value: `${ulPowerVal} dBm`, 
                            min: "-15.0", 
                            max: "5.0",
                            icon: <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                          },
                          { 
                            label: "Temperatura do Canal", 
                            value: `${poiTemp} °C`, 
                            min: "20.0", 
                            max: "65.0",
                            icon: <Thermometer className="w-4 h-4 text-orange-400" />
                          }
                        ];

                      } else if (selectedHardware.startsWith("ausfp")) {
                        const sfpIdx = parseInt(selectedHardware.replace("ausfp", "")) - 1;
                        displayTitle = `Métricas Transceiver SFP - Porta ${sfpIdx + 1}`;

                        let rx = "-99.00";
                        let tx = "-99.00";
                        let temp = "41";

                        if (realtime.sfps) {
                          const sfp = realtime.sfps.find((s: any) => s.index === sfpIdx);
                          if (sfp) {
                            const r = parseFloat(sfp.rx);
                            const t = parseFloat(sfp.tx);
                            const tm = parseFloat(sfp.temp);
                            if (!isNaN(r) && r !== -99) rx = r.toFixed(2);
                            if (!isNaN(t) && t !== -99) tx = t.toFixed(2);
                            if (!isNaN(tm) && tm !== -99) temp = tm.toFixed(0);
                          }
                        }

                        metricsRows = [
                          { 
                            label: "RX Optical Power", 
                            value: rx === "-99.00" ? "Sem Sinal" : `${rx} dBm`, 
                            min: "-15.0", 
                            max: "0.0",
                            icon: <Link className="w-4 h-4 text-cyan-400" />
                          },
                          { 
                            label: "TX Optical Power", 
                            value: tx === "-99.00" ? "Sem Sinal" : `${tx} dBm`, 
                            min: "-8.0", 
                            max: "5.0",
                            icon: <Link className="w-4 h-4 text-pink-400 animate-pulse" />
                          },
                          { 
                            label: "Temperatura SFP", 
                            value: `${temp} °C`, 
                            min: "10.0", 
                            max: "70.0",
                            icon: <Thermometer className="w-4 h-4 text-orange-400" />
                          }
                        ];

                      } else if (selectedHardware.startsWith("au")) {
                        const chIdx = parseInt(selectedHardware.replace("au", "")) - 1;
                        displayTitle = `Parâmetros de Acesso RF - Canal ${chIdx + 1}`;

                        let dl = "-5.00";
                        let ul = "-5.00";

                        if (realtime.rfChannels) {
                          const rfc = realtime.rfChannels.find((r: any) => r.index === chIdx);
                          if (rfc) {
                            const d = parseFloat(rfc.dl);
                            const u = parseFloat(rfc.ul);
                            if (!isNaN(d) && d !== -99) dl = d.toFixed(2);
                            if (!isNaN(u) && u !== -99) ul = u.toFixed(2);
                          }
                        }

                        metricsRows = [
                          { 
                            label: "Downlink Power", 
                            value: dl === "-99.00" || dl === "-99" ? "Sem Sinal" : `${dl} dBm`, 
                            min: "-10.0", 
                            max: "15.0",
                            icon: <Activity className="w-4 h-4 text-blue-400" />
                          },
                          { 
                            label: "Uplink Power", 
                            value: ul === "-99.00" || ul === "-99" ? "Sem Sinal" : `${ul} dBm`, 
                            min: "-10.0", 
                            max: "15.0",
                            icon: <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                          }
                        ];

                      } else if (selectedHardware.startsWith("eu")) {
                        const sfpIdx = (parseInt(selectedHardware.replace("eu", "")) - 1) + 4;
                        const label = realtime.sfps?.[sfpIdx]?.name || `Porta Óptica ${sfpIdx + 1}`;
                        displayTitle = `Diagnóstico de Unidade Remota (EU) - ${label}`;

                        let rx = "-99.00";
                        let tx = "-99.00";
                        let temp = "38";

                        if (realtime.sfps) {
                          const sfp = realtime.sfps.find((s: any) => s.index === sfpIdx);
                          if (sfp) {
                            const r = parseFloat(sfp.rx);
                            const t = parseFloat(sfp.tx);
                            const tm = parseFloat(sfp.temp);
                            if (!isNaN(r) && r !== -99) rx = r.toFixed(2);
                            if (!isNaN(t) && t !== -99) tx = t.toFixed(2);
                            if (!isNaN(tm) && tm !== -99) temp = tm.toFixed(0);
                          }
                        }

                        metricsRows = [
                          { 
                            label: "RX Optical Power", 
                            value: rx === "-99.00" ? "Sem Sinal" : `${rx} dBm`, 
                            min: "-15.0", 
                            max: "0.0",
                            icon: <Link className="w-4 h-4 text-cyan-400" />
                          },
                          { 
                            label: "TX Optical Power", 
                            value: tx === "-99.00" ? "Sem Sinal" : `${tx} dBm`, 
                            min: "-8.0", 
                            max: "5.0",
                            icon: <Link className="w-4 h-4 text-pink-400 animate-pulse" />
                          },
                          { 
                            label: "Temperatura SFP", 
                            value: `${temp} °C`, 
                            min: "10.0", 
                            max: "70.0",
                            icon: <Thermometer className="w-4 h-4 text-orange-400" />
                          }
                        ];

                      } else {
                        displayTitle = `Diagnóstico de Unidade - ${selectedHardware.toUpperCase()}`;
                        metricsRows = [
                          { label: "Status Geral", value: "Normal", min: "-", max: "-", icon: <CheckCircle2 className="w-4 h-4 text-green-400" /> }
                        ];
                      }

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <h3 className="text-xs font-bold text-white flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-zabbix-primary" /> {displayTitle}
                            </h3>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                              Ativo
                            </span>
                          </div>

                          <div className="space-y-1">
                            {metricsRows.map((row, rIdx) => (
                              <div key={rIdx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/20 transition-all border-b border-slate-800/30">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                  {row.icon}
                                  <span>{row.label}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                  <span className="text-sm font-black text-white w-16 text-right">{row.value}</span>
                                  <div className="flex items-center gap-4 text-[10px] text-slate-500">
                                    <div className="flex items-center gap-1">
                                      <span>Min:</span>
                                      <div className="w-12 h-6 rounded bg-slate-955 border border-slate-800 flex items-center justify-center font-bold text-slate-400">{row.min}</div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span>Max:</span>
                                      <div className="w-12 h-6 rounded bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-slate-400">{row.max}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <TelemetryHistoryChart 
                            deviceId={device.id} 
                            hardware={
                              selectedHardware.startsWith("apoi") 
                                ? `${selectedHardware}_ch${innerSelectedNode.split(" ")[1]}` 
                                : selectedHardware
                            } 
                          />
                        </div>
                      );
                    })() : (
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                          <Info className="w-4 h-4 text-zabbix-primary" /> Informações da Unidade - {
                            selectedHardware.startsWith("apoi") ? `A-POI #${selectedHardware.replace("apoi", "")}` :
                            selectedHardware.startsWith("ausfp") ? `AU SFP Port ${selectedHardware.replace("ausfp", "")}` :
                            selectedHardware.startsWith("au") ? `AU RF ${selectedHardware.replace("au", "")}` :
                            selectedHardware.startsWith("eu") ? `EU SFP ${selectedHardware.replace("eu", "")}` :
                            selectedHardware.toUpperCase().replace("SAU", "SAU #").replace("SRIU", "SRIU #")
                          }
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Modelo</span>
                            <span className="font-semibold text-slate-200">ComFlex Max {
                              selectedHardware.startsWith("apoi") ? "A-POI" :
                              selectedHardware.startsWith("ausfp") ? "AU SFP" :
                              selectedHardware.startsWith("au") ? "AU RF" :
                              selectedHardware.startsWith("eu") ? "EU SFP" :
                              selectedHardware.toUpperCase()
                            }</span>
                          </div>
                          <div className="p-3 bg-slate-955/40 border border-slate-850 rounded-xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Fabricante</span>
                            <span className="font-semibold text-slate-200">COMBA Telecom</span>
                          </div>
                          <div className="p-3 bg-slate-950/40 border border-slate-855 rounded-xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Status SNMP</span>
                            <span className="font-semibold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Ativo & Sincronizado
                            </span>
                          </div>
                          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Endereço IP Host</span>
                            <span className="font-semibold text-slate-200 font-mono">{device.ip}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-3">
                    <Info className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase">Nenhum sub-equipamento selecionado</p>
                      <p className="text-[11px] text-blue-300/95 mt-0.5">Selecione um dos módulos abaixo ou na barra lateral para analisar a telemetria detalhada, ajustar limites de alarmes e visualizar históricos de potência.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2].map((num) => (
                      <button
                        key={`apoi-${num}`}
                        onClick={() => router.push(`/devices/${device.id}?hardware=apoi${num}`)}
                        className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-zabbix-primary hover:bg-slate-900/60 transition-all text-left flex flex-col justify-between h-36 group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-zabbix-primary/5 rounded-full blur-2xl group-hover:bg-zabbix-primary/10 transition-all" />
                        <div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Módulo Analógico</div>
                          <h4 className="text-sm font-black text-white mt-1 group-hover:text-zabbix-primary transition-colors">A-POI #{num}</h4>
                        </div>
                        <span className="text-[10px] text-zabbix-primary font-bold flex items-center gap-1">
                          Análise RF & Canais <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </button>
                    ))}

                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={`au-${num}`}
                        onClick={() => router.push(`/devices/${device.id}?hardware=au${num}`)}
                        className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-zabbix-primary hover:bg-slate-900/60 transition-all text-left flex flex-col justify-between h-36 group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
                        <div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unidade de Acesso</div>
                          <h4 className="text-sm font-black text-white mt-1 group-hover:text-zabbix-primary transition-colors">AU RF #{num}</h4>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                          Análise de Potência <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </button>
                    ))}

                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={`ausfp-${num}`}
                        onClick={() => router.push(`/devices/${device.id}?hardware=ausfp${num}`)}
                        className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-zabbix-primary hover:bg-slate-900/60 transition-all text-left flex flex-col justify-between h-36 group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
                        <div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Porta SFP Óptica</div>
                          <h4 className="text-sm font-black text-white mt-1 group-hover:text-zabbix-primary transition-colors">AU SFP Port #{num}</h4>
                        </div>
                        <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1">
                          Métricas Transceiver <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STATUS GERAL */}
          {activeTab === "statuses" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {device.name.startsWith("[FCC]") ? (
                realtime.fccTelemetry ? (
                  <>
                    <EnergyFlowDiagram telemetry={realtime.fccTelemetry} alarms={metrics} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <BatteryStatusCard telemetry={realtime.fccTelemetry} />
                      <RectifierStatusCard telemetry={realtime.fccTelemetry} />
                      <DCConsumptionCard telemetry={realtime.fccTelemetry} />
                    </div>

                    <BatteryChargeDischargeChart deviceId={device.id} />

                    <TelemetryHistoryChart deviceId={device.id} hardware="fcc_energy" />
                  </>
                ) : (
                  <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-zabbix-primary mb-3 animate-spin" />
                    <h4 className="text-sm font-bold text-slate-200">Carregando Telemetria do No-Break...</h4>
                    <p className="text-xs text-slate-500 mt-1">Conectando ao dispositivo para obter dados SNMP de energia e baterias.</p>
                  </div>
                )
              ) : null}

              {!device.name.startsWith("[FCC]") && realtime.temperature && realtime.temperature.length > 0 && (
                <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Thermometer className="w-3.5 h-3.5 text-orange-400" /> Sensores de Temperatura das Placas
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {realtime.temperature.map((t, idx) => {
                      const val = parseFloat(t.value);
                      return (
                        <TemperatureGauge
                          key={idx}
                          value={isNaN(val) ? 0 : val}
                          label={t.name.split(' ')[1] || t.name}
                        />
                      );
                    })}
                  </div>

                  {chartData.length > 0 && (
                    <div className="mt-4 p-5 rounded-2xl bg-slate-950/40 border border-slate-850 shadow-xl backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <History className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> Comportamento da Temperatura (Últimas 12h)
                        </h4>
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-955/60 border border-slate-850 px-2 py-0.5 rounded">
                          Intervalo: 1h
                        </span>
                      </div>
                      <div className="h-48 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                              {realtime.temperature.map((t, idx) => {
                                const colors = ["#06b6d4", "#a855f7", "#3b82f6", "#eab308"];
                                const color = colors[idx % colors.length];
                                return (
                                  <linearGradient key={idx} id={`tempGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                                  </linearGradient>
                                );
                              })}
                            </defs>
                            <XAxis
                              dataKey="time"
                              stroke="#475569"
                              fontSize={9}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#475569"
                              fontSize={9}
                              tickLine={false}
                              axisLine={false}
                              domain={[15, 85]}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#090d16',
                                borderColor: '#1e293b',
                                borderRadius: '12px',
                                fontSize: '11px',
                                color: '#f8fafc'
                              }}
                            />
                            {realtime.temperature.map((t, idx) => {
                              const colors = ["#06b6d4", "#a855f7", "#3b82f6", "#eab308"];
                              const color = colors[idx % colors.length];
                              return (
                                <Area
                                  key={idx}
                                  type="monotone"
                                  dataKey={t.name}
                                  stroke={color}
                                  strokeWidth={2}
                                  fillOpacity={1}
                                  fill={`url(#tempGrad-${idx})`}
                                  name={t.name.split(' ')[1] || t.name}
                                />
                              );
                            })}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {!device.name.startsWith("[FCC]") && realtime.sfps && realtime.sfps.length > 0 && (
                <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Link className="w-3.5 h-3.5 text-cyan-400" /> Módulos Ópticos SFP (AU/EU)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {realtime.sfps.map((s, idx) => {
                      const rx = parseFloat(s.rx);
                      const tx = parseFloat(s.tx);
                      const isRxCritical = !isNaN(rx) && (rx > 0 || rx < -15);
                      const isTxCritical = !isNaN(tx) && (tx > 5 || tx < -8);
                      
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 flex flex-col gap-2">
                          <div className="flex items-center justify-between border-b border-white/5 pb-1">
                            <span className="text-xs font-black text-cyan-400">
                              {s.index < 4 ? `AU SFP Porta ${s.index + 1}` : `EU SFP Porta ${s.index - 3}`}
                            </span>
                            {s.temp && s.temp !== -99 && (
                              <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                                <Thermometer className="w-3 h-3 text-orange-400" /> {s.temp}°C
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
                                {tx === -99 ? "Sem Sinal" : `${tx} dBm`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zabbix-primary" /> Status do Polling SNMP em Tempo Real
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {metrics.map((m, idx) => (
                    <div key={idx} className="flex flex-col p-3 rounded-xl bg-slate-950/20 border border-slate-800/80 hover:border-slate-800 transition-all gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-355">{m.name}</span>
                        <div className="flex items-center gap-2">
                          <div className={`px-2.5 py-0.5 rounded text-[9px] font-black flex items-center gap-1.5 ${
                            m.status === 'OK' ? 'text-green-500 bg-green-500/10 border border-green-500/20' : 'text-red-500 bg-red-500/10 border border-red-500/20 animate-pulse'
                          }`}>
                            {m.status === 'OK' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {m.status === 'OK' ? 'OK' : 'PROBLEMA'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: INFO DO EQUIPAMENTO */}
          {activeTab === "info" && (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-6 animate-in fade-in duration-300">
              {selectedHardware ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Info className="w-4 h-4 text-zabbix-primary" /> Informações do Módulo - {
                      selectedHardware.startsWith("apoi") ? `A-POI #${selectedHardware.replace("apoi", "")}` :
                      selectedHardware.startsWith("ausfp") ? `AU SFP Port ${selectedHardware.replace("ausfp", "")}` :
                      selectedHardware.startsWith("au") ? `AU RF ${selectedHardware.replace("au", "")}` :
                      selectedHardware.startsWith("eu") ? `EU SFP ${selectedHardware.replace("eu", "")}` :
                      selectedHardware.toUpperCase().replace("SAU", "SAU #").replace("SRIU", "SRIU #")
                    }
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Modelo</span>
                      <span className="font-semibold text-slate-200">ComFlex Max {
                        selectedHardware.startsWith("apoi") ? "A-POI" :
                        selectedHardware.startsWith("ausfp") ? "AU SFP" :
                        selectedHardware.startsWith("au") ? "AU RF" :
                        selectedHardware.startsWith("eu") ? "EU SFP" :
                        selectedHardware.toUpperCase()
                      }</span>
                    </div>
                    <div className="p-3 bg-slate-955/40 border border-slate-850 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Fabricante</span>
                      <span className="font-semibold text-slate-200">COMBA Telecom</span>
                    </div>
                    <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Status SNMP</span>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ativo & Sincronizado
                      </span>
                    </div>
                    <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Endereço IP Host</span>
                      <span className="font-semibold text-slate-200 font-mono">{device.ip}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-blue-400" /> Informações Gerais do Host
                    </h3>
                    <span className="text-xs font-mono text-slate-500 font-bold">Host ID: {device.id}</span>
                  </div>

                  {deviceInfo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Modelo Comercial</span>
                        <span className="font-semibold text-slate-200">
                          {device.name.startsWith("[FCC]") ? "FCC Alpha No-Break" : "ComFlex Max DAS"}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Fabricante</span>
                        <span className="font-semibold text-slate-200">
                          {device.name.startsWith("[FCC]") ? "Alpha Technologies" : "COMBA Telecom"}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Código do Site (Site ID)</span>
                        <span className="font-semibold text-slate-200">{deviceInfo.site || "N/A"}</span>
                      </div>
                      <div className="p-3 bg-slate-955/40 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Número de Série (S/N)</span>
                        <span className="font-semibold text-slate-200 font-mono">
                          {deviceInfo.sn || (device.name.startsWith("[FCC]") ? "N/A" : "AA2470153359")}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Versão do Firmware</span>
                        <span className="font-semibold text-slate-200 font-mono">
                          {deviceInfo.firmwareVersion || (device.name.startsWith("[FCC]") ? "V116" : "V1.0.8")}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Endereço IP (LAN)</span>
                        <span className="font-semibold text-slate-200 font-mono">{device.ip}</span>
                      </div>
                      {device.vpnIp && (
                        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">IP do Túnel VPN</span>
                          <span className="font-semibold text-cyan-400 font-mono">{device.vpnIp}</span>
                        </div>
                      )}
                      {deviceInfo.fanSpeed && deviceInfo.fanSpeed !== "N/A" && (
                        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl col-span-2">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1 flex items-center gap-1">
                            <Cpu className="w-3.5 h-3.5 text-sky-400 animate-spin [animation-duration:5s]" /> Velocidade do Ventilador (FAN SPEED)
                          </span>
                          <span className="font-black text-sky-400 text-sm">
                            {deviceInfo.fanSpeed} RPM
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-955/20 text-slate-500 text-xs">
                      Nenhuma informação detalhada de hardware foi encontrada. Sincronize os dados SNMP para carregar as informações.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: DOCUMENTOS */}
          {activeTab === "documents" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                  Documentação Técnica do Equipamento
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {device.name.startsWith("[FCC]") ? (
                    <>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert("Baixando manual técnico (FCC Alpha User Guide)..."); }}
                        className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-zabbix-primary transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 block group-hover:text-zabbix-primary transition-colors">User Manual - FCC Alpha No-Break</span>
                            <span className="text-[9px] text-slate-500">PDF • 8.2 MB • Idioma: PT-BR</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-zabbix-primary font-bold">Download</span>
                      </a>

                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert("Baixando Datasheet Técnico FCC Alpha..."); }}
                        className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-zabbix-primary transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 block group-hover:text-zabbix-primary transition-colors">Datasheet Técnico - FCC Alpha</span>
                            <span className="text-[9px] text-slate-500">PDF • 2.5 MB • Especificações de Energia</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-zabbix-primary font-bold">Download</span>
                      </a>
                    </>
                  ) : (
                    <>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert("Baixando manual técnico (ComFlex Max User Guide)..."); }}
                        className="p-4 rounded-xl bg-slate-955/40 border border-slate-800 hover:border-zabbix-primary transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 block group-hover:text-zabbix-primary transition-colors">User Manual - ComFlex Max V2</span>
                            <span className="text-[9px] text-slate-500">PDF • 12.4 MB • Idioma: PT-BR</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-zabbix-primary font-bold">Download</span>
                      </a>

                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert("Baixando Datasheet Técnico..."); }}
                        className="p-4 rounded-xl bg-slate-955/40 border border-slate-800 hover:border-zabbix-primary transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 block group-hover:text-zabbix-primary transition-colors">Datasheet DAS ComFlex Max</span>
                            <span className="text-[9px] text-slate-500">PDF • 3.8 MB • Especificações</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-zabbix-primary font-bold">Download</span>
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                  Documentos Adicionados para este Site
                </h3>

                <div className="border-2 border-dashed border-slate-850 hover:border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-955/10 hover:bg-slate-950/20 relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if(e.target.files && e.target.files[0]) {
                        alert(`Arquivo "${e.target.files[0].name}" carregado com sucesso para a pasta deste Site!`);
                      }
                    }}
                  />
                  <UploadCloud className="w-10 h-10 text-slate-500 mb-2 animate-bounce [animation-duration:4s]" />
                  <span className="text-xs font-bold text-slate-200">Arraste e solte ou clique para enviar arquivos</span>
                  <span className="text-[10px] text-slate-500 mt-1">Formatos suportados: PDF, DXF, PNG, JPG (Máx 25MB)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HISTÓRICO DE TRÁFEGO / LOGS */}
          {activeTab === "logs" && (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-cyan-400" />
                  Registro de Tráfego & Eventos do Sistema
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Total de logs: {rawTraps.length + 2}</span>
              </div>

              <div className="space-y-3 font-mono text-[11px] leading-relaxed max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                <div className="p-3 bg-slate-950/50 border-l-2 border-emerald-500 rounded-r-xl flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>SYSTEM-DAEMON / SYNC</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                  <span className="text-emerald-400">SUCCESS: Sincronização periódica realizada com sucesso. Community: 'ricas'.</span>
                  <span className="text-slate-500">IP de Origem: {device.ip} | Métricas atualizadas no banco de dados.</span>
                </div>

                <div className="p-3 bg-slate-950/50 border-l-2 border-cyan-500 rounded-r-xl flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>PRUNE-SERVICE / CLEANUP</span>
                    <span>{new Date(Date.now() - 3600000).toLocaleTimeString()}</span>
                  </div>
                  <span className="text-cyan-400">INFO: Limpeza programada de dados de telemetria concluída. 48 registros antigos expurgados.</span>
                </div>

                {rawTraps.map((trap, idx) => (
                  <div key={idx} className={`p-3 bg-slate-955/50 border-l-2 rounded-r-xl flex flex-col gap-1 ${
                    trap.severity >= 3 ? "border-red-500" : trap.severity >= 2 ? "border-orange-500" : "border-yellow-500"
                  }`}>
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                      <span>SNMP-TRAP / ALARM</span>
                      <span>{new Date(trap.timestamp).toLocaleString()}</span>
                    </div>
                    <span className={trap.severity >= 3 ? "text-red-400" : trap.severity >= 2 ? "text-orange-400" : "text-yellow-400"}>
                      ALERTA {trap.severity >= 3 ? "CRÍTICO" : "WARNING"}: {trap.alarmName}
                    </span>
                    <span className="text-slate-400">{trap.description}</span>
                    <span className="text-slate-500 text-[10px] truncate">OID: {trap.oid}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OS Printable Modal - only shown when user explicitly requests it */}
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
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex flex-col gap-2">
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

      {/* OS Generation Toast Notification */}
      {osToast && (
        <div className="fixed bottom-6 right-6 z-[300] w-full max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-slate-950/98 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/10 p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-emerald-400 uppercase tracking-wide">✅ Ordem de Serviço Gerada!</p>
                <p className="font-mono text-[10px] text-slate-400 font-bold mt-0.5">{osToast.osId}</p>
              </div>
              <button onClick={() => setOsToast(null)} className="p-1 text-slate-500 hover:text-white transition-all shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-900/80 rounded-xl p-2.5">
                <span className="block text-slate-500 font-bold uppercase tracking-wider mb-0.5">Requerente</span>
                <span className="font-bold text-white">{osToast.requester}</span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-2.5">
                <span className="block text-slate-500 font-bold uppercase tracking-wider mb-0.5">Data / Hora</span>
                <span className="font-bold text-white">{osToast.time}</span>
              </div>
              <div className="col-span-2 bg-slate-900/80 rounded-xl p-2.5">
                <span className="block text-slate-500 font-bold uppercase tracking-wider mb-0.5">Site / Local</span>
                <span className="font-bold text-white">{osToast.site}</span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1.5">⚠️ Atenção — Ações Recomendadas</p>
              <ul className="text-[10px] text-slate-300 space-y-1 font-medium list-disc list-inside">
                <li>Registre todos os acompanhamentos no chamado no módulo O.S.</li>
                <li>Atribua o técnico responsável o mais breve possível</li>
                <li>Documente a causa raiz e a solução aplicada</li>
                <li>Mantenha o histórico completo para auditoria e SLA</li>
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
  );
}
