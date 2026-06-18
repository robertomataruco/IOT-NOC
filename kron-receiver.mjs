/**
 * kron-receiver.mjs
 * ─────────────────────────────────────────────────────────────
 * Serviço MQTT Subscriber para o Medidor KRON KS-3000
 * Recebe as medições via MQTT e salva no banco SQLite (Prisma)
 *
 * Topico MQTT esperado (configurar no RedeMB TCP do KRON):
 *   kron/+/data  →  ex: kron/CP01/data
 *
 * Payload JSON esperado do KS-3000:
 * {
 *   "Va": 220.5,  "Vb": 219.8,  "Vc": 221.0,   ← Tensão trifásica
 *   "I1": 12.3,   "I2": 11.9,   "I3": 12.1,    ← Correntes
 *   "Ptot": 7.5,                                 ← Potência ativa total
 *   "FP1": 0.97,  "FP2": 0.96,  "FP3": 0.97,   ← Fatores de potência
 *   "EA+": 1234.56,                              ← Energia ativa positiva
 *   "EA-": 0.12                                  ← Energia ativa negativa
 * }
 * ─────────────────────────────────────────────────────────────
 */

import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

// ─── Configuração MQTT ────────────────────────────────────────
const BROKER_URL  = process.env.MQTT_BROKER  || 'mqtt://localhost:1883';
const TOPIC_WILDCARD = process.env.KRON_TOPIC || 'kron/+/data';

console.log('');
console.log('╔══════════════════════════════════════════╗');
console.log('║   ⚡ KRON Receiver — KS-3000 via MQTT    ║');
console.log('╚══════════════════════════════════════════╝');
console.log(`  Broker  : ${BROKER_URL}`);
console.log(`  Tópico  : ${TOPIC_WILDCARD}`);
console.log('');

// ─── Conexão ao broker MQTT ───────────────────────────────────
const client = mqtt.connect(BROKER_URL, {
  clientId: `ricas-kron-receiver-${Date.now()}`,
  reconnectPeriod: 5000,
  connectTimeout: 10000,
});

client.on('connect', () => {
  console.log(`[✅] Conectado ao broker MQTT: ${BROKER_URL}`);
  client.subscribe(TOPIC_WILDCARD, { qos: 1 }, (err) => {
    if (err) {
      console.error(`[❌] Erro ao subscrever tópico: ${err.message}`);
    } else {
      console.log(`[📡] Subscrito no tópico: ${TOPIC_WILDCARD}`);
      console.log('');
    }
  });
});

client.on('reconnect', () => {
  console.log('[🔄] Reconectando ao broker MQTT...');
});

client.on('error', (err) => {
  console.error(`[❌] Erro MQTT: ${err.message}`);
});

