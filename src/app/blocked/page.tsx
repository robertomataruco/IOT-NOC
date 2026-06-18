"use client";

import { signOut } from "next-auth/react";
import { LogOut, ShieldAlert, CreditCard, Building2, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BlockedPage() {
  const [companyName, setCompanyName] = useState<string>("sua empresa");

  useEffect(() => {
    // Tentar buscar informações da empresa atual de forma segura
    axios.get("/api/admin/devices")
      .then(res => {
        if (res.data.success && res.data.data.length > 0) {
          const firstDevice = res.data.data[0];
          if (firstDevice.company?.name) {
            setCompanyName(firstDevice.company.name);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background gradients for ultra premium feel */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-zabbix-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-red-500/20 shadow-2xl relative z-10 text-center space-y-6 backdrop-blur-2xl bg-slate-900/40">
        <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-500 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Acesso Suspenso
          </h1>
          <p className="text-slate-400 text-sm">
            Detectamos uma pendência no cadastro ou no faturamento da entidade <strong className="text-white">{companyName}</strong>.
          </p>
        </div>

        {/* Detalhes do bloqueio */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Building2 className="w-4 h-4 text-red-400 shrink-0" />
            <span>Entidade: <strong className="text-white">{companyName}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <CreditCard className="w-4 h-4 text-red-400 shrink-0" />
            <span>Motivo: <strong className="text-white">Atraso na mensalidade (+15 dias)</strong></span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Phone className="w-4 h-4 text-green-400 shrink-0" />
            <span>Contato Suporte: <strong className="text-white">Ricas Tecnologia</strong></span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Para reestabelecer o acesso, por favor entre em contato com o administrador financeiro ou o suporte técnico para registrar o pagamento.
        </p>

        <div className="pt-4 flex flex-col gap-2">
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all text-sm border border-slate-700"
          >
            Verificar Novamente
          </button>
          
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/login";
            }}
            className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-400 font-bold py-3 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
