import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dir = process.cwd();
    const readmePath = path.join(dir, '2.07.0069_LEIA-ME.txt');
    const revisadosPath = path.join(dir, '2.07.0069_Conflex_NCC_REVISADOS.txt');

    let readme = '';
    let revisados = '';

    if (fs.existsSync(readmePath)) {
      readme = fs.readFileSync(readmePath, 'latin1');
    } else {
      readme = 'LEIA-ME not found at ' + readmePath;
    }

    if (fs.existsSync(revisadosPath)) {
      revisados = fs.readFileSync(revisadosPath, 'latin1');
    } else {
      revisados = 'REVISADOS not found at ' + revisadosPath;
    }

    return NextResponse.json({
      success: true,
      readme,
      revisados
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}
