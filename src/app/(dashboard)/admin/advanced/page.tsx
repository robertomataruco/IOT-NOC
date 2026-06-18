import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdvancedClient from "./AdvancedClient";

export default async function AdvancedPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  });

  // Acesso estritamente restrito ao usuário roberto.mataruco
  if (dbUser?.username !== 'roberto.mataruco') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
        <div className="glass-panel rounded-2xl p-12 text-center max-w-md border border-red-500/20 bg-red-500/5">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
          <p className="text-slate-400 text-sm">Esta área é de acesso exclusivo ao administrador master do sistema.</p>
          <a href="/" className="mt-6 inline-block px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all text-sm font-medium">
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Buscar dados para o painel avançado
  const allDevices = await prisma.device.findMany({
    include: {
      city: { include: { state: true } },
      company: true
    },
    orderBy: { name: 'asc' }
  });

  const totalDevices = allDevices.length;
  const onlineDevices = allDevices.filter((d: any) => d.active !== false && d.status === 'ONLINE').length;
  const alertDevices = allDevices.filter((d: any) => d.active !== false && d.status === 'ALERTA').length;
  const offlineDevices = allDevices.filter((d: any) => d.active !== false && d.status === 'OFFLINE').length;

  const allCompanies = await prisma.company.findMany({ orderBy: { name: 'asc' } });
  const allUsers = await prisma.user.findMany({ orderBy: { name: 'asc' }, include: { companyRef: true } });

  const statsData = {
    totalDevices,
    onlineDevices,
    alertDevices,
    offlineDevices,
    totalCompanies: allCompanies.length,
    totalUsers: allUsers.length,
  };

  return (
    <AdvancedClient
      devices={allDevices.map((d: any) => ({
        id: d.id,
        name: d.name,
        ip: d.ip,
        status: d.status || 'ONLINE',
        syncError: d.syncError,
        lastSnmpSync: d.lastSnmpSync?.toISOString() || null,
        lastSeen: d.lastSeen?.toISOString() || null,
        hasAlarm: d.hasAlarm,
        company: d.company?.name || null,
        city: d.city?.name || null,
        state: d.city?.state?.uf || null,
        active: d.active !== false
      }))}
      stats={statsData}
    />
  );
}
