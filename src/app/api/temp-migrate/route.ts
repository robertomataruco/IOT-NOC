import { execSync } from 'child_process';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pushOutput = execSync('npx prisma db push', { encoding: 'utf-8' });
    const genOutput = execSync('npx prisma generate', { encoding: 'utf-8' });
    return NextResponse.json({ 
      success: true, 
      pushOutput, 
      genOutput 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message, 
      stderr: error.stderr 
    }, { status: 500 });
  }
}
