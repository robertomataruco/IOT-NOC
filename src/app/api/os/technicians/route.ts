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
    const technicians = await prisma.user.findMany({
      where: {
        role: 'TECHNICIAN'
      },
      select: {
        id: true,
        name: true,
        companyId: true,
        company: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ success: true, data: technicians });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
