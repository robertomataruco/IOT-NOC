"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  LayoutDashboard, FileText, AlertTriangle, 
  Building, Settings, Users, Wifi, Zap, Info, 
  ShieldAlert, Compass, ChevronDown, Server, Map as MapIcon, Battery, Cpu
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface TopNavProps {
  isAdmin: boolean;
  isTech: boolean;
  canAccessInfo: boolean;
  username: string;
}

export function TopNav({ isAdmin, isTech, canAccessInfo, username }: TopNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const equipRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (equipRef.current && !equipRef.current.contains(event.target as Node)) &&
        (adminRef.current && !adminRef.current.contains(event.target as Node)) &&
        (toolsRef.current && !toolsRef.current.contains(event.target as Node))
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isLinkActive = (href: string) => pathname === href;

  return (
    <div className="hidden md:flex items-center gap-1.5 lg:gap-2 ml-4">
      {/* Dashboard Geral */}
      {!isTech && (
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold ${
            isLinkActive("/")
              ? "bg-zabbix-primary/20 text-zabbix-primary border-zabbix-primary/30"
              : "border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      )}

      {/* Dropdown: Ferramentas */}
      <div className="relative" ref={toolsRef}>
        <button
          onClick={() => toggleDropdown("ferramentas")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold ${
            activeDropdown === "ferramentas" || pathname.startsWith("/mapa")
              ? "bg-slate-800/80 text-white border-slate-700"
              : "border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-white"
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Ferramentas</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "ferramentas" ? "rotate-180" : ""}`} />
        </button>

        {activeDropdown === "ferramentas" && (
          <div className="absolute left-0 mt-1.5 w-52 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-slate-850 p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {!isTech && (
              <>
                <a
                  href="/tv"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all font-semibold"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>NOC TV</span>
                </a>
                <a
                  href="/mapa"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setActiveDropdown(null)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                    isLinkActive("/mapa")
                      ? "bg-emerald-500/20 text-emerald-400 font-medium"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white font-semibold"
                  }`}
                >
                  <MapIcon className="w-4 h-4 text-emerald-400" />
                  <span>Mapa de Sites</span>
                </a>
              </>
            )}

            <a
              href="/os"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setActiveDropdown(null)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all font-semibold"
            >
              <FileText className="w-4 h-4 text-zabbix-primary" />
              <span>O.S. (Ordens de Serviço)</span>
            </a>

            {username === "roberto.mataruco" && (
              <a
                href="/admin/survey"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all font-semibold border-t border-slate-900 mt-1 pt-1.5"
              >
                <Compass className="w-4 h-4 text-cyan-400 animate-spin [animation-duration:12s]" />
                <span>Site Survey</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Dropdown: Equipamentos */}
      {isAdmin && (
        <div className="relative" ref={equipRef}>
          <button
            onClick={() => toggleDropdown("equipamentos")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold ${
              activeDropdown === "equipamentos" || pathname.startsWith("/admin/devices") || pathname.startsWith("/admin/kron")
                ? "bg-slate-800/80 text-white border-slate-700"
                : "border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-white"
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Equipamentos</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "equipamentos" ? "rotate-180" : ""}`} />
          </button>

          {activeDropdown === "equipamentos" && (
            <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-slate-850 p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <Link
                href="/admin/devices?type=das"
                onClick={() => setActiveDropdown(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                  pathname === "/admin/devices" && (!searchParams.get("type") || searchParams.get("type") === "das")
                    ? "bg-zabbix-primary/20 text-zabbix-primary font-medium"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Wifi className="w-4 h-4" />
                <span>DAS (SNMP)</span>
              </Link>
               <Link
                href="/admin/devices?type=fcc"
                onClick={() => setActiveDropdown(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                  pathname === "/admin/devices" && searchParams.get("type") === "fcc"
                    ? "bg-cyan-500/20 text-cyan-400 font-medium"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Battery className="w-4 h-4 text-cyan-400/80" />
                <span>No-Breaks FCC</span>
              </Link>
              <Link
                href="/admin/devices?type=agst"
                onClick={() => setActiveDropdown(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                  pathname === "/admin/devices" && searchParams.get("type") === "agst"
                    ? "bg-red-500/20 text-red-400 font-medium"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Cpu className="w-4 h-4 text-red-500/80" />
                <span>Controladores AGST</span>
              </Link>
              <Link
                href="/admin/kron"
                onClick={() => setActiveDropdown(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                  isLinkActive("/admin/kron")
                    ? "bg-yellow-500/20 text-yellow-400 font-medium"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Medidores KRON</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Dropdown: Administração */}
      {isAdmin && (
        <div className="relative" ref={adminRef}>
          <button
            onClick={() => toggleDropdown("admin")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold ${
              activeDropdown === "admin" || pathname.startsWith("/admin/companies") || pathname.startsWith("/admin/sites") || pathname.startsWith("/admin/users") || pathname.startsWith("/admin/info")
                ? "bg-slate-800/80 text-white border-slate-700"
                : "border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Administração</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "admin" ? "rotate-180" : ""}`} />
          </button>

          {activeDropdown === "admin" && (
            <div className="absolute right-0 lg:left-0 mt-1.5 w-52 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-slate-850 p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <Link
                href="/admin/companies"
                onClick={() => setActiveDropdown(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                  isLinkActive("/admin/companies")
                    ? "bg-zabbix-primary/20 text-zabbix-primary font-medium"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Gestão de Empresas</span>
              </Link>
              <Link
                href="/admin/sites"
                onClick={() => setActiveDropdown(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                  isLinkActive("/admin/sites")
                    ? "bg-zabbix-primary/20 text-zabbix-primary font-medium"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Gerenciamento de Sites</span>
              </Link>
              <Link
                href="/admin/users"
                onClick={() => setActiveDropdown(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                  isLinkActive("/admin/users")
                    ? "bg-zabbix-primary/20 text-zabbix-primary font-medium"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Gestão de Usuários</span>
              </Link>
              {canAccessInfo && (
                <Link
                  href="/admin/info"
                  onClick={() => setActiveDropdown(null)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border-t border-slate-900 mt-1 pt-1.5 ${
                    isLinkActive("/admin/info")
                      ? "bg-zabbix-accent/25 text-zabbix-accent font-medium"
                      : "text-zabbix-accent/90 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>Informações</span>
                </Link>
              )}
              {username === "roberto.mataruco" && (
                <a
                  href="/admin/documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border-t border-slate-900 mt-1 pt-1.5 text-emerald-400 hover:bg-slate-800/50 hover:text-white font-semibold"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Manual do Portal (PDF)</span>
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Avançado (Roberto Mataruco) */}
      {username === "roberto.mataruco" && (
        <Link
          href="/admin/advanced"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${
            isLinkActive("/admin/advanced")
              ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
              : "border-violet-500/20 bg-violet-500/5 text-violet-300 hover:bg-violet-500/20 hover:text-violet-100"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-violet-400 animate-pulse" />
          <span>Avançado</span>
        </Link>
      )}


    </div>
  );
}
