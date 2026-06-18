"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function DashboardHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMainPage = pathname === "/";

  // Determinar o título com base na rota
  let title = "Visão Geral";
  if (pathname?.includes("/sites/")) title = "Detalhes do Site";
  if (pathname === "/admin/sites") title = "Gerenciamento de Sites";
  if (pathname === "/admin/devices") {
    const type = searchParams.get("type");
    title = type === "fcc" ? "Gestão de No-Breaks FCC" : "Gestão de Dispositivos DAS";
  }
  if (pathname === "/admin/users") title = "Controle de Usuários";
  if (pathname === "/admin/info") title = "Painel de Informações";
  if (pathname === "/admin/companies") title = "Gestão de Empresas";
  if (pathname === "/admin/advanced") title = "Painel Avançado";
  if (pathname === "/admin/survey") title = "Site Survey";

  return (
    <div className="flex items-center gap-3">
      {!isMainPage && (
        <Link
          href="/"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs font-medium group shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Voltar
        </Link>
      )}
      <h1 className="text-sm md:text-base font-bold text-white uppercase tracking-wider truncate max-w-[180px] sm:max-w-none">
        {title}
      </h1>
    </div>
  );
}
