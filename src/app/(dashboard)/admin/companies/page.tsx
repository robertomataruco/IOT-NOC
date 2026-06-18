"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Building, Plus, Trash2, Edit3, Loader2, DollarSign, Calendar, 
  CheckCircle2, AlertTriangle, XCircle, CreditCard, Shield, Users, Wifi 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompaniesAdmin() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"cadastro" | "financeiro">("cadastro");

  const [formData, setFormData] = useState({
    name: "",
    status: "ATIVO",
    paymentStatus: "PAGO",
    dueDate: "",
    lastPaymentAt: ""
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/api/admin/companies");
      if (res.data.success) {
        setCompanies(res.data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        lastPaymentAt: formData.lastPaymentAt ? new Date(formData.lastPaymentAt).toISOString() : null
      };

      if (isEditing && editingId) {
        await axios.patch(`/api/admin/companies/${editingId}`, payload);
      } else {
        await axios.post("/api/admin/companies", payload);
      }

      resetForm();
      await fetchCompanies();
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao salvar empresa.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (company: any) => {
    setFormData({
      name: company.name,
      status: company.status || "ATIVO",
      paymentStatus: company.paymentStatus || "PAGO",
      dueDate: company.dueDate ? new Date(company.dueDate).toISOString().split("T")[0] : "",
      lastPaymentAt: company.lastPaymentAt ? new Date(company.lastPaymentAt).toISOString().split("T")[0] : ""
    });
    setEditingId(company.id);
    setIsEditing(true);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta empresa? Os usuários e dispositivos continuarão existindo, mas desvinculados.")) return;
    try {
      await axios.delete(`/api/api/admin/companies/${id}`);
      await fetchCompanies();
      router.refresh();
    } catch (error) {
      try {
        await axios.delete(`/api/admin/companies/${id}`);
        await fetchCompanies();
        router.refresh();
      } catch (innerError) {
        alert("Erro ao excluir empresa.");
      }
    }
  };

  const handleQuickPayment = async (company: any) => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      // Avançar o vencimento em 1 mês
      const currentDueDate = company.dueDate ? new Date(company.dueDate) : new Date();
      currentDueDate.setMonth(currentDueDate.getMonth() + 1);
      const nextDueDateStr = currentDueDate.toISOString().split("T")[0];

      await axios.patch(`/api/admin/companies/${company.id}`, {
        paymentStatus: "PAGO",
        status: "ATIVO", // Desbloqueia se estiver bloqueado
        lastPaymentAt: todayStr,
        dueDate: nextDueDateStr
      });
      await fetchCompanies();
      router.refresh();
    } catch (error) {
      alert("Erro ao registrar pagamento rápido.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      status: "ATIVO",
      paymentStatus: "PAGO",
      dueDate: "",
      lastPaymentAt: ""
    });
    setIsCreating(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const isOverdue15Days = (company: any) => {
    if (!company.dueDate || company.paymentStatus === "PAGO") return false;
    const due = new Date(company.dueDate);
    const fifteenDaysAfter = new Date(due.getTime() + 15 * 24 * 60 * 60 * 1000);
    return new Date() > fifteenDaysAfter;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mt-1">Gerencie as entidades (empresas) clientes e configure a saúde financeira delas.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
          className="flex items-center gap-2 bg-zabbix-primary hover:bg-zabbix-primary/90 text-white px-4 py-2 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Nova Empresa
        </button>
      </div>

      {isCreating && (
        <div className="glass-panel p-6 rounded-2xl border-zabbix-primary/30 max-w-2xl animate-in fade-in zoom-in duration-200">
          <h2 className="text-lg font-bold text-white mb-6">
            {isEditing ? `Editar Empresa: ${formData.name}` : "Cadastrar Nova Empresa"}
          </h2>

          {/* Abas */}
          <div className="flex border-b border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("cadastro")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "cadastro"
                  ? "border-zabbix-primary text-zabbix-primary"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Building className="w-4 h-4" />
              Cadastro & Detalhes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("financeiro")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "financeiro"
                  ? "border-zabbix-primary text-zabbix-primary"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Financeiro
            </button>
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-4">
            {activeTab === "cadastro" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Nome da Empresa (Entidade)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                    placeholder="Ex: Highline"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Status do Cadastro</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50 font-medium"
                  >
                    <option value="ATIVO">ATIVO (Acesso Autorizado)</option>
                    <option value="BLOQUEADO">BLOQUEADO (Suspenso Manualmente)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Bloquear suspende o acesso ao painel de todos os usuários vinculados imediatamente.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "financeiro" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Status Financeiro</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50 font-medium"
                    >
                      <option value="PAGO">PAGO</option>
                      <option value="PENDENTE">PENDENTE</option>
                      <option value="ATRASADO">ATRASADO</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Data de Vencimento</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Último Pagamento Confirmado</label>
                  <input
                    type="date"
                    value={formData.lastPaymentAt}
                    onChange={(e) => setFormData({ ...formData, lastPaymentAt: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-500 text-sm flex gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p>
                    <strong>Regra de Bloqueio Financeiro:</strong> Se a situação de pagamento não for "PAGO" e o atraso for superior a 15 dias do vencimento estipulado, o painel travará o login dos usuários.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-zabbix-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? "Atualizar Empresa" : "Criar Empresa")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de Empresas */}
      <div className="glass-panel overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Empresa</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Status Geral</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Financeiro</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Vencimento</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Ativos</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <Loader2 className="w-8 h-8 text-zabbix-primary animate-spin mx-auto" />
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">Nenhuma empresa cadastrada.</td>
              </tr>
            ) : (
              companies.map((company) => {
                const isManualBlocked = company.status === "BLOQUEADO";
                const isOverdue = isOverdue15Days(company);
                const isFinancialBlocked = !isManualBlocked && isOverdue;

                return (
                  <tr key={company.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zabbix-primary/10 flex items-center justify-center text-zabbix-primary">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">{company.name}</span>
                          <span className="text-[10px] text-slate-500">Cadastrada em {new Date(company.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {isManualBlocked ? (
                        <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> BLOQUEADA
                        </span>
                      ) : isFinancialBlocked ? (
                        <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" /> BLOQUEIO FINANC.
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ATIVA
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {company.paymentStatus === "PAGO" ? (
                        <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> PAGO
                        </span>
                      ) : company.paymentStatus === "ATRASADO" || isOverdue ? (
                        <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> INADIMPLENTE
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" /> PENDENTE
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {formatDate(company.dueDate)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1" title="Usuários">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          {company._count?.users || 0}
                        </span>
                        <span className="flex items-center gap-1" title="Dispositivos">
                          <Wifi className="w-3.5 h-3.5 text-slate-500" />
                          {company._count?.devices || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {company.paymentStatus !== "PAGO" && (
                          <button
                            onClick={() => handleQuickPayment(company)}
                            className="px-2.5 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors"
                            title="Quitar mensalidade e avançar 30 dias"
                          >
                            Quitar
                          </button>
                        )}
                        <button
                          onClick={() => startEdit(company)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="p-2 text-slate-500 hover:text-red-500 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente simples para ícone de relógio já que não importamos o relógio específico
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