// ─── Processamento de mensagens ───────────────────────────────
client.on('message', async (topic, buffer) => {
  const raw = buffer.toString();
  console.log(`[📨] Mensagem recebida | Tópico: ${topic}`);
  const parts = topic.split('/');

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    console.error(`[⚠️]  Payload inválido (não é JSON): ${raw.substring(0, 100)}`);
    return;
  }

  // ─── Desempacota o Payload do KRON ──────────────────────────
  // Trata caso em que o payload vem como array [ { variable, metadata: { ... } } ]
  const dataObj = Array.isArray(payload) ? payload[0] : payload;
  const data = (dataObj && typeof dataObj === 'object' && dataObj.metadata) ? dataObj.metadata : dataObj;

  // ─── Extrai o serial de identificação ───────────────────────
  // Prioridade 1: campo "serial"/SN no payload/metadata
  // Prioridade 2: segundo segmento do tópico (kron/{serial}/data)
  const serialFromPayload = findValue(data, 'serial', 'SN', 'sn', 'deviceId');
  const serialFromTopic   = parts.length >= 2 ? parts[1] : null;
  const serial = serialFromPayload ?? serialFromTopic;

  if (!serial) {
    console.warn(`[⚠️]  Não foi possível extrair o serial do tópico "${topic}" nem do payload`);
    return;
  }

  try {
    // Busca o medidor cadastrado pelo número de série
    const kronDevice = await prisma.kronDevice.findUnique({
      where: { serial: String(serial) },
    });

    if (!kronDevice) {
      console.warn(`[⚠️]  Medidor com serial "${serial}" não cadastrado no sistema`);
      console.warn(`      Tópico recebido: ${topic}`);
      console.warn(`      Cadastre em: /admin/kron`);
      return;
    }

    if (!kronDevice.active) {
      console.log(`[⏭️]  Medidor serial "${serial}" está INATIVO — ignorando`);
      return;
    }

    // ─── Tratamentos Especiais das Grandezas ──────────────────
    // 1. Potência Ativa (Auto-sensing Watts para kW)
    let activePower = toFloat(findValue(data, 'Ptot', 'ptot', 'P', 'P3F', 'Ptotal', 'P_tot', 'ActivePower', 'P0'));
    if (activePower !== null && activePower > 50) {
      // Se > 50, com certeza está em Watts (W) e não em kW. Converte para kW.
      activePower = activePower / 1000;
    }

    // 2. Tensão Trifásica (Se houver apenas U0, mapeia como tensão principal da Fase A)
    const voltA = toFloat(findValue(data, 'Va', 'VA', 'V1', 'Vfn1', 'U1', 'Ua', 'UA', 'U_L1', 'V_L1', 'U0'));
    const voltB = toFloat(findValue(data, 'Vb', 'VB', 'V2', 'Vfn2', 'U2', 'Ub', 'UB', 'U_L2', 'V_L2'));
    const voltC = toFloat(findValue(data, 'Vc', 'VC', 'V3', 'Vfn3', 'U3', 'Uc', 'UC', 'U_L3', 'V_L3'));

    // ─── Mapeamento das chaves do KS-3000 para o banco ───────
    const reading = await prisma.kronReading.create({
      data: {
        kronDeviceId: kronDevice.id,
        // Tensões
        voltageA: voltA,
        voltageB: voltB,
        voltageC: voltC,
        // Correntes
        currentI1: toFloat(findValue(data, 'I1', 'Ia', 'IA', 'I_L1')),
        currentI2: toFloat(findValue(data, 'I2', 'Ib', 'IB', 'I_L2')),
        currentI3: toFloat(findValue(data, 'I3', 'Ic', 'IC', 'I_L3')),
        // Potência
        activePowerTotal: activePower,
        // Fatores de potência
        powerFactor1: toFloat(findValue(data, 'FP1', 'fp1', 'PF1', 'pf1', 'FP_L1')),
        powerFactor2: toFloat(findValue(data, 'FP2', 'fp2', 'PF2', 'pf2', 'FP_L2')),
        powerFactor3: toFloat(findValue(data, 'FP3', 'fp3', 'PF3', 'pf3', 'FP_L3')),
        // Energia
        energyActivePos: toFloat(findValue(data, 'EA+', 'EApos', 'kWh+', 'EA', 'kWh', 'ActiveEnergy')),
        energyActiveNeg: toFloat(findValue(data, 'EA-', 'EAneg', 'kWh-', 'EAN', 'ean')),
        // Salva payload bruto para debug
        rawPayload: raw.substring(0, 2000),
      },
    });

    // Log resumido
    const va = reading.voltageA?.toFixed(1) ?? '-';
    const i1 = reading.currentI1?.toFixed(2) ?? '-';
    const p  = reading.activePowerTotal?.toFixed(3) ?? '-';
    const fp = reading.powerFactor1?.toFixed(3) ?? '-';
    const ea = reading.energyActivePos?.toFixed(2) ?? '-';
    console.log(`  [💾] ${kronDevice.name}`);
    console.log(`       Va=${va}V  I1=${i1}A  Ptot=${p}kW  FP1=${fp}  EA+=${ea}kWh`);

  } catch (err) {
    console.error(`[❌] Erro ao salvar leitura no banco: ${err.message}`);
  }
});

// ─── Utilitários ──────────────────────────────────────────────
function findValue(payload, ...possibleKeys) {
  // 1. Busca exata (preserva maiúsculas/minúsculas)
  for (const k of possibleKeys) {
    if (payload[k] !== undefined && payload[k] !== null && payload[k] !== '') {
      return payload[k];
    }
  }

  // 2. Busca case-insensitive
  const lowerKeys = possibleKeys.map(k => k.toLowerCase());
  for (const key in payload) {
    if (lowerKeys.includes(key.toLowerCase())) {
      if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
        return payload[key];
      }
    }
  }
  return null;
}

