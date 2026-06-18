import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const totalToday = await prisma.trap.count({
      where: {
        timestamp: {
          gte: todayStart
        }
      }
    });

    const lastTraps = await prisma.trap.findMany({
      orderBy: { timestamp: 'desc' },
      take: 15,
      include: {
        device: {
          select: {
            name: true,
            ip: true,
            city: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Buscar todos os dispositivos com seus status de sincronismo SNMP
    const devicesStatus = await prisma.device.findMany({
      select: {
        id: true,
        name: true,
        ip: true,
        serial: true,
        status: true,
        hasAlarm: true,
        syncError: true,
        lastSnmpSync: true,
        lastSnmpData: true
      },
      orderBy: { name: 'asc' }
    });

    const devicesDetail = devicesStatus.map(d => {
      let metrics = [];
      let activeAlarms = [];
      if (d.lastSnmpData) {
        try {
          const parsed = JSON.parse(d.lastSnmpData);
          metrics = parsed.metrics || [];
          activeAlarms = metrics.filter((m: any) => m.status === "PROBLEMA");
        } catch (err: any) {
          metrics = [{ error: "Failed to parse json: " + err.message }];
        }
      }
      return {
        id: d.id,
        name: d.name,
        ip: d.ip,
        serial: d.serial,
        status: d.status,
        hasAlarm: d.hasAlarm,
        syncError: d.syncError,
        lastSnmpSync: d.lastSnmpSync,
        totalMetricsParsed: metrics.length,
        activeAlarmsCount: activeAlarms.length,
        activeAlarmsList: activeAlarms
      };
    });

    return NextResponse.json({
      success: true,
      info: "Status do Receptor de Traps (UDP 162) e Dispositivos",
      totalTrapsToday: totalToday,
      lastReceivedTrap: lastTraps.length > 0 ? lastTraps[0].timestamp : "Nenhuma trap recebida ainda no banco",
      devices: devicesDetail,
      last15Traps: lastTraps.map(t => ({
        id: t.id,
        timestamp: t.timestamp,
        deviceName: t.device?.name || "Desconhecido",
        deviceIp: t.device?.ip || "N/A",
        cityName: t.device?.city?.name || "Desconhecido",
        alarmName: t.alarmName,
        description: t.description,
        severity: t.severity,
        isCleared: t.isCleared,
        fullTextSnippet: t.fullText ? t.fullText.substring(0, 200) + "..." : ""
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
