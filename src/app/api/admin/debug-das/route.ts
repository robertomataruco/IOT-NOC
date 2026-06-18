import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      where: {
        name: {
          contains: 'W-VLMARIANA'
        }
      }
    });

    let dasDebugLog = null;
    try {
      const logPath = path.join(process.cwd(), 'das_debug_log.json');
      if (fs.existsSync(logPath)) {
        dasDebugLog = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      devicesCount: devices.length,
      devices: devices.map(d => ({
        id: d.id,
        name: d.name,
        ip: d.ip,
        status: d.status,
        syncError: d.syncError,
        lastSnmpSync: d.lastSnmpSync,
        lastSnmpData: d.lastSnmpData ? JSON.parse(d.lastSnmpData) : null
      })),
      dasDebugLog
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
