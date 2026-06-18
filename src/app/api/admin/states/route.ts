import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const states = await prisma.state.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ success: true, data: states });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
