import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dir = 'c:\\Users\\rmataruco\\OneDrive\\Projeto NOVO ZABBIX\\zabbix-dashboard';
    const file1Path = path.join(dir, '2.07.0069_Conflex_NCC_REVISADOS.txt');
    const file2Path = path.join(dir, '2.07.0069_LEIA-ME.txt');
    
    let file1 = '';
    let file2 = '';
    
    if (fs.existsSync(file1Path)) {
      file1 = fs.readFileSync(file1Path, 'utf8');
    } else {
      file1 = 'file1 not found';
    }
    
    if (fs.existsSync(file2Path)) {
      file2 = fs.readFileSync(file2Path, 'utf8');
    } else {
      file2 = 'file2 not found';
    }
    
    return NextResponse.json({
      success: true,
      file1Length: file1.length,
      file2Length: file2.length,
      file1: file1.substring(0, 10000), // First 10k chars
      file2: file2.substring(0, 10000)
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
