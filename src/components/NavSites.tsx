"use client";

import { useState, useMemo, useEffect } from "react";
import { Globe, ChevronDown, ChevronRight, MapPin, Search, Server, Building, Zap, BatteryCharging, Edit3, RefreshCw, ExternalLink, Cpu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

interface KronDeviceNav {
  id: string;
  name: string;
  serial: string;
  active: boolean;
}

interface DeviceNav {
  id: string;
  name: string;
  serial?: string;
  hasAlarm: boolean;
  status: string;
  syncError?: string;
  active?: boolean;
  ip?: string;
  vpnUsername?: string | null;
  vpnStatus?: string | null;
  vpnIp?: string | null;
  lastSnmpData?: string | null;
  traps?: any[];
}

interface CityNode {
  id: string;
  name: string;
  devices: DeviceNav[];
  kronDevices: KronDeviceNav[];
}

interface StateNode {
  id: string;
  name: string;
  uf: string;
  cities: CityNode[];
}

interface CompanyNode {
  id: string;
  name: string;
  states: StateNode[];
}

interface NavSitesProps {
  companies: CompanyNode[];
  unassignedStates: StateNode[];
  isAdmin: boolean;
}

function getDeviceHardwareList(device: DeviceNav) {
  if (device.name.startsWith("[AGST]")) {
    return {
      ed: Array.from({ length: 11 }, (_, i) => `ED ${i + 1}`),
      eu: Array.from({ length: 22 }, (_, i) => `EU ${i + 1}`),
      sd: Array.from({ length: 12 }, (_, i) => `SD ${i + 1}`)
    } as any;
  }

  const defaultHardware = {
    apois: ["A-POI #1", "A-POI #2"],
    au: [
      "AU RF 1", "AU RF 2", "AU RF 3", "AU RF 4",
      "AU RF 5", "AU RF 6", "AU RF 7", "AU RF 8",
      "AU SFP Port 1", "AU SFP Port 2", "AU SFP Port 3", "AU SFP Port 4"
    ],
    eus: ["Porta 1 (Óptica)", "Porta 2 (Óptica)"],
    saus: ["SAU #1"],
    srius: ["SRIU #1"]
  };

  if (!device.lastSnmpData) {
    return null;
  }

  try {
    const data = JSON.parse(device.lastSnmpData);
    const realtime = data?.realtime || {};
    
    // 1. Detectar A-POIs das temperaturas
    const apoisSet = new Set<string>();
    if (Array.isArray(realtime.temperature)) {
      realtime.temperature.forEach((t: any) => {
        if (t.name && t.name.toLowerCase().includes("poi")) {
          const match = t.name.match(/\d+/);
          if (match) {
            apoisSet.add(`A-POI #${match[0]}`);
          }
        }
      });
    }
    
    // Fallback/adicional por potência
    if (apoisSet.size === 0 && Array.isArray(realtime.power)) {
      realtime.power.forEach((p: any) => {
        if (p.name && p.name.toLowerCase().includes("poi")) {
          const match = p.name.match(/poi-?(\d+)/i);
          if (match) {
            apoisSet.add(`A-POI #${match[1]}`);
          }
        }
      });
    }
    const apois = apoisSet.size > 0 ? Array.from(apoisSet).sort() : defaultHardware.apois;

    // 2. Detectar AU RF Channels e AU SFP Ports dinamicamente
    const auList: string[] = [];
    const auSet = new Set<string>();
    if (Array.isArray(realtime.rfChannels)) {
      realtime.rfChannels.forEach((ch: any) => {
        if (ch.channel !== undefined) {
          auSet.add(`AU RF ${ch.channel}`);
        }
      });
    }
    
    if (auSet.size > 0) {
      const sortedChannels = Array.from(auSet).sort((a, b) => {
        const numA = parseInt(a.replace(/^\D+/g, ''));
        const numB = parseInt(b.replace(/^\D+/g, ''));
        return numA - numB;
      });
      auList.push(...sortedChannels);
    } else {
      auList.push(...defaultHardware.au.filter(item => item.startsWith("AU RF")));
    }

    // Adiciona as portas SFP do AU (usamos as 4 primeiras portas SFP para o AU)
    const auSfpsSet = new Set<string>();
    if (Array.isArray(realtime.sfps)) {
      const limit = Math.min(realtime.sfps.length, 4);
      for (let i = 0; i < limit; i++) {
        auSfpsSet.add(`AU SFP Port ${i + 1}`);
      }
    }
    if (auSfpsSet.size > 0) {
      auList.push(...Array.from(auSfpsSet));
    } else {
      auList.push(...defaultHardware.au.filter(item => item.startsWith("AU SFP")));
    }
    const au = auList;

    // 3. Detectar EUs (SFPs / Portas Ópticas adicionais do EU)
    const eusSet = new Set<string>();
    if (Array.isArray(realtime.sfps)) {
      // Começa da quinta SFP (pois as 4 primeiras são do AU)
      if (realtime.sfps.length > 4) {
        for (let i = 4; i < realtime.sfps.length; i++) {
          const sfp = realtime.sfps[i];
          if (sfp.name) {
            eusSet.add(sfp.name);
          } else if (sfp.index !== undefined) {
            eusSet.add(`Porta ${sfp.index} (Óptica)`);
          }
        }
      }
    }
    const eus = eusSet.size > 0 ? Array.from(eusSet) : defaultHardware.eus;

    // 4. SAUs e SRIUs
    const saus = defaultHardware.saus;
    const srius = defaultHardware.srius;

    return { apois, au, eus, saus, srius };
  } catch (e) {
    return defaultHardware;
  }
}

function parseModuleNameFromFullText(fullText: string): string {
  if (!fullText) return "";
  const match = fullText.match(/15921\.60\.1\.1\.8\s*=\s*(?:[a-zA-Z0-9_-]+:)?\s*["']?([^"'\r\n]+)/i);
  if (match) {
    return match[1].trim();
  }
  return "";
}

function getComponentTrapSeverity(traps: any[], componentType: 'apoi' | 'au' | 'eu' | 'sau' | 'sriu' | 'ed' | 'sd', index: number, name: string) {
  if (!Array.isArray(traps) || traps.length === 0) return null;
  
  if (componentType === 'ed' || componentType === 'eu' || componentType === 'sd') {
    const targetName = `${componentType.toUpperCase()} ${index}`;
    const compTraps = traps.filter(trap => {
      const trapAlarm = (trap.alarmName || "").toUpperCase();
      return trapAlarm === targetName;
    });
    if (compTraps.length === 0) return null;
    return Math.max(...compTraps.map(t => t.severity));
  }
  
  const componentTraps = traps.filter(trap => {
    const moduleName = trap.locationDetails?.moduleName || parseModuleNameFromFullText(trap.fullText);
    const moduleLower = moduleName.toLowerCase();
    const alarmLower = (trap.alarmName || "").toLowerCase();
    const descLower = (trap.description || "").toLowerCase();
    
    if (componentType === 'apoi') {
      const isPoi = moduleLower.includes("poi") || alarmLower.includes("poi") || descLower.includes("poi");
      if (!isPoi) return false;
      const numMatch = moduleLower.match(/\d+/) || alarmLower.match(/\d+/) || descLower.match(/\d+/);
      return numMatch ? parseInt(numMatch[0]) === index : false;
    }
    
    if (componentType === 'au') {
      const isSfp = name.toLowerCase().includes("sfp");
      const isRf = name.toLowerCase().includes("rf");
      const isAu = moduleLower.includes("au") || alarmLower.includes("au") || descLower.includes("au");
      if (!isAu) return false;
      
      if (isSfp) {
        const hasSfp = moduleLower.includes("sfp") || alarmLower.includes("sfp") || descLower.includes("sfp");
        if (!hasSfp) return false;
      } else if (isRf) {
        const hasRf = moduleLower.includes("rf") || alarmLower.includes("rf") || descLower.includes("rf") || moduleLower.includes("channel") || alarmLower.includes("channel") || descLower.includes("channel");
        const hasSfp = moduleLower.includes("sfp") || alarmLower.includes("sfp") || descLower.includes("sfp");
        if (hasSfp) return false;
      }
      
      const numMatch = name.match(/\d+/);
      const trapNumMatch = moduleLower.match(/\d+/) || alarmLower.match(/\d+/) || descLower.match(/\d+/);
      return numMatch && trapNumMatch ? parseInt(numMatch[0]) === parseInt(trapNumMatch[0]) : false;
    }
    
    if (componentType === 'eu') {
      const isEu = moduleLower.includes("eu") || alarmLower.includes("eu") || descLower.includes("eu");
      if (!isEu) return false;
      const numMatch = name.match(/\d+/);
      const trapNumMatch = moduleLower.match(/\d+/) || alarmLower.match(/\d+/) || descLower.match(/\d+/);
      return numMatch && trapNumMatch ? parseInt(numMatch[0]) === parseInt(trapNumMatch[0]) : false;
    }
    
    if (componentType === 'sau') {
      const isSau = moduleLower.includes("sau") || alarmLower.includes("sau") || descLower.includes("sau");
      if (!isSau) return false;
      const numMatch = name.match(/\d+/);
      const trapNumMatch = moduleLower.match(/\d+/) || alarmLower.match(/\d+/) || descLower.match(/\d+/);
      return numMatch && trapNumMatch ? parseInt(numMatch[0]) === parseInt(trapNumMatch[0]) : true;
    }
    
    if (componentType === 'sriu') {
      const isSriu = moduleLower.includes("sriu") || alarmLower.includes("sriu") || descLower.includes("sriu");
      if (!isSriu) return false;
      const numMatch = name.match(/\d+/);
      const trapNumMatch = moduleLower.match(/\d+/) || alarmLower.match(/\d+/) || descLower.match(/\d+/);
      return numMatch && trapNumMatch ? parseInt(numMatch[0]) === parseInt(trapNumMatch[0]) : true;
    }
    
    return false;
  });
  
  if (componentTraps.length === 0) return null;
  return Math.max(...componentTraps.map(t => t.severity));
}

function getSeverityStyles(severity: number | null, isActive: boolean) {
  if (severity === null) {
    return {
      text: isActive ? 'bg-zabbix-primary/25 text-zabbix-primary font-bold' : 'text-slate-500 hover:text-slate-350 hover:bg-slate-800/20',
      icon: 'text-green-500 opacity-60'
    };
  }
  if (severity === 3) {
    return {
      text: isActive ? 'text-red-450 font-extrabold bg-red-500/20 border-l-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'text-red-500 font-semibold hover:text-red-400 hover:bg-red-500/10 bg-red-500/5 border-l border-red-500/30',
      icon: 'text-red-500 animate-pulse'
    };
  }
  if (severity === 1 || severity === 2) {
    return {
      text: isActive ? 'text-amber-450 font-extrabold bg-amber-500/20 border-l-2 border-amber-500 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'text-amber-500 font-semibold hover:text-amber-400 hover:bg-amber-500/10 bg-amber-500/5 border-l border-amber-500/30',
      icon: 'text-amber-500 animate-pulse'
    };
  }
  return {
    text: isActive ? 'text-sky-400 font-extrabold bg-sky-500/20 border-l-2 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 'text-sky-400 font-semibold hover:text-sky-300 hover:bg-sky-500/10 bg-sky-500/5 border-l border-sky-500/30',
    icon: 'text-sky-400 animate-pulse'
  };
}

export function NavSites({ companies, unassignedStates, isAdmin }: NavSitesProps) {
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const [expandedSites, setExpandedSites]         = useState<Record<string, boolean>>({});
  const [expandedStates, setExpandedStates]       = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities]       = useState<Record<string, boolean>>({});
  const [expandedDas, setExpandedDas]             = useState<Record<string, boolean>>({});
  const [expandedFcc, setExpandedFcc]             = useState<Record<string, boolean>>({});
  const [expandedAgst, setExpandedAgst]           = useState<Record<string, boolean>>({});
  const [expandedKron, setExpandedKron]           = useState<Record<string, boolean>>({});
  const [expandedVpn, setExpandedVpn]             = useState<Record<string, boolean>>({});
  const [expandedDevices, setExpandedDevices]     = useState<Record<string, boolean>>({});
  const [expandedApois, setExpandedApois]         = useState<Record<string, boolean>>({});
  const [expandedAus, setExpandedAus]             = useState<Record<string, boolean>>({});
  const [expandedEus, setExpandedEus]             = useState<Record<string, boolean>>({});
  const [expandedSaus, setExpandedSaus]           = useState<Record<string, boolean>>({});
  const [expandedSrius, setExpandedSrius]         = useState<Record<string, boolean>>({});
  const [expandedAgstEd, setExpandedAgstEd]       = useState<Record<string, boolean>>({});
  const [expandedAgstEu, setExpandedAgstEu]       = useState<Record<string, boolean>>({});
  const [expandedAgstSd, setExpandedAgstSd]       = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm]               = useState("");
  const pathname = usePathname();
  const router   = useRouter();
  const searchParams = useSearchParams();
  const [deviceUpdates, setDeviceUpdates] = useState<Record<string, { status: string; hasAlarm: boolean; active?: boolean; traps?: any[] }>>({});

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get("/api/admin/devices");
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          const updates: Record<string, { status: string; hasAlarm: boolean; active?: boolean; traps?: any[] }> = {};
          res.data.data.forEach((d: any) => {
            updates[d.id] = { status: d.status, hasAlarm: d.hasAlarm, active: d.active, traps: d.traps || [] };
          });
          setDeviceUpdates(updates);
        }
      } catch (err) {
        console.error("Erro ao atualizar status dos dispositivos na sidebar:", err);
      }
    };

    fetchStatuses();
    const interval = setInterval(fetchStatuses, 15000);
    return () => clearInterval(interval);
  }, []);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    deviceId: string;
    deviceName: string;
    isFcc: boolean;
    ip?: string;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, deviceId: string, deviceName: string, isFcc: boolean, ip?: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      deviceId,
      deviceName,
      isFcc,
      ip
    });
  };

  useEffect(() => {
    const handleCloseMenu = () => {
      setContextMenu(null);
    };
    window.addEventListener("click", handleCloseMenu);
    return () => window.removeEventListener("click", handleCloseMenu);
  }, []);

  // Auto-expand first company for single-company users
  useEffect(() => {
    if (companies.length > 0) {
      const initial: Record<string, boolean> = {};
      if (!isAdmin || companies.length === 1) {
        initial[companies[0].id] = true;
        initial[`sites-${companies[0].id}`] = true;
      }
      setExpandedCompanies(prev => ({ ...initial, ...prev }));
    }
  }, [companies, isAdmin]);

  const toggleCompany = (id: string) =>
    setExpandedCompanies(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleSites = (id: string) =>
    setExpandedSites(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleState = (id: string) =>
    setExpandedStates(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleCity = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedCities(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleDas  = (cityId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedDas(prev => ({ ...prev, [cityId]: !prev[cityId] }));
  };
  const toggleFcc  = (cityId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedFcc(prev => ({ ...prev, [cityId]: !prev[cityId] }));
  };
  const toggleAgst = (cityId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedAgst(prev => ({ ...prev, [cityId]: !prev[cityId] }));
  };
  const toggleKron = (cityId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedKron(prev => ({ ...prev, [cityId]: !prev[cityId] }));
  };
  const toggleVpn  = (cityId: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedVpn(prev => ({ ...prev, [cityId]: !prev[cityId] }));
  };
  const toggleDevice = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedDevices(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleApois = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedApois(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleAus = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedAus(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleEus = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedEus(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleSaus = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedSaus(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleSrius = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedSrius(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleAgstEd = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedAgstEd(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleAgstEu = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedAgstEu(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleAgstSd = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setExpandedAgstSd(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ── Filter logic ──────────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return { companies, unassignedStates };
    const q = searchTerm.toLowerCase();

    const filterStates = (statesList: StateNode[]) =>
      statesList.map(state => {
        const filteredCities = state.cities.map(city => {
          const devices = city.devices?.filter(d =>
            d.name.toLowerCase().includes(q) || d.serial?.toLowerCase().includes(q)
          ) || [];
          const kronDevices = city.kronDevices?.filter(k =>
            k.name.toLowerCase().includes(q) || k.serial.toLowerCase().includes(q)
          ) || [];
          return {
            ...city, devices, kronDevices,
            hasMatch: devices.length > 0 || kronDevices.length > 0 || city.name.toLowerCase().includes(q)
          };
        }).filter(c => c.hasMatch);
        return {
          ...state, cities: filteredCities,
          hasMatch: filteredCities.length > 0 || state.name.toLowerCase().includes(q)
        };
      }).filter(s => s.hasMatch);

    const filteredCompanies = companies.map(company => {
      const matchedStates = filterStates(company.states);
      return {
        ...company, states: matchedStates,
        hasMatch: matchedStates.length > 0 || company.name.toLowerCase().includes(q)
      };
    }).filter(c => c.hasMatch);

    return { companies: filteredCompanies, unassignedStates: filterStates(unassignedStates) };
  }, [companies, unassignedStates, searchTerm]);

  // Auto-expand all when searching
  useEffect(() => {
    if (!searchTerm.trim()) return;
    const eComp: Record<string,boolean> = {};
    const eSite: Record<string,boolean> = {};
    const eSt:   Record<string,boolean> = {};
    const eCi:   Record<string,boolean> = {};
    const eDas:  Record<string,boolean> = {};
    const eFcc:  Record<string,boolean> = {};
    const eAgst: Record<string,boolean> = {};
    const eKron: Record<string,boolean> = {};

    const expandStates = (statesList: any[]) => {
      statesList.forEach(state => {
        eSt[state.id] = true;
        state.cities.forEach((city: any) => {
          const dasDevices = city.devices?.filter((d: any) => !d.name.startsWith("[FCC]") && !d.name.startsWith("[AGST]")) || [];
          const fccDevices = city.devices?.filter((d: any) => d.name.startsWith("[FCC]")) || [];
          const agstDevices = city.devices?.filter((d: any) => d.name.startsWith("[AGST]")) || [];
          const hasDas  = dasDevices.length > 0;
          const hasFcc  = fccDevices.length > 0;
          const hasAgst = agstDevices.length > 0;
          const hasKron = city.kronDevices?.length > 0;
          if (hasDas || hasFcc || hasAgst || hasKron) {
            eCi[city.id]   = true;
            if (hasDas)  eDas[city.id]  = true;
            if (hasFcc)  eFcc[city.id]  = true;
            if (hasAgst) eAgst[city.id] = true;
            if (hasKron) eKron[city.id] = true;
          }
        });
      });
    };

    filteredData.companies.forEach(c => {
      eComp[c.id] = true; eSite[c.id] = true;
      expandStates(c.states);
    });
    if (filteredData.unassignedStates.length > 0) {
      eComp["unassigned"] = true; eSite["unassigned"] = true;
      expandStates(filteredData.unassignedStates);
    }
    setExpandedCompanies(eComp); setExpandedSites(eSite);
    setExpandedStates(eSt); setExpandedCities(eCi);
    setExpandedDas(eDas); setExpandedFcc(eFcc); setExpandedAgst(eAgst); setExpandedKron(eKron);
  }, [searchTerm, filteredData]);

  function deviceColors(device: DeviceNav) {
    const update = deviceUpdates[device.id];
    const active = update?.active !== undefined ? update.active : device.active;
    const status = update?.status !== undefined ? update.status : device.status;
    const hasAlarm = update?.hasAlarm !== undefined ? update.hasAlarm : device.hasAlarm;

    if (active === false) {
      return { 
        status: 'text-slate-600 line-through opacity-45', 
        icon: 'opacity-25', 
        hover: 'hover:text-slate-500 hover:opacity-60', 
        dot: 'bg-red-500/50' 
      };
    }
    const s = status || 'ONLINE';
    if (s === 'OFFLINE') {
      return { 
        status: 'text-red-500 font-semibold', 
        icon: 'text-red-500 animate-pulse', 
        hover: 'hover:text-red-400', 
        dot: 'bg-red-500 animate-ping' 
      };
    }
    if (!device.lastSnmpData) {
      return { 
        status: 'text-cyan-400', 
        icon: 'text-cyan-500 animate-pulse', 
        hover: 'hover:text-cyan-300', 
        dot: 'bg-cyan-500 animate-pulse' 
      };
    }
    if (s === 'ALERTA')  return { status: 'text-amber-400', icon: 'text-amber-500 animate-pulse', hover: 'hover:text-amber-300', dot: 'bg-amber-500 animate-ping' };
    if (hasAlarm) return { status: 'text-red-400',   icon: 'text-red-500 animate-pulse',   hover: 'hover:text-red-300',   dot: 'bg-red-500 animate-pulse' };
    return { status: 'text-green-400', icon: 'text-green-500', hover: 'hover:text-green-300', dot: 'bg-green-500' };
  }

  // ── Render states tree ────────────────────────────────────────
  const renderStatesTree = (statesList: StateNode[]) => (
    <div className="ml-2.5 space-y-1 border-l border-slate-800 pl-2">
      {statesList.map(state => (
        <div key={state.id} className="space-y-1">
          <button
            onClick={() => toggleState(state.id)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 transition-all text-sm min-w-0"
            title={state.name}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 text-[10px] font-bold text-slate-600 shrink-0">{state.uf}</span>
              <span className="truncate">{state.name}</span>
            </div>
            {state.cities.length > 0 && (
              expandedStates[state.id] ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            )}
          </button>

          {/* Sites */}
          {expandedStates[state.id] && state.cities.length > 0 && (
            <div className="ml-3.5 space-y-1 border-l border-slate-800/50 pl-2">
              {state.cities.map(city => {
                const isCityActive  = pathname === `/sites/${city.id}`;
                const isCityExpanded = expandedCities[city.id];
                const dasDevices = city.devices?.filter(d => !d.name.startsWith("[FCC]") && !d.name.startsWith("[AGST]")) || [];
                const fccDevices = city.devices?.filter(d => d.name.startsWith("[FCC]")) || [];
                const agstDevices = city.devices?.filter(d => d.name.startsWith("[AGST]")) || [];
                const hasDas  = dasDevices.length > 0;
                const hasFcc  = fccDevices.length > 0;
                const hasAgst = agstDevices.length > 0;
                const hasKron = city.kronDevices?.length > 0;
                const hasVpn  = city.devices?.some(d => d.vpnUsername) || false;
                const hasChildren = hasDas || hasFcc || hasAgst || hasKron || hasVpn;

                return (
                  <div key={city.id} className="space-y-0.5">
                    {/* Linha do site */}
                    <div className={`flex items-center justify-between rounded-md transition-all ${isCityActive ? 'bg-zabbix-primary/5' : 'hover:bg-slate-800/30'} min-w-0`}>
                      <button
                        onClick={() => router.push(`/sites/${city.id}`)}
                        className={`flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-xs text-left ${isCityActive ? 'text-zabbix-primary font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                        title={city.name}
                      >
                        <MapPin className="w-3 h-3 opacity-50 shrink-0" />
                        <span className="truncate">{city.name}</span>
                      </button>
                      {hasChildren && (
                        <button onClick={(e) => toggleCity(city.id, e)} className="px-2 py-1.5 text-slate-500 hover:text-white shrink-0">
                          {isCityExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>

                    {/* Subpastas DAS + Medidores + VPN */}
                    {isCityExpanded && hasChildren && (
                      <div className="ml-3 space-y-0.5 border-l border-slate-800/30 pl-2 mt-0.5 mb-1">

                        {/* ── Subpasta DAS ── */}
                        {hasDas && (
                          <div>
                            <button
                              onClick={(e) => toggleDas(city.id, e)}
                              className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800/20 transition-all text-[11px] font-semibold uppercase tracking-wider"
                            >
                              <div className="flex items-center gap-1.5">
                                <Server className="w-3 h-3 text-zabbix-primary/70" />
                                <span>DAS</span>
                                <span className="text-[9px] text-slate-600 font-normal normal-case tracking-normal">({dasDevices.length})</span>
                              </div>
                              {expandedDas[city.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                            </button>

                            {expandedDas[city.id] && (
                              <div className="ml-3 space-y-0.5 border-l border-slate-800/20 pl-2 mt-0.5">
                                {dasDevices.map(device => {
                                  const c = deviceColors(device);
                                  const isActive = pathname === `/devices/${device.id}` && !searchParams.get("vpn");
                                  const isDeviceExpanded = expandedDevices[device.id];
                                  const hardware = getDeviceHardwareList(device);
                                  const canExpand = hardware !== null;

                                  return (
                                    <div key={device.id} className="space-y-0.5">
                                      <div 
                                        onContextMenu={(e) => handleContextMenu(e, device.id, device.name, false, device.ip)}
                                        className={`flex items-center justify-between rounded-md transition-all ${
                                          isActive ? 'bg-slate-800/80 border-l-2 border-zabbix-primary text-white font-bold' : `${c.status} ${c.hover} hover:bg-slate-800/30`
                                        } ${device.active === false ? 'opacity-45 line-through' : ''} min-w-0`}
                                      >
                                        <Link
                                          href={`/devices/${device.id}`}
                                          className="flex-1 min-w-0 flex items-center gap-2 px-2 py-1.5 text-[11px]"
                                          title={`SN: ${device.serial || 'N/A'}${device.active === false ? ' (Inativo)' : ''}`}
                                        >
                                          <div className="relative shrink-0">
                                            <Server className={`w-3 h-3 ${c.icon}`} />
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${c.dot}`} />
                                          </div>
                                          <span className="truncate">{device.name}</span>
                                        </Link>
                                        {canExpand && (
                                          <button 
                                            onClick={(e) => toggleDevice(device.id, e)} 
                                            className="px-2 py-1.5 text-slate-500 hover:text-white shrink-0"
                                          >
                                            {isDeviceExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                          </button>
                                        )}
                                      </div>

                                      {/* Sub-hardwares de expansão */}
                                      {isDeviceExpanded && canExpand && hardware && (
                                        <div className="ml-3.5 space-y-0.5 border-l border-slate-800/40 pl-2.5 mt-0.5 mb-1 animate-in fade-in duration-200">
                                          
                                          {/* A-POIs */}
                                          {hardware.apois && hardware.apois.length > 0 && (() => {
                                            const update = deviceUpdates[device.id];
                                            const deviceTraps = update?.traps !== undefined ? update.traps : (device.traps || []);
                                            const apoisTraps = hardware.apois.map((item, idx) => getComponentTrapSeverity(deviceTraps, 'apoi', idx + 1, item));
                                            const maxApoisSeverity = apoisTraps.some(s => s !== null) ? Math.max(...apoisTraps.filter(s => s !== null) as number[]) : null;
                                            const headerStyles = getSeverityStyles(maxApoisSeverity, false);
                                            
                                            return (
                                              <div className="space-y-0.5">
                                                <div className={`flex items-center justify-between rounded-md min-w-0 transition-all ${headerStyles.text}`}>
                                                  <button
                                                    onClick={(e) => toggleApois(device.id, e)}
                                                    className="flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-left"
                                                  >
                                                    <Server className={`w-2.5 h-2.5 ${headerStyles.icon}`} />
                                                    <span className="truncate">A-POIs</span>
                                                  </button>
                                                  <button onClick={(e) => toggleApois(device.id, e)} className="px-1.5 py-1 shrink-0 text-slate-600 hover:text-white">
                                                    {expandedApois[device.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                                  </button>
                                                </div>
                                                {expandedApois[device.id] && (
                                                  <div className="ml-3.5 space-y-0.5 border-l border-slate-800/20 pl-2">
                                                    {hardware.apois.map((item, idx) => {
                                                      const isSubActive = pathname === `/devices/${device.id}` && searchParams.get("hardware") === `apoi${idx + 1}`;
                                                      const severity = apoisTraps[idx];
                                                      const styles = getSeverityStyles(severity, isSubActive);
                                                      return (
                                                        <Link
                                                          key={idx}
                                                          href={`/devices/${device.id}?hardware=apoi${idx + 1}`}
                                                          className={`flex items-center gap-1.5 px-2 py-1 text-[10px] rounded-md transition-all ${styles.text}`}
                                                        >
                                                          <Server className={`w-2.5 h-2.5 ${styles.icon}`} />
                                                          <span className="truncate">{item}</span>
                                                        </Link>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })()}
 
                                          {/* AU */}
                                          {hardware.au && hardware.au.length > 0 && (() => {
                                            const update = deviceUpdates[device.id];
                                            const deviceTraps = update?.traps !== undefined ? update.traps : (device.traps || []);
                                            const auTraps = hardware.au.map((item, idx) => getComponentTrapSeverity(deviceTraps, 'au', idx + 1, item));
                                            const maxAuSeverity = auTraps.some(s => s !== null) ? Math.max(...auTraps.filter(s => s !== null) as number[]) : null;
                                            const headerStyles = getSeverityStyles(maxAuSeverity, false);
                                            
                                            return (
                                              <div className="space-y-0.5">
                                                <div className={`flex items-center justify-between rounded-md min-w-0 transition-all ${headerStyles.text}`}>
                                                  <button
                                                    onClick={(e) => toggleAus(device.id, e)}
                                                    className="flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-left"
                                                  >
                                                    <Server className={`w-2.5 h-2.5 ${headerStyles.icon}`} />
                                                    <span className="truncate">AU</span>
                                                  </button>
                                                  <button onClick={(e) => toggleAus(device.id, e)} className="px-1.5 py-1 shrink-0 text-slate-600 hover:text-white">
                                                    {expandedAus[device.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                                  </button>
                                                </div>
                                                {expandedAus[device.id] && (
                                                  <div className="ml-3.5 space-y-0.5 border-l border-slate-800/20 pl-2">
                                                    {hardware.au.map((item, idx) => {
                                                      let hwParam = "";
                                                      if (item.toLowerCase().includes("rf")) {
                                                        const match = item.match(/\d+/);
                                                        hwParam = match ? `au${match[0]}` : `au${idx + 1}`;
                                                      } else {
                                                        const match = item.match(/\d+/);
                                                        hwParam = match ? `ausfp${match[0]}` : `ausfp${idx + 1}`;
                                                      }
                                                      const isSubActive = pathname === `/devices/${device.id}` && searchParams.get("hardware") === hwParam;
                                                      const severity = auTraps[idx];
                                                      const styles = getSeverityStyles(severity, isSubActive);
                                                      return (
                                                        <Link
                                                          key={idx}
                                                          href={`/devices/${device.id}?hardware=${hwParam}`}
                                                          className={`flex items-center gap-1.5 px-2 py-1 text-[10px] rounded-md transition-all ${styles.text}`}
                                                        >
                                                          <Server className={`w-2.5 h-2.5 ${styles.icon}`} />
                                                          <span className="truncate">{item}</span>
                                                        </Link>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })()}
 
                                          {/* EUs */}
                                          {hardware.eus && hardware.eus.length > 0 && (() => {
                                            const update = deviceUpdates[device.id];
                                            const deviceTraps = update?.traps !== undefined ? update.traps : (device.traps || []);
                                            const eusTraps = hardware.eus.map((item, idx) => getComponentTrapSeverity(deviceTraps, 'eu', idx + 1, item));
                                            const maxEusSeverity = eusTraps.some(s => s !== null) ? Math.max(...eusTraps.filter(s => s !== null) as number[]) : null;
                                            const headerStyles = getSeverityStyles(maxEusSeverity, false);
                                            
                                            return (
                                              <div className="space-y-0.5">
                                                <div className={`flex items-center justify-between rounded-md min-w-0 transition-all ${headerStyles.text}`}>
                                                  <button
                                                    onClick={(e) => toggleEus(device.id, e)}
                                                    className="flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-left"
                                                  >
                                                    <Server className={`w-2.5 h-2.5 ${headerStyles.icon}`} />
                                                    <span className="truncate">EUs</span>
                                                  </button>
                                                  <button onClick={(e) => toggleEus(device.id, e)} className="px-1.5 py-1 shrink-0 text-slate-600 hover:text-white">
                                                    {expandedEus[device.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                                  </button>
                                                </div>
                                                {expandedEus[device.id] && (
                                                  <div className="ml-3.5 space-y-0.5 border-l border-slate-800/20 pl-2">
                                                    {hardware.eus.map((item, idx) => {
                                                      const isSubActive = pathname === `/devices/${device.id}` && searchParams.get("hardware") === `eu${idx + 1}`;
                                                      const severity = eusTraps[idx];
                                                      const styles = getSeverityStyles(severity, isSubActive);
                                                      return (
                                                        <Link
                                                          key={idx}
                                                          href={`/devices/${device.id}?hardware=eu${idx + 1}`}
                                                          className={`flex items-center gap-1.5 px-2 py-1 text-[10px] rounded-md transition-all ${styles.text}`}
                                                        >
                                                          <Server className={`w-2.5 h-2.5 ${styles.icon}`} />
                                                          <span className="truncate">{item}</span>
                                                        </Link>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })()}
 
                                          {/* SAUs */}
                                          {hardware.saus && hardware.saus.length > 0 && (() => {
                                            const update = deviceUpdates[device.id];
                                            const deviceTraps = update?.traps !== undefined ? update.traps : (device.traps || []);
                                            const sausTraps = hardware.saus.map((item, idx) => getComponentTrapSeverity(deviceTraps, 'sau', idx + 1, item));
                                            const maxSausSeverity = sausTraps.some(s => s !== null) ? Math.max(...sausTraps.filter(s => s !== null) as number[]) : null;
                                            const headerStyles = getSeverityStyles(maxSausSeverity, false);
                                            
                                            return (
                                              <div className="space-y-0.5">
                                                <div className={`flex items-center justify-between rounded-md min-w-0 transition-all ${headerStyles.text}`}>
                                                  <button
                                                    onClick={(e) => toggleSaus(device.id, e)}
                                                    className="flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-left"
                                                  >
                                                    <Server className={`w-2.5 h-2.5 ${headerStyles.icon}`} />
                                                    <span className="truncate">SAUs</span>
                                                  </button>
                                                  <button onClick={(e) => toggleSaus(device.id, e)} className="px-1.5 py-1 shrink-0 text-slate-600 hover:text-white">
                                                    {expandedSaus[device.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                                  </button>
                                                </div>
                                                {expandedSaus[device.id] && (
                                                  <div className="ml-3.5 space-y-0.5 border-l border-slate-800/20 pl-2">
                                                    {hardware.saus.map((item, idx) => {
                                                      const isSubActive = pathname === `/devices/${device.id}` && searchParams.get("hardware") === `sau${idx + 1}`;
                                                      const severity = sausTraps[idx];
                                                      const styles = getSeverityStyles(severity, isSubActive);
                                                      return (
                                                        <Link
                                                          key={idx}
                                                          href={`/devices/${device.id}?hardware=sau${idx + 1}`}
                                                          className={`flex items-center gap-1.5 px-2 py-1 text-[10px] rounded-md transition-all ${styles.text}`}
                                                        >
                                                          <Server className={`w-2.5 h-2.5 ${styles.icon}`} />
                                                          <span className="truncate">{item}</span>
                                                        </Link>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })()}
 
                                          {/* SRIUs */}
                                          {hardware.srius && hardware.srius.length > 0 && (() => {
                                            const update = deviceUpdates[device.id];
                                            const deviceTraps = update?.traps !== undefined ? update.traps : (device.traps || []);
                                            const sriusTraps = hardware.srius.map((item, idx) => getComponentTrapSeverity(deviceTraps, 'sriu', idx + 1, item));
                                            const maxSriusSeverity = sriusTraps.some(s => s !== null) ? Math.max(...sriusTraps.filter(s => s !== null) as number[]) : null;
                                            const headerStyles = getSeverityStyles(maxSriusSeverity, false);
                                            
                                            return (
                                              <div className="space-y-0.5">
                                                <div className={`flex items-center justify-between rounded-md min-w-0 transition-all ${headerStyles.text}`}>
                                                  <button
                                                    onClick={(e) => toggleSrius(device.id, e)}
                                                    className="flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-left"
                                                  >
                                                    <Server className={`w-2.5 h-2.5 ${headerStyles.icon}`} />
                                                    <span className="truncate">SRIUs</span>
                                                  </button>
                                                  <button onClick={(e) => toggleSrius(device.id, e)} className="px-1.5 py-1 shrink-0 text-slate-600 hover:text-white">
                                                    {expandedSrius[device.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                                  </button>
                                                </div>
                                                {expandedSrius[device.id] && (
                                                  <div className="ml-3.5 space-y-0.5 border-l border-slate-800/20 pl-2">
                                                    {hardware.srius.map((item, idx) => {
                                                      const isSubActive = pathname === `/devices/${device.id}` && searchParams.get("hardware") === `sriu${idx + 1}`;
                                                      const severity = sriusTraps[idx];
                                                      const styles = getSeverityStyles(severity, isSubActive);
                                                      return (
                                                        <Link
                                                          key={idx}
                                                          href={`/devices/${device.id}?hardware=sriu${idx + 1}`}
                                                          className={`flex items-center gap-1.5 px-2 py-1 text-[10px] rounded-md transition-all ${styles.text}`}
                                                        >
                                                          <Server className={`w-2.5 h-2.5 ${styles.icon}`} />
                                                          <span className="truncate">{item}</span>
                                                        </Link>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })()}
 
                                        </div>
                                      )}


                                        
                                      
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* ── Subpasta FCC (No-Breaks) ── */}
                        {hasFcc && (
                          <div>
                            <button
                              onClick={(e) => toggleFcc(city.id, e)}
                              className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-slate-500 hover:text-emerald-300 hover:bg-emerald-500/5 transition-all text-[11px] font-semibold uppercase tracking-wider"
                            >
                              <div className="flex items-center gap-1.5">
                                <BatteryCharging className="w-3 h-3 text-emerald-500/70" />
                                <span>FCC (No-Breaks)</span>
                                <span className="text-[9px] text-slate-600 font-normal normal-case tracking-normal">({fccDevices.length})</span>
                              </div>
                              {expandedFcc[city.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                            </button>

                            {expandedFcc[city.id] && (
                              <div className="ml-3 space-y-0.5 border-l border-slate-800/20 pl-2 mt-0.5 animate-in fade-in duration-200">
                                {fccDevices.map(device => {
                                  const c = deviceColors(device);
                                  const isActive = pathname === `/devices/${device.id}` && !searchParams.get("vpn");

                                  return (
                                    <div key={device.id} className="space-y-0.5">
                                      <div 
                                        onContextMenu={(e) => handleContextMenu(e, device.id, device.name, true, device.ip)}
                                        className={`flex items-center justify-between rounded-md transition-all ${
                                          isActive ? 'bg-slate-800/80 border-l-2 border-zabbix-primary text-white font-bold' : `${c.status} ${c.hover} hover:bg-slate-800/30`
                                        } ${device.active === false ? 'opacity-45 line-through' : ''} min-w-0`}
                                      >
                                        <Link
                                          href={`/devices/${device.id}`}
                                          className="flex-1 min-w-0 flex items-center gap-2 px-2 py-1.5 text-[11px]"
                                          title={`SN: ${device.serial || 'N/A'}${device.active === false ? ' (Inativo)' : ''}`}
                                        >
                                          <div className="relative shrink-0">
                                            <BatteryCharging className={`w-3 h-3 ${c.icon}`} />
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${c.dot}`} />
                                          </div>
                                          <span className="truncate">{device.name.replace("[FCC] ", "").replace("[FCC]", "")}</span>
                                        </Link>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* ── Subpasta AGST ── */}
                        {hasAgst && (
                          <div>
                            <button
                              onClick={(e) => toggleAgst(city.id, e)}
                              className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-slate-500 hover:text-red-350 hover:bg-red-500/5 transition-all text-[11px] font-semibold uppercase tracking-wider"
                            >
                              <div className="flex items-center gap-1.5">
                                <Cpu className="w-3 h-3 text-red-500/70" />
                                <span>AGST</span>
                                <span className="text-[9px] text-slate-600 font-normal normal-case tracking-normal">({agstDevices.length})</span>
                              </div>
                              {expandedAgst[city.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                            </button>

                            {expandedAgst[city.id] && (
                              <div className="ml-3 space-y-0.5 border-l border-slate-800/20 pl-2 mt-0.5 animate-in fade-in duration-200">
                                {agstDevices.map(device => {
                                  const c = deviceColors(device);
                                  const isActive = pathname === `/devices/${device.id}` && !searchParams.get("vpn");
                                  const isDeviceExpanded = expandedDevices[device.id];
                                  const hardware = getDeviceHardwareList(device);
                                  const canExpand = hardware !== null;

                                  return (
                                    <div key={device.id} className="space-y-0.5">
                                      <div 
                                        onContextMenu={(e) => handleContextMenu(e, device.id, device.name, false, device.ip)}
                                        className={`flex items-center justify-between rounded-md transition-all ${
                                          isActive ? 'bg-slate-800/80 border-l-2 border-zabbix-primary text-white font-bold' : `${c.status} ${c.hover} hover:bg-slate-800/30`
                                        } ${device.active === false ? 'opacity-45 line-through' : ''} min-w-0`}
                                      >
                                        <Link
                                          href={`/devices/${device.id}`}
                                          className="flex-1 min-w-0 flex items-center gap-2 px-2 py-1.5 text-[11px]"
                                          title={`SN: ${device.serial || 'N/A'}${device.active === false ? ' (Inativo)' : ''}`}
                                        >
                                          <div className="relative shrink-0">
                                            <Cpu className={`w-3 h-3 ${c.icon}`} />
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${c.dot}`} />
                                          </div>
                                          <span className="truncate">{device.name.replace("[AGST] ", "").replace("[AGST]", "")}</span>
                                        </Link>
                                        {canExpand && (
                                          <button 
                                            onClick={(e) => toggleDevice(device.id, e)} 
                                            className="px-2 py-1.5 text-slate-500 hover:text-white shrink-0"
                                          >
                                            {isDeviceExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                          </button>
                                        )}
                                      </div>

                                      {/* Sub-hardwares de expansão para AGST */}
                                      {isDeviceExpanded && canExpand && hardware && (
                                        <div className="ml-3.5 space-y-0.5 border-l border-slate-800/40 pl-2.5 mt-0.5 mb-1 animate-in fade-in duration-200">
                                          
                                          {/* EDs (Digital Inputs) */}
                                          {hardware.ed && hardware.ed.length > 0 && (() => {
                                            const update = deviceUpdates[device.id];
                                            const deviceTraps = update?.traps !== undefined ? update.traps : (device.traps || []);
                                            const edTraps = hardware.ed.map((item, idx) => getComponentTrapSeverity(deviceTraps, 'ed', idx + 1, item));
                                            const maxEdSeverity = edTraps.some(s => s !== null) ? Math.max(...edTraps.filter(s => s !== null) as number[]) : null;
                                            const headerStyles = getSeverityStyles(maxEdSeverity, false);
                                            
                                            return (
                                              <div className="space-y-0.5">
                                                <div className={`flex items-center justify-between rounded-md min-w-0 transition-all ${headerStyles.text}`}>
                                                  <button
                                                    onClick={(e) => toggleAgstEd(device.id, e)}
                                                    className="flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-left"
                                                  >
                                                    <Server className={`w-2.5 h-2.5 ${headerStyles.icon}`} />
                                                    <span className="truncate">Digital Inputs</span>
                                                  </button>
                                                  <button onClick={(e) => toggleAgstEd(device.id, e)} className="px-1.5 py-1 shrink-0 text-slate-600 hover:text-white">
                                                    {expandedAgstEd[device.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                                  </button>
                                                </div>
                                                {expandedAgstEd[device.id] && (
                                                  <div className="ml-3.5 space-y-0.5 border-l border-slate-800/20 pl-2">
                                                    {hardware.ed.map((item, idx) => {
                                                      const isSubActive = pathname === `/devices/${device.id}` && searchParams.get("hardware") === `ed${idx + 1}`;
                                                      const severity = edTraps[idx];
                                                      const styles = getSeverityStyles(severity, isSubActive);
                                                      return (
                                                        <Link
                                                          key={idx}
                                                          href={`/devices/${device.id}?hardware=ed${idx + 1}`}
                                                          className={`flex items-center gap-1.5 px-2 py-1 text-[10px] rounded-md transition-all ${styles.text}`}
                                                        >
                                                          <Server className={`w-2.5 h-2.5 ${styles.icon}`} />
                                                          <span className="truncate">{item}</span>
                                                        </Link>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })()}

                                          {/* EUs (Universal Inputs) */}
                                          {hardware.eu && hardware.eu.length > 0 && (() => {
                                            const update = deviceUpdates[device.id];
                                            const deviceTraps = update?.traps !== undefined ? update.traps : (device.traps || []);
                                            const euTraps = hardware.eu.map((item, idx) => getComponentTrapSeverity(deviceTraps, 'eu', idx + 1, item));
                                            const maxEuSeverity = euTraps.some(s => s !== null) ? Math.max(...euTraps.filter(s => s !== null) as number[]) : null;
                                            const headerStyles = getSeverityStyles(maxEuSeverity, false);
                                            
                                            return (
                                              <div className="space-y-0.5">
                                                <div className={`flex items-center justify-between rounded-md min-w-0 transition-all ${headerStyles.text}`}>
                                                  <button
                                                    onClick={(e) => toggleAgstEu(device.id, e)}
                                                    className="flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-left"
                                                  >
                                                    <Server className={`w-2.5 h-2.5 ${headerStyles.icon}`} />
                                                    <span className="truncate">Universal Inputs</span>
                                                  </button>
                                                  <button onClick={(e) => toggleAgstEu(device.id, e)} className="px-1.5 py-1 shrink-0 text-slate-600 hover:text-white">
                                                    {expandedAgstEu[device.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                                  </button>
                                                </div>
                                                {expandedAgstEu[device.id] && (
                                                  <div className="ml-3.5 space-y-0.5 border-l border-slate-800/20 pl-2">
                                                    {hardware.eu.map((item, idx) => {
                                                      const isSubActive = pathname === `/devices/${device.id}` && searchParams.get("hardware") === `eu${idx + 1}`;
                                                      const severity = euTraps[idx];
                                                      const styles = getSeverityStyles(severity, isSubActive);
                                                      return (
                                                        <Link
                                                          key={idx}
                                                          href={`/devices/${device.id}?hardware=eu${idx + 1}`}
                                                          className={`flex items-center gap-1.5 px-2 py-1 text-[10px] rounded-md transition-all ${styles.text}`}
                                                        >
                                                          <Server className={`w-2.5 h-2.5 ${styles.icon}`} />
                                                          <span className="truncate">{item}</span>
                                                        </Link>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })()}

                                          {/* SDs (Digital Outputs) */}
                                          {hardware.sd && hardware.sd.length > 0 && (() => {
                                            const update = deviceUpdates[device.id];
                                            const deviceTraps = update?.traps !== undefined ? update.traps : (device.traps || []);
                                            const sdTraps = hardware.sd.map((item, idx) => getComponentTrapSeverity(deviceTraps, 'sd', idx + 1, item));
                                            const maxSdSeverity = sdTraps.some(s => s !== null) ? Math.max(...sdTraps.filter(s => s !== null) as number[]) : null;
                                            const headerStyles = getSeverityStyles(maxSdSeverity, false);
                                            
                                            return (
                                              <div className="space-y-0.5">
                                                <div className={`flex items-center justify-between rounded-md min-w-0 transition-all ${headerStyles.text}`}>
                                                  <button
                                                    onClick={(e) => toggleAgstSd(device.id, e)}
                                                    className="flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-left"
                                                  >
                                                    <Server className={`w-2.5 h-2.5 ${headerStyles.icon}`} />
                                                    <span className="truncate">Digital Outputs</span>
                                                  </button>
                                                  <button onClick={(e) => toggleAgstSd(device.id, e)} className="px-1.5 py-1 shrink-0 text-slate-600 hover:text-white">
                                                    {expandedAgstSd[device.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                                                  </button>
                                                </div>
                                                {expandedAgstSd[device.id] && (
                                                  <div className="ml-3.5 space-y-0.5 border-l border-slate-800/20 pl-2">
                                                    {hardware.sd.map((item, idx) => {
                                                      const isSubActive = pathname === `/devices/${device.id}` && searchParams.get("hardware") === `sd${idx + 1}`;
                                                      const severity = sdTraps[idx];
                                                      const styles = getSeverityStyles(severity, isSubActive);
                                                      return (
                                                        <Link
                                                          key={idx}
                                                          href={`/devices/${device.id}?hardware=sd${idx + 1}`}
                                                          className={`flex items-center gap-1.5 px-2 py-1 text-[10px] rounded-md transition-all ${styles.text}`}
                                                        >
                                                          <Server className={`w-2.5 h-2.5 ${styles.icon}`} />
                                                          <span className="truncate">{item}</span>
                                                        </Link>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })()}

                                        </div>
                                      )}

                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* ── Subpasta Medidores ── */}
                        {hasKron && (
                          <div>
                            <button
                              onClick={(e) => toggleKron(city.id, e)}
                              className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-slate-500 hover:text-yellow-300 hover:bg-yellow-500/5 transition-all text-[11px] font-semibold uppercase tracking-wider"
                            >
                              <div className="flex items-center gap-1.5">
                                <Zap className="w-3 h-3 text-yellow-500/70" />
                                <span>Medidores</span>
                                <span className="text-[9px] text-slate-600 font-normal normal-case tracking-normal">({city.kronDevices.length})</span>
                              </div>
                              {expandedKron[city.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                            </button>

                            {expandedKron[city.id] && (
                              <div className="ml-3 space-y-0.5 border-l border-yellow-900/30 pl-2 mt-0.5">
                                {city.kronDevices.map(meter => {
                                  const isActive = pathname === `/kron/${meter.id}`;
                                  return (
                                    <Link
                                      key={meter.id}
                                      href={`/kron/${meter.id}`}
                                      className={`flex items-center gap-2 px-2 py-1.5 text-[11px] rounded-md transition-all ${
                                        isActive
                                          ? 'bg-yellow-500/10 border-l-2 border-yellow-400 text-yellow-300 font-bold'
                                          : 'text-yellow-600 hover:text-yellow-300 hover:bg-yellow-500/5'
                                      }`}
                                      title={`Serial: ${meter.serial}`}
                                    >
                                      <div className="relative shrink-0">
                                        <Zap className="w-3 h-3" />
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${meter.active ? 'bg-yellow-400' : 'bg-slate-600'}`} />
                                      </div>
                                      <span className="truncate">{meter.name}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* ── Subpasta VPN ── */}
                        {hasVpn && (
                          <div>
                            <button
                              onClick={(e) => toggleVpn(city.id, e)}
                              className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-slate-500 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all text-[11px] font-semibold uppercase tracking-wider"
                            >
                              <div className="flex items-center gap-1.5">
                                <Globe className="w-3 h-3 text-cyan-500/70" />
                                <span>VPN</span>
                                <span className="text-[9px] text-slate-600 font-normal normal-case tracking-normal">({city.devices.filter(d => d.vpnUsername).length})</span>
                              </div>
                              {expandedVpn[city.id] ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                            </button>

                            {expandedVpn[city.id] && (
                              <div className="ml-3 space-y-0.5 border-l border-cyan-900/30 pl-2 mt-0.5">
                                {city.devices
                                  .filter(device => device.vpnUsername)
                                  .map(device => {
                                    const isOnline = device.vpnStatus === "ONLINE";
                                    const isActive = pathname === `/devices/${device.id}` && searchParams.get("vpn") === "true";
                                    return (
                                      <Link
                                        key={device.id}
                                        href={`/devices/${device.id}?vpn=true`}
                                        className={`flex items-center justify-between px-2 py-1.5 text-[11px] rounded-md transition-all ${
                                          isActive
                                            ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-300 font-bold'
                                            : 'text-slate-500 hover:text-cyan-300 hover:bg-cyan-500/5'
                                        }`}
                                        title={`Usuário VPN: ${device.vpnUsername || 'N/A'}`}
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="relative shrink-0">
                                            <Globe className="w-3 h-3 text-cyan-400" />
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                          </div>
                                          <span className="truncate">{device.name}</span>
                                        </div>
                                        {isOnline && device.vpnIp && (
                                          <span className="text-[9px] font-mono text-emerald-500 font-bold ml-1 shrink-0">{device.vpnIp}</span>
                                        )}
                                      </Link>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ── Main render ───────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar equipamento ou medidor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zabbix-primary transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Companies */}
      <div className="space-y-2">
        {filteredData.companies.map(company => {
          const isCompExpanded = expandedCompanies[company.id];
          const isSitesOpen    = expandedSites[company.id];
          return (
            <div key={company.id} className="space-y-1">
              <button
                onClick={() => toggleCompany(company.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/40 hover:text-white transition-all font-semibold text-xs uppercase tracking-wider bg-slate-900/40 border border-slate-800/60 min-w-0"
                title={company.name}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building className={`w-4 h-4 text-zabbix-accent shrink-0 ${isCompExpanded ? 'opacity-100' : 'opacity-60'}`} />
                  <span className="truncate">{company.name}</span>
                </div>
                {isCompExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
              </button>

              {isCompExpanded && (
                <div className="ml-2 pl-2 border-l border-slate-800/80 space-y-1 pt-1 animate-in fade-in duration-200">
                  <button
                    onClick={() => toggleSites(company.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-400 hover:text-white transition-all text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className={`w-3.5 h-3.5 ${isSitesOpen ? 'text-zabbix-primary' : ''}`} />
                      <span>Sites (Estados)</span>
                    </div>
                    {isSitesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isSitesOpen && company.states.length > 0  && renderStatesTree(company.states)}
                  {isSitesOpen && company.states.length === 0 && (
                    <p className="text-[10px] text-slate-600 italic px-3 py-1">Nenhum site cadastrado.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Admin: Sem Empresa */}
        {isAdmin && filteredData.unassignedStates.length > 0 && (
          <div className="space-y-1">
            <button
              onClick={() => toggleCompany("unassigned")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/40 hover:text-white transition-all font-semibold text-xs uppercase tracking-wider bg-slate-900/10 border border-slate-800/30"
            >
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Sem Empresa</span>
              </div>
              {expandedCompanies["unassigned"] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {expandedCompanies["unassigned"] && (
              <div className="ml-2 pl-2 border-l border-slate-800/80 space-y-1 pt-1 animate-in slide-in-from-top-1 duration-200">
                <button
                  onClick={() => toggleSites("unassigned")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-400 hover:text-white transition-all text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Sites (Estados)</span>
                  </div>
                  {expandedSites["unassigned"] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                {expandedSites["unassigned"] && renderStatesTree(filteredData.unassignedStates)}
              </div>
            )}
          </div>
        )}
      </div>

      {contextMenu && (
        <div 
          className="fixed z-50 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl p-1.5 w-48 flex flex-col gap-1 text-[11px] text-slate-300 backdrop-blur-md shadow-black/80 animate-in fade-in duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800/60 pb-1 mb-1 truncate">
            {contextMenu.deviceName}
          </div>
          {contextMenu.ip && (
            <a
              href={`https://${contextMenu.ip}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setContextMenu(null)}
              className="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-800/60 hover:text-white rounded-lg transition-colors text-left font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              Acessar Web (HTTPS)
            </a>
          )}
          <button
            onClick={() => {
              const typeParam = contextMenu.isFcc ? "fcc" : "das";
              router.push(`/admin/devices?type=${typeParam}&edit=${contextMenu.deviceId}`);
              setContextMenu(null);
            }}
            className="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-800/60 hover:text-white rounded-lg transition-colors text-left font-semibold"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            Editar Equipamento
          </button>
          <button
            onClick={async () => {
              const targetId = contextMenu.deviceId;
              setContextMenu(null);
              router.push(`/devices/${targetId}`);
              try {
                await axios.get(`/api/admin/devices/${targetId}/snmp?force=true`);
                router.refresh();
              } catch (err) {
                console.error("Erro ao solicitar sincronismo manual:", err);
              }
            }}
            className="flex items-center gap-2 px-2.5 py-2 hover:bg-zabbix-primary/10 hover:text-zabbix-primary rounded-lg transition-colors text-left font-semibold text-zabbix-primary border border-transparent hover:border-zabbix-primary/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sincronizar Agora
          </button>
        </div>
      )}
    </div>
  );
}
