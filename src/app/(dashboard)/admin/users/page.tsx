"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, User, Shield, Loader2, Key, CheckCircle2, Trash2 } from "lucide-react";

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [creatingUser, setCreatingUser] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "USER",
    companyId: "",
    phone: "",
    email: "",
    canAccessInfo: false,
    selectedSites: [] as { siteId: string; permission: string }[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, sitesRes, companiesRes] = await Promise.all([
        axios.get("/api/admin/users"),
        axios.get("/api/admin/cities"),
        axios.get("/api/admin/companies")
      ]);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (sitesRes.data.success) setSites(sitesRes.data.data);
      if (companiesRes.data.success) setCompanies(companiesRes.data.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: "", // Senha vazia significa que não será alterada a menos que preenchida
      role: user.role,
      companyId: user.companyId || "",
      phone: user.phone || "",
      email: user.email || "",
      canAccessInfo: user.canAccessInfo || false,
      selectedSites: user.access ? user.access.map((a: any) => ({ siteId: a.cityId, permission: a.permission })) : []
    });
    setIsCreating(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      if (editingUser) {
        await axios.patch(`/api/admin/users/${editingUser.id}`, {
          ...formData,
          sites: formData.selectedSites
        });
      } else {
        await axios.post("/api/admin/users", {
          ...formData,
          sites: formData.selectedSites
        });
      }
      setFormData({ name: "", username: "", password: "", role: "USER", companyId: "", phone: "", email: "", canAccessInfo: false, selectedSites: [] });
      setEditingUser(null);
      setIsCreating(false);
      fetchData();
    } catch (error) {
      alert("Erro ao salvar usuário.");
    } finally {
      setCreatingUser(false);
    }
  };

  const toggleSite = (id: string) => {
    setFormData(prev => {
      const exists = prev.selectedSites.find(s => s.siteId === id);
      if (exists) {
        return {
          ...prev,
          selectedSites: prev.selectedSites.filter(s => s.siteId !== id)
        };
      } else {
        return {
          ...prev,
          selectedSites: [...prev.selectedSites, { siteId: id, permission: 'VIEW' }]
        };
      }
    });
  };

  const updatePermission = (siteId: string, perm: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSites: prev.selectedSites.map(s => 
        s.siteId === siteId ? { ...s, permission: perm } : s
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mt-1">Gerencie quem pode acessar o painel e quais sites estão visíveis para eles.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-zabbix-primary hover:bg-zabbix-primary/90 text-white px-4 py-2 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      {isCreating && (
        <div className="glass-panel p-8 rounded-2xl border-zabbix-primary/30 max-w-2xl">
          <h2 className="text-lg font-bold text-white mb-6">
            {editingUser ? `Editando Usuário: ${editingUser.username}` : "Cadastrar Novo Usuário"}
          </h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Username (Login)</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Empresa (Entidade)</label>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50 font-medium"
                >
                  <option value="">Nenhuma (Administração Geral)</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Telefone Celular (WhatsApp)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  placeholder="Ex: 5511999999999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  placeholder="usuario@empresa.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">
                  {editingUser ? "Nova Senha (deixe em branco para manter)" : "Senha (Automática se vazia)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  placeholder={editingUser ? "Deixe em branco para manter" : "Será gerada e enviada no WhatsApp"}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase tracking-wider font-bold">Perfil</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                >
                  <option value="USER">Usuário Padrão</option>
                  <option value="TECHNICIAN">Técnico de Campo</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>

            {formData.role === 'ADMIN' ? (
              <div className="space-y-4">
                <div className="bg-zabbix-primary/10 border border-zabbix-primary/30 p-4 rounded-xl text-zabbix-primary text-sm flex items-center gap-3">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <p>Usuários Administradores possuem acesso total a todas as cidades e configurações do sistema.</p>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-700 bg-slate-900/30">
                  <input
                    type="checkbox"
                    id="canAccessInfo"
                    checked={formData.canAccessInfo}
                    onChange={(e) => setFormData({ ...formData, canAccessInfo: e.target.checked })}
                    className="w-4 h-4 rounded text-zabbix-primary bg-slate-900 border-slate-700 focus:ring-zabbix-primary cursor-pointer"
                  />
                  <div className="cursor-pointer select-none" onClick={() => setFormData({ ...formData, canAccessInfo: !formData.canAccessInfo })}>
                    <label htmlFor="canAccessInfo" className="text-sm font-bold text-white cursor-pointer select-none">
                      Permitir acesso à ferramenta de Informação
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">Permite visualizar usuários online e usuários cadastrados no dashboard.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-bold">Acesso aos Sites e Permissão</label>
                <div className="space-y-2">
                  {sites.map(site => {
                    const selected = formData.selectedSites.find(s => s.siteId === site.id);
                    return (
                      <div 
                        key={site.id} 
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${selected ? 'bg-zabbix-primary/10 border-zabbix-primary/50 text-white' : 'bg-slate-900/30 border-slate-700 text-slate-400'}`}
                      >
                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleSite(site.id)}>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${selected ? 'bg-zabbix-primary border-zabbix-primary' : 'border-slate-600'}`}>
                            {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm font-medium">{site.name} {site.state ? `- ${site.state.uf}` : ''}</span>
                        </div>
                        
                        {selected && (
                          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                            <button 
                              type="button"
                              onClick={() => updatePermission(site.id, 'VIEW')}
                              className={`px-3 py-1 text-[10px] font-bold rounded ${selected.permission === 'VIEW' ? 'bg-zabbix-primary text-white' : 'text-slate-500'}`}
                            >
                              VER
                            </button>
                            <button 
                              type="button"
                              onClick={() => updatePermission(site.id, 'EDIT')}
                              className={`px-3 py-1 text-[10px] font-bold rounded ${selected.permission === 'EDIT' ? 'bg-zabbix-primary text-white' : 'text-slate-500'}`}
                            >
                              EDITAR
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={creatingUser}
                className="flex-1 bg-zabbix-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {creatingUser ? <Loader2 className="w-5 h-5 animate-spin" /> : editingUser ? "Salvar Alterações" : "Salvar Usuário"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingUser(null);
                  setFormData({ name: "", username: "", password: "", role: "USER", company: "", phone: "", email: "", canAccessInfo: false, selectedSites: [] });
                }}
                className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Usuário</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Perfil</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Sites Permitidos</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-zabbix-primary font-bold">
                      {user.name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">@{user.username} {user.company ? `• ${user.company}` : ''}</p>
                      {user.phone && <p className="text-xs text-slate-500 mt-0.5">📱 {user.phone}</p>}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-zabbix-primary/10 text-zabbix-primary' : 'bg-slate-800 text-slate-400'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-400">
                  {user.role === 'ADMIN' ? (
                    <span className="text-zabbix-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Acesso Total
                    </span>
                  ) : (!user.access || user.access.length === 0 ? "Nenhum site" : user.access.map((a: any) => (
                    <span key={a.cityId} className="inline-flex items-center gap-1 bg-slate-850 px-2 py-1 rounded mr-2 mb-2 text-[10px]">
                      {a.city?.name} 
                      <span className={`font-bold ${a.permission === 'EDIT' ? 'text-zabbix-accent' : 'text-slate-500'}`}>
                        ({a.permission})
                      </span>
                    </span>
                  )))}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="p-2 text-slate-500 hover:text-zabbix-primary transition-colors"
                      title="Editar Usuário / Reset de Senha"
                    >
                      <User className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={async () => {
                        if(confirm('Tem certeza que deseja excluir este usuário?')) {
                          await axios.delete(`/api/admin/users/${user.id}`);
                          fetchData();
                        }
                      }}
                      className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                      title="Excluir Usuário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
