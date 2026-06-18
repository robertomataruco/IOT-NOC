import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        access: {
          include: {
            city: {
              include: { state: true }
            }
          }
        }
      }
    });

    if (!user) return NextResponse.json({ success: false });

    // Se for admin, pode ver todos os sites se não tiver sites vinculados especificamente
    if (user.role === 'ADMIN' && user.access.length === 0) {
        const allSites = await prisma.city.findMany({
          include: { state: true },
          orderBy: { name: 'asc' }
        });
        return NextResponse.json({ success: true, data: allSites });
    }

    const sites = user.access.map(us => us.city);
    return NextResponse.json({ success: true, data: sites });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
