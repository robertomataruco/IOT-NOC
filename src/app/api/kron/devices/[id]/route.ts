import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET — Últimas leituras do medidor (padrão: últimas 100)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const limit  = parseInt(url.searchParams.get('limit')  || '100');
  const period = url.searchParams.get('period') || '24h'; // 1h, 24h, 7d, 30d

  let since = new Date();
  switch (period) {
    case '1h':  since = new Date(Date.now() - 1 * 60 * 60 * 1000); break;
    case '24h': since = new Date(Date.now() - 24 * 60 * 60 * 1000); break;
    case '7d':  since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); break;
    case '30d': since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); break;
  }

  const device = await prisma.kronDevice.findUnique({
    where: { id: params.id },
    include: {
      company: { select: { name: true } },
      readings: {
        where: { receivedAt: { gte: since } },
        orderBy: { receivedAt: 'desc' },
        take: Math.min(limit, 1000),
        select: {
          id: true, receivedAt: true,
          voltageA: true, voltageB: true, voltageC: true,
          currentI1: true, currentI2: true, currentI3: true,
          activePowerTotal: true,
          powerFactor1: true, powerFactor2: true, powerFactor3: true,
          energyActivePos: true, energyActiveNeg: true,
        },
      },
    },
  });

  if (!device) return NextResponse.json({ error: 'Medidor não encontrado' }, { status: 404 });
  return NextResponse.json(device);
}

// PUT — Atualiza medidor
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { name, serial, mqttTopic, location, companyId, cityId, active } = body;

  const device = await prisma.kronDevice.update({
    where: { id: params.id },
    data: {
      ...(name      !== undefined && { name }),
      ...(serial    !== undefined && { serial }),
      ...(mqttTopic !== undefined && { mqttTopic }),
      ...(location  !== undefined && { location }),
      ...(companyId !== undefined && { companyId: companyId || null }),
      ...(cityId    !== undefined && { cityId: cityId || null }),
      ...(active    !== undefined && { active }),
    },
  });

  return NextResponse.json(device);
}

// DELETE — Remove medidor e todas as leituras
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.kronDevice.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
