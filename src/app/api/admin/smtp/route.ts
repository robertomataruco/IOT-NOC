import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getSmtpConfig, saveSmtpConfig } from "@/lib/email";

// GET — Retorna as configurações SMTP (apenas para roberto.mataruco)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id }
    });

    if (!user || user.username.toLowerCase() !== 'roberto.mataruco') {
      console.warn(`[AUTH] Acesso negado para SMTP GET. Usuário no banco: ${user?.username || 'não encontrado'}`);
      return NextResponse.json({ error: 'Forbidden. Esta configuração está restrita à conta roberto.mataruco.' }, { status: 403 });
    }

    const config = getSmtpConfig();
    
    // Ocultar a senha para segurança ao exibir na tela
    const responseConfig = {
      ...config,
      pass: config.pass ? '••••••••••••••••' : ''
    };

    return NextResponse.json({ success: true, data: responseConfig });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST — Salva as configurações SMTP (apenas para roberto.mataruco)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id }
    });

    if (!user || user.username.toLowerCase() !== 'roberto.mataruco') {
      console.warn(`[AUTH] Acesso negado para SMTP POST. Usuário no banco: ${user?.username || 'não encontrado'}`);
      return NextResponse.json({ error: 'Forbidden. Esta configuração está restrita à conta roberto.mataruco.' }, { status: 403 });
    }

    const body = await req.json();
    const { host, port, secure, user: smtpUser, pass, fromName, fromEmail, provider, tenantId, clientId } = body;

    if (provider !== 'graph' && (!host || !port || !smtpUser)) {
      return NextResponse.json({ error: 'Os campos Host, Porta e Usuário são obrigatórios' }, { status: 400 });
    }
    if (provider === 'graph' && (!smtpUser || !tenantId || !clientId)) {
      return NextResponse.json({ error: 'Os campos E-mail, Tenant ID e Client ID são obrigatórios para Microsoft Graph' }, { status: 400 });
    }

    const currentConfig = getSmtpConfig();
    
    // Se a senha vier mascarada ou em branco, mantém a senha atual
    let finalPass = pass;
    if (!pass || pass === '••••••••••••••••') {
      finalPass = currentConfig.pass;
    }

    const newConfig = {
      host: provider === 'graph' ? 'microsoft-graph' : host,
      port: provider === 'graph' ? 587 : parseInt(port),
      secure: provider === 'graph' ? false : secure === true,
      user: smtpUser,
      pass: finalPass,
      fromName: fromName || 'Ricas Alertas',
      fromEmail: fromEmail || smtpUser,
      provider: provider || 'smtp',
      tenantId: provider === 'graph' ? tenantId : undefined,
      clientId: provider === 'graph' ? clientId : undefined
    };

    const saved = saveSmtpConfig(newConfig);
    if (!saved) {
      return NextResponse.json({ error: 'Falha ao salvar o arquivo de configuração' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Configurações salvas com sucesso' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