function toFloat(val) {
  if (val === undefined || val === null || val === '') return null;
  if (typeof val === 'number') return val;
  
  let s = String(val).trim();
  // Remove sufixos comuns de unidades (ex: V, A, kW, kWh, VAr, VA, Hz, W)
  s = s.replace(/[a-zA-Z%+\-\s]+$/, '');
  
  // Trata formato brasileiro/europeu (ex: "1.234,56" ou "120,95")
  if (s.includes(',') && s.includes('.')) {
    if (s.indexOf('.') < s.indexOf(',')) {
      s = s.replace(/\./g, '').replace(/,/g, '.'); // 1.234,56 -> 1234.56
    } else {
      s = s.replace(/,/g, ''); // 1,234.56 -> 1234.56
    }
  } else if (s.includes(',')) {
    s = s.replace(/,/g, '.'); // 120,95 -> 120.95
  }
  
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

// ─── Limpeza de leituras antigas (mantém 30 dias) ────────────
async function cleanOldReadings() {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    const deleted = await prisma.kronReading.deleteMany({
      where: { receivedAt: { lt: cutoff } },
    });
    if (deleted.count > 0) {
      console.log(`[🧹] Limpeza: ${deleted.count} leituras antigas removidas (>30 dias)`);
    }
  } catch (err) {
    console.error(`[⚠️]  Erro na limpeza: ${err.message}`);
  }
}

// Roda limpeza uma vez por dia
setInterval(cleanOldReadings, 24 * 60 * 60 * 1000);

