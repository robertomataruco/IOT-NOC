import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET — Calcula o consumo de energia e custos no período selecionado
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const startDateStr = url.searchParams.get('startDate');
  const endDateStr = url.searchParams.get('endDate');
  const tariffParam = url.searchParams.get('tariff');

  if (!startDateStr || !endDateStr) {
    return NextResponse.json({ error: 'Parâmetros startDate e endDate são obrigatórios' }, { status: 400 });
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const baseTariff = parseFloat(tariffParam || '0.75'); // Tarifa base default por kWh

  try {
    // 1. Busca a primeira leitura válida a partir da data de início
    const startReading = await prisma.kronReading.findFirst({
      where: {
        kronDeviceId: params.id,
        receivedAt: { gte: startDate },
        energyActivePos: { not: null, gt: 0 }
      },
      orderBy: { receivedAt: 'asc' },
      select: { receivedAt: true, energyActivePos: true }
    });

    // 2. Busca a última leitura válida até a data de fim
    const endReading = await prisma.kronReading.findFirst({
      where: {
        kronDeviceId: params.id,
        receivedAt: { lte: endDate },
        energyActivePos: { not: null, gt: 0 }
      },
      orderBy: { receivedAt: 'desc' },
      select: { receivedAt: true, energyActivePos: true }
    });

    // 3. Busca o dispositivo para pegar metadados (nome, serial, local, etc.)
    const device = await prisma.kronDevice.findUnique({
      where: { id: params.id },
      include: {
        company: { select: { name: true } }
      }
    });

    if (!device) {
      return NextResponse.json({ error: 'Medidor não encontrado' }, { status: 404 });
    }

    if (!startReading || !endReading) {
      return NextResponse.json({
        device,
        startReading: startReading || null,
        endReading: endReading || null,
        consumptionKwh: 0,
        totalCost: 0,
        message: 'Sem leituras suficientes no período selecionado.'
      });
    }

    // Calcula o consumo acumulado no período
    let consumptionKwh = endReading.energyActivePos - startReading.energyActivePos;
    if (consumptionKwh < 0) consumptionKwh = 0; // Previne resets de medidor

    // Tarifação e impostos estimados (padrão brasileiro comercial)
    const activeCost = consumptionKwh * baseTariff;
    const pisCofinsEst = activeCost * 0.0925; // 9.25% de PIS/COFINS
    const icmsEst = activeCost * 0.18; // 18% de ICMS estimado
    const publicLightingEst = consumptionKwh > 0 ? 15.40 : 0.00; // Taxa de iluminação pública estimativa
    const totalCost = activeCost + pisCofinsEst + icmsEst + publicLightingEst;

    return NextResponse.json({
      device,
      startReading,
      endReading,
      consumptionKwh,
      baseTariff,
      calculations: {
        activeCost,
        pisCofinsEst,
        icmsEst,
        publicLightingEst,
        totalCost
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: `Erro no cálculo de faturamento: ${err.message}` }, { status: 500 });
  }
}
