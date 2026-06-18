import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { sendEmailNotification } from '@/lib/email';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      startDate: startDateStr,
      endDate: endDateStr,
      tariff,
      icmsRate,
      pisCofinsRate,
      lightingFee,
      recipientEmail
    } = body;

    if (!startDateStr || !endDateStr || !recipientEmail) {
      return NextResponse.json(
        { error: 'Os campos startDate, endDate e recipientEmail são obrigatórios.' },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const baseTariff = parseFloat(tariff || '0.738');
    const icmsPct = parseFloat(icmsRate || '18');
    const pisCofinsPct = parseFloat(pisCofinsRate || '9.25');
    const lightingVal = parseFloat(lightingFee || '15.40');

    // 1. Busca dispositivo
    const device = await prisma.kronDevice.findUnique({
      where: { id: params.id },
      include: {
        company: { select: { name: true } }
      }
    });

    if (!device) {
      return NextResponse.json({ error: 'Medidor não encontrado' }, { status: 404 });
    }

    // 2. Busca a primeira leitura válida a partir da data de início
    const startReading = await prisma.kronReading.findFirst({
      where: {
        kronDeviceId: params.id,
        receivedAt: { gte: startDate },
        energyActivePos: { not: null, gt: 0 }
      },
      orderBy: { receivedAt: 'asc' },
      select: { receivedAt: true, energyActivePos: true }
    });

    // 3. Busca a última leitura válida até a data de fim
    const endReading = await prisma.kronReading.findFirst({
      where: {
        kronDeviceId: params.id,
        receivedAt: { lte: endDate },
        energyActivePos: { not: null, gt: 0 }
      },
      orderBy: { receivedAt: 'desc' },
      select: { receivedAt: true, energyActivePos: true }
    });

    let consumptionKwh = 0;
    if (startReading && endReading) {
      consumptionKwh = endReading.energyActivePos - startReading.energyActivePos;
      if (consumptionKwh < 0) consumptionKwh = 0;
    }

    // 4. Cálculos Financeiros
    const activeCost = consumptionKwh * baseTariff;
    const pisCofinsEst = activeCost * (pisCofinsPct / 100);
    const icmsEst = activeCost * (icmsPct / 100);
    const publicLightingEst = consumptionKwh > 0 ? lightingVal : 0;
    const totalCost = activeCost + pisCofinsEst + icmsEst + publicLightingEst;

    // 5. Monta o e-mail HTML da Fatura
    const invoiceNumber = `KRON-${device.serial}-${new Date(endDate).getFullYear()}${String(new Date(endDate).getMonth() + 1).padStart(2, '0')}`;
    const subject = `⚡ Fatura de Consumo de Energia - ${device.name} (${invoiceNumber})`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; text-align: left; color: #ffffff; border-bottom: 4px solid #3b82f6;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td>
                  <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; tracking-tight: -0.5px;">RICAS TECNOLOGIA</h2>
                  <p style="margin: 3px 0 0 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Soluções em Automação & Conectividade</p>
                  <p style="margin: 5px 0 0 0; font-size: 10px; color: #64748b;">CNPJ: 12.345.678/0001-90 | www.ricas.com.br</p>
                </td>
                <td style="text-align: right; vertical-align: top;">
                  <span style="display: inline-block; background-color: rgba(59, 130, 246, 0.2); color: #60a5fa; font-weight: bold; font-size: 10px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; margin-bottom: 8px;">
                    Simulação de Cobrança
                  </span>
                  <div style="font-size: 11px; color: #94a3b8;">Fatura: <strong>#${invoiceNumber}</strong></div>
                  <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Emissão: <strong>${new Date().toLocaleDateString('pt-BR')}</strong></div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Content Body -->
          <div style="padding: 25px;">
            
            <!-- Info Section -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
              <tr>
                <td style="vertical-align: top; padding-right: 15px; width: 50%;">
                  <span style="color: #64748b; font-weight: bold; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 5px;">Destinatário / Unidade</span>
                  <strong style="font-size: 15px; color: #0f172a; display: block; margin-bottom: 2px;">${device.company?.name || 'Ricas Tecnologia — Interno'}</strong>
                  ${device.location ? `<span style="color: #475569;">📍 Localização: ${device.location}</span>` : ''}
                </td>
                <td style="vertical-align: top; text-align: right; width: 50%;">
                  <span style="color: #64748b; font-weight: bold; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 5px;">Dados de Medição Técnica</span>
                  <span style="color: #334155; display: block;">Medidor: <strong>${device.name}</strong></span>
                  <span style="color: #334155; display: block;">Nº de Série: <strong>${device.serial}</strong></span>
                  <span style="color: #334155; display: block;">Período: <strong>${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}</strong></span>
                </td>
              </tr>
            </table>

            <!-- Table Consumo -->
            <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Leituras do Medidor</h4>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; border: 1px solid #e2e8f0;">
              <thead>
                <tr style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: bold;">
                  <th style="padding: 10px; text-align: left;">Grandeza Elétrica</th>
                  <th style="padding: 10px; text-align: right;">Leitura Inicial</th>
                  <th style="padding: 10px; text-align: right;">Leitura Final</th>
                  <th style="padding: 10px; text-align: right;">Consumo Registrado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">⚡ Energia Ativa Positiva</td>
                  <td style="padding: 12px 10px; text-align: right; border-bottom: 1px solid #e2e8f0; font-family: monospace;">
                    ${startReading ? startReading.energyActivePos.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) : '—'} kWh
                    ${startReading ? `<div style="font-size: 9px; color: #94a3b8; font-family: sans-serif;">(${new Date(startReading.receivedAt).toLocaleDateString('pt-BR')})</div>` : ''}
                  </td>
                  <td style="padding: 12px 10px; text-align: right; border-bottom: 1px solid #e2e8f0; font-family: monospace;">
                    ${endReading ? endReading.energyActivePos.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) : '—'} kWh
                    ${endReading ? `<div style="font-size: 9px; color: #94a3b8; font-family: sans-serif;">(${new Date(endReading.receivedAt).toLocaleDateString('pt-BR')})</div>` : ''}
                  </td>
                  <td style="padding: 12px 10px; text-align: right; border-bottom: 1px solid #e2e8f0; font-weight: 800; color: #10b981; font-size: 14px; font-family: monospace;">
                    ${consumptionKwh.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kWh
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Table Financeiro -->
            <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Demonstrativo Financeiro</h4>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; border: 1px solid #e2e8f0;">
              <thead>
                <tr style="background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: bold;">
                  <th style="padding: 10px; text-align: left;">Descrição do Item</th>
                  <th style="padding: 10px; text-align: center;">Base / Alíquota</th>
                  <th style="padding: 10px; text-align: right;">Preço Unitário</th>
                  <th style="padding: 10px; text-align: right;">Valor (R$)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Consumo Ativo de Energia</td>
                  <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">${consumptionKwh.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kWh</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">R$ ${baseTariff.toFixed(4)}</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 600;">R$ ${activeCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">ICMS Adicional Est.</td>
                  <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0; color: #64748b;">${icmsPct}%</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #64748b;">—</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #475569;">R$ ${icmsEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">PIS/COFINS Adicional Est.</td>
                  <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0; color: #64748b;">${pisCofinsPct}%</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #64748b;">—</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #475569;">R$ ${pisCofinsEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Custeio de Iluminação Pública (COSIP)</td>
                  <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0; color: #64748b;">—</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #64748b;">—</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #475569;">R$ ${publicLightingEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                <tr style="background-color: #f8fafc; font-weight: bold; border-top: 2px solid #cbd5e1;">
                  <td colspan="3" style="padding: 15px 10px; text-align: right; font-size: 14px; color: #0f172a;">VALOR TOTAL DA FATURA:</td>
                  <td style="padding: 15px 10px; text-align: right; font-size: 18px; color: #1e3a8a; font-family: monospace; font-weight: 800;">
                    R$ ${totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- PIX Payment Block -->
            <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 60px; text-align: center; vertical-align: middle;">
                    <div style="width: 50px; height: 50px; background-color: #e2e8f0; border-radius: 4px; display: inline-block; font-size: 8px; font-weight: bold; color: #1e3a8a; line-height: 50px; text-align: center;">[PIX QR]</div>
                  </td>
                  <td style="padding-left: 15px; font-size: 12px; color: #334155; line-height: 1.5;">
                    <strong style="color: #0f172a; text-transform: uppercase;">Pagamento Simplificado via PIX</strong><br />
                    Use a chave CNPJ: <strong>12.345.678/0001-90</strong><br />
                    Favorecido: Ricas Tecnologia Ltda.
                  </td>
                </tr>
              </table>
            </div>

            <!-- Notes -->
            <div style="font-size: 11px; color: #64748b; line-height: 1.4; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              <strong>Observação importante:</strong> Este documento representa um demonstrativo de simulação de consumo ativo gerado pelo portal de monitoramento inteligente da Ricas Tecnologia com base nas medições reais coletadas de forma automatizada do medidor IoT.
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            Ricas Tecnologia - Painel de Monitoramento IoT & Alarmes. Mensagem automática.
          </div>
          
        </div>
      </div>
    `;

    // Envia o email usando o motor de emails configurado
    const emailSent = await sendEmailNotification(recipientEmail, subject, `Fatura de Energia - Consumo Registrado: ${consumptionKwh.toFixed(1)} kWh, Total: R$ ${totalCost.toFixed(2)}`, htmlBody);

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: `Fatura enviada com sucesso para ${recipientEmail}!`
      });
    } else {
      return NextResponse.json({ error: 'O motor de e-mail não conseguiu processar o envio.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Erro ao enviar fatura por e-mail:', error);
    return NextResponse.json({ error: `Erro interno ao enviar fatura: ${error.message}` }, { status: 500 });
  }
}
