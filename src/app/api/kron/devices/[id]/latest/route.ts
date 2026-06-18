import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET — Retorna apenas a última leitura do medidor (para polling em tempo real)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const reading = await prisma.kronReading.findFirst({
    where: { kronDeviceId: params.id },
    orderBy: { receivedAt: 'desc' },
    select: {
      receivedAt: true,
      voltageA: true, voltageB: true, voltageC: true,
      currentI1: true, currentI2: true, currentI3: true,
      activePowerTotal: true,
      powerFactor1: true, powerFactor2: true, powerFactor3: true,
      energyActivePos: true, energyActiveNeg: true,
    },
  });

  if (!reading) return NextResponse.json({ error: 'Sem leituras disponíveis' }, { status: 404 });
  return NextResponse.json(reading);
}
