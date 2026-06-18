import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'prisma', 'os.json');

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { osId } = await req.json();
    if (!osId) {
      return NextResponse.json({ success: false, error: "ID da OS é obrigatório" }, { status: 400 });
    }

    const list = readDb();
    const os = list.find((item: any) => item.osId === osId);
    if (!os) {
      return NextResponse.json({ success: false, error: "OS não encontrada" }, { status: 404 });
    }

    // Build the professional WhatsApp message with History and Solutions
    let message = `*📋 ORDEM DE SERVIÇO: ${os.osId}*\n\n` +
      `*Site:* ${os.site}\n` +
      `*Equipamento:* ${os.equipment} (${os.ip})\n` +
      `*Urgência:* ${os.urgency || 'MEDIA'}\n` +
      `*Categoria:* ${os.category || 'Geral'}\n` +
      `*Status:* ${os.status}\n` +
      `*Técnico Encarregado:* ${os.technician || 'Não atribuído'}\n` +
      `*Descrição:* ${os.description || 'Sem descrição.'}\n` +
      `*Criado em:* ${new Date(os.createdAt).toLocaleString('pt-BR')}\n`;

    if (os.notes) {
      message += `\n*✅ Solução Aplicada:*\n${os.notes}\n`;
    }

    if (os.logs && os.logs.length > 0) {
      message += `\n*📜 Histórico de Atividades:*\n` +
        os.logs.map((log: any) => {
          const dateStr = new Date(log.timestamp).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          const isFollowup = log.text?.includes('[') && log.text?.includes(']');
          let logContent = log.text;
          if (isFollowup) {
            const match = log.text.match(/^\[(.*?)\]\s*(.*)$/);
            if (match) {
              logContent = `(${match[1]}) ${match[2]}`;
            }
          }
          
          return `• ${dateStr}: ${logContent}`;
        }).join('\n') + `\n`;
    }

    message += `\n_Notificação enviada automaticamente via Evolution API._`;

    const recipientPhones: string[] = [];

    // 1. Send to the technician if assigned and has a phone number
    if (os.technician) {
      const techUser = await prisma.user.findFirst({
        where: {
          name: { equals: os.technician }
        }
      });
      if (techUser && techUser.phone) {
        recipientPhones.push(techUser.phone);
      }
    }

    // 2. Send to supervisors/admins
    const supervisors = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'SUPERVISOR' },
          { role: 'ADMIN' }
        ],
        phone: { not: null }
      }
    });

    for (const sup of supervisors) {
      if (sup.phone && !recipientPhones.includes(sup.phone)) {
        recipientPhones.push(sup.phone);
      }
    }

    if (recipientPhones.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Nenhum número de telefone encontrado para o técnico ou supervisores." 
      }, { status: 400 });
    }

    // Send messages in parallel
    await Promise.all(recipientPhones.map(phone => sendWhatsAppMessage(phone, message)));

    return NextResponse.json({ 
      success: true, 
      message: `Chamado enviado com sucesso para ${recipientPhones.length} contatos.` 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
