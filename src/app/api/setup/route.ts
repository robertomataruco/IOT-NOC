import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const count = await prisma.user.count();
    if (count > 0) {
      return NextResponse.json({ message: "Admin already exists" });
    }

    const passwordHash = await bcrypt.hash('admin', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        name: 'Administrador',
        passwordHash: passwordHash,
        role: 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, user: admin.username });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
