import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = execSync('git status', { encoding: 'utf8' });
    let diff = '';
    try {
      diff = execSync('git diff kron-receiver.mjs', { encoding: 'utf8' });
    } catch (e: any) {
      diff = e.message;
    }
    return NextResponse.json({ success: true, status, diff });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
