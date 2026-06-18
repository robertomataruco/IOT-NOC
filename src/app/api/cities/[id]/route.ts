import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const city = await prisma.city.findUnique({
      where: { id },
      include: { 
        state: true,
        devices: true
      }
    });

    if (!city) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: city });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
