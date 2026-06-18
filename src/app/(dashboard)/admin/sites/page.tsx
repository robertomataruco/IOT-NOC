"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, MapPin, Trash2, Loader2, Globe, Pencil, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SitesAdmin() {
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for creating
  const [isCreating, setIsCreating] = useState(false);
  const [creatingCity, setCreatingCity] = useState(false);
  
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatingCity, setUpdatingCity] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    stateId: "",
    address: "",
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [citiesRes, statesRes] = await Promise.all([
        axios.get("/api/admin/cities"),
        axios.get("/api/admin/states")
      ]);
      if (citiesRes.data.success) setCities(citiesRes.data.data);
      if (statesRes.data.success) setStates(statesRes.data.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCity(true);
    try {
      const res = await axios.post("/api/admin/cities", formData);
      if (res.data.success) {
        setFormData({ name: "", stateId: "", address: "", latitude: "", longitude: "" });
        setIsCreating(false);
        await fetchData();
        router.refresh();
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao criar site.");
    } finally {
      setCreatingCity(false);
    }
  };

  const handleUpdateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setUpdatingCity(true);
    try {
      const res = await axios.patch(`/api/admin/cities/${editingId}`, formData);
      if (res.data.success) {
        setFormData({ name: "", stateId: "", address: "", latitude: "", longitude: "" });
        setIsEditing(false);
        setEditingId(null);
        await fetchData();
        router.refresh();
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao editar site.");
    } finally {
      setUpdatingCity(false);
    }
  };

  const startEdit = (city: any) => {
    setFormData({
      name: city.name,
      stateId: city.stateId,
      address: city.address || "",
      latitude: city.latitude !== null && city.latitude !== undefined ? String(city.latitude) : "",
      longitude: city.longitude !== null && city.longitude !== undefined ? String(city.longitude) : ""
    });
    setEditingId(city.id);
    setIsEditing(true);
    setIsCreating(false);
  };

  const cancelAction = () => {
    setFormData({ name: "", stateId: "", address: "", latitude: "", longitude: "" });
    setIsCreating(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleGeocode = async () => {
    if (!formData.address) return;
    setGeocoding(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: formData.address,
            format: "json",
            limit: 1
          },
          headers: {
            "User-Agent": "ZabbixDashboard/1.0"
          }
        }
      );

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(result.lat).toFixed(6),
          longitude: parseFloat(result.lon).toFixed(6)
        }));
      } else {
        alert("Nenhuma coordenada encontrada para este endereço. Verifique o endereço e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao geocodificar endereço:", error);
      alert("Erro ao buscar coordenadas. Tente preencher manualmente.");
    } finally {
      setGeocoding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este site? Todos os dispositivos vinculados serão removidos!")) return;
    try {
      await axios.delete(`/api/admin/cities/${id}`);
      await fetchData();
      router.refresh();
    } catch (error) {
      alert("Erro ao excluir site.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mt-1">Gerencie os sites onde os dispositivos estão instalados.</p>
        </div>
        <button
          onClick={() => {
            cancelAction();
            setIsCreating(true);
          }}
          className="flex items-center gap-2 bg-zabbix-primary hover:bg-zabbix-primary/90 text-white px-4 py-2 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Site
        </button>
      </div>

      {(isCreating || isEditing) && (
        <div className="glass-panel p-6 rounded-2xl border-zabbix-primary/30 max-w-2xl">
          <h2 className="text-lg font-bold text-white mb-6">
            {isEditing ? "Editar Site" : "Cadastrar Novo Site"}
          </h2>
          <form onSubmit={isEditing ? handleUpdateCity : handleCreateCity} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Estado</label>
              <select
                value={formData.stateId}
                onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                required
              >
                <option value="">Selecione um Estado...</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>{state.name} ({state.uf})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Nome do Site</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                placeholder="Ex: Site Salvador"
                required
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={creatingCity || updatingCity}
                className="flex-1 bg-zabbix-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {creatingCity || updatingCity ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  isEditing ? "Salvar Alterações" : "Salvar Site"
                )}
              </button>
              <button
                type="button"
                onClick={cancelAction}
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
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Site</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Estado</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-12 text-center">
                  <Loader2 className="w-8 h-8 text-zabbix-primary animate-spin mx-auto" />
                </td>
              </tr>
            ) : cities.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-12 text-center text-slate-500">Nenhum site cadastrado.</td>
              </tr>
            ) : (
              cities.map(city => (
                <tr key={city.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zabbix-primary/10 flex items-center justify-center text-zabbix-primary flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">{city.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-600" />
                      {city.state?.name} ({city.state?.uf})
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => startEdit(city)}
                        className="p-2 text-slate-500 hover:text-cyan-500 transition-colors"
                        title="Editar Site"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(city.id)}
                        className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                        title="Excluir Site"
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
