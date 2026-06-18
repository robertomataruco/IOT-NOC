"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { 
  FileText, Activity, AlertCircle, Clock, CheckCircle2, 
  HelpCircle, ChevronRight, User, Plus, X, Search, 
  Trash2, Edit, Save, Share2, MessageSquare, Mail, Printer,
  UploadCloud, FileImage, Eye, Inbox, Flame, ShieldAlert,
  Layers, CheckSquare, Send, Check, AlertTriangle, Layers3,
  ExternalLink, Sparkles, ArrowLeft, LogOut, Loader2, Sliders,
  BarChart3, Bell, TrendingUp, MapPin, Users
} from 'lucide-react';

export default function StandaloneOsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [osList, setOsList] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTabFilter, setCurrentTabFilter] = useState('ALL'); // ALL, MY, UNASSIGNED, NOVA, ATENDIMENTO, CONCLUIDA
  
  // Selected OS for detailed workspace
  const [selectedOs, setSelectedOs] = useState<any | null>(null);
  
  // Tabs inside ticket detail workspace
  const [workspaceTab, setWorkspaceTab] = useState<'PROPERTIES' | 'FEED' | 'SOLUTION'>('FEED');

  // Input states
  const [newLogText, setNewLogText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [techName, setTechName] = useState('');
  const [solutionText, setSolutionText] = useState('');
  const [uploading, setUploading] = useState(false);

  // Alarms associated with selected OS
  const [activeAlarms, setActiveAlarms] = useState<any[]>([]);
  const [loadingAlarms, setLoadingAlarms] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [sendingWhatsapp, setSendingWhatsapp] = useState(false);

  // Custom panel resizing state
  const [rightPanelWidth, setRightPanelWidth] = useState(500);
  const [isResizing, setIsResizing] = useState(false);

  // Custom filters state
  const [customFilters, setCustomFilters] = useState({
    status: '',
    urgency: '',
    category: '',
    technician: ''
  });

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 320 && newWidth < 900) {
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; sub?: string; type?: 'success' | 'info' } | null>(null);
  const showToast = (message: string, sub?: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, sub, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Reports state
  const [reportTab, setReportTab] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [loadingReport, setLoadingReport] = useState(false);

  const fetchReport = async (year?: number) => {
    setLoadingReport(true);
    try {
      const res = await axios.get(`/api/os/reports?year=${year || reportYear}`);
      if (res.data.success) setReportData(res.data.data);
    } catch (err) {
      console.error('Erro ao carregar relatório:', err);
    } finally {
      setLoadingReport(false);
    }
  };

  // New ticket modal
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    description: '',
    category: 'Redes',
    urgency: 'MEDIA',
    impact: 'MEDIA',
    cityId: '',
    deviceId: '',
    technician: '',
    requester: '',
    observer: ''
  });

  // Pending Reason modal states
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [pendingReasonSelect, setPendingReasonSelect] = useState('Empresa Terceira');
  const [customPendingReason, setCustomPendingReason] = useState('');

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch list, cities, devices and technicians
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOs, resCities, resDevices, resTechs] = await Promise.all([
        axios.get('/api/os'),
        axios.get('/api/admin/cities'),
        axios.get('/api/admin/devices'),
        axios.get('/api/os/technicians')
      ]);

      if (resOs.data.success) {
        setOsList(resOs.data.data);
      }
      if (resCities.data.success) {
        setCities(resCities.data.data);
      }
      if (resDevices.data.success) {
        setDevices(resDevices.data.data);
      }
      if (resTechs.data.success) {
        setTechnicians(resTechs.data.data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do portal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const getTechniciansForSelectedOs = () => {
    if (!selectedOs || !selectedOs.deviceId) return technicians;
    const dev = devices.find(d => d.id === selectedOs.deviceId);
    if (!dev || !dev.companyId) return technicians;
    const filtered = technicians.filter(t => t.companyId === dev.companyId);
    return filtered.length > 0 ? filtered : technicians;
  };

  const getTechniciansForNewTicket = () => {
    if (!newTicketForm.deviceId) return technicians;
    const dev = devices.find(d => d.id === newTicketForm.deviceId);
    if (!dev || !dev.companyId) return technicians;
    const filtered = technicians.filter(t => t.companyId === dev.companyId);
    return filtered.length > 0 ? filtered : technicians;
  };

  const handleSendWhatsappNotification = async () => {
    if (!selectedOs) return;
    setSendingWhatsapp(true);
    try {
      const res = await axios.post('/api/os/send-whatsapp', { osId: selectedOs.osId });
      if (res.data.success) {
        alert(res.data.message || "Notificação enviada por WhatsApp!");
      }
    } catch (err: any) {
      console.error("Erro ao enviar WhatsApp:", err);
      alert(err.response?.data?.error || "Falha ao enviar notificação via WhatsApp.");
    } finally {
      setSendingWhatsapp(false);
    }
  };

  // Fetch traps/alarms when an OS is selected
  const fetchAlarmsForSelectedOs = async (os: any) => {
    if (!os) {
      setActiveAlarms([]);
      return;
    }
    
    // Fallback: If os.deviceId is missing (legacy ticket), try to find the device ID from the devices list using equipment name or IP!
    let targetDeviceId = os.deviceId;
    if (!targetDeviceId && devices.length > 0) {
      const foundDevice = devices.find(d => 
        (d.name && d.name.toLowerCase() === os.equipment?.toLowerCase()) || 
        (d.ip && d.ip === os.ip)
      );
      if (foundDevice) {
        targetDeviceId = foundDevice.id;
      }
    }

    if (!targetDeviceId) {
      setActiveAlarms([]);
      return;
    }

    setLoadingAlarms(true);
    try {
      const res = await axios.get(`/api/traps?deviceId=${targetDeviceId}`);
      if (res.data.success && res.data.data) {
        setActiveAlarms(res.data.data);
      } else {
        setActiveAlarms([]);
      }
    } catch (err) {
      console.error("Erro ao carregar alarmes do dispositivo:", err);
      setActiveAlarms([]);
    } finally {
      setLoadingAlarms(false);
    }
  };

  useEffect(() => {
    if (selectedOs) {
      fetchAlarmsForSelectedOs(selectedOs);
    }
  }, [selectedOs, devices]); // Triggers lookup as soon as devices list finishes loading

  // Group traps by alarmName
  const getGroupedAlarms = () => {
    if (!activeAlarms || activeAlarms.length === 0) return [];
    
    const groups: Record<string, {
      alarmName: string;
      description: string;
      severity: number;
      count: number;
      firstOccurrence: string;
      latestOccurrence: string;
    }> = {};

    activeAlarms.forEach(trap => {
      const name = trap.alarmName || 'Alarme Geral';
      if (!groups[name]) {
        groups[name] = {
          alarmName: name,
          description: trap.description || '',
          severity: trap.severity || 0,
          count: 0,
          firstOccurrence: trap.timestamp,
          latestOccurrence: trap.timestamp
        };
      }
      groups[name].count += 1;
      
      // Compare to find the first/oldest occurrence
      if (new Date(trap.timestamp).getTime() < new Date(groups[name].firstOccurrence).getTime()) {
        groups[name].firstOccurrence = trap.timestamp;
      }
      // Compare to find the latest occurrence
      if (new Date(trap.timestamp).getTime() > new Date(groups[name].latestOccurrence).getTime()) {
        groups[name].latestOccurrence = trap.timestamp;
      }
    });

    return Object.values(groups);
  };

  // Update Status or fields
  const handleUpdateOs = async (osId: string, updates: any) => {
    try {
      const res = await axios.put('/api/os', { osId, ...updates });
      if (res.data.success) {
        setOsList(prev => prev.map(item => item.osId === osId ? res.data.data : item));
        if (selectedOs && selectedOs.osId === osId) {
          setSelectedOs(res.data.data);
        }
      }
    } catch (err) {
      console.error("Erro ao atualizar OS:", err);
    }
  };

  const handleConfirmPending = async () => {
    if (!selectedOs) return;
    const finalReason = pendingReasonSelect === 'OUTRO' ? customPendingReason.trim() : pendingReasonSelect;
    if (!finalReason) {
      alert("Por favor, descreva ou selecione o motivo da espera.");
      return;
    }
    
    await handleUpdateOs(selectedOs.osId, {
      status: 'EM_ESPERA',
      pendingReason: finalReason,
      newLog: `Lifecycle: Status atualizado para Pendente/Pausa. Motivo: ${finalReason}`
    });
    
    setIsPendingModalOpen(false);
    setPendingReasonSelect('Empresa Terceira');
    setCustomPendingReason('');
  };

  // Add Comment/Timeline entry
  const handleAddLog = async () => {
    if (!newLogText.trim() || !selectedOs) return;
    const author = session?.user?.name || "NOC";
    try {
      const res = await axios.put('/api/os', { 
        osId: selectedOs.osId, 
        newLog: `[${author}] ${newLogText.trim()}` 
      });
      if (res.data.success) {
        setOsList(prev => prev.map(item => item.osId === selectedOs.osId ? res.data.data : item));
        setSelectedOs(res.data.data);
        setNewLogText('');
      }
    } catch (err) {
      console.error("Erro ao adicionar log:", err);
    }
  };

  // Submit Solution (Declares OS as Solved)
  const handleSolveTicket = async () => {
    if (!solutionText.trim() || !selectedOs) return;
    const author = session?.user?.name || "Técnico";
    try {
      const res = await axios.put('/api/os', { 
        osId: selectedOs.osId, 
        status: 'CONCLUIDA',
        notes: `SOLUÇÃO APLICADA por ${author}:\n${solutionText.trim()}`,
        newLog: `Chamado solucionado por ${author}. Solução: ${solutionText.trim()}` 
      });
      if (res.data.success) {
        setOsList(prev => prev.map(item => item.osId === selectedOs.osId ? res.data.data : item));
        setSelectedOs(res.data.data);
        setSolutionText('');
        setWorkspaceTab('FEED');
      }
    } catch (err) {
      console.error("Erro ao registrar solução:", err);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedOs) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('osId', selectedOs.osId);

    try {
      const res = await axios.post('/api/os/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setOsList(prev => prev.map(item => item.osId === selectedOs.osId ? res.data.data : item));
        setSelectedOs(res.data.data);
      }
    } catch (err) {
      console.error("Erro ao fazer upload do anexo:", err);
      alert("Falha no upload do arquivo.");
    } finally {
      setUploading(false);
    }
  };

  // Delete OS
  const handleDeleteOs = async (osId: string) => {
    if (!confirm("Tem certeza que deseja remover este chamado permanentemente?")) return;
    try {
      const res = await axios.delete(`/api/os?osId=${osId}`);
      if (res.data.success) {
        setOsList(prev => prev.filter(item => item.osId !== osId));
        if (selectedOs && selectedOs.osId === osId) {
          setSelectedOs(null);
        }
      }
    } catch (err) {
      console.error("Erro ao deletar chamado:", err);
    }
  };

  // Create Ticket
  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextNumber = osList.length + 1;
    const computedOsId = `OS-${new Date().getFullYear()}-${String(nextNumber).padStart(4, '0')}`;
    
    // Find device IP and Name if selected
    const selectedDevice = devices.find(d => d.id === newTicketForm.deviceId);
    const selectedCity = cities.find(c => c.id === newTicketForm.cityId);

    const ticketBody = {
      osId: computedOsId,
      title: `${selectedCity ? selectedCity.name : 'Outros'} - ${selectedDevice ? selectedDevice.name : 'Infraestrutura Geral'}`,
      description: newTicketForm.description,
      category: newTicketForm.category,
      urgency: newTicketForm.urgency,
      impact: newTicketForm.impact,
      status: 'NOVA',
      site: selectedCity ? selectedCity.name : 'Outros',
      equipment: selectedDevice ? selectedDevice.name : 'Infraestrutura Geral',
      deviceId: newTicketForm.deviceId || '',
      cityId: newTicketForm.cityId || '',
      ip: selectedDevice ? selectedDevice.ip : '0.0.0.0',
      sn: selectedDevice ? (selectedDevice.serial || 'N/A') : 'N/A',
      technician: newTicketForm.technician || '',
      requester: newTicketForm.requester || session?.user?.name || 'Portal User',
      attachments: [],
      logs: [
        { timestamp: new Date().toISOString(), text: `Chamado registrado por ${session?.user?.name || 'NOC'}.` }
      ]
    };

    try {
      const res = await axios.post('/api/os', { ...ticketBody, observer: newTicketForm.observer || '' });
      if (res.data.success) {
        setOsList(prev => [res.data.data, ...prev]);
        setSelectedOs(res.data.data);
        setWorkspaceTab('FEED');
        setIsNewTicketModalOpen(false);
        const siteName = ticketBody.site;
        const reqName = ticketBody.requester;
        showToast(
          `✅ Chamado ${ticketBody.osId} registrado com sucesso!`,
          `Requerente: ${reqName} • Site: ${siteName} • ${new Date().toLocaleString('pt-BR')}`,
          'success'
        );
        setNewTicketForm({
          description: '',
          category: 'Redes',
          urgency: 'MEDIA',
          impact: 'MEDIA',
          cityId: '',
          deviceId: '',
          technician: '',
          requester: '',
          observer: ''
        });
      }
    } catch (err) {
      console.error("Erro ao criar chamado:", err);
      alert("Erro ao criar chamado.");
    }
  };

  // Filters
  const filteredList = osList.filter(item => {
    const matchesSearch = 
      item.osId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.equipment || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.site || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.technician || '').toLowerCase().includes(searchQuery.toLowerCase());

    const isCurrentTech = item.technician?.toLowerCase() === session?.user?.name?.toLowerCase();

    if (currentTabFilter === 'ALL') return matchesSearch;
    if (currentTabFilter === 'MY') return matchesSearch && isCurrentTech;
    if (currentTabFilter === 'UNASSIGNED') return matchesSearch && !item.technician;
    if (currentTabFilter === 'NOVA') return matchesSearch && item.status === 'NOVA';
    if (currentTabFilter === 'ATENDIMENTO') return matchesSearch && item.status === 'EM_ATENDIMENTO';
    if (currentTabFilter === 'CONCLUIDA') return matchesSearch && item.status === 'CONCLUIDA';
    if (currentTabFilter === 'NAO_SOLUCIONADO') return matchesSearch && item.status !== 'CONCLUIDA';
    if (currentTabFilter === 'CUSTOM') {
      const matchesStatus = !customFilters.status || item.status === customFilters.status;
      const priority = getPriorityLabel(item.urgency || 'MEDIA', item.impact || 'MEDIA');
      const matchesUrgency = !customFilters.urgency || item.urgency === customFilters.urgency || priority.name.toUpperCase() === customFilters.urgency.toUpperCase();
      const matchesCategory = !customFilters.category || item.category === customFilters.category;
      const matchesTech = !customFilters.technician || item.technician === customFilters.technician;
      return matchesSearch && matchesStatus && matchesUrgency && matchesCategory && matchesTech;
    }
    return matchesSearch;
  });

  // Calculate Urgência / Impacto Color code
  const getPriorityLabel = (urgency: string, impact: string) => {
    if (urgency === 'ALTA' && impact === 'ALTA') return { name: 'Crítica', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
    if (urgency === 'ALTA' || impact === 'ALTA') return { name: 'Alta', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
    if (urgency === 'MEDIA' || impact === 'MEDIA') return { name: 'Média', color: 'text-amber-400 bg-amber-500/10 border-amber-550/30' };
    return { name: 'Baixa', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'NOVA':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'EM_ATENDIMENTO':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'EM_ESPERA':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'CONCLUIDA':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-slate-400 bg-slate-550/10 border-slate-550/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NOVA': return 'Novo';
      case 'EM_ATENDIMENTO': return 'Em Atendimento';
      case 'EM_ESPERA': return 'Pendente';
      case 'CONCLUIDA': return 'Solucionado';
      default: return status;
    }
  };

  if (status === 'loading') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zabbix-dark text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-zabbix-primary"></div>
      </div>
    );
  }

  const isTechUser = (session?.user as any)?.role === 'TECHNICIAN';

  return (
    <div className="h-screen w-full flex flex-col bg-zabbix-dark text-slate-200 overflow-hidden font-sans">
      
      {/* GLPI Standard Top Header */}
      <div className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center justify-center h-12">
            <img 
              src="/logo-ricas-new.png?v=8" 
              alt="Logo Ricas IoT NOC"
              style={{ 
                height: '42px',
                maxHeight: '42px',
                imageRendering: '-webkit-optimize-contrast'
              }}
              className="object-contain transition-transform duration-200 hover:scale-[1.02] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            />
          </a>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-zabbix-primary/10 text-zabbix-primary border border-zabbix-primary/20">ITIL ServiceDesk</span>
        </div>

        {/* Top Indicators */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span className="text-slate-400">Novos:</span>
            <span className="text-white">{osList.filter(o => o.status === 'NOVA').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span className="text-slate-400">Processando:</span>
            <span className="text-white">{osList.filter(o => o.status === 'EM_ATENDIMENTO').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">Solucionados:</span>
            <span className="text-white">{osList.filter(o => o.status === 'CONCLUIDA').length}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Reports button */}
          <button
            onClick={() => { setReportTab(!reportTab); if (!reportTab) fetchReport(); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all ${
              reportTab
                ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white border-slate-850 hover:border-slate-700'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Relatórios</span>
          </button>

          {/* Create ticket button */}
          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-zabbix-primary to-cyan-600 hover:from-zabbix-primary/90 hover:to-cyan-600/90 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-md shadow-zabbix-primary/5 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-white" />
            Novo Chamado
          </button>

          {/* Navigation back to main dashboard (only for non-technicians) */}
          {!isTechUser && (
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Portal
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/login";
            }}
            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 transition-all hover:scale-105"
            title="Sair do Sistema"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Main Body with GLPI standard Sub-Sidebar Filters */}
      <div className="flex-1 overflow-hidden flex">
        
        {/* GLPI 11 Left Navigation Sidebar Panel (Visões de Chamados) */}
        <div className="w-64 bg-slate-950/40 border-r border-slate-900 flex flex-col p-4 gap-2 shrink-0">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-3 mb-1 block">Visões de Chamados</span>
          {[
            { id: 'ALL', label: 'Todos os Chamados', icon: Inbox, count: osList.length },
            { id: 'MY', label: 'Atribuídos a mim', icon: User, count: osList.filter(o => o.technician?.toLowerCase() === session?.user?.name?.toLowerCase()).length },
            { id: 'UNASSIGNED', label: 'Sem atribuição', icon: HelpCircle, count: osList.filter(o => !o.technician).length },
            { id: 'NOVA', label: 'Chamados Novos', icon: Clock, count: osList.filter(o => o.status === 'NOVA').length },
            { id: 'ATENDIMENTO', label: 'Em Atendimento', icon: Activity, count: osList.filter(o => o.status === 'EM_ATENDIMENTO').length },
            { id: 'NAO_SOLUCIONADO', label: 'Não Solucionados', icon: AlertCircle, count: osList.filter(o => o.status !== 'CONCLUIDA').length },
            { id: 'CONCLUIDA', label: 'Solucionados', icon: CheckCircle2, count: osList.filter(o => o.status === 'CONCLUIDA').length },
            { 
              id: 'CUSTOM', 
              label: 'Filtro Personalizado', 
              icon: Sliders, 
              count: osList.filter(item => {
                const matchesStatus = !customFilters.status || item.status === customFilters.status;
                const priority = getPriorityLabel(item.urgency || 'MEDIA', item.impact || 'MEDIA');
                const matchesUrgency = !customFilters.urgency || item.urgency === customFilters.urgency || priority.name.toUpperCase() === customFilters.urgency.toUpperCase();
                const matchesCategory = !customFilters.category || item.category === customFilters.category;
                const matchesTech = !customFilters.technician || item.technician === customFilters.technician;
                return matchesStatus && matchesUrgency && matchesCategory && matchesTech;
              }).length 
            },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTabFilter(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all border ${
                currentTabFilter === tab.id 
                ? 'bg-zabbix-primary/10 border-zabbix-primary/20 text-zabbix-primary' 
                : 'border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left truncate">{tab.label}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-850 text-slate-500">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Center Panel: Full Ticket List */}
        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          
          {/* Search bar */}
          <div className="relative shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Pesquisar por site, equipamento, chamado ou técnico..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-zabbix-primary transition-all font-semibold"
            />
          </div>

          {/* Custom Filters panel */}
          {currentTabFilter === 'CUSTOM' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-900/20 border border-slate-850 rounded-2xl animate-in slide-in-from-top-2 duration-150 shrink-0">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                <select
                  value={customFilters.status}
                  onChange={e => setCustomFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 font-semibold focus:outline-none focus:border-zabbix-primary cursor-pointer"
                >
                  <option value="">Todos</option>
                  <option value="NOVA">Novo</option>
                  <option value="EM_ATENDIMENTO">Em Atendimento</option>
                  <option value="EM_ESPERA">Pendente</option>
                  <option value="CONCLUIDA">Solucionado</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-550 uppercase tracking-wider">Urgência / Prioridade</label>
                <select
                  value={customFilters.urgency}
                  onChange={e => setCustomFilters(prev => ({ ...prev, urgency: e.target.value }))}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 font-semibold focus:outline-none focus:border-zabbix-primary cursor-pointer"
                >
                  <option value="">Todas</option>
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta / Crítica</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-550 uppercase tracking-wider">Categoria</label>
                <select
                  value={customFilters.category}
                  onChange={e => setCustomFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 font-semibold focus:outline-none focus:border-zabbix-primary cursor-pointer"
                >
                  <option value="">Todas</option>
                  <option value="Redes">Redes / Fibra</option>
                  <option value="Energia">Energia / Kron</option>
                  <option value="Hardware">Hardware / Roteador</option>
                  <option value="Software">Software / Zabbix</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-550 uppercase tracking-wider">Responsável</label>
                <select
                  value={customFilters.technician}
                  onChange={e => setCustomFilters(prev => ({ ...prev, technician: e.target.value }))}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 font-semibold focus:outline-none focus:border-zabbix-primary cursor-pointer"
                >
                  <option value="">Todos</option>
                  {technicians.map((t, idx) => (
                    <option key={idx} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Ticket Cards Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredList.length === 0 ? (
              <div className="p-12 rounded-2xl border border-slate-850 border-dashed text-center bg-slate-900/10">
                <Inbox className="w-12 h-12 text-slate-650 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-white">Nenhum chamado encontrado</h3>
                <p className="text-xs text-slate-550 mt-1">Nenhuma ocorrência registrada nesta aba ou busca.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredList.map((os) => {
                  const priority = getPriorityLabel(os.urgency || 'MEDIA', os.impact || 'MEDIA');
                  const isSelected = selectedOs?.osId === os.osId;
                  return (
                    <div 
                      key={os.osId}
                      onClick={() => {
                        setSelectedOs(os);
                        setNotesText(os.notes || '');
                        setTechName(os.technician || '');
                      }}
                      className={`p-4 bg-slate-900/40 hover:bg-slate-900/70 border rounded-2xl cursor-pointer transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        isSelected ? 'border-zabbix-primary bg-zabbix-primary/5 shadow-[0_0_15px_rgba(34,197,94,0.05)]' : 'border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Priority indicator bar */}
                        <div className={`w-1.5 h-10 rounded-full shrink-0 ${
                          priority.name === 'Crítica' ? 'bg-red-500' :
                          priority.name === 'Alta' ? 'bg-orange-500' :
                          priority.name === 'Média' ? 'bg-amber-500' : 'bg-slate-500'
                        }`}></div>

                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-black text-slate-400">{os.osId}</span>
                            <span className="text-xs font-black text-white truncate max-w-[340px] uppercase tracking-wide">
                              {os.site} - {os.equipment}
                            </span>
                             <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider shrink-0 ${getStatusStyle(os.status)}`}>
                              {getStatusText(os.status)}
                            </span>
                            {os.status === 'EM_ESPERA' && os.pendingReason && (
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider shrink-0 bg-amber-500/10 border-amber-500/20 text-amber-400 max-w-[200px] truncate animate-pulse" title={os.pendingReason}>
                                Pausa: {os.pendingReason}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider shrink-0 ${priority.color}`}>
                              P: {priority.name}
                            </span>
                            {os.glpiTicketId && (
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider shrink-0 bg-violet-500/15 border-violet-500/25 text-violet-400">
                                GLPI #{os.glpiTicketId}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500">
                            <div>IP Equipamento: <span className="font-mono text-slate-350 font-bold">{os.ip || '0.0.0.0'}</span></div>
                            {os.category && <div>Categoria: <span className="font-semibold text-slate-400">{os.category}</span></div>}
                            <div>Aberto: <span className="font-medium text-slate-450">{new Date(os.createdAt).toLocaleDateString('pt-BR')}</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                        <div className="text-right">
                          <span className="text-[8px] font-bold text-slate-550 uppercase block">Responsável</span>
                          <span className="font-bold text-xs text-slate-300 truncate max-w-[120px] block">
                            {os.technician || 'Sem Atribuição'}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Panel: ITIL Ticket Workspace */}
        {selectedOs ? (
          <>
            {/* Resizable Divider splitter */}
            <div 
              onMouseDown={startResize}
              className={`w-1.5 h-full cursor-col-resize hover:bg-zabbix-primary/80 transition-colors shrink-0 z-20 flex items-center justify-center relative ${
                isResizing ? 'bg-zabbix-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-900 border-l border-r border-slate-850/30'
              }`}
            >
              <div className="w-[2px] h-8 rounded bg-slate-700/60" />
            </div>
            
            <div 
              style={{ width: `${rightPanelWidth}px` }}
              className="bg-slate-950/60 flex flex-col shrink-0 overflow-hidden animate-in slide-in-from-right duration-250"
            >
            
            {/* Header details */}
            <div className="p-4 border-b border-slate-900 bg-slate-950/80 flex items-center justify-between shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-black text-slate-500">{selectedOs.osId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider ${getStatusStyle(selectedOs.status)}`}>
                    {getStatusText(selectedOs.status)}
                  </span>
                  {selectedOs.glpiTicketId && (
                    <a 
                      href={`http://192.168.67.95/front/ticket.form.php?id=${selectedOs.glpiTicketId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-all flex items-center gap-1"
                      title="Abrir chamado no GLPI 11"
                    >
                      <ExternalLink className="w-2.5 h-2.5" /> GLPI #{selectedOs.glpiTicketId}
                    </a>
                  )}
                </div>
                <h2 className="text-sm font-black text-white truncate mt-1 uppercase tracking-wide" title={`${selectedOs.site} - ${selectedOs.equipment}`}>
                  {selectedOs.site} - {selectedOs.equipment}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => window.print()}
                  title="Imprimir / Salvar PDF"
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-zabbix-primary transition-all"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelectedOs(null)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ITIL Tabs Navigation */}
            <div className="flex border-b border-slate-900 bg-slate-950/30 text-[10px] font-black uppercase tracking-wider shrink-0">
              {[
                { id: 'FEED', label: 'Processamento (Timeline)', icon: Activity },
                { id: 'PROPERTIES', label: 'Propriedades (ITIL)', icon: Layers },
                { id: 'SOLUTION', label: 'Solução', icon: CheckCircle2 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setWorkspaceTab(tab.id as any)}
                  className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-2 transition-all ${
                    workspaceTab === tab.id 
                    ? 'border-zabbix-primary text-zabbix-primary bg-zabbix-primary/5' 
                    : 'border-transparent text-slate-500 hover:text-slate-350'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents Workspace Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              
              {/* TAB 1: PROPERTIES (ITIL Settings) */}
              {workspaceTab === 'PROPERTIES' && (
                <div className="space-y-6">
                  
                  {/* Quick Change Status Buttons */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Status do Ciclo de Vida ITIL</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-wide">
                      <button
                        onClick={() => handleUpdateOs(selectedOs.osId, { status: 'NOVA', newLog: 'Lifecycle: Status retornado para Novo' })}
                        className={`py-2 rounded-xl border text-center transition-all ${
                          selectedOs.status === 'NOVA'
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                          : 'bg-white/5 border-slate-850 text-slate-400 hover:text-white'
                        }`}
                      >
                        Novo (Aberto)
                      </button>
                      <button
                        onClick={() => handleUpdateOs(selectedOs.osId, { status: 'EM_ATENDIMENTO', newLog: 'Lifecycle: Status atualizado para Em Atendimento' })}
                        className={`py-2 rounded-xl border text-center transition-all ${
                          selectedOs.status === 'EM_ATENDIMENTO'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-white/5 border-slate-850 text-slate-400 hover:text-white'
                        }`}
                      >
                        Em Atendimento
                      </button>
                      <button
                        onClick={() => setIsPendingModalOpen(true)}
                        className={`py-2 rounded-xl border text-center transition-all ${
                          selectedOs.status === 'EM_ESPERA'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-white/5 border-slate-850 text-slate-400 hover:text-white'
                        }`}
                      >
                        Pendente (Espera)
                      </button>
                      <button
                        onClick={() => handleUpdateOs(selectedOs.osId, { status: 'CONCLUIDA', newLog: 'Lifecycle: Status finalizado como Solucionado' })}
                        className={`py-2 rounded-xl border text-center transition-all ${
                          selectedOs.status === 'CONCLUIDA'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-white/5 border-slate-850 text-slate-400 hover:text-white'
                        }`}
                      >
                        Solucionado
                      </button>
                    </div>
                  </div>

                  {selectedOs.status === 'EM_ESPERA' && selectedOs.pendingReason && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest block">Motivo da Espera (Pausa)</span>
                      <p className="text-xs font-semibold text-slate-200">{selectedOs.pendingReason}</p>
                    </div>
                  )}

                  {/* Attributes configuration card */}
                  <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-slate-400" /> Atributos do Chamado
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] font-bold text-slate-550 uppercase block">Impacto</span>
                        <span className="text-xs font-semibold text-white uppercase">{selectedOs.impact || 'Média'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-550 uppercase block">Urgência</span>
                        <span className="text-xs font-semibold text-white uppercase">{selectedOs.urgency || 'Média'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-550 uppercase block">Requerente</span>
                        <span className="text-xs font-semibold text-white truncate block">{selectedOs.requester || 'Portal User'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-550 uppercase block">Categoria</span>
                        <span className="text-xs font-semibold text-white uppercase truncate block">{selectedOs.category || 'Redes'}</span>
                      </div>
                    </div>

                    {/* Observer field */}
                    <div className="pt-3 border-t border-slate-900/60">
                      <label className="text-[9px] font-bold text-slate-550 uppercase block mb-1">Observador (E-mail para cópia das notificações)</label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="observador@empresa.com.br"
                          defaultValue={selectedOs.observer || ''}
                          id="observer-input"
                          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-zabbix-primary transition-all font-semibold placeholder-slate-700"
                        />
                        <button
                          onClick={() => {
                            const val = (document.getElementById('observer-input') as HTMLInputElement)?.value || '';
                            handleUpdateOs(selectedOs.osId, { observer: val, newLog: val ? `Observador adicionado: ${val}` : 'Observador removido.' });
                          }}
                          className="px-3 py-2 bg-zabbix-primary/10 hover:bg-zabbix-primary text-zabbix-primary hover:text-black rounded-xl border border-zabbix-primary/20 transition-all text-[10px] font-black uppercase shrink-0"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tech Allocation */}
                  <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Atribuição & Responsável
                    </h4>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold text-slate-550 uppercase">Técnico Encarregado</label>
                      <div className="flex gap-2">
                        <select
                          value={techName}
                          onChange={e => setTechName(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-zabbix-primary transition-all font-semibold"
                        >
                          <option value="">Selecione um técnico...</option>
                          {getTechniciansForSelectedOs().map(tech => (
                            <option key={tech.id} value={tech.name}>
                              {tech.name} {tech.company ? `(${tech.company})` : ''}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleUpdateOs(selectedOs.osId, { technician: techName, newLog: `Operação: Técnico atribuído: ${techName}` })}
                          className="px-4 py-2 bg-zabbix-primary text-black font-bold text-xs uppercase rounded-xl hover:bg-zabbix-primary/80 transition-all flex items-center justify-center shrink-0"
                        >
                          Atribuir
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Site & Equipment */}
                  <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Localização & Equipamento Afetado
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-550 block">Site:</span>
                        <span className="font-bold text-white">{selectedOs.site}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-550 block">Equipamento:</span>
                        <span className="font-semibold text-slate-350">{selectedOs.equipment} ({selectedOs.ip})</span>
                      </div>
                      {selectedOs.sn && selectedOs.sn !== 'N/A' && (
                        <div>
                          <span className="text-[9px] font-bold text-slate-550 block">Número de Série:</span>
                          <span className="font-mono text-slate-350">{selectedOs.sn}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Advanced Operations */}
                  <div className="pt-4 border-t border-slate-900 flex justify-between items-center">
                    <button
                      onClick={() => handleDeleteOs(selectedOs.osId)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 transition-all text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Excluir Chamado
                    </button>
                    
                    <button
                      onClick={handleSendWhatsappNotification}
                      disabled={sendingWhatsapp}
                      className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500 disabled:bg-emerald-950/20 text-emerald-400 disabled:text-slate-550 hover:text-black rounded-xl border border-emerald-500/20 hover:border-emerald-500/30 transition-all text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 disabled:cursor-not-allowed"
                    >
                      {sendingWhatsapp ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                      Enviar p/ WhatsApp
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: FEED (ITIL Timeline & Files) */}
              {workspaceTab === 'FEED' && (
                <div className="space-y-6 flex flex-col h-full justify-between">
                  
                  {/* Unified ITIL Feed List */}
                  <div className="space-y-4">
                    
                    {/* Unified Requester Alarms / Manual Description */}
                    <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-850 space-y-4">
                      
                      <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-850/50">
                        <div className="w-7 h-7 rounded-lg bg-zabbix-primary/20 flex items-center justify-center text-zabbix-primary font-bold text-xs border border-zabbix-primary/20">
                          {(selectedOs.requester?.[0] || 'R').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{selectedOs.requester || 'Portal User'}</p>
                          <p className="text-[9px] text-slate-500 font-medium">Requerente • Criado em {new Date(selectedOs.createdAt).toLocaleString('pt-BR')}</p>
                        </div>
                      </div>

                      {/* Manual text description if provided */}
                      {selectedOs.description && (
                        <div className="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap pb-3 border-b border-slate-850/50">
                          <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Notas da Abertura</span>
                          {selectedOs.description}
                        </div>
                      )}

                      {/* Associated Device Active Alarms (The Alertas) */}
                      <div className="space-y-3">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-zabbix-primary animate-pulse shrink-0" /> 
                          Descrição do Problema (Histórico de Alertas) ({getGroupedAlarms().length})
                        </span>

                        {loadingAlarms ? (
                          <div className="py-2 text-[10px] text-slate-500 font-bold animate-pulse uppercase tracking-wider">
                            Buscando ocorrências do dispositivo...
                          </div>
                        ) : getGroupedAlarms().length === 0 ? (
                          <div className="text-xs text-slate-550 font-medium italic">
                            Nenhum alerta SNMP registrado para este dispositivo no momento.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {getGroupedAlarms().map((alarm: any, idx: number) => {
                              const severityColors = [
                                'border-blue-500/20 bg-blue-500/5 text-blue-400',       // 0: Notification
                                'border-amber-500/20 bg-amber-500/5 text-amber-400',    // 1: Minor
                                'border-orange-500/20 bg-orange-500/5 text-orange-400',  // 2: Major
                                'border-red-500/20 bg-red-500/5 text-red-400'           // 3: Critical
                              ];
                              
                              // Check if error is frequent/constant (repeated 3 or more times)
                              const isConstantError = alarm.count >= 3;
                              
                              return (
                                <div key={idx} className={`p-4 rounded-2xl border ${severityColors[alarm.severity] || 'border-slate-850 bg-slate-900/50'} space-y-2`}>
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-0.5">
                                      <span className="font-bold text-xs text-white block">{alarm.alarmName}</span>
                                      {isConstantError && (
                                        <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-red-405 tracking-wider bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">
                                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                                          Falha Constante / Recorrente
                                        </span>
                                      )}
                                    </div>
                                    {alarm.count > 1 && (
                                      <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-white/10 text-white shrink-0">
                                        Repetido {alarm.count}x
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-350 leading-relaxed font-semibold">
                                    {alarm.description}
                                  </p>
                                  
                                  <div className="pt-2 border-t border-slate-850/50 space-y-1">
                                    <div className="flex justify-between items-center text-[9px] font-mono">
                                      <span className="text-slate-500 font-semibold uppercase">Início da Constância (Primeira Ocorrência):</span>
                                      <span className="font-bold text-slate-300">{new Date(alarm.firstOccurrence).toLocaleString('pt-BR')}</span>
                                    </div>
                                    {alarm.count > 1 && (
                                      <div className="flex justify-between items-center text-[9px] font-mono">
                                        <span className="text-slate-500 font-semibold uppercase">Última Detecção:</span>
                                        <span className="font-bold text-slate-400">{new Date(alarm.latestOccurrence).toLocaleString('pt-BR')}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Timeline logs */}
                    <div className="space-y-3">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Processamento & Atividades</span>
                      
                      <div className="space-y-3 pl-3 border-l-2 border-slate-900">
                        {(selectedOs.logs || []).map((log: any, idx: number) => {
                          const isFollowup = log.text?.includes('[') && log.text?.includes(']');
                          let authorName = "NOC";
                          let logContent = log.text;

                          if (isFollowup) {
                            const match = log.text.match(/^\[(.*?)\]\s*(.*)$/);
                            if (match) {
                              authorName = match[1];
                              logContent = match[2];
                            }
                          }

                          return (
                            <div key={idx} className="relative space-y-1">
                              <div className="absolute -left-[17px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-slate-950"></div>
                              
                              <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono">
                                <span className="font-bold text-slate-400 capitalize">{authorName}</span>
                                <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">{logContent}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Evidence & Uploads */}
                    <div className="space-y-3 pt-4 border-t border-slate-900">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Documentos & Fotos do Chamado</span>
                        {uploading && <span className="text-[8px] text-cyan-400 font-bold animate-pulse uppercase tracking-wider">Subindo...</span>}
                      </div>

                      <label 
                        htmlFor="detail-timeline-upload-input" 
                        className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-800 hover:border-zabbix-primary bg-slate-950/20 rounded-xl cursor-pointer transition-all group"
                      >
                        <UploadCloud className="w-4 h-4 text-slate-500 group-hover:text-zabbix-primary transition-all" />
                        <span className="text-[11px] font-bold text-slate-400 group-hover:text-white transition-all">Anexar foto ou documento</span>
                        <input 
                          type="file" 
                          onChange={handleFileUpload} 
                          accept="image/*,application/pdf" 
                          className="hidden" 
                          id="detail-timeline-upload-input" 
                        />
                      </label>

                      {selectedOs.attachments && selectedOs.attachments.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {selectedOs.attachments.map((att: any) => {
                            const isImg = att.mimeType?.startsWith('image/') || 
                                          att.filename?.toLowerCase().endsWith('.png') || 
                                          att.filename?.toLowerCase().endsWith('.jpg') || 
                                          att.filename?.toLowerCase().endsWith('.jpeg');
                            return (
                              <a 
                                key={att.id}
                                href={att.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-2 bg-slate-950/80 border border-slate-900 rounded-xl hover:border-slate-700 transition-all group"
                              >
                                {isImg ? (
                                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-800 shrink-0 bg-slate-900">
                                    <img src={att.path} alt={att.filename} className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                                    <FileText className="w-4.5 h-4.5" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-white truncate">{att.filename}</p>
                                  <p className="text-[8px] text-slate-500 font-semibold">{isImg ? 'FOTO' : 'DOCUMENTO'} • {new Date(att.uploadedAt).toLocaleString('pt-BR')}</p>
                                </div>
                                <Eye className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 mr-1 transition-colors" />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Timeline input */}
                  <div className="flex gap-2 pt-4 border-t border-slate-900 shrink-0 mt-6">
                    <input
                      type="text"
                      placeholder="Adicionar acompanhamento técnico (ex: Peça solicitada...)"
                      value={newLogText}
                      onChange={e => setNewLogText(e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none focus:border-zabbix-primary transition-all font-semibold"
                      onKeyDown={e => e.key === 'Enter' && handleAddLog()}
                    />
                    <button
                      onClick={handleAddLog}
                      className="p-2.5 bg-zabbix-primary/10 hover:bg-zabbix-primary text-zabbix-primary hover:text-black rounded-xl border border-zabbix-primary/20 hover:border-zabbix-primary transition-all shrink-0"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 3: SOLUTION */}
              {workspaceTab === 'SOLUTION' && (
                <div className="space-y-6">
                  
                  {selectedOs.status === 'CONCLUIDA' ? (
                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-3">
                      <div className="flex items-center gap-3">
                        <Check className="w-6 h-6 bg-emerald-500/20 p-1 rounded-full text-emerald-400" />
                        <h4 className="text-sm font-black uppercase tracking-wider">Chamado Solucionado</h4>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-350 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                        {selectedOs.notes || 'Nenhuma nota de solução registrada.'}
                      </p>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Para reabrir o chamado, alterne o status para "Novo" ou "Em Atendimento" na aba de Propriedades.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-zabbix-primary/10 border border-zabbix-primary/20 text-zabbix-primary text-xs leading-relaxed">
                        Escreva a solução técnica aplicada. Ao salvar, o chamado mudará seu status automaticamente para **Solucionado** e o encerramento será registrado na linha do tempo.
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-slate-550 uppercase">Solução Técnica Aplicada</label>
                        <textarea
                          placeholder="Descreva a solução do problema (ex: Fibra óptica limpa e restabelecida, sinal normalizado em -18dBm)..."
                          value={solutionText}
                          onChange={e => setSolutionText(e.target.value)}
                          className="w-full h-32 p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none focus:border-zabbix-primary transition-all font-medium resize-none custom-scrollbar"
                        />
                      </div>

                      <button
                        onClick={handleSolveTicket}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 hover:scale-[1.01]"
                      >
                        <Check className="w-4 h-4" /> Gravar Solução do Chamado
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center p-6 text-center bg-slate-950/10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 mb-4">
              <Layers3 className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-400">Nenhum chamado aberto</h3>
            <p className="text-xs text-slate-550 mt-1 max-w-[280px]">
              Selecione um chamado da lista para visualizar as propriedades, cronologia de acompanhamentos, arquivos e registrar soluções.
            </p>
          </div>
        )}

      </div>

      {/* NEW TICKET MODAL */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-zabbix-primary animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Abrir Novo Chamado de Serviço</h3>
              </div>
              <button 
                onClick={() => setIsNewTicketModalOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              
              {/* Auto Title Preview (Read-only) */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block uppercase tracking-wider font-bold">Título do Chamado (Gerado Automaticamente)</label>
                <div className="w-full bg-slate-950/50 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-400 font-bold border-dashed uppercase tracking-wider">
                  {(() => {
                    const selectedDevice = devices.find(d => d.id === newTicketForm.deviceId);
                    const selectedCity = cities.find(c => c.id === newTicketForm.cityId);
                    const siteName = selectedCity ? selectedCity.name : 'Selecione o Site';
                    const equipName = selectedDevice ? selectedDevice.name : 'Selecione o Equipamento';
                    return `${siteName} - ${equipName}`;
                  })()}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Descrição Inicial / Observações</label>
                <textarea
                  placeholder="Escreva detalhes adicionais sobre o incidente ou requisição técnica se houver..."
                  value={newTicketForm.description}
                  onChange={e => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  className="w-full h-24 p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none focus:border-zabbix-primary transition-all font-medium resize-none custom-scrollbar"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Urgência</label>
                  <select
                    value={newTicketForm.urgency}
                    onChange={e => setNewTicketForm({ ...newTicketForm, urgency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zabbix-primary font-semibold"
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Impacto</label>
                  <select
                    value={newTicketForm.impact}
                    onChange={e => setNewTicketForm({ ...newTicketForm, impact: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zabbix-primary font-semibold"
                  >
                    <option value="BAIXA">Baixo</option>
                    <option value="MEDIA">Médio</option>
                    <option value="ALTA">Alto</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Categoria</label>
                  <select
                    value={newTicketForm.category}
                    onChange={e => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zabbix-primary font-semibold"
                  >
                    <option value="Redes">Redes / Fibra</option>
                    <option value="Energia">Energia / Kron</option>
                    <option value="Hardware">Hardware / Roteador</option>
                    <option value="Software">Software / Zabbix</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Site Afetado</label>
                  <select
                    value={newTicketForm.cityId}
                    onChange={e => setNewTicketForm({ ...newTicketForm, cityId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zabbix-primary font-semibold"
                    required
                  >
                    <option value="">Selecione um site...</option>
                    {cities.map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.state ? `- ${c.state.uf}` : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Equipamento com Falha</label>
                  <select
                    value={newTicketForm.deviceId}
                    onChange={e => setNewTicketForm({ ...newTicketForm, deviceId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zabbix-primary font-semibold"
                    required
                  >
                    <option value="">Selecione um equipamento...</option>
                    {devices.filter(d => !newTicketForm.cityId || d.cityId === newTicketForm.cityId).map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.ip})</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Técnico Atribuído (Opcional)</label>
                  <select
                    value={newTicketForm.technician}
                    onChange={e => setNewTicketForm({ ...newTicketForm, technician: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-zabbix-primary transition-all font-semibold"
                  >
                    <option value="">Selecione um Técnico...</option>
                    {getTechniciansForNewTicket().map(tech => (
                      <option key={tech.id} value={tech.name}>
                        {tech.name} {tech.company ? `(${tech.company})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Requerente (Responsável pela Abertura)</label>
                  <input
                    type="text"
                    value={newTicketForm.requester}
                    onChange={e => setNewTicketForm({ ...newTicketForm, requester: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-4 text-xs text-white focus:outline-none focus:border-zabbix-primary transition-all font-semibold"
                    placeholder={session?.user?.name || 'Seu nome'}
                  />
                </div>

              </div>

              {/* Observer email */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">
                  Observador (E-mail para cópia das notificações)
                </label>
                <input
                  type="email"
                  value={newTicketForm.observer}
                  onChange={e => setNewTicketForm({ ...newTicketForm, observer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-4 text-xs text-white focus:outline-none focus:border-zabbix-primary transition-all font-semibold"
                  placeholder="ex: supervisor@empresa.com.br (opcional)"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-zabbix-primary to-cyan-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zabbix-primary/10"
                >
                  <CheckCircle2 className="w-4.5 h-4.5" /> Registrar e Abrir Chamado
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Cancelar
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* PENDING REASON MODAL */}
      {isPendingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Motivo da Espera / Pausa</h3>
              </div>
              <button 
                onClick={() => {
                  setIsPendingModalOpen(false);
                  setPendingReasonSelect('Empresa Terceira');
                  setCustomPendingReason('');
                }}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider font-bold">Selecione o Motivo</label>
                <select
                  value={pendingReasonSelect}
                  onChange={e => setPendingReasonSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-zabbix-primary font-semibold"
                >
                  <option value="Empresa Terceira">Empresa Terceira / Parceiro Externo</option>
                  <option value="Sem Autorização de Acesso">Sem Autorização de Acesso ao Local</option>
                  <option value="Aguardando Equipamento / Peça">Aguardando Equipamento / Peça de Reposição</option>
                  <option value="Cliente Ausente / Sem Contato">Cliente Ausente / Sem Contato</option>
                  <option value="Condições Climáticas Adversas">Condições Climáticas Adversas</option>
                  <option value="OUTRO">Outro Motivo (especificar abaixo)</option>
                </select>
              </div>

              {pendingReasonSelect === 'OUTRO' && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Descreva o Motivo</label>
                  <textarea
                    placeholder="Descreva detalhadamente o motivo pelo qual o chamado está em espera..."
                    value={customPendingReason}
                    onChange={e => setCustomPendingReason(e.target.value)}
                    className="w-full h-24 p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none focus:border-zabbix-primary transition-all font-medium resize-none custom-scrollbar"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleConfirmPending}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  Confirmar Pausa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPendingModalOpen(false);
                    setPendingReasonSelect('Empresa Terceira');
                    setCustomPendingReason('');
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[999] max-w-sm w-full animate-in slide-in-from-bottom-4 fade-in duration-300 rounded-2xl shadow-2xl border p-4 flex items-start gap-3 ${
          toast.type === 'success'
            ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-900/95 border-slate-700 text-slate-200'
        }`}>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-wide">{toast.message}</p>
            {toast.sub && <p className="text-[10px] font-medium opacity-70 mt-0.5">{toast.sub}</p>}
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-white/10 rounded-lg transition-all shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* REPORTS PANEL */}
      {reportTab && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex justify-between items-center rounded-t-3xl">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-violet-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Relatórios de Chamados</h3>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={reportYear}
                  onChange={e => { const y = parseInt(e.target.value); setReportYear(y); fetchReport(y); }}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none"
                >
                  {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <button onClick={() => setReportTab(false)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {loadingReport ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
                </div>
              ) : reportData ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Abertos', value: reportData.summary.totalOpened, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                      { label: 'Solucionados', value: reportData.summary.totalResolved, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                      { label: 'Em Aberto', value: reportData.summary.totalPending, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                      { label: 'Taxa Resolução', value: `${reportData.summary.resolutionRate}%`, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
                    ].map(c => (
                      <div key={c.label} className={`p-4 rounded-2xl border ${c.bg} flex flex-col gap-1`}>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{c.label}</span>
                        <span className={`text-2xl font-black ${c.color}`}>{c.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Monthly Bar Chart */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" /> Chamados por Mês — {reportData.year}
                    </h4>
                    <div className="flex items-end gap-2 h-32">
                      {reportData.months.map((m: any) => {
                        const maxVal = Math.max(...reportData.months.map((x: any) => x.opened), 1);
                        const h = Math.round((m.opened / maxVal) * 100);
                        return (
                          <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[8px] text-slate-500 font-bold">{m.opened || ''}</span>
                            <div className="w-full rounded-t-md bg-slate-800 relative" style={{ height: '88px' }}>
                              <div
                                className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-violet-600 to-violet-400 transition-all duration-500"
                                style={{ height: `${h}%` }}
                              />
                              {m.resolved > 0 && (
                                <div
                                  className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-60 transition-all duration-500"
                                  style={{ height: `${Math.round((m.resolved / maxVal) * 100)}%` }}
                                />
                              )}
                            </div>
                            <span className="text-[8px] text-slate-500 font-bold">{m.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-violet-500 inline-block"></span> Abertos</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block opacity-70"></span> Solucionados</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* TOP 5 Sites */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-red-400" /> TOP 5 Sites com Mais Problemas
                      </h4>
                      <div className="space-y-2">
                        {reportData.top5Sites.map((site: any, idx: number) => {
                          const maxSite = reportData.top5Sites[0]?.total || 1;
                          return (
                            <div key={site.site} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-300 truncate max-w-[200px]">{idx + 1}. {site.site}</span>
                                <span className="font-black text-white">{site.total}</span>
                              </div>
                              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500"
                                  style={{ width: `${Math.round((site.total / maxSite) * 100)}%` }}
                                />
                              </div>
                              <div className="flex gap-3 text-[9px] text-slate-500 font-semibold">
                                <span className="text-emerald-400">{site.resolved} resolvidos</span>
                                <span className="text-amber-400">{site.open} abertos</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" /> Chamados por Categoria
                      </h4>
                      <div className="space-y-2">
                        {reportData.categories.map((cat: any) => {
                          const maxCat = reportData.categories[0]?.count || 1;
                          return (
                            <div key={cat.name} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-300">{cat.name}</span>
                                <span className="font-black text-white">{cat.count}</span>
                              </div>
                              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-500"
                                  style={{ width: `${Math.round((cat.count / maxCat) * 100)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Technicians */}
                      {reportData.technicians.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-slate-800">
                          <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Users className="w-3 h-3" /> Técnicos — Chamados Atendidos
                          </h5>
                          <div className="space-y-1.5">
                            {reportData.technicians.slice(0, 5).map((t: any) => (
                              <div key={t.name} className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 truncate max-w-[180px]">{t.name}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-emerald-400 font-bold">{t.resolved} resolvidos</span>
                                  <span className="text-slate-500">/ {t.total}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Nenhum dado disponível para o período selecionado.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
