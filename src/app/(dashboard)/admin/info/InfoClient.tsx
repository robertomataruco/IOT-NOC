"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, 
  UserCheck, 
  Shield, 
  Clock, 
  RefreshCw, 
  Search, 
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  Loader2, 
  ShieldCheck, 
  ShieldAlert 
} from "lucide-react";

export default function InfoClient() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "online" | "admin" | "user">("all");

  const fetchUsers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await axios.get("/api/admin/users");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Erro ao buscar usuários para informação:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Auto-refresh a cada 10 segundos para ver quem está online/offline em tempo real
    const interval = setInterval(() => fetchUsers(false), 10000);
    return () => clearInterval(interval);
  }, []);

  // Determinar status do usuário
  const getUserStatus = (lastActiveStr: string | null) => {
    if (!lastActiveStr) return { label: "Offline", color: "text-slate-500 bg-slate-500/10 border-slate-700/50", dot: "bg-slate-600", isOnline: false };
    
    const lastActive = new Date(lastActiveStr);
    const diffMs = new Date().getTime() - lastActive.getTime();
    const diffMin = diffMs / (1000 * 60);

    if (diffMin <= 5) {
      return { 
        label: "Online", 
        color: "text-green-500 bg-green-500/10 border-green-500/20", 
        dot: "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]", 
        isOnline: true 
      };
    } else if (diffMin <= 15) {
      return { 
        label: "Ausente", 
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20", 
        dot: "bg-amber-500 animate-pulse", 
        isOnline: true 
      };
    } else {
      return { 
        label: "Offline", 
        color: "text-slate-500 bg-slate-500/10 border-slate-700/50", 
        dot: "bg-slate-600", 
        isOnline: false 
      };
    }
  };

  // Filtragem dos usuários
  const filteredUsers = users.filter((user) => {
    const status = getUserStatus(user.lastActive);
    
    // Filtro por Tab
    if (activeTab === "online" && !status.isOnline) return false;
    if (activeTab === "admin" && user.role !== "ADMIN") return false;
    if (activeTab === "user" && user.role !== "USER") return false;

    // Filtro por Busca
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        (user.company && user.company.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.phone && user.phone.includes(query))
      );
    }

    return true;
  });

  // Estatísticas
  const totalUsers = users.length;
  const onlineUsers = users.filter(u => getUserStatus(u.lastActive).isOnline).length;
  const adminUsers = users.filter(u => u.role === "ADMIN").length;
  const normalUsers = totalUsers - adminUsers;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Loader2 className="w-10 h-10 text-zabbix-primary animate-spin" />
        <p className="text-slate-400 animate-pulse font-medium">Carregando painel de informações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Painel de Informações</h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitore usuários online em tempo real e gerencie as credenciais registradas no sistema.
          </p>
        </div>
        <button 
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          className="self-start md:self-auto px-4 py-2 border border-slate-700 bg-slate-800/40 text-slate-300 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-zabbix-primary" : ""}`} />
          {refreshing ? "Atualizando..." : "Atualizar Agora"}
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cadastrados</span>
            <span className="text-2xl font-black text-white">{totalUsers}</span>
          </div>
        </div>

        {/* Online Users */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-all">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <UserCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Online Agora</span>
            <span className="text-2xl font-black text-green-450">{onlineUsers}</span>
          </div>
        </div>

        {/* Administrators */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-all">
          <div className="w-12 h-12 rounded-xl bg-zabbix-primary/10 flex items-center justify-center text-zabbix-primary">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Administradores</span>
            <span className="text-2xl font-black text-white">{adminUsers}</span>
          </div>
        </div>

        {/* Standard Users */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-all">
          <div className="w-12 h-12 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Usuários Padrão</span>
            <span className="text-2xl font-black text-white">{normalUsers}</span>
          </div>
        </div>

      </div>

      {/* Filters & Search Row */}
      <div className="p-4 rounded-2xl bg-zabbix-card/30 border border-white/5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        
        {/* Tabs */}
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "all" ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setActiveTab("online")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === "online" ? "bg-green-500/20 text-green-400 shadow-lg border border-green-500/10" : "text-slate-500 hover:text-slate-350"}`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Online ({onlineUsers})
          </button>
          <button 
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "admin" ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
          >
            Admins
          </button>
          <button 
            onClick={() => setActiveTab("user")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "user" ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
          >
            Usuários Padrão
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, usuário, empresa..."
            className="w-full bg-slate-900/50 border border-slate-700/60 rounded-xl py-2 px-4 pl-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-zabbix-primary/50 focus:border-zabbix-primary/50 transition-all"
          />
        </div>

      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const status = getUserStatus(user.lastActive);
            return (
              <div 
                key={user.id} 
                className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between space-y-4 hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] group"
              >
                
                {/* Header Card */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    
                    {/* User Avatar with status dot */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-zabbix-primary/10 border border-zabbix-primary/20 flex items-center justify-center text-zabbix-primary font-bold text-sm">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className={`w-3.5 h-3.5 rounded-full border-2 border-slate-900 absolute -bottom-0.5 -right-0.5 ${status.dot}`}></span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-zabbix-accent transition-colors">{user.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">@{user.username}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Info Fields */}
                <div className="space-y-2 border-t border-b border-white/5 py-3 text-xs text-slate-350">
                  
                  {/* Perfil & Permissão Info */}
                  <div className="flex items-center justify-between pb-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-zabbix-primary/15 text-zabbix-primary border border-zabbix-primary/25' : 'bg-slate-800 text-slate-400 border border-slate-700/50'}`}>
                      {user.role}
                    </span>

                    {user.role === 'ADMIN' && (
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black flex items-center gap-1 uppercase tracking-widest ${user.canAccessInfo ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700/50'}`}>
                        {user.canAccessInfo ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                        Info: {user.canAccessInfo ? "SIM" : "NÃO"}
                      </span>
                    )}
                  </div>

                  {/* Company */}
                  {user.company && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-550 shrink-0" />
                      <span className="truncate text-slate-300">{user.company}</span>
                    </div>
                  )}

                  {/* Email */}
                  {user.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-550 shrink-0" />
                      <span className="truncate text-slate-300">{user.email}</span>
                    </div>
                  )}

                  {/* Phone */}
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-550 shrink-0" />
                      <span className="font-mono text-slate-300">{user.phone}</span>
                    </div>
                  )}

                  {/* Last active time */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Último clique: {user.lastActive ? new Date(user.lastActive).toLocaleString('pt-BR') : "Nunca"}
                    </span>
                  </div>

                </div>

                {/* Cities access tag list */}
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Sites Autorizados</span>
                  <div className="flex flex-wrap gap-1">
                    {user.role === 'ADMIN' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase">
                        Todos os Sites (Acesso Total)
                      </span>
                    ) : user.access && user.access.length > 0 ? (
                      user.access.map((a: any) => (
                        <span key={a.id} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-[9px] font-mono text-slate-300 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-zabbix-accent" />
                          {a.city?.name}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/25 text-[9px] font-bold text-red-400 uppercase">
                        Nenhum Site Vinculado
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-white/5 border border-white/5 border-dashed rounded-2xl">
            <Users className="w-12 h-12 text-slate-600 mb-2" />
            <h4 className="text-white font-bold">Nenhum Usuário Encontrado</h4>
            <p className="text-xs text-slate-500 mt-1">Tente mudar sua busca ou alterar o filtro de perfil.</p>
          </div>
        )}
      </div>

    </div>
  );
}
