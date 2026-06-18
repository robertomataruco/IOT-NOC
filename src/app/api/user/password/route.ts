import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { syncUserPasswordToGlpi } from "@/lib/glpi";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { password } = await req.json();

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 8 caracteres." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        passwordHash,
        mustChangePassword: false,
      },
    });

    // Sincroniza a nova senha com o GLPI em segundo plano
    syncUserPasswordToGlpi(updatedUser.username, password, updatedUser.name, updatedUser.email, updatedUser.company || undefined)
      .catch(err => console.error('[GLPI Sync User Update] Erro ao sincronizar nova senha:', err));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao alterar senha:", error);
    return NextResponse.json({ success: false, error: "Falha interna ao alterar senha" }, { status: 500 });
  }
}
