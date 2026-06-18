import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { base64 } = await req.json();
    const buffer = Buffer.from(base64.split(',')[1], 'base64');
    
    const targetNew = path.join(process.cwd(), 'public', 'logo-ricas-new.png');
    const targetOld = path.join(process.cwd(), 'public', 'logo-ricas.png');
    
    fs.writeFileSync(targetNew, buffer);
    fs.copyFileSync(targetNew, targetOld);
    
    console.log('>>> LOGO SAVED FROM API ROUTE <<<', targetNew);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
