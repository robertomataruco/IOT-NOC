"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plus, Server, Trash2, Loader2, Globe, Wifi, MapPin, Activity, Edit3, Power, PowerOff, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DevicesAdmin() {
  const [devices, setDevices] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creatingDevice, setCreatingDevice] = useState(false);
  const [diagnosingVpn, setDiagnosingVpn] = useState(false);
  const [vpnReport, setVpnReport] = useState<any>(null);
  const [showVpnModal, setShowVpnModal] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type") || "das"; // default to das

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const nameLower = device.name.toLowerCase();
      const isFcc = nameLower.startsWith("[fcc]") || nameLower.includes("fcc") || nameLower.includes("alfa") || nameLower.includes("nobreak");
      const isAgst = nameLower.startsWith("[agst]") || nameLower.includes("agst") || nameLower.includes("conflex");
      if (typeFilter === "fcc") return isFcc;
      if (typeFilter === "agst") return isAgst;
      return !isFcc && !isAgst;
    });
  }, [devices, typeFilter]);

  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    serial: "",
    cityId: "",
    companyId: "",
    active: true,
    vpnUsername: "",
    address: "",
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && devices.length > 0) {
      const dev = devices.find(d => d.id === editId);
      if (dev) {
        let cleanName = dev.name;
        if (cleanName.startsWith("[FCC] ")) {
          cleanName = cleanName.replace("[FCC] ", "");
        } else if (cleanName.startsWith("[FCC]")) {
          cleanName = cleanName.replace("[FCC]", "");
        } else if (cleanName.startsWith("[AGST] ")) {
          cleanName = cleanName.replace("[AGST] ", "");
        } else if (cleanName.startsWith("[AGST]")) {
          cleanName = cleanName.replace("[AGST]", "");
        }
        setFormData({
          name: cleanName,
          ip: dev.ip || "",
          serial: dev.serial || "",
          cityId: dev.cityId || "",
          companyId: dev.companyId || "",
          active: dev.active !== false,
          vpnUsername: dev.vpnUsername || "",
          address: dev.address || "",
          latitude: dev.latitude !== null && dev.latitude !== undefined ? String(dev.latitude) : "",
          longitude: dev.longitude !== null && dev.longitude !== undefined ? String(dev.longitude) : ""
        });
        setEditingId(dev.id);
        setIsEditing(true);
        setIsCreating(true);
      }
    }
  }, [searchParams, devices]);

  const fetchData = async () => {
    try {
      const [devicesRes, citiesRes, companiesRes] = await Promise.all([
        axios.get("/api/admin/devices"),
        axios.get("/api/admin/cities"),
        axios.get("/api/admin/companies")
      ]);
      if (devicesRes.data.success) setDevices(devicesRes.data.data);
      if (citiesRes.data.success) setCities(citiesRes.data.data);
      if (companiesRes.data.success) setCompanies(companiesRes.data.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
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

  const handleSaveDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingDevice(true);
    try {
      const payloadName = typeFilter === "fcc" && !formData.name.startsWith("[FCC]") 
        ? `[FCC] ${formData.name}` 
        : typeFilter === "agst" && !formData.name.startsWith("[AGST]")
          ? `[AGST] ${formData.name}`
          : formData.name;
      const payload = { ...formData, name: payloadName };

      if (isEditing && editingId) {
        await axios.patch(`/api/admin/devices/${editingId}`, payload);
      } else {
        await axios.post("/api/admin/devices", payload);
      }
      
      setFormData({ name: "", ip: "", serial: "", cityId: "", companyId: "", active: true, vpnUsername: "", address: "", latitude: "", longitude: "" });
      setIsCreating(false);
      setIsEditing(false);
      setEditingId(null);
      await fetchData();
      router.refresh();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao salvar dispositivo.");
    } finally {
      setCreatingDevice(false);
    }
  };

  const startEdit = (device: any) => {
    let cleanName = device.name;
    if (cleanName.startsWith("[FCC] ")) {
      cleanName = cleanName.replace("[FCC] ", "");
    } else if (cleanName.startsWith("[FCC]")) {
      cleanName = cleanName.replace("[FCC]", "");
    } else if (cleanName.startsWith("[AGST] ")) {
      cleanName = cleanName.replace("[AGST] ", "");
    } else if (cleanName.startsWith("[AGST]")) {
      cleanName = cleanName.replace("[AGST]", "");
    }
    setFormData({
      name: cleanName,
      ip: device.ip,
      serial: device.serial || "",
      cityId: device.cityId,
      companyId: device.companyId || "",
      active: device.active !== undefined ? device.active : true,
      vpnUsername: device.vpnUsername || "",
      address: device.address || "",
      latitude: device.latitude !== null && device.latitude !== undefined ? String(device.latitude) : "",
      longitude: device.longitude !== null && device.longitude !== undefined ? String(device.longitude) : ""
    });
    setEditingId(device.id);
    setIsEditing(true);
    setIsCreating(true); // Reusa o mesmo container de formulário
  };

  const toggleDeviceActive = async (device: any) => {
    try {
      const updatedActive = !device.active;
      await axios.patch(`/api/admin/devices/${device.id}`, { active: updatedActive });
      setDevices(prev => prev.map(d => d.id === device.id ? { ...d, active: updatedActive } : d));
      router.refresh();
    } catch (error) {
      alert("Erro ao alterar status do dispositivo.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este dispositivo?")) return;
    try {
      await axios.delete(`/api/admin/devices/${id}`);
      await fetchData();
      router.refresh();
    } catch (error) {
      alert("Erro ao excluir dispositivo.");
    }
  };

  const handleVpnDiagnostics = async () => {
    setDiagnosingVpn(true);
    try {
      const res = await axios.post("/api/admin/devices/check-vpn");
      setVpnReport(res.data);
      setShowVpnModal(true);
      await fetchData(); // Recarregar tabela local para mostrar status atualizado!
      router.refresh();
    } catch (err: any) {
      console.error(err);
      if (err.response?.data) {
        setVpnReport(err.response.data);
        setShowVpnModal(true);
      } else {
        alert("Erro ao executar diagnóstico de VPN: " + err.message);
      }
    } finally {
      setDiagnosingVpn(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white">
            {typeFilter === "fcc" ? "No-Breaks FCC (SNMP)" : typeFilter === "agst" ? "Dispositivos AGST (SNMP)" : "Dispositivos DAS (SNMP)"}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {typeFilter === "fcc" 
              ? "Cadastre e gerencie seus retificadores e no-breaks FCC Alpha." 
              : typeFilter === "agst"
                ? "Cadastre e gerencie seus controladores AGST Conflex-Light."
                : "Cadastre e gerencie seus repetidores e equipamentos DAS Comba."} Defina-os como Ativo ou Inativo para habilitar ou suspender o monitoramento e alarmes.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
        
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-zabbix-primary hover:bg-zabbix-primary/90 text-white px-4 py-2 rounded-lg transition-all font-bold text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            {typeFilter === "fcc" ? "Novo No-Break" : typeFilter === "agst" ? "Novo Dispositivo AGST" : "Novo Dispositivo"}
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="glass-panel p-6 rounded-2xl border-zabbix-primary/30 max-w-2xl animate-in fade-in zoom-in duration-200">
          <h2 className="text-lg font-bold text-white mb-6">
            {isEditing 
              ? (typeFilter === 'fcc' ? 'Editar No-Break' : typeFilter === 'agst' ? 'Editar Dispositivo AGST' : 'Editar Dispositivo') 
              : (typeFilter === 'fcc' ? 'Cadastrar Novo No-Break' : typeFilter === 'agst' ? 'Cadastrar Novo Dispositivo AGST' : 'Cadastrar Novo Dispositivo')}
          </h2>
          <form onSubmit={handleSaveDevice} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">
                  {typeFilter === 'fcc' ? 'Nome do No-Break' : typeFilter === 'agst' ? 'Nome do Dispositivo AGST' : 'Nome do Dispositivo'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  placeholder={typeFilter === 'fcc' ? "Ex: No-Break Gabinete 1" : typeFilter === 'agst' ? "Ex: Central AGST 01" : "Ex: Master DCU"}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">IP LAN (Chave Trap)</label>
                <input
                  type="text"
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  placeholder="Ex: 192.170.114.101"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Número de Série (P/ Traps)</label>
                <input
                  type="text"
                  value={formData.serial}
                  onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  placeholder="Ex: AA2470153360"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Empresa (Entidade)</label>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50 font-medium"
                >
                  <option value="">Nenhuma (Administração Geral)</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Usuário VPN SSTP (Mikrotik)</label>
                <input
                  type="text"
                  value={formData.vpnUsername}
                  onChange={(e) => setFormData({ ...formData, vpnUsername: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  placeholder="Ex: site-highline (opcional)"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Site de Destino</label>
                <select
                  value={formData.cityId}
                  onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  required
                >
                  <option value="">Selecione um Site...</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name} ({city.state?.uf})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Endereço</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  placeholder="Ex: Av. Paulista, 1000 - Bela Vista, São Paulo - SP"
                />
                <button
                  type="button"
                  onClick={handleGeocode}
                  disabled={!formData.address || geocoding}
                  className="bg-slate-800 hover:bg-slate-700 text-zabbix-primary disabled:text-slate-500 disabled:bg-slate-900/20 hover:text-white px-4 rounded-xl border border-slate-700 hover:border-zabbix-primary/30 transition-all font-bold text-xs flex items-center gap-1.5 whitespace-nowrap disabled:cursor-not-allowed"
                  title="Clique para buscar a latitude/longitude do endereço automaticamente"
                >
                  {geocoding ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  Buscar Coordenadas
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  placeholder="Ex: -23.5616"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block uppercase font-bold">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50"
                  placeholder="Ex: -46.6560"
                />
              </div>
            </div>

            {/* Ativo / Desativado Switch */}
            <div className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                id="active-toggle"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded text-zabbix-primary bg-slate-950 border-slate-750 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="active-toggle" className="text-xs font-bold text-white uppercase cursor-pointer select-none flex-1">
                Ativar monitoramento e recepção de traps para este dispositivo
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={creatingDevice}
                className="flex-1 bg-zabbix-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {creatingDevice ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? "Atualizar Dados" : "Salvar Dispositivo")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setFormData({ name: "", ip: "", serial: "", cityId: "", companyId: "", active: true, vpnUsername: "" });
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
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Dispositivo</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Empresa</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">IP LAN</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Túnel VPN</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Nº Série</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Site/Estado</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <Loader2 className="w-8 h-8 text-zabbix-primary animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredDevices.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-500">Nenhum dispositivo cadastrado.</td>
              </tr>
            ) : (
              filteredDevices.map(device => {
                let displayName = device.name;
                if (displayName.startsWith("[FCC] ")) {
                  displayName = displayName.replace("[FCC] ", "");
                } else if (displayName.startsWith("[FCC]")) {
                  displayName = displayName.replace("[FCC]", "");
                } else if (displayName.startsWith("[AGST] ")) {
                  displayName = displayName.replace("[AGST] ", "");
                } else if (displayName.startsWith("[AGST]")) {
                  displayName = displayName.replace("[AGST]", "");
                }
                return (
                  <tr key={device.id} className={`hover:bg-slate-800/30 transition-colors ${!device.active ? 'opacity-60' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          device.active 
                            ? 'bg-zabbix-primary/10 border-zabbix-primary/20 text-zabbix-primary' 
                            : 'bg-slate-800/10 border-slate-800/20 text-slate-550'
                        }`}>
                          <Server className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${device.active ? 'text-white' : 'text-slate-500'}`}>{displayName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                            device.active 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-red-500/10 border-red-500/20 text-red-400'
                          }`}>
                            {device.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        {!device.active && (
                          <span className="text-[9px] text-red-450 font-bold block uppercase tracking-wider mt-0.5">Monitoramento Suspenso</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-semibold text-slate-300">
                      {device.company?.name || <span className="text-slate-500 italic">Sem Empresa</span>}
                    </span>
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-slate-900 px-2 py-1 rounded text-zabbix-accent">{device.ip}</code>
                  </td>
                  <td className="p-4">
                    {device.vpnUsername ? (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            device.vpnStatus === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                          }`} />
                          <span className={`text-[11px] font-extrabold uppercase ${
                            device.vpnStatus === 'ONLINE' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {device.vpnStatus === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          User: <strong className="text-slate-350">{device.vpnUsername}</strong>
                        </span>
                        {device.vpnIp && (
                          <span className="text-[9px] text-zabbix-accent font-mono block bg-slate-900/60 px-1 py-0.5 rounded w-max mt-0.5">
                            {device.vpnIp}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600 italic">Sem monitoramento</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-slate-300 font-mono">{device.serial || '---'}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        <span className="font-semibold text-slate-350">{device.city?.name} ({device.city?.state?.uf})</span>
                      </div>
                      {device.address && (
                        <span className="text-[10px] text-slate-500 max-w-[180px] truncate block" title={device.address}>
                          {device.address}
                        </span>
                      )}
                      {(device.latitude !== null || device.longitude !== null) && (
                        <span className="text-[9px] text-emerald-500/80 font-mono block">
                          Lat: {device.latitude ?? 'N/A'} | Lon: {device.longitude ?? 'N/A'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleDeviceActive(device)}
                      className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        device.active
                          ? 'bg-emerald-500/10 hover:bg-emerald-500 border-emerald-500/20 hover:border-emerald-500 text-emerald-400 hover:text-black shadow-md shadow-emerald-500/5'
                          : 'bg-red-500/10 hover:bg-red-500 border-red-500/20 hover:border-red-500 text-red-400 hover:text-white'
                      }`}
                      title={device.active ? "Suspender Monitoramento" : "Ativar Monitoramento"}
                    >
                      {device.active ? (
                        <>
                          <Power className="w-3.5 h-3.5" /> Ativado
                        </>
                      ) : (
                        <>
                          <PowerOff className="w-3.5 h-3.5" /> Desativado
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => startEdit(device)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Editar Dispositivo"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => router.push(`/devices/${device.id}`)}
                        className="p-2 text-zabbix-primary hover:bg-zabbix-primary/10 rounded-lg transition-colors"
                        title="Monitorar Tempo Real"
                        disabled={!device.active}
                      >
                        <Activity className={`w-4 h-4 ${!device.active ? 'text-slate-650 opacity-40 cursor-not-allowed' : ''}`} />
                      </button>
                      <button 
                        onClick={() => handleDelete(device.id)}
                        className="p-2 text-slate-550 hover:text-red-500 transition-colors"
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

      {showVpnModal && vpnReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border-zabbix-primary/30 p-6 flex flex-col space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  Diagnóstico em Tempo Real do Mikrotik Central
                </h3>
                <p className="text-slate-400 text-xs mt-1">Servidor Consultando: {vpnReport.ip}</p>
              </div>
              <button 
                onClick={() => setShowVpnModal(false)}
                className="text-slate-450 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors font-bold text-xs"
              >
                Fechar Painel
              </button>
            </div>

            {vpnReport.success ? (
              <div className="space-y-4">
                {/* Sucesso Geral */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm flex flex-col gap-1.5 shadow-md">
                  <span className="font-extrabold flex items-center gap-1.5">
                    ✅ CONEXÃO ESTABELECIDA COM SUCESSO!
                  </span>
                  <span>Comunidade SNMP identificada e aceita pelo Mikrotik Central: <strong className="text-white">"{vpnReport.connectedCommunity}"</strong></span>
                  {vpnReport.walkCounts && (
                    <span className="text-xs text-slate-400 mt-1">
                      Métricas da Leitura: <strong className="text-emerald-400">{vpnReport.walkCounts.namesCount}</strong> nomes de interface, <strong className="text-emerald-400">{vpnReport.walkCounts.statusCount}</strong> status e <strong className="text-emerald-400">{vpnReport.walkCounts.ipsCount}</strong> IPs cadastrados no Mikrotik.
                    </span>
                  )}
                  {vpnReport.attempts && vpnReport.attempts.length > 0 && (
                    <div className="text-[10px] text-slate-400 mt-1.5 flex flex-col gap-0.5 border-t border-emerald-500/10 pt-1.5 font-mono">
                      <span className="font-semibold text-[11px] text-slate-350">Histórico de tentativas:</span>
                      {vpnReport.attempts.map((att: any, idx: number) => (
                        <span key={idx} className={att.status === 'SUCCESS' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          • Comunidade "{att.community}": {att.status === 'SUCCESS' ? 'Conectado com sucesso ✅' : `Falhou ❌ (${att.error})`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lista de Comparações */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mapeamento dos Túneis dos Dispositivos</h4>
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/20">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900/40 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                          <th className="p-3">Equipamento</th>
                          <th className="p-3">Usuário VPN</th>
                          <th className="p-3">Interface Encontrada</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">IP Dinâmico</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {vpnReport.devicesChecked.map((d: any) => (
                          <tr key={d.deviceId} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-bold text-white">{d.deviceName}</td>
                            <td className="p-3 text-slate-300 font-semibold">{d.vpnUsernameConfigured}</td>
                            <td className="p-3 text-slate-400 font-mono">{d.matchedInterfaceName}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                d.evaluatedStatus === 'ONLINE' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {d.evaluatedStatus}
                              </span>
                            </td>
                            <td className="p-3 text-emerald-400 font-mono font-bold">{d.matchedIp || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Lista de Interfaces Encontradas no Mikrotik */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interfaces Ativas / VPNs Detectadas no Mikrotik Central</h4>
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/20 max-h-[220px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900/40 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider sticky top-0 backdrop-blur-md">
                          <th className="p-3">Índice</th>
                          <th className="p-3">Nome da Interface</th>
                          <th className="p-3">Status SNMP</th>
                          <th className="p-3">IP Associado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {vpnReport.interfacesFound && vpnReport.interfacesFound.length > 0 ? (
                          vpnReport.interfacesFound.map((i: any) => (
                            <tr key={i.index} className="hover:bg-white/5 transition-colors">
                              <td className="p-3 text-slate-500">#{i.index}</td>
                              <td className="p-3 text-cyan-300 font-bold">{i.name}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  i.status.includes('ONLINE') 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                                    : 'bg-slate-800 text-slate-500'
                                }`}>
                                  {i.status}
                                </span>
                              </td>
                              <td className="p-3 text-emerald-450 font-bold">{i.ip || "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-slate-550 italic bg-slate-900/50">
                              Nenhuma interface ativa ou túnel VPN retornado pelo Mikrotik Central.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Fallback de interfaces sem filtro */}
                {vpnReport.rawInterfacesFallback && vpnReport.rawInterfacesFallback.length > 0 && (
                  <div className="space-y-2 p-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      ⚠️ AVISO DE PERMISSÃO / VIEW SNMP DO MIKROTIK
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      O Mikrotik respondeu com <strong className="text-white">{vpnReport.walkCounts?.namesCount} interfaces</strong> no total, mas nenhuma delas bateu com os nossos filtros de busca ou estão marcadas como ONLINE. 
                      Abaixo estão as primeiras 15 interfaces retornadas pelo Mikrotik para diagnosticarmos se ele está enviando as interfaces físicas ou dinâmicas:
                    </p>
                    <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/35 max-h-[200px] overflow-y-auto mt-2">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-950/45 border-b border-slate-800 text-slate-400 font-bold font-sans">
                            <th className="p-2.5">Índice</th>
                            <th className="p-2.5">Nome da Interface</th>
                            <th className="p-2.5">Status SNMP</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-mono text-slate-355">
                          {vpnReport.rawInterfacesFallback.map((i: any) => (
                            <tr key={i.index} className="hover:bg-white/5">
                              <td className="p-2.5 text-slate-500">#{i.index}</td>
                              <td className="p-2.5 font-bold text-cyan-400">{i.name}</td>
                              <td className="p-2.5 text-xs">{i.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Dicas de Resolução */}
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-amber-400">Dicas de Resolução de Túneis OFFLINE:</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    <li>Verifique se o nome do <strong>Usuário VPN SSTP</strong> cadastrado no Zabbix (ex: <code className="text-white font-mono">HL_FASANO_BA</code>) é exatamente igual ao da conta na aba <code className="text-white font-semibold">PPP -> Secrets</code> do Mikrotik Central.</li>
                    <li>O sistema diferencia maiúsculas de minúsculas no Mikrotik, mas nossa busca converte ambos para minúsculas automaticamente para facilitar!</li>
                    <li>Se a interface listada for <code className="text-white">"Nenhuma correspondente encontrada..."</code>, o túnel SSTP daquele cliente não está ativo no Mikrotik Central no momento ou o nome está grafado de forma diferente.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Falha Geral */}
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm flex flex-col gap-1.5">
                  <span className="font-extrabold flex items-center gap-1.5">
                    ❌ FALHA GERAL DE CONECTIVIDADE SNMP!
                  </span>
                  <span>{vpnReport.error}</span>
                </div>

                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-amber-500">Passo a Passo de Solução de Erro de Conexão:</h4>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                    <li>Verifique se o SNMP está ativado no seu Mikrotik Central (<code className="text-white">IP -> SNMP -> Enabled</code>).</li>
                    <li>Verifique se a comunidade SNMP configurada no Mikrotik Central é <code className="text-white">ricas</code> ou <code className="text-white">public</code> e se o IP do servidor Ubuntu (<code className="text-white">192.168.67.94</code>) tem permissão de leitura.</li>
                    <li>Certifique-se de que não há nenhuma regra de firewall no Mikrotik Central bloqueando tráfego UDP na porta <code className="text-white">161</code> vindo da rede local.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
