import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET — Lista todos os medidores KRON
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const devices = await prisma.kronDevice.findMany({
    include: {
      company: { select: { id: true, name: true } },
      city: {
        select: { id: true, name: true, state: { select: { id: true, name: true, uf: true } } }
      },
      readings: {
        orderBy: { receivedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(devices);
}

// POST — Cadastra novo medidor KRON
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { name, serial, mqttTopic, location, companyId, cityId } = body;

  if (!name || !serial || !mqttTopic) {
    return NextResponse.json({ error: 'name, serial e mqttTopic são obrigatórios' }, { status: 400 });
  }

  try {
    const device = await prisma.kronDevice.create({
      data: {
        name, serial, mqttTopic, location,
        companyId: companyId || null,
        cityId: cityId || null,
      },
    });
    return NextResponse.json(device, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Serial já cadastrado' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
