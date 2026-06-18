import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { syncUserPasswordToGlpi } from "@/lib/glpi";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = params;

  try {
    const { name, username, password, role, company, companyId, phone, email, sites: userCities, canAccessInfo } = await req.json();
    
    const isUserAdmin = role === 'ADMIN';
    const finalCanAccessInfo = isUserAdmin ? (canAccessInfo ?? false) : false;

    // Sincronizar nome da empresa antigo/novo para compatibilidade
    let finalCompany = company;
    if (companyId) {
      const dbCompany = await prisma.company.findUnique({ where: { id: companyId } });
      if (dbCompany) {
        finalCompany = dbCompany.name;
      }
    }

    const updateData: any = {
      name,
      username,
      role,
      canAccessInfo: finalCanAccessInfo,
      company: finalCompany,
      companyId: companyId || null,
      phone,
      email,
    };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    // Atualizar usuário e suas permissões de acesso
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        access: {
          deleteMany: {}, // Limpa as permissões atuais
          create: userCities?.map((c: any) => ({
            cityId: c.cityId || c.siteId, // Compatibilidade com frontend antigo/novo
            permission: c.permission || 'VIEW'
          })) || []
        }
      }
    });

    // Sincroniza as atualizações do usuário (e senha se fornecida) com o GLPI em segundo plano
    syncUserPasswordToGlpi(user.username, password || undefined, user.name, user.email, user.company)
      .catch(err => console.error('[GLPI Sync Admin Update] Erro ao sincronizar usuário:', err));

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = params;

  try {
    await prisma.user.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
