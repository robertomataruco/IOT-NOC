"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Zap, Activity, Gauge, Battery, BatteryCharging,
  RefreshCw, Clock, AlertTriangle, CheckCircle2, WifiOff, ArrowLeft, FileText, Trash2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

// --- Tipos e Helpers iguais aos do page geral ---
interface KronReading {
  receivedAt: string;
  voltageA: number | null; voltageB: number | null; voltageC: number | null;
  currentI1: number | null; currentI2: number | null; currentI3: number | null;
  activePowerTotal: number | null;
  powerFactor1: number | null; powerFactor2: number | null; powerFactor3: number | null;
  energyActivePos: number | null; energyActiveNeg: number | null;
}

interface KronDevice {
  id: string;
  name: string;
  serial: string;
  mqttTopic: string;
  location: string | null;
  active: boolean;
  company: { name: string } | null;
  readings: KronReading[];
}

function fmt(v: number | null | undefined, dec = 1) {
  if (v === null || v === undefined) return '—';
  return v.toFixed(dec);
}

function fpColor(fp: number | null) {
  if (!fp) return 'text-slate-500';
  if (fp >= 0.92) return 'text-emerald-400';
  if (fp >= 0.85) return 'text-yellow-400';
  return 'text-red-400';
}

function voltageColor(v: number | null) {
  if (!v) return 'text-slate-500';
  if (v >= 207 && v <= 233) return 'text-emerald-400';
  if (v >= 198 && v <= 242) return 'text-yellow-400';
  return 'text-red-400';
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Agora';
  if (mins < 60) return `${mins} min atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  return `${Math.floor(hrs / 24)}d atrás`;
}

function isStale(ts: string) {
  return Date.now() - new Date(ts).getTime() > 5 * 60 * 1000;
}

// ── Radial Speedometer Helpers ────────────────────────────────────────────────
function getMetricPercentage(label: string, valueStr: string): number {
  const numeric = parseFloat(valueStr.replace(/[^\d.]/g, ''));
  if (isNaN(numeric)) return 0;
  
  const lbl = label.toLowerCase();
  if (lbl.includes('tensão') || lbl.includes('tensao')) {
    // Normal is ~220V, range 0-250V
    return Math.min(Math.max((numeric / 250) * 100, 0), 100);
  }
  if (lbl.includes('corrente')) {
    // Let's assume max nominal current is 400A
    return Math.min(Math.max((numeric / 400) * 100, 0), 100);
  }
  if (lbl.includes('potência') || lbl.includes('potencia')) {
    // Active power up to 50 kW
    return Math.min(Math.max((numeric / 50) * 100, 0), 100);
  }
  if (lbl.includes('energia')) {
    // Cumulative energy; cyclical mapping for dynamic display
    return Math.min(Math.max(((numeric % 2000) / 2000) * 100, 0), 100);
  }
  if (lbl.includes('fator') || lbl.includes('fp') || lbl.includes('potência')) {
    // Power factor is 0.00 to 1.00
    return Math.min(Math.max(numeric * 100, 0), 100);
  }
  return 50;
}

// ── Semi-Circular Speedometer Helpers ─────────────────────────────────────────
// ── Sports Cockpit Speedometer Helpers ────────────────────────────────────────
// ── Sports Cockpit Speedometer Helpers ────────────────────────────────────────
function getArcPath(cx: number, cy: number, r: number, startPct: number, endPct: number): string {
  const startAngle = 225 - (startPct / 100) * 270;
  const endAngle = 225 - (endPct / 100) * 270;
  
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy - r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy - r * Math.sin(endRad);
  
  const largeArc = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
  // Sweep flag = 1 draws perfectly clockwise in SVG y-down coordinate system!
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

function SportsSpeedometer({ percentage, valueText, unit, label }: { percentage: number; valueText: string; unit: string; label: string }) {
  const cx = 50;
  const cy = 48;
  const radius = 32;

  // Sports car angle: 225° (0%) to -45° (100%)
  const angle = 225 - (percentage / 100) * 270;
  const rad = (angle * Math.PI) / 180;

  // Needle coordinates (starts at radius 18, goes to 31)
  const x1 = cx + 18 * Math.cos(rad);
  const y1 = cy - 18 * Math.sin(rad);
  const x2 = cx + 31 * Math.cos(rad);
  const y2 = cy - 31 * Math.sin(rad);

  // Active status color based on percentage
  let mainColor = '#10b981'; // Green
  let glowColor = 'rgba(16,185,129,0.5)';
  if (percentage >= 85) {
    mainColor = '#ef4444'; // Red
    glowColor = 'rgba(239,68,68,0.5)';
  } else if (percentage >= 65) {
    mainColor = '#f97316'; // Orange
    glowColor = 'rgba(249,115,22,0.5)';
  }

  // Draw 9 ticks around the speedometer
  const ticks = [];
  for (let i = 0; i <= 8; i++) {
    const tickPct = (i / 8) * 100;
    const tickAngle = 225 - (tickPct / 100) * 270;
    const tickRad = (tickAngle * Math.PI) / 180;
    const tx1 = cx + 33 * Math.cos(tickRad);
    const ty1 = cy - 33 * Math.sin(tickRad);
    const tx2 = cx + 36 * Math.cos(tickRad);
    const ty2 = cy - 36 * Math.sin(tickRad);
    ticks.push({ tx1, ty1, tx2, ty2, key: i });
  }

  // Speedometer tick labels (0, 25, 50, 75, 100)
  const speedLabels = [
    { text: '0', pct: 0 },
    { text: '25', pct: 25 },
    { text: '50', pct: 50 },
    { text: '75', pct: 75 },
    { text: '100', pct: 100 },
  ];

  // Calculate arc paths dynamically with perfect clockwise sweep
  const greenPath = getArcPath(cx, cy, radius, 0, 65);
  const orangePath = getArcPath(cx, cy, radius, 65, 85);
  const redPath = getArcPath(cx, cy, radius, 85, 100);

  return (
    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
      <svg className="w-full h-full" viewBox="0 0 100 96">
        <defs>
          <filter id="needle-cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer 3D Bezel */}
        <circle cx={cx} cy={cy} r="41" fill="none" stroke="#0f172a" strokeWidth="1.5" className="opacity-80" />
        <circle cx={cx} cy={cy} r="40" fill="none" stroke="#1e293b" strokeWidth="0.8" className="opacity-40" />

        {/* Backdrop Track Ring */}
        <path
          d={getArcPath(cx, cy, radius, 0, 100)}
          fill="none"
          stroke="#1e293b"
          strokeWidth="3.5"
          className="opacity-40"
        />

        {/* Speed Dial Ticks */}
        {ticks.map((t) => (
          <line
            key={t.key}
            x1={t.tx1}
            y1={t.ty1}
            x2={t.tx2}
            y2={t.ty2}
            stroke={t.key > 6 ? '#ef4444' : t.key > 4 ? '#f97316' : '#475569'}
            strokeWidth="1.2"
          />
        ))}

        {/* Green Track segment */}
        <path
          d={greenPath}
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
        />

        {/* Orange Track segment */}
        <path
          d={orangePath}
          fill="none"
          stroke="#f97316"
          strokeWidth="4"
        />

        {/* Red Track segment */}
        <path
          d={redPath}
          fill="none"
          stroke="#ef4444"
          strokeWidth="4"
        />

        {/* Outer Tick Labels (0, 25, 50, 75, 100) */}
        {speedLabels.map((l) => {
          const labelRad = ((225 - (l.pct / 100) * 270) * Math.PI) / 180;
          const lx = cx + 44 * Math.cos(labelRad);
          const ly = cy - 44 * Math.sin(labelRad);
          return (
            <text
              key={l.text}
              x={lx}
              y={ly + 1.5}
              fill="#475569"
              fontSize="5.2"
              fontWeight="900"
              textAnchor="middle"
              alignmentBaseline="middle"
              className="font-mono tracking-tighter"
            >
              {l.text}
            </text>
          );
        })}

        {/* Glowing Cyan Needle */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#needle-cyan-glow)"
          className="transition-all duration-1000 ease-out"
        />

        {/* Digital display number in the center */}
        <text
          x={cx}
          y={cy + 3}
          fill={mainColor}
          fontSize="16.5"
          fontWeight="900"
          textAnchor="middle"
          alignmentBaseline="middle"
          className="font-mono tracking-tighter transition-colors duration-300"
          style={{ filter: `drop-shadow(0 0 5px ${glowColor})` }}
        >
          {valueText}
        </text>

        {/* Unit label below digital number */}
        <text
          x={cx}
          y={cy + 15}
          fill="#64748b"
          fontSize="6.5"
          fontWeight="bold"
          textAnchor="middle"
          className="font-sans uppercase tracking-widest"
        >
          {unit}
        </text>
      </svg>
    </div>
  );
}

// ── Componentes Visuais ────────────────────────────────────────────────────────
function MetricCard({
  icon: Icon, label, value, unit, valueClass = 'text-white', sub
}: {
  icon: any; label: string; value: string; unit: string;
  valueClass?: string; sub?: string;
}) {
  const percentage = getMetricPercentage(label, value);

  // Setup vibrant container styling based on metric type
  let borderClass = 'border-slate-800/80 hover:border-emerald-500/30';
  let accentShadow = 'hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]';

  const lbl = label.toLowerCase();
  if (lbl.includes('tensão') || lbl.includes('tensao')) {
    borderClass = 'border-slate-800/80 hover:border-amber-500/30';
    accentShadow = 'hover:shadow-[0_0_30px_rgba(245,158,11,0.05)]';
  } else if (lbl.includes('corrente')) {
    borderClass = 'border-slate-800/80 hover:border-cyan-500/30';
    accentShadow = 'hover:shadow-[0_0_30px_rgba(6,182,212,0.05)]';
  } else if (lbl.includes('potência') || lbl.includes('potencia')) {
    borderClass = 'border-slate-800/80 hover:border-violet-500/30';
    accentShadow = 'hover:shadow-[0_0_30px_rgba(139,92,246,0.05)]';
  } else if (lbl.includes('energia')) {
    borderClass = 'border-slate-800/80 hover:border-emerald-500/30';
    accentShadow = 'hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]';
  } else if (lbl.includes('fator') || lbl.includes('fp')) {
    borderClass = 'border-slate-800/80 hover:border-rose-500/30';
    accentShadow = 'hover:shadow-[0_0_30px_rgba(244,63,94,0.05)]';
  }

  // Format value text for the gauge center (e.g. "211.8" -> "211.8")
  const cleanVal = parseFloat(value.replace(/[^\d.]/g, ''));
  const gaugeText = isNaN(cleanVal) ? '—' : cleanVal.toFixed(lbl.includes('fator') || lbl.includes('fp') ? 3 : 1);

  return (
    <div className={`bg-slate-950/80 border ${borderClass} rounded-3xl p-5 flex flex-col items-center justify-center text-center hover:bg-slate-900/30 ${accentShadow} transition-all duration-500 group relative overflow-hidden`}>
      {/* Subtle glossy background radial glow */}
      <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-slate-800/10 blur-2xl pointer-events-none group-hover:bg-slate-700/10 transition-colors" />

      {/* Centered Icon and Header */}
      <div className="flex items-center gap-1.5 justify-center mb-1 select-none z-10">
        <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono truncate">{label}</span>
      </div>

      <div className="h-px bg-slate-900 w-2/3 my-1 z-10" />

      {/* Centered Cockpit Speedometer Dial */}
      <div className="z-10">
        <SportsSpeedometer percentage={percentage} valueText={gaugeText} unit={unit} label={label} />
      </div>
      
      {/* Centered Sub-text Breakdowns */}
      {sub && (
        <div className="text-[10px] text-slate-500 font-mono font-medium truncate w-full mt-2 z-10 px-2" title={sub}>
          {sub}
        </div>
      )}
    </div>
  );
}

function PhasesTable({ reading }: { reading: KronReading }) {
  const phases = [
    { label: 'Fase 1', v: reading.voltageA, i: reading.currentI1, fp: reading.powerFactor1 },
    { label: 'Fase 2', v: reading.voltageB, i: reading.currentI2, fp: reading.powerFactor2 },
    { label: 'Fase 3', v: reading.voltageC, i: reading.currentI3, fp: reading.powerFactor3 },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 mt-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Leitura por Fase</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs">
              <th className="text-left pb-2">Fase</th>
              <th className="text-right pb-2">Tensão (V)</th>
              <th className="text-right pb-2">Corrente (A)</th>
              <th className="text-right pb-2">Fator Pot.</th>
              <th className="text-right pb-2">Status FP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {phases.map((ph) => (
              <tr key={ph.label} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 font-semibold text-slate-300">{ph.label}</td>
                <td className={`py-2.5 text-right font-mono ${voltageColor(ph.v)}`}>
                  {fmt(ph.v, 1)}
                </td>
                <td className="py-2.5 text-right font-mono text-cyan-400">
                  {fmt(ph.i, 2)}
                </td>
                <td className={`py-2.5 text-right font-mono font-bold ${fpColor(ph.fp)}`}>
                  {fmt(ph.fp, 3)}
                </td>
                <td className="py-2.5 text-right">
                  {!ph.fp ? (
                    <span className="text-slate-600 text-xs">—</span>
                  ) : ph.fp >= 0.92 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle2 className="w-3 h-3" /> OK
                    </span>
                  ) : ph.fp >= 0.85 ? (
                    <span className="inline-flex items-center gap-1 text-yellow-400 text-xs">
                      <AlertTriangle className="w-3 h-3" /> Atenção
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400 text-xs">
                      <AlertTriangle className="w-3 h-3" /> Crítico
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Página Principal do Dispositivo ───────────────────────────────────────────
export default function KronDevicePage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [device, setDevice] = useState<KronDevice | null>(null);
  const [latest, setLatest] = useState<KronReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const handleClearReadings = async () => {
    if (!confirm("⚠️ ATENÇÃO: Tem certeza que deseja zerar TODAS as medições acumuladas deste medidor? Esta ação não pode ser desfeita!")) {
      return;
    }
    
    try {
      const res = await axios.post(`/api/kron/devices/${id}/clear`);
      if (res.data.success) {
        alert(`✅ Sucesso! Leituras históricas do medidor foram zeradas.`);
        window.location.reload();
      } else {
        alert(`❌ Erro: ${res.data.error || "Não foi possível zerar os dados."}`);
      }
    } catch (err: any) {
      alert(`❌ Erro de conexão: ${err.response?.data?.error || err.message}`);
    }
  };

  // Carregamento inicial (Dispositivo + Últimas leituras)
  useEffect(() => {
    async function loadDevice() {
      try {
        const res = await fetch(`/api/kron/devices/${id}?limit=1`);
        if (res.ok) {
          const data = await res.json();
          setDevice(data);
          setLatest(data.readings?.[0] ?? null);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    loadDevice();
  }, [id]);

  // Função de Refresh manual/automático da última leitura
  const refreshLatest = useCallback(async () => {
    if (!device) return;
    setRefreshing(true);
    try {
      const r = await fetch(`/api/kron/devices/${id}/latest`);
      if (r.ok) {
        setLatest(await r.json());
      }
    } catch {}
    setRefreshing(false);
  }, [device, id]);

  // Polling a cada 30 segundos
  useEffect(() => {
    if (!device) return;
    const interval = setInterval(refreshLatest, 30000);
    return () => clearInterval(interval);
  }, [device, refreshLatest]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mr-3" />
        Carregando detalhes do medidor...
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
        <Zap className="w-12 h-12 opacity-20" />
        <h2 className="text-xl font-bold">Medidor não encontrado</h2>
        <Link href="/kron" className="text-yellow-400 hover:underline">Voltar para a lista</Link>
      </div>
    );
  }

  const stale = latest ? isStale(latest.receivedAt) : true;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/kron" className="p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className={`w-3 h-3 rounded-full ${!latest ? 'bg-slate-600' : stale ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              {device.name}
            </h1>
          </div>
          <div className="flex items-center gap-4 mt-2 ml-14 text-sm text-slate-400">
            {device.location && <span>📍 {device.location}</span>}
            {device.company && <span>🏢 {device.company.name}</span>}
            <span className="font-mono text-xs bg-slate-900 px-2 py-1 rounded text-slate-300">Tópico: {device.mqttTopic}</span>
            <span className="font-mono text-xs bg-slate-900 px-2 py-1 rounded text-slate-300">SN: {device.serial}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
          {latest && (
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              {timeAgo(latest.receivedAt)}
            </div>
          )}
          <div className="w-px h-6 bg-slate-800 mx-1"></div>
          <Link
            href={`/kron/${id}/billing`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all font-medium text-sm"
          >
            <FileText className="w-4 h-4" />
            Faturamento
          </Link>
          <div className="w-px h-6 bg-slate-800 mx-1"></div>
          <button
            onClick={refreshLatest}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-all font-medium text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          {isAdmin && (
            <>
              <div className="w-px h-6 bg-slate-800 mx-1"></div>
              <button
                onClick={handleClearReadings}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all font-medium text-sm border border-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                Zerar Leituras
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sem dados */}
      {!latest ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <WifiOff className="w-10 h-10 opacity-30" />
          <p className="text-sm">Aguardando dados do medidor via MQTT...</p>
          <p className="text-xs text-slate-600">Verifique se o dispositivo está conectado e enviando para o tópico <code className="text-slate-500">{device.mqttTopic}</code></p>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-700/40 rounded-2xl p-5">
          {/* Alerta FP */}
          {(latest.powerFactor1 !== null && latest.powerFactor1 < 0.92) && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm mb-5">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                <strong>Alerta de Fator de Potência baixo detectado!</strong> Fase 1 está em {fmt(latest.powerFactor1, 3)}.
                O limite exigido pela concessionária é 0.92. Risco iminente de multa de energia — verifique as cargas e o banco de capacitores deste quadro.
              </span>
            </div>
          )}

          {/* Cards principais */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <MetricCard
              icon={Zap}
              label="Tensão Trifásica"
              value={fmt(latest.voltageA, 1)}
              unit="V"
              valueClass={voltageColor(latest.voltageA)}
              sub={`B: ${fmt(latest.voltageB, 1)}V  C: ${fmt(latest.voltageC, 1)}V`}
            />
            <MetricCard
              icon={Activity}
              label="Corrente I1 / I2 / I3"
              value={fmt(latest.currentI1, 2)}
              unit="A"
              valueClass="text-cyan-400"
              sub={`I2: ${fmt(latest.currentI2, 2)}A  I3: ${fmt(latest.currentI3, 2)}A`}
            />
            <MetricCard
              icon={Gauge}
              label="Potência Ativa"
              value={fmt(latest.activePowerTotal, 3)}
              unit="kW"
              valueClass="text-violet-400"
            />
            <MetricCard
              icon={BatteryCharging}
              label="Energia Positiva"
              value={fmt(latest.energyActivePos, 2)}
              unit="kWh"
              valueClass="text-emerald-400"
              sub={`Neg: ${fmt(latest.energyActiveNeg, 2)} kWh`}
            />
            <MetricCard
              icon={Battery}
              label="Fator Potência"
              value={fmt(latest.powerFactor1, 3)}
              unit=""
              valueClass={fpColor(latest.powerFactor1)}
              sub={`FP2: ${fmt(latest.powerFactor2, 3)}  FP3: ${fmt(latest.powerFactor3, 3)}`}
            />
          </div>

          <PhasesTable reading={latest} />
        </div>
      )}
    </div>
  );
}
