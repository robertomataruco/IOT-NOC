import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      include: { state: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ success: true, data: cities });
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
    const { name, stateId, address, latitude, longitude } = await req.json();

    if (!name || !stateId) {
      return NextResponse.json({ error: "Nome e Estado são obrigatórios" }, { status: 400 });
    }

    const city = await prisma.city.create({
      data: {
        name,
        stateId,
        address: address || null,
        latitude: latitude !== undefined && latitude !== null && latitude !== '' ? parseFloat(latitude) : null,
        longitude: longitude !== undefined && longitude !== null && longitude !== '' ? parseFloat(longitude) : null,
      }
    });

    return NextResponse.json({ success: true, data: city });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
