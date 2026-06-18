"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShieldAlert, Activity, Wifi, WifiOff, AlertTriangle,
  RefreshCw, Building, Users, Server, CheckCircle2,
  Clock, Zap, Database, Terminal, ChevronDown, ChevronUp,
  Download, Upload, Trash2, History, FileText, Check, X, Code, Mail, Send
} from "lucide-react";

interface DeviceItem {
  id: string;
  name: string;
  ip: string;
  status: string;
  syncError: string | null;
  lastSnmpSync: string | null;
  lastSeen: string | null;
  hasAlarm: boolean;
  company: string | null;
  city: string | null;
  state: string | null;
  active: boolean;
}

interface Stats {
  totalDevices: number;
  onlineDevices: number;
  alertDevices: number;
  offlineDevices: number;
  totalCompanies: number;
  totalUsers: number;
}

interface Props {
  devices: DeviceItem[];
  stats: Stats;
}

interface BackupItem {
  filename: string;
  size: string;
  createdAt: string;
}

export default function AdvancedClient({ devices: initialDevices, stats }: Props) {
  const [devices, setDevices] = useState<DeviceItem[]>(initialDevices);
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});
  const [syncAll, setSyncAll] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'ONLINE' | 'ALERTA' | 'OFFLINE' | 'INATIVO'>('ALL');
  const [expandedError, setExpandedError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'devices' | 'smtp' | 'database' | 'logs'>('devices');
  
  // Banco de dados e logs
  const [logs, setLogs] = useState<string[]>([]);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [dbActionLoading, setDbActionLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Alerta de E-mail (SMTP Config)
  const [smtpConfig, setSmtpConfig] = useState({
    host: '',
    port: '465',
    secure: true,
    user: '',
    pass: '',
    fromName: 'Ricas Alertas',
    fromEmail: '',
    provider: 'smtp' as 'smtp' | 'graph',
    tenantId: '',
    clientId: ''
  });
  const [loadingSmtp, setLoadingSmtp] = useState(false);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testRecipient, setTestRecipient] = useState('roberto.mataruco@ricas.com.br');
  const [smtpFeedback, setSmtpFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 50));
  };

  const fetchBackups = async () => {
    setLoadingBackups(true);
    try {
      const res = await axios.get('/api/admin/database');
      if (res.data.success) {
        setBackups(res.data.backups);
      }
    } catch (err: any) {
      addLog(`❌ Erro ao buscar backups: ${err.message}`);
    } finally {
      setLoadingBackups(false);
    }
  };

  const fetchSmtpConfig = async () => {
    setLoadingSmtp(true);
    try {
      const res = await axios.get('/api/admin/smtp');
      if (res.data.success && res.data.data) {
        setSmtpConfig({
          host: res.data.data.host || '',
          port: String(res.data.data.port || '465'),
          secure: res.data.data.secure !== false,
          user: res.data.data.user || '',
          pass: res.data.data.pass || '',
          fromName: res.data.data.fromName || 'Ricas Alertas',
          fromEmail: res.data.data.fromEmail || '',
          provider: res.data.data.provider || 'smtp',
          tenantId: res.data.data.tenantId || '',
          clientId: res.data.data.clientId || ''
        });
      }
    } catch (err: any) {
      console.error("Erro ao buscar SMTP:", err);
    } finally {
      setLoadingSmtp(false);
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSmtp(true);
    setSmtpFeedback(null);
    try {
      const res = await axios.post('/api/admin/smtp', smtpConfig);
      if (res.data.success) {
        setSmtpFeedback({ success: true, message: 'Configurações de SMTP salvas com sucesso!' });
        addLog('✅ Configurações SMTP salvas com sucesso.');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      setSmtpFeedback({ success: false, message: `Erro ao salvar: ${errMsg}` });
      addLog(`❌ Erro ao salvar SMTP: ${errMsg}`);
    } finally {
      setSavingSmtp(false);
    }
  };

  const handleTestSmtp = async () => {
    if (!testRecipient) {
      alert("Por favor, preencha o destinatário de teste.");
      return;
    }
    setTestingSmtp(true);
    setSmtpFeedback(null);
    addLog(`⏳ Testando conexão SMTP e enviando e-mail de teste para ${testRecipient}...`);
    try {
      const res = await axios.post('/api/admin/smtp/test', {
        ...smtpConfig,
        testRecipient
      });
      if (res.data.success) {
        setSmtpFeedback({ success: true, message: `E-mail de teste disparado com sucesso para ${testRecipient}!` });
        addLog(`✅ Teste SMTP concluído com sucesso para ${testRecipient}.`);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      setSmtpFeedback({ success: false, message: `Falha no teste SMTP: ${errMsg}` });
      addLog(`❌ Falha no teste SMTP: ${errMsg}`);
    } finally {
      setTestingSmtp(false);
    }
  };

  useEffect(() => {
    fetchBackups();
    fetchSmtpConfig();
  }, []);

  const createBackup = async () => {
    setDbActionLoading(true);
    addLog("⏳ Solicitando criação de backup no servidor...");
    try {
      const res = await axios.post('/api/admin/database', { action: 'create-backup' });
      if (res.data.success) {
        addLog(`✅ Backup criado com sucesso: ${res.data.message}`);
        fetchBackups();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      addLog(`❌ Erro ao criar backup: ${errMsg}`);
    } finally {
      setDbActionLoading(false);
    }
  };

  const restoreBackup = async (filename: string) => {
    if (!confirm(`Tem certeza que deseja restaurar o backup "${filename}"?\nIsso substituirá o banco de dados ativo atual!`)) return;
    
    setDbActionLoading(true);
    addLog(`⏳ Solicitando restauração do backup: ${filename}...`);
    try {
      const res = await axios.post('/api/admin/database', { action: 'restore-backup', filename });
      if (res.data.success) {
        addLog(`✅ Backup "${filename}" restaurado com sucesso!`);
        alert("Backup restaurado com sucesso! Recomendamos recarregar o painel.");
        window.location.reload();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      addLog(`❌ Erro ao restaurar: ${errMsg}`);
    } finally {
      setDbActionLoading(false);
    }
  };

  const deleteBackup = async (filename: string) => {
    if (!confirm(`Excluir permanentemente o backup "${filename}"?`)) return;

    setDbActionLoading(true);
    addLog(`⏳ Solicitando exclusão do backup: ${filename}...`);
    try {
      const res = await axios.post('/api/admin/database', { action: 'delete-backup', filename });
      if (res.data.success) {
        addLog(`✅ Backup "${filename}" excluído.`);
        fetchBackups();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      addLog(`❌ Erro ao excluir: ${errMsg}`);
    } finally {
      setDbActionLoading(false);
    }
  };

  const handleDbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);
    setDbActionLoading(true);
    addLog(`⏳ Iniciando envio do banco local: ${file.name}...`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.put('/api/admin/database', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setUploadSuccess(res.data.message);
        addLog(`✅ Upload & Validação: ${res.data.message}`);
        fetchBackups();
        alert("Parabéns! Banco de dados validado e atualizado em produção com sucesso!");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      setUploadError(errMsg);
      addLog(`❌ Erro de Validação: ${errMsg}`);
    } finally {
      setDbActionLoading(false);
      // Limpa o input file
      e.target.value = '';
    }
  };

  const syncDevice = async (device: DeviceItem) => {
    setSyncing(prev => ({ ...prev, [device.id]: true }));
    addLog(`⏳ Iniciando sync manual: ${device.name} (${device.ip})...`);
    try {
      await axios.get(`/api/admin/devices/${device.id}/snmp?force=true`);
      addLog(`✅ ${device.name} — Sincronizado com sucesso (ONLINE)`);
      // Update local state
      setDevices(prev => prev.map(d =>
        d.id === device.id ? { ...d, status: 'ONLINE', syncError: null, lastSnmpSync: new Date().toISOString() } : d
      ));
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || 'Falha desconhecida';
      const isOffline = errMsg.toLowerCase().includes('inalcançável') || errMsg.toLowerCase().includes('timeout');
      addLog(`❌ ${device.name} — Falha: ${errMsg}`);
      setDevices(prev => prev.map(d =>
        d.id === device.id ? { ...d, status: isOffline ? 'OFFLINE' : 'ALERTA', syncError: `ALERTA DE FALHA NO DISPOSITIVO: ${errMsg}` } : d
      ));
    } finally {
      setSyncing(prev => ({ ...prev, [device.id]: false }));
    }
  };

  const syncAllDevices = async () => {
    setSyncAll(true);
    addLog(`🔄 Iniciando sincronismo em massa de ${devices.length} dispositivos...`);
    for (const device of devices) {
      await syncDevice(device);
    }
    addLog(`🏁 Sincronismo em massa concluído.`);
    setSyncAll(false);
  };

  const filteredDevices = filter === 'ALL'
    ? devices 
    : devices.filter(d => {
        if (filter === 'INATIVO') return d.active === false;
        return d.active !== false && d.status === filter;
      });

  const formatTime = (iso: string | null) => {
    if (!iso) return 'Nunca';
    const d = new Date(iso);
    if (d.getFullYear() === 1970) return 'Nunca';
    return d.toLocaleString('pt-BR');
  };

  const statusBadge = (status: string, active?: boolean) => {
    if (active === false) return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-700/40 text-slate-400 text-[10px] font-bold border border-slate-600/30">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>SUSPENSO
      </span>
    );
    if (status === 'ONLINE') return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>ONLINE
      </span>
    );
    if (status === 'ALERTA') return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20 animate-pulse">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>ALERTA
      </span>
    );
    if (status === 'OFFLINE') return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20 animate-pulse">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>OFFLINE
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 text-[10px] font-bold border border-slate-600/30">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>DESCONHECIDO
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-violet-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Painel Avançado</h1>
            <p className="text-xs text-violet-400/70 font-mono mt-0.5">🔐 Acesso exclusivo · roberto.mataruco</p>
          </div>
        </div>
        <button
          onClick={syncAllDevices}
          disabled={syncAll}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${
            syncAll
              ? 'bg-violet-500/10 text-violet-400 border-violet-500/30 cursor-wait'
              : 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-violet-300 border-violet-500/30 hover:from-violet-600/40 hover:to-fuchsia-600/40 hover:text-white'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${syncAll ? 'animate-spin' : ''}`} />
          {syncAll ? 'Sincronizando...' : 'Sync Geral'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Dispositivos', value: stats.totalDevices, icon: Server, color: 'from-slate-600/30 to-slate-700/30', border: 'border-slate-600/30', text: 'text-slate-300', icon_c: 'text-slate-400' },
          { label: 'Online', value: stats.onlineDevices, icon: CheckCircle2, color: 'from-green-600/20 to-emerald-700/20', border: 'border-green-500/20', text: 'text-green-400', icon_c: 'text-green-500' },
          { label: 'Em Alerta', value: stats.alertDevices, icon: AlertTriangle, color: 'from-amber-600/20 to-yellow-700/20', border: 'border-amber-500/20', text: 'text-amber-400', icon_c: 'text-amber-500' },
          { label: 'Offline', value: stats.offlineDevices, icon: WifiOff, color: 'from-red-600/20 to-rose-700/20', border: 'border-red-500/20', text: 'text-red-400', icon_c: 'text-red-500' },
          { label: 'Empresas', value: stats.totalCompanies, icon: Building, color: 'from-blue-600/20 to-indigo-700/20', border: 'border-blue-500/20', text: 'text-blue-400', icon_c: 'text-blue-500' },
          { label: 'Usuários', value: stats.totalUsers, icon: Users, color: 'from-violet-600/20 to-fuchsia-700/20', border: 'border-violet-500/20', text: 'text-violet-400', icon_c: 'text-violet-500' },
        ].map((card) => (
          <div key={card.label} className={`glass-panel rounded-2xl p-4 bg-gradient-to-br ${card.color} border ${card.border}`}>
            <div className="flex items-center justify-between mb-2">
              <card.icon className={`w-4 h-4 ${card.icon_c}`} />
            </div>
            <p className={`text-3xl font-black ${card.text}`}>{card.value}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Chrome-style Tab Bar */}
      <div className="flex items-end bg-slate-950/20 px-4 pt-3 gap-1 rounded-t-2xl border-t border-x border-slate-800/80">
        {[
          { id: 'devices', label: 'Diagnóstico de Rede', icon: Activity },
          { id: 'smtp', label: 'Configuração SMTP', icon: Mail },
          { id: 'database', label: 'Banco de Dados', icon: Database },
          { id: 'logs', label: 'Atividade & Deploy', icon: Terminal }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 px-6 py-3.5 text-xs font-bold transition-all duration-150 select-none ${
                isActive
                  ? 'bg-[#101625] text-white rounded-t-xl border-t border-x border-slate-800/80 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.5),4px_0_12px_-4px_rgba(0,0,0,0.5)] z-10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 rounded-t-lg border-t border-x border-transparent'
              }`}
              style={{
                marginBottom: '-1px'
              }}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400 animate-pulse' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-t-xl"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Container */}
      <div className="bg-[#101625] border-x border-b border-slate-800/80 rounded-b-2xl p-6 shadow-2xl min-h-[450px]">
        
        {/* TAB 1: DIAGNÓSTICO DE REDE */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-400" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Diagnóstico de Dispositivos</h2>
              </div>
              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                {(['ALL', 'ONLINE', 'ALERTA', 'OFFLINE', 'INATIVO'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                      filter === f
                        ? f === 'ONLINE' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : f === 'ALERTA' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : f === 'OFFLINE' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : f === 'INATIVO' ? 'bg-slate-700/35 text-slate-400 border border-slate-700/50'
                        : 'bg-slate-700 text-white border border-slate-600'
                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-700/50'
                    }`}
                  >
                    {f === 'ALL' 
                      ? `Todos (${devices.length})` 
                      : f === 'INATIVO' 
                      ? `Suspensos (${devices.filter(d => d.active === false).length})` 
                      : `${f} (${devices.filter(d => d.active !== false && d.status === f).length})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3 pl-2">Dispositivo</th>
                    <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3">IP</th>
                    <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3">Empresa</th>
                    <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3">Localização</th>
                    <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3">Status</th>
                    <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3">Último Sync</th>
                    <th className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-3 pr-2">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredDevices.map(device => {
                    const isInactive = device.active === false;
                    return (
                      <React.Fragment key={device.id}>
                        <tr className={`hover:bg-slate-800/30 transition-colors ${isInactive ? 'opacity-40 line-through bg-slate-900/10' : ''}`}>
                          <td className="py-3 pl-2">
                            <div className="flex items-center gap-2 font-medium">
                              <Server className={`w-3 h-3 shrink-0 ${isInactive ? 'text-slate-600' : 'text-slate-500'}`} />
                              <span className={`font-bold truncate max-w-[160px] ${isInactive ? 'text-slate-500' : 'text-slate-200'}`}>{device.name}</span>
                              {device.hasAlarm && !isInactive && (
                                <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[9px] font-bold border border-red-500/20">ALARME</span>
                              )}
                              {isInactive && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 text-[9px] font-bold border border-slate-700/50 uppercase tracking-wide">Inativo</span>
                              )}
                            </div>
                          </td>
                          <td className={`py-3 font-mono text-[11px] ${isInactive ? 'text-slate-600' : 'text-zabbix-accent'}`}>{device.ip}</td>
                          <td className={`py-3 ${isInactive ? 'text-slate-600' : 'text-slate-400'}`}>{device.company || <span className="text-slate-600 italic">Sem empresa</span>}</td>
                          <td className={`py-3 ${isInactive ? 'text-slate-600' : 'text-slate-400'}`}>
                            {device.city ? `${device.city}/${device.state}` : <span className="text-slate-600 italic">—</span>}
                          </td>
                          <td className="py-3">{statusBadge(device.status, device.active)}</td>
                          <td className="py-3 text-slate-500 text-[10px]">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(device.lastSnmpSync)}
                            </div>
                          </td>
                          <td className="py-3 pr-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {device.syncError && !isInactive && (
                                <button
                                  onClick={() => setExpandedError(expandedError === device.id ? null : device.id)}
                                  className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all border border-amber-500/20"
                                  title="Ver detalhes do erro"
                                >
                                  {expandedError === device.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              )}
                              <button
                                onClick={() => syncDevice(device)}
                                disabled={isInactive || syncing[device.id] || syncAll}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest border transition-all ${
                                  syncing[device.id]
                                    ? 'bg-violet-500/10 text-violet-400 border-violet-500/30 cursor-wait'
                                    : isInactive
                                    ? 'bg-slate-900/40 text-slate-600 border-slate-800/80 cursor-not-allowed'
                                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-violet-500/20 hover:text-violet-300 hover:border-violet-500/30'
                                }`}
                              >
                                <Zap className={`w-3 h-3 ${syncing[device.id] ? 'animate-spin' : ''}`} />
                                {isInactive ? 'Suspenso' : syncing[device.id] ? 'Sync...' : 'Sync'}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedError === device.id && device.syncError && !isInactive && (
                          <tr className={device.status === 'OFFLINE' ? "bg-red-500/5" : "bg-amber-500/5"}>
                            <td colSpan={7} className="py-2 px-4">
                              <div className={`flex items-start gap-2 p-3 rounded-lg border transition-all ${device.status === 'OFFLINE' ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse' : 'bg-amber-500/10 border-amber-500/20'}`}>
                                <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${device.status === 'OFFLINE' ? 'text-red-400' : 'text-amber-400'}`} />
                                <p className={`text-[11px] font-mono leading-relaxed ${device.status === 'OFFLINE' ? 'text-red-300 font-bold' : 'text-amber-300'}`}>{device.syncError}</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {filteredDevices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                        Nenhum dispositivo encontrado neste filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CONFIGURAÇÃO SMTP */}
        {activeTab === 'smtp' && (
          <div className="max-w-4xl mx-auto space-y-6 py-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Mail className="w-5 h-5 text-violet-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Configuração de E-mail de Alerta</h2>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure o método de envio de alertas automáticos para supervisores e administradores em caso de alarmes e incidentes de rede.
            </p>

            <form onSubmit={handleSaveSmtp} className="space-y-4 pt-2">
              <div className="mb-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Método de Envio</label>
                <select
                  value={smtpConfig.provider || 'smtp'}
                  onChange={e => setSmtpConfig(prev => ({ ...prev, provider: e.target.value as any }))}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                >
                  <option value="smtp">SMTP Clássico (Gmail, Outlook, etc.)</option>
                  <option value="graph">Microsoft Graph API (Azure App Registration / Client Secret)</option>
                </select>
              </div>

              {smtpConfig.provider === 'graph' ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">E-mail do Remetente (Conta Office 365)</label>
                      <input
                        type="email"
                        required
                        value={smtpConfig.user}
                        onChange={e => setSmtpConfig(prev => ({ ...prev, user: e.target.value }))}
                        placeholder="ex: iotnoc@ricas.com.br"
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nome do Remetente</label>
                      <input
                        type="text"
                        value={smtpConfig.fromName}
                        onChange={e => setSmtpConfig(prev => ({ ...prev, fromName: e.target.value }))}
                        placeholder="ex: Ricas Alertas"
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tenant ID (ID do Diretório no Azure)</label>
                      <input
                        type="text"
                        required
                        value={smtpConfig.tenantId || ''}
                        onChange={e => setSmtpConfig(prev => ({ ...prev, tenantId: e.target.value }))}
                        placeholder="ex: e983aea7-3f11-4b7a-8b86-72d7dfbc..."
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Client ID (ID do Aplicativo no Azure)</label>
                      <input
                        type="text"
                        required
                        value={smtpConfig.clientId || ''}
                        onChange={e => setSmtpConfig(prev => ({ ...prev, clientId: e.target.value }))}
                        placeholder="ex: 7071a89a-77e8-42cb-9052-548c3fbc..."
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Client Secret (Segredo do Azure App)</label>
                    <input
                      type="password"
                      required
                      value={smtpConfig.pass}
                      onChange={e => setSmtpConfig(prev => ({ ...prev, pass: e.target.value }))}
                      placeholder={smtpConfig.pass ? "••••••••••••••••" : "Valor do segredo (Secret Value)"}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Servidor SMTP (Host)</label>
                      <input
                        type="text"
                        required
                        value={smtpConfig.host}
                        onChange={e => setSmtpConfig(prev => ({ ...prev, host: e.target.value }))}
                        placeholder="ex: smtp.gmail.com"
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Porta</label>
                      <input
                        type="number"
                        required
                        value={smtpConfig.port}
                        onChange={e => setSmtpConfig(prev => ({ ...prev, port: e.target.value }))}
                        placeholder="ex: 465 ou 587"
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Usuário (E-mail)</label>
                      <input
                        type="email"
                        required
                        value={smtpConfig.user}
                        onChange={e => setSmtpConfig(prev => ({ ...prev, user: e.target.value }))}
                        placeholder="ex: alertas@ricas.com.br"
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Senha</label>
                      <input
                        type="password"
                        required
                        value={smtpConfig.pass}
                        onChange={e => setSmtpConfig(prev => ({ ...prev, pass: e.target.value }))}
                        placeholder="Senha de app ou SMTP"
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nome do Remetente</label>
                      <input
                        type="text"
                        value={smtpConfig.fromName}
                        onChange={e => setSmtpConfig(prev => ({ ...prev, fromName: e.target.value }))}
                        placeholder="ex: Ricas Alertas"
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">E-mail do Remetente (Opcional)</label>
                      <input
                        type="email"
                        value={smtpConfig.fromEmail}
                        onChange={e => setSmtpConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
                        placeholder="Se diferente do usuário"
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="smtpSecure"
                      checked={smtpConfig.secure}
                      onChange={e => setSmtpConfig(prev => ({ ...prev, secure: e.target.checked }))}
                      className="rounded bg-slate-900 border-slate-850 text-violet-600 focus:ring-violet-500 w-4 h-4"
                    />
                    <label htmlFor="smtpSecure" className="text-xs text-slate-300 select-none cursor-pointer">
                      Utilizar Conexão Segura SSL/TLS (Recomendado para porta 465)
                    </label>
                  </div>
                </div>
              )}

              {smtpFeedback && (
                <div className={`p-3 rounded-xl text-xs leading-relaxed ${smtpFeedback.success ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                  {smtpFeedback.message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingSmtp || testingSmtp}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {savingSmtp ? 'Salvando...' : 'Salvar Configurações de E-mail'}
                </button>
              </div>
            </form>

            <div className="border-t border-slate-800/80 pt-4 mt-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Testar Envio de E-mail</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={testRecipient}
                  onChange={e => setTestRecipient(e.target.value)}
                  placeholder="Destinatário para teste"
                  className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-all"
                />
                <button
                  onClick={handleTestSmtp}
                  disabled={testingSmtp || savingSmtp}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {testingSmtp ? 'Testando...' : 'Testar Envio'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BANCO DE DADOS & BACKUPS */}
        {activeTab === 'database' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Coluna 1 & 2: Ações de Banco */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel rounded-2xl p-6 bg-slate-900/20 border border-slate-800/40 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-violet-400" />
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Controle de Banco de Dados</h2>
                  </div>
                  <button
                    onClick={createBackup}
                    disabled={dbActionLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <History className="w-4 h-4" />
                    Criar Backup de Segurança
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Aqui você pode gerenciar o arquivo SQLite <code className="text-violet-300 font-mono">dashboard.db</code> de produção. 
                  Sempre que fizer alterações locais no Windows, baixe o banco de produção para não sobrescrever dados novos, ou faça o upload seguro com validação automática de esquema.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Baixar Banco */}
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Baixar Banco Ativo</h3>
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                        Baixe o banco de dados ativo direto da produção para analisar, ver alterações ou trabalhar localmente no Windows.
                      </p>
                    </div>
                    <a
                      href="/api/admin/database?download=true"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-slate-600 transition-all text-center"
                    >
                      <Download className="w-4 h-4" />
                      Download dashboard.db
                    </a>
                  </div>

                  {/* Upload e Validação */}
                  <div className="p-4 rounded-xl bg-violet-600/5 border border-violet-500/10 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-1">Enviar e Validar Novo Banco</h3>
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                        Suba o banco editado do seu Windows. O servidor fará uma validação completa para verificar se todas as tabelas e esquemas do Prisma estão 100% corretos antes de aplicar.
                      </p>
                    </div>
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 hover:from-violet-600/30 hover:to-fuchsia-600/30 text-violet-300 hover:text-white rounded-xl text-xs font-bold border border-violet-500/20 hover:border-violet-500/30 cursor-pointer transition-all text-center">
                      <Upload className="w-4 h-4" />
                      {dbActionLoading ? 'Validando...' : 'Selecionar e Validar'}
                      <input
                        type="file"
                        accept=".db"
                        onChange={handleDbUpload}
                        disabled={dbActionLoading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Mensagens de feedback de Upload */}
                {uploadError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed font-mono">
                    <X className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Erro de Upload:</span> {uploadError}
                    </div>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs leading-relaxed font-mono">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Sucesso:</span> {uploadSuccess}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna 3: Backups List */}
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 bg-slate-900/20 border border-slate-800/40">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                  <History className="w-4 h-4 text-violet-400" />
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Backups ({backups.length})</h2>
                </div>

                {loadingBackups ? (
                  <p className="text-xs text-slate-500 italic">Carregando backups...</p>
                ) : backups.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-800/20 rounded-xl border border-slate-700/10 text-center">
                    Nenhum backup encontrado.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                    {backups.map((b) => (
                      <div key={b.filename} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/50 transition-all flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-mono text-[10px] text-violet-300 truncate break-all flex-1">{b.filename}</p>
                          <span className="text-[10px] text-slate-500 shrink-0 font-bold">{b.size}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
                          <span className="text-[9px] text-slate-500">{new Date(b.createdAt).toLocaleDateString('pt-BR')}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => restoreBackup(b.filename)}
                              disabled={dbActionLoading}
                              className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded text-[9px] font-bold uppercase transition-all"
                            >
                              Restaurar
                            </button>
                            <button
                              onClick={() => deleteBackup(b.filename)}
                              disabled={dbActionLoading}
                              className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ATIVIDADE & DEPLOY */}
        {activeTab === 'logs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Coluna 1: Logs de Atividade */}
            <div className="glass-panel rounded-2xl p-6 bg-slate-900/20 border border-slate-800/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-violet-400" />
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Log de Atividade</h2>
                </div>
                {logs.length > 0 && (
                  <button onClick={() => setLogs([])} className="text-[10px] text-slate-550 hover:text-slate-300 transition-all font-bold uppercase">
                    Limpar
                  </button>
                )}
              </div>
              <div className="bg-black/60 rounded-xl p-4 min-h-[300px] max-h-[380px] overflow-y-auto custom-scrollbar font-mono text-[11px] text-green-400 space-y-1">
                {logs.length === 0 ? (
                  <p className="text-slate-600">▊ Aguardando ações de sincronismo...</p>
                ) : (
                  logs.map((log, i) => (
                    <p key={i} className={log.includes('❌') ? 'text-red-400' : log.includes('⚠') || log.includes('⏳') ? 'text-amber-400' : 'text-green-400'}>
                      {log}
                    </p>
                  ))
                )}
              </div>
            </div>

            {/* Coluna 2: Deploy Local Guide */}
            <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 border border-violet-500/10 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Code className="w-5 h-5 text-violet-400" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Deploy Local (Windows)</h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sempre que editar arquivos de código ou atualizar seu banco no Windows, utilize o PowerShell local para fazer o deploy automatizado seguro:
              </p>

              <div className="space-y-4 font-mono text-xs pt-1">
                <div>
                  <p className="text-violet-300 font-bold mb-1.5 flex items-center gap-1">🚀 1. Deploy Incremental (Recomendado)</p>
                  <div className="p-2.5 rounded-xl bg-black/40 text-slate-300 border border-slate-800 flex justify-between items-center">
                    <span>.\deploy-local.ps1</span>
                    <button 
                      onClick={() => { navigator.clipboard.writeText('.\\deploy-local.ps1'); alert('Copiado!'); }}
                      className="text-[10px] bg-slate-850 hover:bg-slate-700 px-2 py-1 rounded-lg text-slate-450 hover:text-white transition-all font-bold"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-fuchsia-300 font-bold mb-1.5 flex items-center gap-1">🧹 2. Instalação Limpa do Zero</p>
                  <div className="p-2.5 rounded-xl bg-black/40 text-slate-300 border border-slate-800 flex justify-between items-center">
                    <span>.\deploy-clean-install.ps1</span>
                    <button 
                      onClick={() => { navigator.clipboard.writeText('.\\deploy-clean-install.ps1'); alert('Copiado!'); }}
                      className="text-[10px] bg-slate-850 hover:bg-slate-700 px-2 py-1 rounded-lg text-slate-450 hover:text-white transition-all font-bold"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed font-sans">
                ℹ️ Ambos os scripts agora possuem proteção automática contra traduções de permissão do Windows NTFS, usam compatibilidade de dependências e fazem backup do banco ativo antes de compilar o Next.js.
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