// ─── Faturamento Mensal Automático (Dia 5 de cada Mês) ────────
async function checkAndSendMonthlyBills() {
  try {
    const today = new Date();
    // Apenas executa a partir do dia 5 de cada mês
    if (today.getDate() < 5) return;

    // Determina o mês anterior (mês de referência do faturamento)
    let targetYear = today.getFullYear();
    let targetMonth = today.getMonth() - 1; // 0-indexed (Janeiro=0, Dezembro=11)
    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    }

    // Tracker para evitar disparos duplicados no mesmo mês
    const trackerPath = join(__dirname, 'src', 'lib', 'lastBillingMonth.json');
    let tracker = { lastSentYear: 0, lastSentMonth: -1 };
    
    if (fs.existsSync(trackerPath)) {
      try {
        tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
      } catch (e) {
        console.error('[⚠️]  Erro ao ler lastBillingMonth.json:', e.message);
      }
    }

    if (tracker.lastSentYear === targetYear && tracker.lastSentMonth === targetMonth) {
      // Já enviado para o mês de referência
      return;
    }

    console.log(`[⚡] Iniciando fechamento mensal automático de energia para o mês de referência ${targetMonth + 1}/${targetYear}...`);

    // Busca as credenciais SMTP salvas no arquivo
    const smtpPath = join(__dirname, 'src', 'lib', 'smtpConfig.json');
    if (!fs.existsSync(smtpPath)) {
      console.warn('[⚠️]  Configurações de SMTP ausentes. Impossível enviar faturas por e-mail.');
      return;
    }

    let smtpConfig;
    try {
      smtpConfig = JSON.parse(fs.readFileSync(smtpPath, 'utf8'));
    } catch (e) {
      console.error('[❌] Erro ao carregar smtpConfig.json:', e.message);
      return;
    }

    if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.pass) {
      console.warn('[⚠️]  SMTP não está totalmente configurado. Abortando envio.');
      return;
    }

    // Período de apuração (1º ao último dia do mês anterior)
    const startOfMonth = new Date(targetYear, targetMonth, 1, 0, 0, 0);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    // Lista medidores de energia ativos
    const devices = await prisma.kronDevice.findMany({
      where: { active: true },
      include: {
        company: {
          include: {
            users: true
          }
        },
        city: {
          include: {
            state: true
          }
        }
      }
    });

    if (devices.length === 0) {
      console.log('[⏭️]  Nenhum medidor KRON ativo encontrado.');
      return;
    }

    // Configura o transportador SMTP do nodemailer
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: parseInt(smtpConfig.port || '465'),
      secure: smtpConfig.secure !== false,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let sentCount = 0;

    for (const dev of devices) {
      // 1. Busca a primeira leitura válida do mês anterior
      const startReading = await prisma.kronReading.findFirst({
        where: {
          kronDeviceId: dev.id,
          receivedAt: { gte: startOfMonth },
          energyActivePos: { not: null, gt: 0 }
        },
        orderBy: { receivedAt: 'asc' },
        select: { receivedAt: true, energyActivePos: true }
      });

      // 2. Busca a última leitura válida do mês anterior
      const endReading = await prisma.kronReading.findFirst({
        where: {
          kronDeviceId: dev.id,
          receivedAt: { lte: endOfMonth },
          energyActivePos: { not: null, gt: 0 }
        },
        orderBy: { receivedAt: 'desc' },
        select: { receivedAt: true, energyActivePos: true }
      });

      if (!startReading || !endReading) {
        console.log(`[⏭️]  Medidor "${dev.name}" sem leituras suficientes para o período.`);
        continue;
      }

      let consumptionKwh = endReading.energyActivePos - startReading.energyActivePos;
      if (consumptionKwh < 0) consumptionKwh = 0;

      if (consumptionKwh === 0) {
        console.log(`[⏭️]  Medidor "${dev.name}" registrou consumo nulo (0 kWh) no período.`);
        continue;
      }

      // Cálculos financeiros base (Tarifa CPFL/ENEL média comercial: 0.85 R$/kWh)
      const baseTariff = 0.85;
      const activeCost = consumptionKwh * baseTariff;
      const pisCofinsEst = activeCost * 0.0925;
      const icmsEst = activeCost * 0.18;
      const publicLightingEst = 15.40;
      const totalCost = activeCost + pisCofinsEst + icmsEst + publicLightingEst;

      // Lista de destinatários do e-mail
      const recipients = [];
      
      // Adiciona todos os usuários da empresa vinculada ao medidor
      if (dev.company?.users) {
        for (const u of dev.company.users) {
          if (u.email && u.email.trim() !== '') {
            recipients.push(u.email.trim());
          }
        }
      }

      // Adiciona também administradores e supervisores para auditoria/cópia
      const adminsAndSupervisors = await prisma.user.findMany({
        where: {
          role: { in: ['ADMIN', 'SUPERVISOR'] }
        },
        select: { email: true }
      });

      for (const u of adminsAndSupervisors) {
        if (u.email && u.email.trim() !== '' && !recipients.includes(u.email.trim())) {
          recipients.push(u.email.trim());
        }
      }

      if (recipients.length === 0) {
        console.warn(`[⚠️]  Nenhum destinatário com e-mail cadastrado para receber a fatura do medidor "${dev.name}".`);
        continue;
      }

      // Formatação de datas e valores
      const billingMonthStr = `${String(targetMonth + 1).padStart(2, '0')}/${targetYear}`;
      const monthsBr = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const nextMonthStr = monthsBr[today.getMonth()]; // Mês do vencimento (mês atual)

      const startVal = startReading.energyActivePos.toFixed(2);
      const endVal = endReading.energyActivePos.toFixed(2);
      const consumptionKwhStr = consumptionKwh.toFixed(2);
      const activeCostStr = activeCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const icmsEstStr = icmsEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const pisCofinsEstStr = pisCofinsEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const publicLightingEstStr = publicLightingEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const totalCostStr = totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const totalCostPix = totalCost.toFixed(2);

      const startDateStr = new Date(startReading.receivedAt).toLocaleDateString('pt-BR');
      const endDateStr = new Date(endReading.receivedAt).toLocaleDateString('pt-BR');
      
      const companyName = dev.company?.name || 'Cliente Corporativo';
      const deviceName = dev.name;
      const deviceSerial = dev.serial;
      const locationStr = dev.location || (dev.city ? `${dev.city.name} (${dev.city.state.uf})` : 'Planta Central');

      // Gera o template HTML premium da fatura
      const htmlInvoice = `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 40px 30px; max-width: 700px; margin: 0 auto; border: 1px solid #1e293b; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Top Invoice Header -->
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 25px;">
            <div>
              <h1 style="color: #3b82f6; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.05em;">RICAS ENERGIA</h1>
              <p style="font-size: 11px; color: #64748b; margin: 5px 0 0 0; font-family: monospace;">Fatura de Consumo de Energia Elétrica</p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 10px; font-weight: bold; background-color: rgba(59,130,246,0.1); color: #3b82f6; border: 1px solid rgba(59,130,246,0.2); padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">FATURA COMERCIAL</span>
              <p style="font-size: 12px; color: #94a3b8; margin: 8px 0 0 0;">Mês de Referência: <strong>${billingMonthStr}</strong></p>
            </div>
          </div>

          <!-- Client and Sender Details -->
          <div style="margin-bottom: 30px;">
            <div style="width: 48%; float: left; background-color: #111827; padding: 15px; border-radius: 12px; border: 1px solid #1e293b; box-sizing: border-box;">
              <h3 style="font-size: 11px; text-transform: uppercase; color: #64748b; margin: 0 0 10px 0; letter-spacing: 0.1em;">Emissor</h3>
              <p style="font-size: 13px; font-weight: bold; color: #ffffff; margin: 0 0 4px 0;">Ricas Tecnologia Ltda</p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">CNPJ: 12.345.678/0001-90</p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">São Paulo - SP</p>
            </div>
            <div style="width: 48%; float: right; background-color: #111827; padding: 15px; border-radius: 12px; border: 1px solid #1e293b; box-sizing: border-box;">
              <h3 style="font-size: 11px; text-transform: uppercase; color: #64748b; margin: 0 0 10px 0; letter-spacing: 0.1em;">Destinatário</h3>
              <p style="font-size: 13px; font-weight: bold; color: #ffffff; margin: 0 0 4px 0;">${companyName}</p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">Medidor: ${deviceName} (${deviceSerial})</p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">Localização: ${locationStr}</p>
            </div>
            <div style="clear: both;"></div>
          </div>

          <!-- Readings Table -->
          <h3 style="font-size: 12px; text-transform: uppercase; color: #3b82f6; margin: 20px 0 10px 0; letter-spacing: 0.05em;">Leituras e Consumo</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 12px;">
            <thead>
              <tr style="background-color: #1e293b; color: #94a3b8; border-bottom: 1px solid #334155;">
                <th style="padding: 10px; text-align: left;">Descrição</th>
                <th style="padding: 10px; text-align: center;">Data da Leitura</th>
                <th style="padding: 10px; text-align: right;">Leitura Acumulada</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 10px; color: #cbd5e1;">Leitura Inicial</td>
                <td style="padding: 10px; text-align: center; color: #cbd5e1;">${startDateStr}</td>
                <td style="padding: 10px; text-align: right; color: #ffffff; font-family: monospace;">${startVal} kWh</td>
              </tr>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 10px; color: #cbd5e1;">Leitura Final</td>
                <td style="padding: 10px; text-align: center; color: #cbd5e1;">${endDateStr}</td>
                <td style="padding: 10px; text-align: right; color: #ffffff; font-family: monospace;">${endVal} kWh</td>
              </tr>
              <tr style="background-color: rgba(59,130,246,0.05); font-weight: bold; border-top: 2px solid #3b82f6;">
                <td style="padding: 12px; color: #3b82f6;">Total Consumido</td>
                <td style="padding: 12px; text-align: center;">-</td>
                <td style="padding: 12px; text-align: right; color: #3b82f6; font-size: 14px; font-family: monospace;">${consumptionKwhStr} kWh</td>
              </tr>
            </tbody>
          </table>

          <!-- Cost Breakdown -->
          <h3 style="font-size: 12px; text-transform: uppercase; color: #3b82f6; margin: 0 0 10px 0; letter-spacing: 0.05em;">Detalhamento de Custos e Impostos</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px;">
            <tbody>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 8px 10px; color: #94a3b8;">Consumo Ativo Positivo (kWh * R$ ${baseTariff.toFixed(2)})</td>
                <td style="padding: 8px 10px; text-align: right; color: #ffffff; font-family: monospace;">R$ ${activeCostStr}</td>
              </tr>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 8px 10px; color: #94a3b8;">ICMS Estimado (18,00%)</td>
                <td style="padding: 8px 10px; text-align: right; color: #ffffff; font-family: monospace;">R$ ${icmsEstStr}</td>
              </tr>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 8px 10px; color: #94a3b8;">PIS/COFINS Estimado (9,25%)</td>
                <td style="padding: 8px 10px; text-align: right; color: #ffffff; font-family: monospace;">R$ ${pisCofinsEstStr}</td>
              </tr>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 8px 10px; color: #94a3b8;">Iluminação Pública - COSIP (Estimativa)</td>
                <td style="padding: 8px 10px; text-align: right; color: #ffffff; font-family: monospace;">R$ ${publicLightingEstStr}</td>
              </tr>
              <tr style="background-color: rgba(16,185,129,0.1); font-weight: bold; border-top: 2px solid #10b981; font-size: 16px;">
                <td style="padding: 15px 10px; color: #10b981;">VALOR TOTAL A PAGAR</td>
                <td style="padding: 15px 10px; text-align: right; color: #10b981; font-family: monospace;">R$ ${totalCostStr}</td>
              </tr>
            </tbody>
          </table>

          <!-- Payment Section -->
          <div style="background-color: #111827; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; text-align: center;">
            <h4 style="font-size: 13px; font-weight: bold; color: #ffffff; margin: 0 0 10px 0;">💳 INFORMAÇÕES DE PAGAMENTO</h4>
            <p style="font-size: 12px; color: #cbd5e1; margin: 0 0 15px 0;">Vencimento da Fatura: <strong>15 de ${nextMonthStr} de ${today.getFullYear()}</strong></p>
            
            <div style="background-color: #0b0f19; border: 1px dashed #334155; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #94a3b8; word-break: break-all; margin-bottom: 15px;">
              00020101021226870014br.gov.bcb.pix2565pix.ricas.com.br/energia/fatura/2026${String(targetMonth + 1).padStart(2, '0')}5204000053039865405${totalCostPix}5802BR5915RICAS%20TECNOLOGIA6009SAO%20PAULO62070503***6304CA4D
            </div>
            
            <span style="font-size: 10px; color: #64748b; display: block;">Utilize a chave Pix Copia e Cola acima para realizar o pagamento do fechamento mensal.</span>
          </div>

          <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 20px;">
            Esta fatura é um documento simulado gerado com base nas medições de consumo real de sua unidade.<br>
            © 2026 Ricas Tecnologia - Todos os direitos reservados.
          </p>
        </div>
      `;

      // Envia o e-mail
      await transporter.sendMail({
        from: `"${smtpConfig.fromName || 'Ricas Energia'}" <${smtpConfig.fromEmail || smtpConfig.user}>`,
        to: recipients.join(', '),
        subject: `⚡ Fatura de Energia Ricas - Medidor: ${dev.name} - Ref: ${billingMonthStr}`,
        html: htmlInvoice
      });

      console.log(`[✉️]  Fatura do medidor "${dev.name}" enviada com sucesso para: ${recipients.join(', ')}`);
      sentCount++;
    }

    // Grava o sucesso do disparo no tracker para não enviar de novo neste mês
    fs.writeFileSync(trackerPath, JSON.stringify({ lastSentYear: targetYear, lastSentMonth: targetMonth }, null, 2));
    console.log(`[✅] Fechamento mensal de faturamento de energia concluído com sucesso. ${sentCount} faturas enviadas!`);

  } catch (err) {
    console.error('[❌] Erro ao processar fechamento mensal de faturamento de energia:', err.message);
  }
}

// Verifica no início da execução e a cada 24 horas
checkAndSendMonthlyBills();
setInterval(checkAndSendMonthlyBills, 24 * 60 * 60 * 1000);

// ─── Graceful shutdown ────────────────────────────────────────
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {
  console.log('\n[🛑] Encerrando KRON receiver...');
  client.end();
  await prisma.$disconnect();
  process.exit(0);
}
