import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const hardware = searchParams.get('hardware');
  const range = searchParams.get('range') || '100';
  const startDateStr = searchParams.get('startDate');
  const endDateStr = searchParams.get('endDate');

  if (!hardware) {
    return NextResponse.json({ error: "Parâmetro 'hardware' é obrigatório" }, { status: 400 });
  }

  const where: any = {
    deviceId: params.id,
    hardware: hardware
  };

  let takeLimit = 100;

  if (range !== '100') {
    let start: Date | null = null;
    let end: Date | null = null;

    if (range === 'today') {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date();
      end.setHours(23, 59, 59, 999);
      takeLimit = 1000;
    } else if (range === 'yesterday') {
      start = new Date();
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end = new Date();
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      takeLimit = 1000;
    } else if (range === '24h') {
      start = new Date(Date.now() - 24 * 60 * 60 * 1000);
      takeLimit = 1000;
    } else if (range === '3d') {
      start = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      takeLimit = 2000;
    } else if (range === '7d') {
      start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      takeLimit = 3000;
    } else if (range === 'custom') {
      if (startDateStr) {
        if (startDateStr.length === 10) {
          start = new Date(`${startDateStr}T00:00:00`);
        } else {
          start = new Date(startDateStr);
        }
      }
      if (endDateStr) {
        if (endDateStr.length === 10) {
          end = new Date(`${endDateStr}T23:59:59.999`);
        } else {
          end = new Date(endDateStr);
        }
      }
      takeLimit = 3000;
    }

    if (start || end) {
      where.timestamp = {};
      if (start) where.timestamp.gte = start;
      if (end) where.timestamp.lte = end;
    }
  }

  try {
    const readings = await prisma.deviceTelemetry.findMany({
      where: where,
      orderBy: {
        timestamp: 'desc'
      },
      take: takeLimit
    });

    const sortedReadings = readings.reverse().map((r: any) => {
      let parsedMetrics = {};
      try {
        parsedMetrics = JSON.parse(r.metrics);
      } catch (e) {
        // Ignora
      }
      return {
        timestamp: r.timestamp,
        ...parsedMetrics
      };
    });

    return NextResponse.json({ success: true, data: sortedReadings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao buscar telemetria" }, { status: 500 });
  }
}

