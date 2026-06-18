"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, AlertTriangle, CheckCircle2, Map as MapIcon, 
  ExternalLink, Globe, List, Navigation, Edit, Save, X, 
  Server, Zap, ChevronRight, ChevronLeft, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import MapComponent from "./MapComponent";

interface MapaClientProps {
  initialCities: any[];
  userCompanyId: string | null;
  isAdmin: boolean;
}

export default function MapaClient({ initialCities, userCompanyId, isAdmin }: MapaClientProps) {
  const [cities, setCities] = useState<any[]>(initialCities);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ONLINE" | "ALERT">("ALL");
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  
  // HUD states
  const [isSiteListOpen, setIsSiteListOpen] = useState(true);

  // Edit coordinates states (for ADMIN)
  const [isEditingCoords, setIsEditingCoords] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editLat, setEditLat] = useState("");
  const [editLng, setEditLng] = useState("");
  const [savingCoords, setSavingCoords] = useState(false);

  // Poll devices status every 15 seconds to keep the map updated in real-time
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await axios.get("/api/admin/devices");
        if (res.data.success && Array.isArray(res.data.data)) {
          const updatedDevices = res.data.data;
          setCities(prevCities => {
            return prevCities.map(city => {
              const cityDevices = updatedDevices.filter((d: any) => d.cityId === city.id);
              return {
                ...city,
                devices: cityDevices
              };
            });
          });
        }
      } catch (err) {
        console.error("Erro ao atualizar status dos dispositivos no mapa:", err);
      }
    };

    const interval = setInterval(fetchUpdates, 15000);
    return () => clearInterval(interval);
  }, []);

  // Flatten devices from all cities
  const allDevices = useMemo(() => {
    const list: any[] = [];
    cities.forEach(city => {
      if (city.devices) {
        city.devices.forEach((d: any) => {
          list.push({
            ...d,
            city: {
              id: city.id,
              name: city.name,
              state: city.state
            }
          });
        });
      }
    });
    return list;
  }, [cities]);

  // Background auto-geocoding loop for admin to dynamically find and save coordinates
  useEffect(() => {
    if (!isAdmin) return;

    const devicesToGeocode = allDevices.filter(d => d.address && (!d.latitude || !d.longitude));
    if (devicesToGeocode.length === 0) return;

    let index = 0;

    const geocodeNext = async () => {
      if (index >= devicesToGeocode.length) return;
      const device = devicesToGeocode[index];
      
      const query = device.address;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
          {
            headers: {
              'User-Agent': 'RicasTecnologiaNOC/1.0 (suporte@ricastecnologia.com.br)'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            // PATCH to update DB
            const patchRes = await axios.patch(`/api/admin/devices/${device.id}`, {
              latitude: lat,
              longitude: lon
            });

            if (patchRes.data.success) {
              setCities(prev => prev.map(city => {
                if (city.id === device.cityId) {
                  return {
                    ...city,
                    devices: city.devices.map((d: any) => d.id === device.id ? {
                      ...d,
                      latitude: lat,
                      longitude: lon
                    } : d)
                  };
                }
                return city;
              }));
            }
          }
        }
      } catch (err) {
        console.error(`Failed to geocode ${device.name}:`, err);
      }

      index++;
      setTimeout(geocodeNext, 2000); // 2 second delay to respect OSM policies
    };

    const timer = setTimeout(geocodeNext, 3000);
    return () => clearTimeout(timer);
  }, [allDevices, isAdmin]);

  // Filtered devices list
  const filteredDevices = useMemo(() => {
    return allDevices.filter(device => {
      const hasAlert = device.hasAlarm || device.status === "OFFLINE";
      
      const matchesSearch = 
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (device.ip || "").includes(searchQuery) ||
        (device.city?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (device.city?.state?.uf || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "ALL" ||
        (statusFilter === "ONLINE" && !hasAlert) ||
        (statusFilter === "ALERT" && hasAlert);

      return matchesSearch && matchesStatus;
    });
  }, [allDevices, searchQuery, statusFilter]);

  // General counters
  const stats = useMemo(() => {
    let totalDevices = allDevices.length;
    let alerts = allDevices.filter(d => d.hasAlarm || d.status === "OFFLINE").length;
    let normal = totalDevices - alerts;
    return { total: cities.length, alerts, normal, totalDevs: totalDevices };
  }, [allDevices, cities]);

  const handleSelectDevice = (device: any) => {
    setSelectedDevice(device);
    setEditAddress(device.address || "");
    setEditLat(device.latitude?.toString() || "");
    setEditLng(device.longitude?.toString() || "");
    setIsEditingCoords(false);
  };

  const handleSaveCoordinates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;
    setSavingCoords(true);

    try {
      const res = await axios.patch(`/api/admin/devices/${selectedDevice.id}`, {
        address: editAddress || "",
        latitude: editLat ? parseFloat(editLat) : null,
        longitude: editLng ? parseFloat(editLng) : null
      });

      if (res.data.success) {
        setCities(prev => prev.map(city => {
          if (city.id === selectedDevice.cityId) {
            return {
              ...city,
              devices: city.devices.map((d: any) => d.id === selectedDevice.id ? {
                ...d,
                address: res.data.data.address,
                latitude: res.data.data.latitude,
                longitude: res.data.data.longitude
              } : d)
            };
          }
          return city;
        }));

        setSelectedDevice((prev: any) => ({
          ...prev,
          address: res.data.data.address,
          latitude: res.data.data.latitude,
          longitude: res.data.data.longitude
        }));

        setIsEditingCoords(false);
        alert("Geolocalização salva com sucesso!");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Erro ao salvar.");
    } finally {
      setSavingCoords(false);
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      
      {/* Immersive Map Container */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
          devices={filteredDevices} 
          onSelectDevice={handleSelectDevice} 
        />
      </div>

      {/* Floating Header Hud */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col md:flex-row gap-4 items-center justify-between pointer-events-none">
        
        {/* Title Card */}
        <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 px-5 py-3 rounded-2xl flex items-center gap-4 pointer-events-auto shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white border border-emerald-500/20 shadow-lg shadow-emerald-500/20">
            <Globe className="w-6 h-6 animate-spin [animation-duration:20s]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">RICAS TECNOLOGIA</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">NOC</span>
            </div>
            <h1 className="text-sm font-black text-white uppercase tracking-wider">MAPA DE OPERAÇÕES</h1>
          </div>
        </div>

        {/* Tactical Counters */}
        <div className="bg-slate-950/85 backdrop-blur-xl border border-slate-800/80 px-6 py-2.5 rounded-2xl flex items-center gap-6 pointer-events-auto shadow-2xl">
          <div className="text-center">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Sites</span>
            <p className="text-lg font-black text-white">{stats.total}</p>
          </div>
          <div className="w-px h-8 bg-slate-850" />
          <div className="text-center">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Dispositivos</span>
            <p className="text-lg font-black text-slate-300">{stats.totalDevs}</p>
          </div>
          <div className="w-px h-8 bg-slate-850" />
          <div className="text-center">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Normais</span>
            <p className="text-lg font-black text-emerald-400">{stats.normal}</p>
          </div>
          <div className="w-px h-8 bg-slate-850" />
          <div className="text-center">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Alertas</span>
            <p className="text-lg font-black text-red-500 animate-pulse">{stats.alerts}</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl border border-slate-800 text-slate-300 hover:text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xl"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-450" />
            Voltar ao Painel
          </Link>
        </div>
      </div>

      {/* Floating collapsible Device List HUD (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-10 w-80 max-h-[480px] flex flex-col pointer-events-none">
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsSiteListOpen(!isSiteListOpen)}
          className="self-start mb-2 bg-slate-950/90 hover:bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white transition-all flex items-center gap-2 pointer-events-auto shadow-2xl"
        >
          {isSiteListOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>{isSiteListOpen ? "Esconder Dispositivos" : "Mostrar Dispositivos"}</span>
        </button>

        {isSiteListOpen && (
          <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-left duration-200">
            {/* Search & Filter */}
            <div className="p-4 border-b border-slate-900 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                <input
                  type="text"
                  placeholder="Buscar equipamento..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                />
              </div>

              {/* Status Filters */}
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-0.5 border border-slate-850 rounded-xl text-[9px] font-black uppercase tracking-widest text-center">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`py-1 rounded-lg transition-all ${
                    statusFilter === "ALL" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-550 hover:text-slate-300"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter("ONLINE")}
                  className={`py-1 rounded-lg transition-all ${
                    statusFilter === "ONLINE" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "text-slate-550 hover:text-slate-300"
                  }`}
                >
                  OK
                </button>
                <button
                  onClick={() => setStatusFilter("ALERT")}
                  className={`py-1 rounded-lg transition-all ${
                    statusFilter === "ALERT" ? "bg-red-500/15 text-red-400 border border-red-500/20" : "text-slate-550 hover:text-slate-300"
                  }`}
                >
                  Alertas
                </button>
              </div>
            </div>

            {/* Devices List */}
            <div className="overflow-y-auto max-h-[300px] p-3 space-y-1.5 custom-scrollbar">
              {filteredDevices.length === 0 ? (
                <div className="p-8 text-center text-slate-600 text-xs italic">Nenhum equipamento encontrado.</div>
              ) : (
                filteredDevices.map(device => {
                  const isOffline = device.status === "OFFLINE";
                  const hasAlarm = device.hasAlarm || device.status === "ALERTA";
                  const hasAlert = isOffline || hasAlarm;
                  const isSelected = selectedDevice?.id === device.id;
                  const hasCoords = device.latitude && device.longitude;

                  return (
                    <div
                      key={device.id}
                      onClick={() => handleSelectDevice(device)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-emerald-500/5 border-emerald-500/50 text-white shadow-lg"
                          : "bg-slate-900/20 border-slate-900 hover:bg-slate-900/40 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs truncate block uppercase tracking-wide">
                            {device.name}
                          </span>
                          <span className="text-[8px] font-black text-slate-500 bg-slate-900 px-1 rounded shrink-0">
                            {device.city?.state?.uf || ""}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-[9px] text-slate-550 font-semibold">
                          <span className="flex items-center gap-1 shrink-0">
                            <Server className="w-3 h-3 text-slate-600" />
                            {device.city?.name || "Sem Site"}
                          </span>
                          {hasCoords ? (
                            <span className="text-emerald-500/80 font-bold">Mapeado</span>
                          ) : (
                            <span className="text-slate-700 italic">Sem coords</span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isOffline ? (
                          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
                        ) : hasAlarm ? (
                          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Device Detail Drawer (Slide-in Right) */}
      {selectedDevice && (
        <div className="absolute top-4 right-4 bottom-4 w-96 bg-slate-950/95 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl z-25 flex flex-col overflow-hidden animate-in slide-in-from-right duration-250">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-900 bg-slate-950/90 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                Detalhes do Dispositivo ({selectedDevice.city?.state?.uf || ""})
              </span>
              <h2 className="text-sm font-black text-white truncate mt-0.5 uppercase tracking-wide">
                {selectedDevice.name}
              </h2>
            </div>
            <button
              onClick={() => setSelectedDevice(null)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-550 hover:text-white transition-all shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
            
            {/* Geoposicionamento / Map Links */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-slate-400" /> Geoposicionamento
              </h4>

              {isEditingCoords && isAdmin ? (
                <form onSubmit={handleSaveCoordinates} className="space-y-3">
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-550 uppercase block mb-1">Endereço</label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={e => setEditAddress(e.target.value)}
                        placeholder="Ex: Av. Paulista, 1000"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-slate-550 uppercase block mb-1">Latitude</label>
                        <input
                          type="text"
                          value={editLat}
                          onChange={e => setEditLat(e.target.value)}
                          placeholder="-14.235"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-550 uppercase block mb-1">Longitude</label>
                        <input
                          type="text"
                          value={editLng}
                          onChange={e => setEditLng(e.target.value)}
                          placeholder="-51.925"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={savingCoords}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-950 text-slate-950 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingCoords ? "Salvando..." : "Salvar"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingCoords(false)}
                      className="flex-1 bg-slate-850 hover:bg-slate-800 text-white py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  {selectedDevice.address && (
                    <div className="text-xs mb-2">
                      <span className="text-[9px] font-bold text-slate-550 uppercase block">Endereço</span>
                      <span className="text-white font-medium">{selectedDevice.address}</span>
                    </div>
                  )}
                  {selectedDevice.latitude && selectedDevice.longitude ? (
                    <>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[9px] font-bold text-slate-550 uppercase block">Latitude</span>
                          <span className="font-mono font-bold text-white">{selectedDevice.latitude}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-550 uppercase block">Longitude</span>
                          <span className="font-mono font-bold text-white">{selectedDevice.longitude}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t border-slate-900/60">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${selectedDevice.latitude},${selectedDevice.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Google Maps</span>
                        </a>
                        {isAdmin && (
                          <button
                            onClick={() => setIsEditingCoords(true)}
                            className="px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-455 hover:text-white py-2 rounded-xl transition-all"
                            title="Editar Coordenadas"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 italic">Nenhuma coordenada configurada.</p>
                      {isAdmin && (
                        <button
                          onClick={() => setIsEditingCoords(true)}
                          className="w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Digitar Coordenadas</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status / Details */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-slate-400" /> Informações do Dispositivo
              </h4>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500 font-bold uppercase text-[9px]">Status Monitoramento</span>
                  <span className={`font-black uppercase tracking-wider text-[10px] ${
                    selectedDevice.status === "OFFLINE"
                      ? "text-red-500"
                      : selectedDevice.hasAlarm || selectedDevice.status === "ALERTA"
                      ? "text-amber-500"
                      : "text-emerald-400"
                  }`}>
                    {selectedDevice.status === "OFFLINE"
                      ? "🔴 OFFLINE"
                      : selectedDevice.hasAlarm || selectedDevice.status === "ALERTA"
                      ? "⚠️ ONLINE c/ ERROS"
                      : "🟢 ONLINE"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500 font-bold uppercase text-[9px]">IP Lan</span>
                  <span className="font-mono text-white font-bold">{selectedDevice.ip || '0.0.0.0'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500 font-bold uppercase text-[9px]">Nº Série</span>
                  <span className="font-mono text-white font-bold">{selectedDevice.serial || '---'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-bold uppercase text-[9px]">Site</span>
                  <span className="text-white font-bold">{selectedDevice.city?.name} ({selectedDevice.city?.state?.uf})</span>
                </div>
              </div>
            </div>

            {/* HTTPS Quick Link */}
            {selectedDevice.ip && (
              <a
                href={`https://${selectedDevice.ip}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Acessar Web (HTTPS)</span>
              </a>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
