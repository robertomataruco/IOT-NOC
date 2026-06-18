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

  try {
    const device = await prisma.device.findUnique({
      where: { id: params.id },
      include: {
        city: { include: { state: true } },
        company: true
      }
    });

    if (!device) {
      return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: device });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, ip, serial, cityId, companyId, active, vpnUsername, address, latitude, longitude } = await req.json();

    // Verificar se o IP já existe em OUTRO dispositivo
    if (ip) {
      const existingIp = await prisma.device.findFirst({
        where: { 
          ip,
          NOT: { id: params.id }
        }
      });
      if (existingIp) {
        return NextResponse.json({ error: "Este IP já está em uso por outro dispositivo" }, { status: 400 });
      }
    }

    // Verificar se o Serial já existe em OUTRO dispositivo
    if (serial) {
      const existingSerial = await prisma.device.findFirst({
        where: { 
          serial,
          NOT: { id: params.id }
        }
      });
      if (existingSerial) {
        return NextResponse.json({ error: "Este Serial já está em uso por outro dispositivo" }, { status: 400 });
      }
    }

    const device = await prisma.device.update({
      where: { id: params.id },
      data: { 
        name, 
        ip, 
        serial, 
        cityId, 
        companyId: companyId || null,
        active: active !== undefined ? active : undefined,
        vpnUsername: vpnUsername !== undefined ? (vpnUsername || null) : undefined,
        address: address !== undefined ? (address || null) : undefined,
        latitude: latitude !== undefined ? (latitude !== null && latitude !== '' ? parseFloat(latitude) : null) : undefined,
        longitude: longitude !== undefined ? (longitude !== null && longitude !== '' ? parseFloat(longitude) : null) : undefined,
      }
    });

    return NextResponse.json({ success: true, data: device });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.device.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
