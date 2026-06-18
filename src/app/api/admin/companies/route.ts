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
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: { users: true, devices: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ success: true, data: companies });
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
    const { name, status, paymentStatus, dueDate, lastPaymentAt } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "O nome da empresa é obrigatório" }, { status: 400 });
    }

    // Verificar se já existe empresa com este nome
    const existing = await prisma.company.findUnique({
      where: { name: name.trim() }
    });

    if (existing) {
      return NextResponse.json({ error: "Já existe uma empresa cadastrada com este nome" }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        name: name.trim(),
        status: status || "ATIVO",
        paymentStatus: paymentStatus || "PAGO",
        dueDate: dueDate ? new Date(dueDate) : null,
        lastPaymentAt: lastPaymentAt ? new Date(lastPaymentAt) : null,
        blockedAt: status === "BLOQUEADO" ? new Date() : null
      }
    });

    return NextResponse.json({ success: true, data: company });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
