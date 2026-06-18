import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const isAdmin = user.role === 'ADMIN';

    // Obter cidades que o usuário tem acesso
    const userAccess = await prisma.userAccess.findMany({
      where: { userId: user.id },
      select: { cityId: true }
    });
    const allowedCityIds = userAccess.map(ua => ua.cityId);

    const whereClause: any = {
      OR: [
        { status: 'OFFLINE' },
        { status: 'ALERTA' },
        { hasAlarm: true }
      ]
    };

    const kronWhereClause: any = { active: true };

    if (!isAdmin) {
      // Filtrar estritamente por cidades que a conta tem acesso
      whereClause.cityId = { in: allowedCityIds };
      kronWhereClause.cityId = { in: allowedCityIds };
    }

    // Fetch problem devices (DAS)
    const problemDevices = await prisma.device.findMany({
      where: whereClause,
      include: {
        city: { include: { state: true } },
        company: true
      },
      orderBy: { lastSeen: 'desc' }
    });

    // Fetch problem kron meters (Let's say if it hasn't received data for 5 mins, or power factor < 0.92)
    // For TV dashboard, maybe we just show KRON devices that are active but haven't received data in a while
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);

    const kronDevices = await prisma.kronDevice.findMany({
      where: kronWhereClause,
      include: {
        city: { include: { state: true } },
        company: true,
        readings: {
          orderBy: { receivedAt: 'desc' },
          take: 1
        }
      }
    });

    const problemKron = kronDevices.filter(k => {
      if (!k.readings.length) return true; // Sem dados = offline/alerta
      const last = k.readings[0];
      if (new Date(last.receivedAt) < fiveMinsAgo) return true; // Parou de enviar
      if (last.powerFactor1 !== null && last.powerFactor1 < 0.92) return true; // Alarme de energia
      return false;
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        devices: problemDevices,
        kron: problemKron
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
