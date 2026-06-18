import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const id = params.id;
    const { name, status, paymentStatus, dueDate, lastPaymentAt } = await req.json();

    // Verificar se a empresa existe
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
    }

    // Se estiver mudando o nome, checar duplicidade
    if (name && name.trim() !== company.name) {
      const existing = await prisma.company.findUnique({
        where: { name: name.trim() }
      });
      if (existing) {
        return NextResponse.json({ error: "Já existe outra empresa cadastrada com este nome" }, { status: 400 });
      }
    }

    // Tratar datas e status do bloqueio
    let blockedAt = company.blockedAt;
    if (status === "BLOQUEADO" && company.status !== "BLOQUEADO") {
      blockedAt = new Date();
    } else if (status === "ATIVO") {
      blockedAt = null;
    }

    const updated = await prisma.company.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        status: status !== undefined ? status : undefined,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : undefined,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
        lastPaymentAt: lastPaymentAt !== undefined ? (lastPaymentAt ? new Date(lastPaymentAt) : null) : undefined,
        blockedAt
      }
    });

    return NextResponse.json({ success: true, data: updated });
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
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const id = params.id;
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
    }

    await prisma.company.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Empresa excluída com sucesso" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
