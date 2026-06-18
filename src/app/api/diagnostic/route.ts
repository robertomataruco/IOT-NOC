import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SNMPClient } from '@/lib/snmp';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      select: {
        id: true,
        name: true,
        ip: true,
        status: true,
        lastSnmpSync: true,
        syncError: true
      }
    });

    const targetDevice = devices.find(d => d.name.includes('W-VLMARIANA-01'));
    if (!targetDevice) {
      return NextResponse.json({ success: false, message: 'Device W-VLMARIANA-01 not found', devices });
    }

    // Try a ping test
    let pingResult = false;
    let pingError = '';
    try {
      const client = new SNMPClient(targetDevice.ip, 'ricas');
      pingResult = await client.ping();
      client.close();
    } catch (err: any) {
      pingError = err.message;
    }

    return NextResponse.json({
      success: true,
      device: targetDevice,
      pingResult,
      pingError,
      allDevices: devices.map(d => ({ id: d.id, name: d.name, ip: d.ip, status: d.status }))
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
