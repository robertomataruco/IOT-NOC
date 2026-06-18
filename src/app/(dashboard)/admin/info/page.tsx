import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import InfoClient from "./InfoClient";

export default async function InfoPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Buscar usuário completo no banco
  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  // Apenas administradores com canAccessInfo habilitado podem ver esta página!
  if (!dbUser || dbUser.role !== 'ADMIN' || !dbUser.canAccessInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-zabbix-dark">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Acesso Restrito</h1>
        <p className="text-sm text-slate-400 max-w-md">
          Você não possui permissão para acessar a ferramenta de Informações de usuários online.
          Fale com o administrador do sistema para obter esta permissão.
        </p>
      </div>
    );
  }

  return <InfoClient />;
}
