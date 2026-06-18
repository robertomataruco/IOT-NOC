"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { X, RefreshCw, Activity, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

interface DeviceMonitorModalProps {
  device: { id: string, name: string, ip: string };
  onClose: () => void;
}

export default function DeviceMonitorModal({ device, onClose }: DeviceMonitorModalProps) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/admin/devices/${device.id}/snmp`);
      if (res.data.success) {
        setMetrics(res.data.metrics);
      } else {
        setError(res.data.error);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao consultar equipamento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [device.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-4xl max-h-[85vh] flex flex-col rounded-[2rem] border-zabbix-primary/20 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-zabbix-primary/20 via-transparent to-transparent">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-zabbix-primary/20 flex items-center justify-center text-zabbix-primary shadow-lg shadow-zabbix-primary/10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">{device.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{device.ip} • CENTRAL DE ALARMES</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchMetrics}
              disabled={loading}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-300 hover:text-white border border-white/5"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all text-red-400 border border-red-500/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-950/20">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Falha na Central</h3>
              <p className="text-slate-400 max-w-sm text-sm">{error}</p>
              <button onClick={fetchMetrics} className="mt-8 bg-zabbix-primary hover:bg-zabbix-primary/80 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-zabbix-primary/20">
                Tentar Reconexão
              </button>
            </div>
          ) : loading && metrics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-zabbix-primary/20 border-t-zabbix-primary rounded-full animate-spin mb-6"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Sincronizando Alarmes Críticos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map((m, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-2xl border-white/5 flex items-center justify-between hover:bg-white/5 transition-all group">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-mono mb-1">{m.oid}</span>
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{m.name}</span>
                  </div>
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-tighter uppercase flex items-center gap-2 ${
                    m.status === 'OK' 
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                    : 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse'
                  }`}>
                    {m.status === 'OK' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {m.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/40 border-t border-white/5 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[10px] text-slate-400 font-bold">NORMAL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-400 font-bold">CRÍTICO</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
            {metrics.filter(m => m.status === 'ALERTA').length} Alarmes Ativos
          </p>
        </div>
      </div>
    </div>
  );
}
