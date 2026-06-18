import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const sites = await prisma.city.findMany({
      include: { state: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: sites });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { name, stateId } = await req.json();
    
    if (!name || !stateId) {
      return NextResponse.json({ error: "Nome e Estado são obrigatórios" }, { status: 400 });
    }

    const site = await prisma.city.create({
      data: {
        name: name,
        stateId: stateId
      }
    });

    return NextResponse.json({ success: true, data: site });
  } catch (error: any) {
    console.error("Erro ao criar site:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
