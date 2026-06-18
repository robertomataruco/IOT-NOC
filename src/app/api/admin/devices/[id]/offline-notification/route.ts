import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { sendEmailNotification } from '@/lib/email';

const SYNC_SECRET = process.env.SYNC_SECRET || 'ricas-sync-secret-token-2026';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const syncSecret = req.headers.get('x-sync-secret');
    if (syncSecret !== SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const device = await prisma.device.findUnique({
      where: { id: params.id },
      include: { city: true }
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    const cityName = device.city?.name || 'Desconhecido';

    // 1. Buscar todos os usuários alvo (ADMINs, SUPERVISORs ou com acesso ao site/cidade)
    const targetUsers = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'SUPERVISOR' },
          ...(device.cityId ? [{ access: { some: { cityId: device.cityId } } }] : [])
        ]
      }
    });

    if (targetUsers.length > 0) {
      const emoji = "🚨";
      const subject = `${emoji} ALERTA RICASTEC: DISPOSITIVO OFFLINE - ${device.name}`;
      const message = `*${emoji} DISPOSITIVO OFFLINE: ${device.name}*\n\nO equipamento parou de responder às consultas SNMP após esgotar todas as retentativas.\n*IP:* ${device.ip}\n*Site:* ${cityName}\n\n_Verifique o painel para mais detalhes._`;
      
      // WhatsApp Dispatch
      const phoneUsers = targetUsers.filter(u => u.phone && u.phone.trim() !== "");
      if (phoneUsers.length > 0) {
        Promise.all(phoneUsers.map(u => sendWhatsAppMessage(u.phone!, message)))
          .catch(err => console.error('Erro no despacho de WhatsApp em background (Offline):', err));
      }

      // Email Dispatch
      const emailUsers = targetUsers.filter(u => u.email && u.email.trim() !== "" && (u.role === 'ADMIN' || u.role === 'SUPERVISOR' || u.username === 'roberto.mataruco'));
      if (emailUsers.length > 0) {
        const emailText = `DISPOSITIVO OFFLINE DETECTADO\n\nEquipamento: ${device.name}\nIP: ${device.ip}\nSite: ${cityName}\nStatus: OFFLINE\nDescrição: O equipamento não responde ao SNMP após múltiplas tentativas de polling.\nData/Hora: ${new Date().toLocaleString('pt-BR')}\n\nPor favor, acesse o painel para averiguar o problema de conectividade.`;
        
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
            <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px; margin-top: 0;">${emoji} EQUIPAMENTO OFFLINE DETECTADO</h2>
            <p style="font-size: 16px; color: #cbd5e1;">Um dispositivo monitorado parou de responder às consultas SNMP e foi marcado como OFFLINE.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #1e293b;">
                <td style="padding: 10px; font-weight: bold; color: #94a3b8; width: 150px;">Equipamento</td>
                <td style="padding: 10px; color: #ffffff;">${device.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #94a3b8;">Endereço IP</td>
                <td style="padding: 10px; color: #cbd5e1; font-family: monospace;">${device.ip}</td>
              </tr>
              <tr style="background-color: #1e293b;">
                <td style="padding: 10px; font-weight: bold; color: #94a3b8;">Site</td>
                <td style="padding: 10px; color: #ffffff;">${cityName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #94a3b8;">Status</td>
                <td style="padding: 10px; color: #ef4444; font-weight: bold;">OFFLINE (SEM CONTATO)</td>
              </tr>
              <tr style="background-color: #1e293b;">
                <td style="padding: 10px; font-weight: bold; color: #94a3b8;">Data/Hora</td>
                <td style="padding: 10px; color: #ffffff;">${new Date().toLocaleString('pt-BR')}</td>
              </tr>
            </table>
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://192.168.67.84:3005" style="background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Acessar Painel NOC</a>
            </div>
            <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 15px;">Sistema de Alertas Automáticos - Ricas Tecnologia</p>
          </div>
        `;

        Promise.all(emailUsers.map(u => sendEmailNotification(u.email!, subject, emailText, emailHtml)))
          .catch(err => console.error('Erro no despacho de e-mails em background (Offline):', err));
      }
    }

    return NextResponse.json({ success: true, message: 'Offline notifications triggered successfully' });

  } catch (error: any) {
    console.error('Error dispatching offline notification:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
