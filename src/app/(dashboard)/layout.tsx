import { Activity, LayoutDashboard, Settings, AlertTriangle, Globe, Users, Wifi, Info, Building, ShieldAlert, Zap, Server, Compass, Map, FileText, Battery, Cpu } from 'lucide-react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { LogoutButton } from "@/components/LogoutButton"
import { NavSites } from "@/components/NavSites"
import { DashboardHeader } from "@/components/DashboardHeader"
import { ResponsiveLayout } from "@/components/ResponsiveLayout"
import { TopNav } from "@/components/TopNav"


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Buscar usuário completo para checar permissões
  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { companyRef: true }
  });

  if (dbUser) {
    // Atualiza silenciosamente a última atividade do usuário no banco
    prisma.user.update({
      where: { id: dbUser.id },
      data: { lastActive: new Date() }
    }).catch(err => console.error("Erro ao atualizar lastActive:", err));
  }

  if (dbUser?.mustChangePassword) {
    redirect("/change-password");
  }

  const isAdmin = dbUser?.role === 'ADMIN';
  const isTech = dbUser?.role === 'TECHNICIAN';

  // Verificação de Bloqueio Financeiro / Administrativo
  let isBlocked = false;
  if (dbUser?.companyRef && !isAdmin) {
    const company = dbUser.companyRef;
    if (company.status === "BLOQUEADO") {
      isBlocked = true;
    } else if (company.paymentStatus !== "PAGO" && company.dueDate) {
      const today = new Date();
      const fifteenDaysAfter = new Date(new Date(company.dueDate).getTime() + 15 * 24 * 60 * 60 * 1000);
      if (today > fifteenDaysAfter) {
        isBlocked = true;
      }
    }
  }

  if (isBlocked) {
    redirect("/blocked");
  }

  // Buscar empresas, dispositivos DAS e medidores KRON para navegação
  const companies = await prisma.company.findMany({
    where: isAdmin ? {} : { id: dbUser?.companyId || 'non-existent' },
    include: {
      devices: {
        include: { 
          city: { include: { state: true } },
          traps: {
            where: { isCleared: false }
          }
        },
        orderBy: { name: 'asc' }
      },
      kronDevices: {
        where: { active: true },
        include: { city: { include: { state: true } } },
        orderBy: { name: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Buscar dispositivos sem empresa para ADMIN
  let unassignedDevices: any[]     = [];
  let unassignedKronDevices: any[] = [];
  if (isAdmin) {
    unassignedDevices = await prisma.device.findMany({
      where: { companyId: null },
      include: { 
        city: { include: { state: true } },
        traps: {
          where: { isCleared: false }
        }
      },
      orderBy: { name: 'asc' }
    });
    unassignedKronDevices = await prisma.kronDevice.findMany({
      where: { companyId: null, active: true },
      include: { city: { include: { state: true } } },
      orderBy: { name: 'asc' }
    });
  }

  // Helper: agrupa DAS + KRON por Estado → Cidade
  function groupByStateAndCity(devices: any[], kronDevices: any[]) {
    const stateMap: Record<string, any> = {};

    const ensureCity = (state: any, city: any) => {
      if (!stateMap[state.id]) {
        stateMap[state.id] = { id: state.id, name: state.name, uf: state.uf, citiesMap: {} };
      }
      if (!stateMap[state.id].citiesMap[city.id]) {
        stateMap[state.id].citiesMap[city.id] = { id: city.id, name: city.name, devices: [], kronDevices: [] };
      }
    };

    for (const device of devices) {
      if (!device.city?.state) continue;
      ensureCity(device.city.state, device.city);
      stateMap[device.city.state.id].citiesMap[device.city.id].devices.push({
        id: device.id, name: device.name, serial: device.serial,
        hasAlarm: device.hasAlarm, status: device.status || 'ONLINE', syncError: device.syncError || null,
        active: device.active,
        ip: device.ip,
        vpnUsername: device.vpnUsername || null,
        vpnStatus: device.vpnStatus || null,
        vpnIp: device.vpnIp || null,
        lastSnmpData: device.lastSnmpData || null,
        traps: device.traps || []
      });
    }

    for (const meter of kronDevices) {
      if (!meter.city?.state) continue;
      ensureCity(meter.city.state, meter.city);
      stateMap[meter.city.state.id].citiesMap[meter.city.id].kronDevices.push({
        id: meter.id, name: meter.name, serial: meter.serial, active: meter.active
      });
    }

    return Object.values(stateMap).map((state: any) => ({
      id: state.id, name: state.name, uf: state.uf,
      cities: Object.values(state.citiesMap)
        .map((city: any) => ({ id: city.id, name: city.name, devices: city.devices, kronDevices: city.kronDevices }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
    })).sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  const companiesWithStates = companies.map(c => ({
    id: c.id,
    name: c.name,
    states: groupByStateAndCity(c.devices, c.kronDevices)
  }));

  const unassignedStates = groupByStateAndCity(unassignedDevices, unassignedKronDevices);

  return (
    <ResponsiveLayout
      sidebar={
        <div className="flex flex-col h-full overflow-hidden">
          <div className="h-32 flex flex-col items-center justify-center shrink-0 w-full bg-slate-950/20 border-b border-slate-800/80 px-2 py-1">
            <a href="/" className="flex items-center justify-center w-full px-1">
              <img 
                src="/logo-ricas-new.png?v=8" 
                alt="Aicon Ricas NOC Brasil"
                style={{ 
                  height: '108px',
                  maxHeight: '108px',
                  imageRendering: '-webkit-optimize-contrast'
                }}
                className="w-full object-contain transition-transform duration-200 hover:scale-[1.02] filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
              />
            </a>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {/* O desktop só exibe os sites na barra lateral vertical */}
            <NavSites companies={companiesWithStates} unassignedStates={unassignedStates} isAdmin={isAdmin} />

            {/* Menus adicionais são movidos para o mobile-only na barra lateral vertical */}
            <div className="md:hidden space-y-2 border-t border-slate-800/80 pt-4 mt-2">
              {!isTech && (
                <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zabbix-primary/10 text-zabbix-primary border border-zabbix-primary/20 transition-all text-sm font-medium">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard Geral</span>
                </a>
              )}

              <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ferramentas</div>

              {!isTech && (
                <>
                  <a href="/tv" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm font-medium group">
                    <AlertTriangle className="w-5 h-5 text-red-400 group-hover:animate-pulse" />
                    <span>NOC TV</span>
                  </a>

                  <a href="/mapa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm font-medium">
                    <Map className="w-5 h-5 text-emerald-450" />
                    <span>Mapa de Sites</span>
                  </a>
                </>
              )}

              <a href="/os" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm font-medium group">
                <FileText className="w-5 h-5 text-zabbix-primary group-hover:animate-pulse" />
                <span>Ordens de Serviço</span>
              </a>

              {dbUser?.username === 'roberto.mataruco' && (
                <a href="/admin/survey" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm group">
                  <Compass className="w-5 h-5 text-cyan-400 animate-spin [animation-duration:12s]" />
                  <span>Site Survey</span>
                </a>
              )}

              {isAdmin && (
                <>
                  <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Administração</div>
                  <a href="/admin/companies" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm">
                    <Building className="w-4 h-4" />
                    <span>Gestão de Empresas</span>
                  </a>
                  <a href="/admin/sites" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm">
                    <Settings className="w-4 h-4" />
                    <span>Gerenciamento de Sites</span>
                  </a>
                  <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Server className="w-3.5 h-3.5" /> Gestão de Equipamentos
                  </div>
                  <div className="space-y-1 pl-2">
                    <a href="/admin/devices?type=das" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm border-l-2 border-transparent hover:border-zabbix-primary">
                      <Wifi className="w-4 h-4" />
                      <span>DAS (SNMP)</span>
                    </a>
                    <a href="/admin/devices?type=fcc" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm border-l-2 border-transparent hover:border-cyan-500">
                      <Battery className="w-4 h-4 text-cyan-400/70" />
                      <span>No-Breaks FCC</span>
                    </a>
                    <a href="/admin/devices?type=agst" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm border-l-2 border-transparent hover:border-red-500">
                      <Cpu className="w-4 h-4 text-red-500/70" />
                      <span>Controladores AGST</span>
                    </a>
                    <a href="/admin/kron" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm border-l-2 border-transparent hover:border-yellow-500">
                      <Zap className="w-4 h-4 text-yellow-500/70" />
                      <span>Medidores KRON</span>
                    </a>
                  </div>
                  <a href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm">
                    <Users className="w-4 h-4" />
                    <span>Gestão de Usuários</span>
                  </a>
                  {dbUser?.canAccessInfo && (
                    <a href="/admin/info" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm">
                      <Info className="w-4 h-4 text-zabbix-accent" />
                      <span className="font-medium text-white">Informação</span>
                    </a>
                  )}
                  {dbUser?.username === 'roberto.mataruco' && (
                    <>
                      <a href="/admin/advanced" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-300 border border-violet-500/20 hover:from-violet-500/20 hover:to-fuchsia-500/20 hover:text-violet-100 transition-all text-sm mb-1">
                        <ShieldAlert className="w-4 h-4 text-violet-400 animate-pulse" />
                        <span className="font-bold">Avançado</span>
                      </a>

                      <a href="/admin/documentation" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-300 border border-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20 hover:text-emerald-100 transition-all text-sm mt-1">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold">Manual do Portal (PDF)</span>
                      </a>
                    </>
                  )}
                </>
              )}
            </div>
          </nav>
          <div className="p-4 border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-3 px-4 py-3 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-zabbix-primary/20 flex items-center justify-center text-zabbix-primary font-bold text-xs">
                {session.user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{(session.user as any).role}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      }
      header={
        <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
          <DashboardHeader />
          <TopNav 
            isAdmin={isAdmin} 
            isTech={isTech} 
            canAccessInfo={!!dbUser?.canAccessInfo} 
            username={dbUser?.username || ''} 
          />
        </div>
      }
    >
      {children}
    </ResponsiveLayout>
  );
}
