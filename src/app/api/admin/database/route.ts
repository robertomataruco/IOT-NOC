import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PROJECT_DIR = '/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard';
const PRISMA_DIR = path.join(PROJECT_DIR, 'prisma');
const ACTIVE_DB_PATH = path.join(PRISMA_DIR, 'dashboard.db');

// Middleware simplificado para garantir acesso exclusivo ao roberto.mataruco
async function verifyAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Não autorizado", status: 401 };

  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  });

  if (dbUser?.username.toLowerCase() !== 'roberto.mataruco') {
    return { error: "Acesso restrito ao administrador principal", status: 403 };
  }

  return { success: true };
}

// GET: Listar backups ou Baixar banco de dados ativo
export async function GET(req: Request) {
  const auth = await verifyAdminAccess();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const download = searchParams.get('download');

  // Caso 1: Baixar banco ativo
  if (download === 'true') {
    try {
      if (!fs.existsSync(ACTIVE_DB_PATH)) {
        return NextResponse.json({ error: "Banco de dados ativo não encontrado" }, { status: 404 });
      }

      const fileBuffer = fs.readFileSync(ACTIVE_DB_PATH);
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': 'application/x-sqlite3',
          'Content-Disposition': 'attachment; filename=dashboard.db',
          'Content-Length': fileBuffer.length.toString(),
        }
      });
    } catch (error: any) {
      return NextResponse.json({ error: `Erro ao baixar banco: ${error.message}` }, { status: 500 });
    }
  }

  // Caso 2: Listar backups existentes
  try {
    if (!fs.existsSync(PRISMA_DIR)) {
      return NextResponse.json({ success: true, backups: [] });
    }

    const files = fs.readdirSync(PRISMA_DIR);
    const backups = files
      .filter(file => file.startsWith('dashboard.db.backup.'))
      .map(file => {
        const filePath = path.join(PRISMA_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: `${(stats.size / 1024).toFixed(1)} KB`,
          createdAt: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json({ success: true, backups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Ações de Backup, Restauração e Exclusão
export async function POST(req: Request) {
  const auth = await verifyAdminAccess();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { action, filename } = await req.json();

    if (action === 'create-backup') {
      if (!fs.existsSync(ACTIVE_DB_PATH)) {
        return NextResponse.json({ success: false, error: "Banco ativo não encontrado" }, { status: 404 });
      }

      const timestamp = new Date().toISOString().replace(/[-:T]/g, '_').slice(0, 19);
      const backupPath = path.join(PRISMA_DIR, `dashboard.db.backup.${timestamp}`);

      fs.copyFileSync(ACTIVE_DB_PATH, backupPath);
      return NextResponse.json({ success: true, message: `Backup criado: dashboard.db.backup.${timestamp}` });
    }

    if (action === 'restore-backup') {
      if (!filename) {
        return NextResponse.json({ success: false, error: "Nome do arquivo não fornecido" }, { status: 400 });
      }

      const backupPath = path.join(PRISMA_DIR, filename);
      if (!fs.existsSync(backupPath)) {
        return NextResponse.json({ success: false, error: "Arquivo de backup não encontrado" }, { status: 404 });
      }

      // Cria um backup de segurança temporário do ativo antes de restaurar
      if (fs.existsSync(ACTIVE_DB_PATH)) {
        const safetyBackup = path.join(PRISMA_DIR, `dashboard.db.backup.pre_restore_${Date.now()}`);
        fs.copyFileSync(ACTIVE_DB_PATH, safetyBackup);
      }

      fs.copyFileSync(backupPath, ACTIVE_DB_PATH);
      return NextResponse.json({ success: true, message: "Backup restaurado com sucesso!" });
    }

    if (action === 'delete-backup') {
      if (!filename) {
        return NextResponse.json({ success: false, error: "Nome do arquivo não fornecido" }, { status: 400 });
      }

      const backupPath = path.join(PRISMA_DIR, filename);
      if (!fs.existsSync(backupPath)) {
        return NextResponse.json({ success: false, error: "Backup não encontrado" }, { status: 404 });
      }

      fs.unlinkSync(backupPath);
      return NextResponse.json({ success: true, message: "Backup excluído!" });
    }

    return NextResponse.json({ success: false, error: "Ação inválida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Upload e Validação de Banco de Dados Local do Windows
export async function PUT(req: Request) {
  const auth = await verifyAdminAccess();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const tempFilePath = '/tmp/dashboard_upload.db';

  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ─── VALIDAÇÃO 1: Verificar se é um SQLite válido (Cabeçalho de 16 bytes) ───
    const sqliteHeader = "SQLite format 3\0";
    const fileHeader = buffer.slice(0, 16).toString();
    if (fileHeader !== sqliteHeader) {
      return NextResponse.json({ 
        success: false, 
        error: "Arquivo inválido! O arquivo enviado não é um banco SQLite válido (cabeçalho incorreto)." 
      }, { status: 400 });
    }

    // Salva temporariamente no /tmp para validação via CLI
    fs.writeFileSync(tempFilePath, buffer);

    // ─── VALIDAÇÃO 2: Verificar se contém as tabelas do Prisma ───
    let tableCheckOutput = "";
    try {
      tableCheckOutput = execSync(`sqlite3 ${tempFilePath} ".tables"`).toString();
    } catch (e: any) {
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      return NextResponse.json({ 
        success: false, 
        error: `O arquivo enviado está corrompido ou não pôde ser lido pelo SQLite: ${e.message}` 
      }, { status: 400 });
    }

    const requiredTables = ['User', 'Device', 'City', 'Company'];
    const missingTables = requiredTables.filter(table => !tableCheckOutput.includes(table));

    if (missingTables.length > 0) {
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      return NextResponse.json({
        success: false,
        error: `Validação Falhou! O banco enviado está faltando as seguintes tabelas críticas do Prisma: [${missingTables.join(', ')}]. Certifique-se de que é o banco dashboard.db correto.`
      }, { status: 400 });
    }

    // ─── APLICAÇÃO SEGURA DO BANCO DE DADOS ───
    // 1. Criar backup automático do banco ativo antes de substituí-lo
    if (fs.existsSync(ACTIVE_DB_PATH)) {
      const timestamp = new Date().toISOString().replace(/[-:T]/g, '_').slice(0, 19);
      const safetyBackup = path.join(PRISMA_DIR, `dashboard.db.backup.pre_upload.${timestamp}`);
      fs.copyFileSync(ACTIVE_DB_PATH, safetyBackup);
    }

    // 2. Substituir o banco ativo pelo novo
    fs.copyFileSync(tempFilePath, ACTIVE_DB_PATH);
    
    // Limpa o arquivo temporário
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

    return NextResponse.json({ 
      success: true, 
      message: "Banco de dados enviado, validado com sucesso e ativado em produção!" 
    });

  } catch (error: any) {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
