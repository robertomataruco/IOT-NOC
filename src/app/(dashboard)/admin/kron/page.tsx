"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Zap, Trash2, Loader2, MapPin, Activity, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KronAdmin() {
  const [devices, setDevices] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creatingDevice, setCreatingDevice] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    serial: "",
    mqttTopic: "",
    location: "",
    cityId: "",
    companyId: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [devicesRes, citiesRes, companiesRes] = await Promise.all([
        axios.get("/api/kron/devices"),
        axios.get("/api/admin/cities"),
        axios.get("/api/admin/companies")
      ]);
      setDevices(devicesRes.data);
      if (citiesRes.data.success) setCities(citiesRes.data.data);
      if (companiesRes.data.success) setCompanies(companiesRes.data.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingDevice(true);
    try {
      if (isEditing && editingId) {
        await axios.put(`/api/kron/devices/${editingId}`, formData);
      } else {
        await axios.post("/api/kron/devices", formData);
      }
      
      setFormData({ name: "", serial: "", mqttTopic: "", location: "", cityId: "", companyId: "" });
      setIsCreating(false);
      setIsEditing(false);
      setEditingId(null);
      await fetchData();
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao salvar medidor.");
    } finally {
      setCreatingDevice(false);
    }
  };

  const startEdit = (device: any) => {
    setFormData({
      name: device.name,
      serial: device.serial,
      mqttTopic: device.mqttTopic,
      location: device.location || "",
      cityId: device.cityId || "",
      companyId: device.companyId || ""
    });
    setEditingId(device.id);
    setIsEditing(true);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este medidor e todo o histórico de leituras?")) return;
    try {
      await axios.delete(`/api/kron/devices/${id}`);
      await fetchData();
      router.refresh();
    } catch (error) {
      alert("Erro ao excluir medidor.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Gestão de Medidores KRON
          </h1>
          <p className="text-slate-400 text-sm mt-1">Cadastre os medidores KS-3000 para habilitar a recepção de telemetria via MQTT.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Medidor
        </button>
      </div>

      {isCreating && (
        <div className="glass-panel p-6 rounded-2xl border-yellow-500/30 max-w-2xl animate-in fade-in zoom-in duration-200">
          <h2 className="text-lg font-bold text-white mb-6">{isEditing ? 'Editar Medidor' : 'Cadastrar Novo Medidor'}</h2>
          <form onSubmit={handleSaveDevice} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Nome do Medidor</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="Ex: Quadro Principal"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Número de Série</label>
                <input
                  type="text"
                  value={formData.serial}
                  onChange={(e) => {
                    const sn = e.target.value;
                    setFormData({ ...formData, serial: sn, mqttTopic: `kron/${sn}/data` });
                  }}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="Ex: 2507298"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Tópico MQTT</label>
                <input
                  type="text"
                  value={formData.mqttTopic}
                  onChange={(e) => setFormData({ ...formData, mqttTopic: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="Ex: kron/2507298/data"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Localização (Opcional)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-yellow-500/50"
                  placeholder="Ex: Sala Elétrica Térreo"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Site de Destino</label>
                <select
                  value={formData.cityId}
                  onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-yellow-500/50"
                  required
                >
                  <option value="">Selecione um Site...</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name} ({city.state?.uf})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Empresa (Entidade)</label>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-yellow-500/50 font-medium"
                >
                  <option value="">Nenhuma (Administração Geral)</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={creatingDevice}
                className="flex-1 bg-yellow-500 text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {creatingDevice ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? "Atualizar Medidor" : "Salvar Medidor")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setFormData({ name: "", serial: "", mqttTopic: "", location: "", cityId: "", companyId: "" });
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
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Medidor</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Empresa</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Tópico MQTT</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Nº Série</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Site/Estado</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <Loader2 className="w-8 h-8 text-yellow-500 animate-spin mx-auto" />
                </td>
              </tr>
            ) : devices.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">Nenhum medidor KRON cadastrado.</td>
              </tr>
            ) : (
              devices.map(device => (
                <tr key={device.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-white">{device.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-semibold text-slate-300">
                      {device.company?.name || <span className="text-slate-500 italic">Sem Empresa</span>}
                    </span>
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-slate-900 px-2 py-1 rounded text-yellow-500">{device.mqttTopic}</code>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-slate-300 font-mono">{device.serial || '---'}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-600" />
                      {device.city?.name} ({device.city?.state?.uf})
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => startEdit(device)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Editar Medidor"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => router.push(`/kron/${device.id}`)}
                        className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors"
                        title="Monitorar Tempo Real"
                      >
                        <Activity className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(device.id)}
                        className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
