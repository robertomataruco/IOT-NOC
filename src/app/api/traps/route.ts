import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseZabbixTrap } from '@/lib/trapParser';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { sendEmailNotification } from '@/lib/email';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trapText } = body;

    console.log("-----------------------------------------");
    console.log("[TRAP RECEBIDA]");
    console.log("Conteúdo:", trapText);
    console.log("-----------------------------------------");

    if (!trapText) {
      return NextResponse.json({ success: false, error: 'trapText is required' }, { status: 400 });
    }

    // --- INTERCEPTOR DE TRAPS DE LINKUP/LINKDOWN DO MIKROTIK CENTRAL ---
    if (trapText.includes("192.168.67.254")) {
      const isLinkUp = trapText.includes("1.3.6.1.6.3.1.1.5.4");
      const isLinkDown = trapText.includes("1.3.6.1.6.3.1.1.5.3");
      
      if (isLinkUp || isLinkDown) {
        console.log(`[VPN-TRAP] Trap de link recebida do Mikrotik Central. Tipo: ${isLinkUp ? 'linkUp' : 'linkDown'}`);
        
        // Mapear OID 1.3.6.1.2.1.2.2.1.2.X (nome da interface)
        const ifDescrRegex = /1\.3\.6\.1\.2\.1\.2\.2\.1\.2\.\d+\s*=\s*(?:String|.*?):\s*(.*)/i;
        const match = trapText.match(ifDescrRegex);
        
        if (match) {
          let ifName = match[1].trim();
          ifName = ifName.replace(/^["<]|["<>]$/g, '').toLowerCase().trim();
          console.log(`[VPN-TRAP] Nome da interface resolvido na trap: "${ifName}"`);

          const devices = await prisma.device.findMany({
            where: { active: true, vpnUsername: { not: null } }
          });

          for (const device of devices) {
            const vpnUser = device.vpnUsername!.toLowerCase().trim();
            if (ifName === vpnUser || ifName === `sstp-${vpnUser}` || ifName.includes(vpnUser)) {
              console.log(`[VPN-TRAP] ✅ Correspondência encontrada! Aparelho: ${device.name}`);
              
              // Tentar extrair IP da VPN que possa vir no trapText
              let assignedIp: string | null = null;
              const ipRegex = /192\.168\.67\.(\d+)/g;
              let ipMatch;
              while ((ipMatch = ipRegex.exec(trapText)) !== null) {
                const foundIp = ipMatch[0];
                if (foundIp !== "192.168.67.254") {
                  assignedIp = foundIp;
                }
              }

              await prisma.device.update({
                where: { id: device.id },
                data: {
                  vpnStatus: isLinkUp ? "ONLINE" : "OFFLINE",
                  vpnIp: isLinkUp ? (assignedIp || device.vpnIp) : null,
                  vpnLastSeen: isLinkUp ? new Date() : device.vpnLastSeen
                }
              });
              console.log(`[VPN-TRAP] Dispositivo ${device.name} atualizado via Trap para ${isLinkUp ? 'ONLINE' : 'OFFLINE'}`);
            }
          }
        }
        return NextResponse.json({ success: true, message: "VPN Trap processed in real-time" });
      }
    }

    // 1. Processar o trap
    const processed = parseZabbixTrap(trapText);
    if (!processed) {
      console.warn("[API] Falha ao processar texto da trap. Verifique o formato.");
      return NextResponse.json({ success: false, error: 'Failed to parse trap' }, { status: 422 });
    }


    // 2. Tentar encontrar o Dispositivo pelo Serial (mais preciso) ou IP/VPN
    let deviceId = null;
    let targetDevice = null;
    
    if (processed.deviceSerial) {
      targetDevice = await prisma.device.findUnique({
        where: { serial: processed.deviceSerial }
      });
      if (targetDevice) {
        deviceId = targetDevice.id;
        console.log(`[TRAP] Dispositivo encontrado via Serial: ${targetDevice.name}`);
      }
    }

    if (!deviceId && processed.senderIp) {
      // Tentar por IP de gerência (LAN)
      targetDevice = await prisma.device.findUnique({
        where: { ip: processed.senderIp }
      });
      if (targetDevice) {
        deviceId = targetDevice.id;
        console.log(`[TRAP] Dispositivo encontrado via IP LAN: ${targetDevice.name}`);
      } else {
        // Tentar por IP da VPN
        targetDevice = await prisma.device.findFirst({
          where: { vpnIp: processed.senderIp }
        });
        if (targetDevice) {
          deviceId = targetDevice.id;
          console.log(`[TRAP] Dispositivo encontrado via IP VPN: ${targetDevice.name}`);
        }
      }
    }

    // Se o dispositivo foi localizado mas está desativado (active === false), ignoramos a trap inteira!
    if (targetDevice && targetDevice.active === false) {
      console.log(`[TRAP] Trap descartada. Dispositivo "${targetDevice.name}" está DESATIVADO no painel.`);
      return NextResponse.json({ success: true, message: "Device is disabled. Trap discarded." });
    }

    // Definir flags de set/clear ANTES do if/else para ficarem disponíveis em todo o escopo
    const isSetTrap = processed.rawFields?.["13"] === "1";
    const isClearTrap = processed.rawFields?.["13"] === "0";

    // Heartbeat (OID .422): sempre ignorar histórico, só atualizar lastSeen se device encontrado
    if (processed.oid === "1.2.422" || processed.oid?.endsWith(".422")) {
      if (deviceId) {
        await prisma.device.update({
          where: { id: deviceId },
          data: { lastSeen: new Date() }
        });
      }
      console.log(`[TRAP] Heartbeat recebido de ${processed.deviceSerial || processed.senderIp} (ignorando histórico)`);
      return NextResponse.json({ success: true, message: "Heartbeat registered" });
    }

    if (!deviceId) {
      console.warn(`[TRAP] ATENÇÃO: Nenhum dispositivo cadastrado com Serial "${processed.deviceSerial}" ou IP "${processed.senderIp}". Trap salva sem associação.`);
    } else {
      // Atualizar o status do dispositivo
      await prisma.device.update({
        where: { id: deviceId },
        data: { 
          lastSeen: new Date(),
          ...(isSetTrap ? { hasAlarm: true } : {}),
          ...(isClearTrap ? { hasAlarm: false } : {})
        }
      });
      console.log(`[STATUS] Dispositivo "${deviceId}" atualizado. Alarme Ativo: ${isSetTrap}, Clear: ${isClearTrap}`);
    }

    // Se for uma trap de CLEAR (campo 13 === "0"), limpamos os registros anteriores desse mesmo alarme
    if (isClearTrap) {
      if (deviceId) {
        await prisma.trap.updateMany({
          where: {
            deviceId: deviceId,
            alarmName: processed.name,
            isCleared: false
          },
          data: {
            isCleared: true
          }
        });
      } else if (processed.deviceSerial) {
        await prisma.trap.updateMany({
          where: {
            deviceSerial: processed.deviceSerial,
            alarmName: processed.name,
            isCleared: false
          },
          data: {
            isCleared: true
          }
        });
      }
    }

    // 5. Salvar no banco de dados
    const trap = await prisma.trap.create({
      data: {
        deviceId:     deviceId,
        deviceSerial: processed.deviceSerial,
        ctrlName:     processed.ctrlName,
        severity:     processed.severity,
        oid:          processed.oid,
        alarmName:    processed.name,
        description:  processed.description,
        fullText:     processed.fullText,
        timestamp:    processed.timestamp ? new Date(processed.timestamp.replace(/-/g, '/')) : new Date(),
        isCleared:    isClearTrap ? true : false,
      }
    });

    // 6. Lógica de Notificação com Deduplicação de 24h
    // Só notifica se for alarme de ATIVAÇÃO (campo 13 = "1") e device identificado
    if (isSetTrap && deviceId) {
      const NOTIF_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 horas
      const agora = new Date();

      // Buscar o último trap que foi notificado para este device e mesmo alarme
      const ultimoTrapNotificado = await prisma.trap.findFirst({
        where: {
          deviceId:  deviceId,
          alarmName: processed.name,
          lastNotifiedAt: { not: null },
          // Excluir o trap que acabamos de criar
          id: { not: trap.id }
        },
        orderBy: { lastNotifiedAt: 'desc' }
      });

      // Decidir se deve notificar:
      // - Sem trap anterior notificado → ALARME NOVO → notificar agora
      // - Com trap anterior notificado há < 24h → SILENCIOSO (evitar spam)
      // - Com trap anterior notificado há >= 24h → notificar (lembrete ou nova ocorrência)
      let deveNotificar = false;
      let isLembrete = false;

      if (!ultimoTrapNotificado) {
        // Primeiro alerta deste alarme para este device
        deveNotificar = true;
        isLembrete = false;
        console.log(`[NOTIF] 🆕 Alarme NOVO (nunca notificado antes): "${processed.name}" em ${deviceId} → notificando`);
      } else {
        const diffMs = agora.getTime() - ultimoTrapNotificado.lastNotifiedAt!.getTime();
        if (diffMs >= NOTIF_INTERVAL_MS) {
          deveNotificar = true;
          // Se o trap anterior ainda não foi limpo, é um lembrete (lembrete de alarme persistente)
          const temTrapAtivo = await prisma.trap.findFirst({
            where: {
              deviceId: deviceId,
              alarmName: processed.name,
              isCleared: false,
              id: { not: trap.id }
            }
          });
          isLembrete = !!temTrapAtivo;
          console.log(`[NOTIF] ⏰ Reenvio após 24h: "${processed.name}" em ${deviceId} (Lembrete: ${isLembrete}) → notificando`);
        } else {
          // Mesmo alarme, notificado há menos de 24h → silencioso
          const horasRestantes = Math.ceil((NOTIF_INTERVAL_MS - diffMs) / (1000 * 60 * 60));
          console.log(`[NOTIF] 🔇 Alarme repetido silenciado (limite 24h): "${processed.name}" — próximo reenvio em ~${horasRestantes}h`);
        }
      }

      if (deveNotificar) {
        // Atualizar lastNotifiedAt no trap atual
        await prisma.trap.update({
          where: { id: trap.id },
          data: { lastNotifiedAt: agora }
        });

        // Se for lembrete, também atualizar o trap ativo anterior para evitar double-notif
        if (isLembrete && ultimoTrapNotificado) {
          await prisma.trap.update({
            where: { id: ultimoTrapNotificado.id },
            data: { lastNotifiedAt: agora }
          });
        }

        const device = await prisma.device.findUnique({
          where: { id: deviceId },
          include: { city: true }
        });

        if (device && device.city) {
          const targetUsers = await prisma.user.findMany({
            where: {
              OR: [
                { role: 'ADMIN' },
                { role: 'SUPERVISOR' },
                { access: { some: { cityId: device.cityId } } }
              ]
            }
          });

          if (targetUsers.length > 0) {
            const emoji = processed.severity >= 2 ? "🚨" : "⚠️";
            const prefixo = isLembrete ? `*⏰ LEMBRETE (alarme persistente):*\n` : "";
            const message = `${prefixo}*${emoji} ALARME: ${processed.name}*\n\n*Equipamento:* ${device.name}\n*Site:* ${device.city.name}\n*Ocorrência:* ${processed.description}${isLembrete ? '\n\n_Este alarme está ativo há mais de 24h sem resolução._' : ''}\n\n_Verifique o painel para mais detalhes._`;

            // WhatsApp
            const phoneUsers = targetUsers.filter(u => u.phone && u.phone.trim() !== "");
            if (phoneUsers.length > 0) {
              Promise.all(phoneUsers.map(u => sendWhatsAppMessage(u.phone!, message)))
                .catch(err => console.error('Erro WhatsApp (trap):', err));
            }

            // E-mail
            const emailUsers = targetUsers.filter(u => u.email && u.email.trim() !== "" && (u.role === 'ADMIN' || u.role === 'SUPERVISOR' || u.username === 'roberto.mataruco'));
            if (emailUsers.length > 0) {
              const emailSubject = `${isLembrete ? '⏰ LEMBRETE - ' : ''}${emoji} ALERTA RICASTEC: ${processed.name} - ${device.name}`;
              const emailText = `${isLembrete ? 'LEMBRETE — ALARME PERSISTENTE\n\nEste alarme está ativo há mais de 24h sem resolução.\n\n' : 'NOVO ALARME DETECTADO\n\n'}Equipamento: ${device.name}\nSite: ${device.city.name}\nSeveridade: ${processed.severity}\nOcorrência: ${processed.description}\nData/Hora: ${new Date().toLocaleString('pt-BR')}`;

              const emailHtml = `
                <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
                  <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px; margin-top: 0;">${isLembrete ? '⏰ LEMBRETE — ALARME PERSISTENTE' : `${emoji} NOVO ALARME DETECTADO`}</h2>
                  ${isLembrete ? '<p style="color: #f59e0b; font-weight: bold;">⚠️ Este alarme está ativo há mais de 24 horas sem resolução.</p>' : '<p style="color: #cbd5e1;">Um evento de alarme foi registrado no sistema.</p>'}
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; color: #94a3b8; width: 150px;">Equipamento</td><td style="padding: 10px; color: #ffffff;">${device.name}</td></tr>
                    <tr><td style="padding: 10px; font-weight: bold; color: #94a3b8;">Site</td><td style="padding: 10px; color: #ffffff;">${device.city.name}</td></tr>
                    <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; color: #94a3b8;">Severidade</td><td style="padding: 10px; color: #f59e0b;">${processed.severity}</td></tr>
                    <tr><td style="padding: 10px; font-weight: bold; color: #94a3b8;">Ocorrência</td><td style="padding: 10px; color: #ef4444; font-weight: bold;">${processed.description}</td></tr>
                    <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; color: #94a3b8;">Data/Hora</td><td style="padding: 10px; color: #ffffff;">${new Date().toLocaleString('pt-BR')}</td></tr>
                  </table>
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="http://192.168.67.94:3005" style="background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Acessar Dashboard</a>
                  </div>
                  <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 15px;">Sistema de Alertas Automáticos - Ricas Tecnologia</p>
                </div>
              `;

              Promise.all(emailUsers.map(u => sendEmailNotification(u.email!, emailSubject, emailText, emailHtml)))
                .catch(err => console.error('Erro Email (trap):', err));
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, data: trap });
  } catch (error: any) {
    console.error('Error receiving trap:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  }
}

// Opcional: GET para listar traps
import trapMappings from '@/lib/trapMappings.json';

function parseTrapFields(fullText: string) {
  const fields: Record<string, string> = {};
  const fieldRegex = /(?:enterprises|1\.3\.6\.1\.4\.1)\.15921\.60\.1\.1\.(\d+)\s*=\s*.*?: (.*?)(?:$|,|\r|\n)/g;
  let match;
  while ((match = fieldRegex.exec(fullText)) !== null) {
    const fieldId = match[1];
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    fields[fieldId] = value;
  }
  return fields;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isAdmin = user?.role === 'ADMIN';

  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get('deviceId');
    const cityId = searchParams.get('cityId');

    const whereClause: any = {};

    let deviceSerial = null;
    if (deviceId) {
      const dev = await prisma.device.findUnique({
        where: { id: deviceId },
        select: { serial: true }
      });
      deviceSerial = dev?.serial;
    }

    if (isAdmin) {
      if (deviceId) {
        whereClause.OR = [
          { deviceId: deviceId },
          ...(deviceSerial ? [{ deviceSerial: deviceSerial }] : [])
        ];
      } else if (cityId) {
        whereClause.device = { cityId };
      }
    } else {
      const companyId = user?.companyId || 'non-existent';
      whereClause.device = { companyId };
      if (deviceId) {
        whereClause.OR = [
          { deviceId: deviceId },
          ...(deviceSerial ? [{ deviceSerial: deviceSerial }] : [])
        ];
      } else if (cityId) {
        whereClause.device.cityId = cityId;
      }
    }

    const traps = await prisma.trap.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: { device: { include: { city: { include: { state: true } } } } }
    });

    // Enriquecer traps com Causa Provável, Resolução Recomendada e Localização detalhada
    const enriched = traps.map((trap: any) => {
      const parts = trap.oid.split('.');
      const trapId = parts[parts.length - 1];
      const mapping = (trapMappings.traps as any)[trapId];
      
      const rawFields = parseTrapFields(trap.fullText);
      const moduleName = rawFields["8"] || "Módulo Geral";
      const channelId = rawFields["10"] || "N/A";
      const channelDesc = rawFields["11"] || "";
      const bandId = rawFields["12"] || "Geral";

      return {
        ...trap,
        probableCause: mapping?.probableCause || 'Causa indeterminada.',
        handleMeasures: mapping?.handleMeasures || 'Verificar conexões físicas do equipamento.',
        locationDetails: {
          moduleName,
          channelId,
          channelDesc,
          bandId
        }
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get('deviceId');

    if (!deviceId) {
      return NextResponse.json({ success: false, error: 'deviceId is required' }, { status: 400 });
    }

    const dev = await prisma.device.findUnique({
      where: { id: deviceId },
      select: { serial: true }
    });
    const deviceSerial = dev?.serial;

    await prisma.trap.deleteMany({
      where: {
        OR: [
          { deviceId: deviceId },
          ...(deviceSerial ? [{ deviceSerial: deviceSerial }] : [])
        ]
      }
    });

    // Also update device's hasAlarm status
    await prisma.device.update({
      where: { id: deviceId },
      data: { hasAlarm: false }
    });

    return NextResponse.json({ success: true, message: "Traps history cleared successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

