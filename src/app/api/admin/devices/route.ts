import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isAdmin = user?.role === 'ADMIN';

  try {
    const devices = await prisma.device.findMany({
      where: isAdmin ? {} : { companyId: user?.companyId || 'non-existent' },
      include: { 
        city: { include: { state: true } }, 
        company: true,
        traps: {
          where: { isCleared: false }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ success: true, data: devices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, ip, serial, cityId, companyId, active, vpnUsername, address, latitude, longitude } = await req.json();

    if (!name || !ip || !cityId) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    // Verificar se IP já existe
    const existingIp = await prisma.device.findUnique({ where: { ip } });
    if (existingIp) {
      return NextResponse.json({ error: "Este IP já está cadastrado em outro dispositivo" }, { status: 400 });
    }

    // Verificar se Serial já existe (se fornecido)
    if (serial) {
      const existingSerial = await prisma.device.findUnique({ where: { serial } });
      if (existingSerial) {
        return NextResponse.json({ error: "Este Número de Série já está cadastrado em outro dispositivo" }, { status: 400 });
      }
    }

    const device = await prisma.device.create({
      data: { 
        name, 
        ip, 
        serial, 
        cityId, 
        companyId: companyId || null, 
        active: active !== undefined ? active : true,
        vpnUsername: vpnUsername || null,
        address: address || null,
        latitude: latitude !== undefined && latitude !== null && latitude !== '' ? parseFloat(latitude) : null,
        longitude: longitude !== undefined && longitude !== null && longitude !== '' ? parseFloat(longitude) : null,
      }
    });

    return NextResponse.json({ success: true, data: device });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
