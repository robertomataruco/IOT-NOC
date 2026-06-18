import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { sendEmailNotification } from '@/lib/email';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createGlpiTicketForOs } from "@/lib/glpi";

const DB_PATH = path.join(process.cwd(), 'prisma', 'os.json');

// Helper to read database
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error("Error reading OS database:", error);
    return [];
  }
}

// Helper to write database
function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing OS database:", error);
    return false;
  }
}

// Build HTML email body for OS notifications
function buildEmailHtml(item: any, subject: string, changeNote: string): string {
  const statusColors: Record<string, string> = {
    NOVA: '#eab308',
    EM_ATENDIMENTO: '#06b6d4',
    EM_ESPERA: '#f59e0b',
    CONCLUIDA: '#10b981',
  };
  const statusLabels: Record<string, string> = {
    NOVA: 'Novo',
    EM_ATENDIMENTO: 'Em Atendimento',
    EM_ESPERA: 'Pendente / Espera',
    CONCLUIDA: 'Solucionado',
  };
  const color = statusColors[item.status] || '#64748b';
  const label = statusLabels[item.status] || item.status;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body{font-family:system-ui,-apple-system,sans-serif;background:#0b0f19;color:#e2e8f0;margin:0;padding:0}
  .container{max-width:600px;margin:0 auto;background:#0f172a;border-radius:16px;overflow:hidden;border:1px solid #1e293b}
  .header{background:linear-gradient(135deg,#1e293b,#0f172a);padding:24px 28px;border-bottom:1px solid #1e293b}
  .logo{font-size:18px;font-weight:900;color:#fff;letter-spacing:-.5px;text-transform:uppercase}
  .logo span{color:#22c55e}
  .badge{display:inline-block;margin-top:6px;padding:3px 10px;background:#22c55e18;border:1px solid #22c55e30;color:#22c55e;font-size:10px;font-weight:700;border-radius:6px;text-transform:uppercase;letter-spacing:.08em}
  .content{padding:24px 28px}
  .title{font-size:14px;font-weight:800;color:#fff;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em}
  .change-note{padding:12px 16px;background:#22c55e10;border-left:3px solid #22c55e;border-radius:4px;font-size:12px;color:#86efac;margin-bottom:20px}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
  .info-item label{display:block;font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px}
  .info-item span{font-size:12px;font-weight:600;color:#e2e8f0}
  .status-badge{display:inline-block;padding:4px 12px;border-radius:6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;border:1px solid ${color}40;background:${color}15;color:${color}}
  .desc-box{background:#0b0f19;border:1px solid #1e293b;border-radius:10px;padding:14px;font-size:12px;color:#94a3b8;line-height:1.5;margin-bottom:20px}
  .footer{padding:16px 28px;border-top:1px solid #1e293b;text-align:center;font-size:10px;color:#475569}
</style></head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">RICAS<span>TECNOLOGIA</span></div>
    <div class="badge">ITIL ServiceDesk</div>
  </div>
  <div class="content">
    <div class="title">${subject}</div>
    <div class="change-note">🔔 ${changeNote}</div>
    <div class="info-grid">
      <div class="info-item"><label>N° da O.S.</label><span>${item.osId}</span></div>
      <div class="info-item"><label>Status</label><span class="status-badge">${label}</span></div>
      <div class="info-item"><label>Site / Local</label><span>${item.site || '---'}</span></div>
      <div class="info-item"><label>Equipamento</label><span>${item.equipment || '---'}</span></div>
      <div class="info-item"><label>IP do Equipamento</label><span>${item.ip || '0.0.0.0'}</span></div>
      <div class="info-item"><label>Categoria</label><span>${item.category || 'Geral'}</span></div>
      <div class="info-item"><label>Urgência</label><span>${item.urgency || 'MEDIA'}</span></div>
      <div class="info-item"><label>Técnico Responsável</label><span>${item.technician || 'Não atribuído'}</span></div>
      <div class="info-item"><label>Requerente</label><span>${item.requester || 'Portal NOC'}</span></div>
      <div class="info-item"><label>Abertura</label><span>${item.createdAt ? new Date(item.createdAt).toLocaleString('pt-BR') : '---'}</span></div>
    </div>
    ${item.description ? `<div class="desc-box"><strong>Descrição:</strong><br>${item.description}</div>` : ''}
    ${item.notes ? `<div class="desc-box"><strong>✅ Solução Registrada:</strong><br>${item.notes}</div>` : ''}
  </div>
  <div class="footer">Notificação automática do Portal NOC — RICAS TECNOLOGIA — Não responda este e-mail.</div>
</div>
</body>
</html>`;
}

export async function GET() {
  try {
    const list = readDb();
    list.sort((a: any, b: any) => new Date(b.createdAt || b.oldestDate || 0).getTime() - new Date(a.createdAt || a.oldestDate || 0).getTime());
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.osId) {
      return NextResponse.json({ success: false, error: "Faltando ID da OS" }, { status: 400 });
    }

    // Resolve o deviceId com base no IP caso a requisição venha sem ele
    if (!body.deviceId && body.ip) {
      try {
        const foundDev = await prisma.device.findUnique({
          where: { ip: body.ip }
        });
        if (foundDev) {
          body.deviceId = foundDev.id;
        }
      } catch (err: any) {
        console.error('[OS Route] Erro ao buscar dispositivo por IP:', err.message);
      }
    }

    const list = readDb();
    
    const exists = list.find((item: any) => item.osId === body.osId);
    if (exists) {
      return NextResponse.json({ success: true, data: exists });
    }

    const newOs = {
      ...body,
      createdAt: new Date().toISOString(),
      status: body.status || "NOVA",
      notes: body.notes || "",
      technician: body.technician || "",
      observer: body.observer || "",
      requester: body.requester || "",
      glpiTicketId: null,
      logs: body.logs || [
        { timestamp: new Date().toISOString(), text: `Ordem de Serviço registrada no sistema pelo requerente ${body.requester || 'Portal NOC'}.` }
      ]
    };

    // ─── Buscar Erros, Cidade e Alarmes do Equipamento no Portal ───
    let portalErrors = '';
    if (body.deviceId) {
      try {
        const device = await prisma.device.findUnique({
          where: { id: body.deviceId },
          include: {
            city: true,
            traps: {
              where: { isCleared: false }
            }
          }
        });
        if (device) {
          // Preenche ou corrige o nome do site/cidade a partir do banco de dados do portal
          if (device.city?.name) {
            newOs.site = device.city.name;
          }
          
          // Preenche o título caso esteja vazio ou "N/A"
          if (!newOs.title || newOs.title === 'N/A' || newOs.title.includes('N/A')) {
            newOs.title = `${newOs.site || 'Outros'} - ${newOs.equipment || 'Equipamento'}`;
          }

          const lines = [];
          if (device.status === 'OFFLINE') {
            lines.push('⚠️ EQUIPAMENTO CONSTAVA COMO OFFLINE NO PORTAL');
          }
          if (device.syncError) {
            lines.push(`❌ Erro de Comunicação/Sincronismo: ${device.syncError}`);
          }
          if (device.traps && device.traps.length > 0) {
            lines.push('🚨 Alarmes/Traps Ativas no Portal:');
            device.traps.forEach((t) => {
              lines.push(`  - [${t.alarmName}] ${t.description}`);
            });
          }
          if (lines.length > 0) {
            portalErrors = `\n\n--- ERROS E ALARMES DO PORTAL ---\n${lines.join('\n')}\n----------------------------------`;
          }
        }
      } catch (err: any) {
        console.error('[OS Route] Erro ao buscar dados do dispositivo:', err.message);
      }
    }

    if (portalErrors) {
      newOs.description = (newOs.description || '') + portalErrors;
    }

    // ─── Integração Dinâmica com GLPI 11 ───
    try {
      let portalUser = null;
      
      // 1. Prioriza a busca pelo requerente informado no formulário (caso seja um cliente no portal)
      if (body.requester) {
        portalUser = await prisma.user.findFirst({
          where: {
            OR: [
              { name: { equals: body.requester } },
              { username: { equals: body.requester } }
            ]
          },
          include: { companyRef: true }
        });
      }

      // 2. Se não encontrar o requerente pelo nome, tenta obter o usuário da sessão logada
      if (!portalUser) {
        const session = await getServerSession(authOptions);
        if (session?.user) {
          portalUser = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            include: { companyRef: true }
          });
        }
      }

      const requesterName = portalUser?.name || body.requester || 'Operador NOC';
      // Gera um username válido (limpo, sem acentos ou espaços) se o usuário não tiver username no portal
      const requesterUsername = portalUser?.username || requesterName.toLowerCase().trim()
        .replace(/\s+/g, '_')
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const requesterEmail = portalUser?.email || null;

      // 3. Resolve o nome da empresa/entidade. Se o usuário não tiver empresa associada no portal,
      // busca a empresa associada ao dispositivo do ticket.
      let companyName = 'Root';
      if (portalUser?.companyRef?.name) {
        companyName = portalUser.companyRef.name;
      } else if (portalUser?.company) {
        companyName = portalUser.company;
      } else if (body.deviceId) {
        const dev = await prisma.device.findUnique({
          where: { id: body.deviceId },
          include: { company: true }
        });
        if (dev?.company?.name) {
          companyName = dev.company.name;
        }
      }

      console.log(`[GLPI Sync] Integrando OS ${newOs.osId}. Usuário: ${requesterUsername}, Cliente: ${companyName}`);

      const glpiResult = await createGlpiTicketForOs({
        osId: newOs.osId,
        site: newOs.site || 'N/A',
        equipment: newOs.equipment || 'N/A',
        ip: newOs.ip || '0.0.0.0',
        description: newOs.description || '',
        urgency: newOs.urgency || 'MEDIA',
        requesterUsername,
        requesterName,
        requesterEmail,
        companyName
      });

      if (glpiResult?.success) {
        newOs.glpiTicketId = glpiResult.glpiTicketId;
        newOs.logs.push({
          timestamp: new Date().toISOString(),
          text: `Chamado integrado com sucesso no GLPI 11 (ID: ${glpiResult.glpiTicketId}).`
        });
      } else {
        newOs.logs.push({
          timestamp: new Date().toISOString(),
          text: `Aviso: Falha ao integrar com GLPI: ${glpiResult?.error || 'Erro desconhecido'}`
        });
      }
    } catch (glpiErr: any) {
      console.error('[GLPI Sync Exception]', glpiErr);
      newOs.logs.push({
        timestamp: new Date().toISOString(),
        text: `Aviso: Exceção no sincronismo com GLPI: ${glpiErr.message}`
      });
    }

    list.push(newOs);
    writeDb(list);

    // E-mail para o requerente e supervisor sobre a abertura do chamado
    const emailSubject = `✅ Chamado Aberto: ${newOs.osId} — ${newOs.site}`;
    const changeNote = `Chamado aberto por ${newOs.requester || 'Portal NOC'} em ${new Date().toLocaleString('pt-BR')} • Site: ${newOs.site}`;
    const htmlBody = buildEmailHtml(newOs, emailSubject, changeNote);

    const emailTargets: string[] = [];

    // Requester email lookup
    if (body.requester) {
      const requesterUser = await prisma.user.findFirst({
        where: { name: { equals: body.requester } }
      });
      if (requesterUser?.email) emailTargets.push(requesterUser.email);
    }

    // Observer direct email
    if (body.observer && body.observer.includes('@')) {
      emailTargets.push(body.observer);
    }

    // Admins
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN', email: { not: null } }
    });
    for (const a of admins) {
      if (a.email && !emailTargets.includes(a.email)) emailTargets.push(a.email);
    }

    if (emailTargets.length > 0) {
      await Promise.all(emailTargets.map(email =>
        sendEmailNotification(email, emailSubject, changeNote, htmlBody).catch(e =>
          console.error('[MAIL OS] Erro ao notificar abertura:', e)
        )
      ));
    }

    return NextResponse.json({ success: true, data: newOs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { osId, status, notes, technician, newLog, pendingReason, observer } = body;
    if (!osId) {
      return NextResponse.json({ success: false, error: "Faltando ID da OS" }, { status: 400 });
    }

    const list = readDb();
    const index = list.findIndex((item: any) => item.osId === osId);
    
    if (index === -1) {
      return NextResponse.json({ success: false, error: "OS não encontrada" }, { status: 404 });
    }

    const item = list[index];
    const oldTechnician = item.technician;
    const oldStatus = item.status;

    if (status !== undefined) {
      item.status = status;
      if (status !== 'EM_ESPERA') {
        item.pendingReason = "";
      }
    }
    if (notes !== undefined) item.notes = notes;
    if (technician !== undefined) item.technician = technician;
    if (pendingReason !== undefined) item.pendingReason = pendingReason;
    if (observer !== undefined) item.observer = observer;
    
    if (newLog) {
      if (!item.logs) item.logs = [];
      item.logs.push({
        timestamp: new Date().toISOString(),
        text: newLog
      });
    }

    list[index] = item;
    writeDb(list);

    // ─── Notifications: WhatsApp + E-mail ────────────────────────────────
    try {
      const recipientPhones: string[] = [];
      const recipientEmails: string[] = [];

      // 1. Técnico Atribuído
      if (item.technician) {
        const techUser = await prisma.user.findFirst({
          where: { name: { equals: item.technician } }
        });
        if (techUser?.phone) recipientPhones.push(techUser.phone);
        if (techUser?.email) recipientEmails.push(techUser.email);
      }

      // 2. Supervisores/Admins
      const supervisors = await prisma.user.findMany({
        where: {
          OR: [{ role: 'SUPERVISOR' }, { role: 'ADMIN' }],
        }
      });
      for (const sup of supervisors) {
        if (sup.phone && !recipientPhones.includes(sup.phone)) recipientPhones.push(sup.phone);
        if (sup.email && !recipientEmails.includes(sup.email)) recipientEmails.push(sup.email);
      }

      // 3. Requerente
      if (item.requester) {
        const requesterUser = await prisma.user.findFirst({
          where: { name: { equals: item.requester } }
        });
        if (requesterUser?.email && !recipientEmails.includes(requesterUser.email)) {
          recipientEmails.push(requesterUser.email);
        }
      }

      // 4. Observer (campo de e-mail livre)
      if (item.observer && item.observer.includes('@') && !recipientEmails.includes(item.observer)) {
        recipientEmails.push(item.observer);
      }

      // Build message
      let updateHeader = `*🔄 ATUALIZAÇÃO DA OS: ${item.osId}*`;
      let changeNote = `Atualização registrada na OS ${item.osId}`;
      
      if (technician !== undefined && technician !== oldTechnician) {
        updateHeader = `*📋 OS ATRIBUÍDA: ${item.osId}*`;
        changeNote = `O chamado foi atribuído ao técnico: ${technician || 'Não atribuído'}`;
      } else if (status === 'CONCLUIDA') {
        updateHeader = `*✅ OS SOLUCIONADA: ${item.osId}*`;
        changeNote = `O chamado foi marcado como solucionado`;
      } else if (status && status !== oldStatus) {
        changeNote = `Status atualizado de "${oldStatus}" para "${status}"`;
      } else if (newLog) {
        changeNote = `Novo acompanhamento adicionado ao chamado`;
      }

      // WhatsApp
      if (recipientPhones.length > 0) {
        const waMsgText = `${updateHeader}\n\n` +
          `*Site:* ${item.site}\n` +
          `*Equipamento:* ${item.equipment} (${item.ip})\n` +
          `*Urgência:* ${item.urgency || 'MEDIA'}\n` +
          `*Categoria:* ${item.category || 'Geral'}\n` +
          `*Status:* ${item.status}\n` +
          `*Técnico:* ${item.technician || 'Não atribuído'}\n` +
          `*Requerente:* ${item.requester || '---'}\n` +
          (item.notes ? `\n*✅ Solução:*\n${item.notes}\n` : '') +
          `\n_Notificação automática via Portal NOC._`;

        await Promise.all(
          recipientPhones.map(phone =>
            sendWhatsAppMessage(phone, waMsgText).catch(err =>
              console.error('Erro ao enviar WhatsApp para', phone, err)
            )
          )
        );
      }

      // E-mail
      if (recipientEmails.length > 0) {
        const emailSubject = technician !== undefined && technician !== oldTechnician
          ? `📋 OS Atribuída: ${item.osId} — ${item.site}`
          : status === 'CONCLUIDA'
          ? `✅ OS Solucionada: ${item.osId} — ${item.site}`
          : `🔄 Atualização na OS: ${item.osId} — ${item.site}`;

        const htmlBody = buildEmailHtml(item, emailSubject, changeNote);
        await Promise.all(
          recipientEmails.map(email =>
            sendEmailNotification(email, emailSubject, changeNote, htmlBody).catch(err =>
              console.error('[MAIL OS] Erro ao notificar', email, err)
            )
          )
        );
      }
    } catch (notifErr) {
      console.error('Erro no fluxo de notificação:', notifErr);
    }

    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const osId = searchParams.get('osId');
    if (!osId) {
      return NextResponse.json({ success: false, error: "Faltando ID da OS" }, { status: 400 });
    }

    let list = readDb();
    list = list.filter((item: any) => item.osId !== osId);
    writeDb(list);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
