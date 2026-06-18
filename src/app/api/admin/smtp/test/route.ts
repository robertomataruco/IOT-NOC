import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import nodemailer from 'nodemailer';
import { getSmtpConfig, sendEmailWithConfig } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id }
    });

    if (!user || user.username.toLowerCase() !== 'roberto.mataruco') {
      console.warn(`[AUTH] Acesso negado para SMTP TEST. Usuário no banco: ${user?.username || 'não encontrado'}`);
      return NextResponse.json({ error: 'Forbidden. Esta configuração está restrita à conta roberto.mataruco.' }, { status: 403 });
    }

    const body = await req.json();
    const { host, port, secure, user: smtpUser, pass, fromName, fromEmail, testRecipient, provider, tenantId, clientId } = body;

    if (!smtpUser || !testRecipient) {
      return NextResponse.json({ error: 'Usuário e Destinatário de teste são obrigatórios' }, { status: 400 });
    }
    if (provider !== 'graph' && (!host || !port)) {
      return NextResponse.json({ error: 'Host e Porta são obrigatórios para SMTP' }, { status: 400 });
    }
    if (provider === 'graph' && (!tenantId || !clientId)) {
      return NextResponse.json({ error: 'Tenant ID e Client ID são obrigatórios para Microsoft Graph' }, { status: 400 });
    }

    const currentConfig = getSmtpConfig();
    
    // Se a senha for a mascarada, usa a que está salva no arquivo
    let finalPass = pass;
    if (!pass || pass === '••••••••••••••••') {
      finalPass = currentConfig.pass;
    }

    // Cria configuração temporária para testar
    const tempConfig = {
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

    const hostStr = provider === 'graph' ? 'Microsoft Graph API' : `${host}:${port}`;
    const textContent = `Olá Roberto,\n\nEste é um e-mail de teste disparado pelo painel de monitoramento da Ricas Tecnologia.\n\nSua configuração de envio foi testada com sucesso e está operando normalmente!\n\nMétodo: ${provider === 'graph' ? 'Microsoft Graph (OAuth2)' : 'SMTP Clássico'}\nConexão: ${hostStr}\nRemetente: ${smtpUser}\nData/Hora: ${new Date().toLocaleString('pt-BR')}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #3b82f6;">
        <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">🧪 Teste de Envio - Ricas Tecnologia</h2>
        <p style="font-size: 16px; color: #cbd5e1;">Olá Roberto,</p>
        <p style="font-size: 14px; color: #cbd5e1; leading-relaxed: 1.5;">Este é um e-mail de teste automático enviado a partir do Painel Avançado da Ricas Tecnologia.</p>
        <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace; font-size: 13px;">
          <p style="margin: 5px 0;"><strong style="color: #94a3b8;">Status:</strong> <span style="color: #10b981; font-weight: bold;">CONECTADO (Sucesso)</span></p>
          <p style="margin: 5px 0;"><strong style="color: #94a3b8;">Método de Envio:</strong> ${provider === 'graph' ? 'Microsoft Graph API (OAuth2 App)' : 'SMTP Clássico'}</p>
          <p style="margin: 5px 0;"><strong style="color: #94a3b8;">Conexão/Servidor:</strong> ${hostStr}</p>
          <p style="margin: 5px 0;"><strong style="color: #94a3b8;">Usuário Remetente:</strong> ${smtpUser}</p>
          <p style="margin: 5px 0;"><strong style="color: #94a3b8;">Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        </div>
        <p style="font-size: 14px; color: #cbd5e1;">Sua configuração está 100% pronta para disparar alertas aos supervisores em caso de quedas ou incidentes na rede!</p>
        <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 15px;">Sistema de Alertas Automáticos - Ricas Tecnologia</p>
      </div>
    `;

    await sendEmailWithConfig(tempConfig, testRecipient, `🧪 Teste de Conectividade - Ricas Tecnologia`, textContent, htmlContent);

    return NextResponse.json({ success: true, message: `E-mail de teste enviado com sucesso para ${testRecipient}` });
  } catch (error: any) {
    console.error('Error testing SMTP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
