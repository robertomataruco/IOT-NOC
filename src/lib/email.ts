import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  
  // Microsoft Graph specific fields
  provider?: 'smtp' | 'graph';
  tenantId?: string;
  clientId?: string;
}

const CONFIG_PATH = path.join(process.cwd(), 'src/lib/smtpConfig.json');

// Carrega configurações SMTP
export function getSmtpConfig(): SmtpConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Erro ao ler smtpConfig.json:", err);
  }

  // Fallback para variáveis de ambiente ou valores vazios padrão
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || true,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromName: process.env.SMTP_FROM_NAME || 'Ricas Alertas',
    fromEmail: process.env.SMTP_FROM_EMAIL || '',
    provider: 'smtp'
  };
}

// Salva configurações SMTP
export function saveSmtpConfig(config: SmtpConfig): boolean {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Erro ao salvar smtpConfig.json:", err);
    return false;
  }
}

// Envia e-mail utilizando uma configuração customizada (usado para envio real e de teste)
export async function sendEmailWithConfig(config: SmtpConfig, to: string, subject: string, text: string, html?: string) {
  if (!config.user || !config.pass) {
    throw new Error("E-mail ou senha/secret não configurados.");
  }

  if (config.provider === 'graph') {
    const tenantId = config.tenantId?.trim() || '';
    const clientId = config.clientId?.trim() || '';
    const clientSecret = config.pass || '';
    const senderEmail = config.user.trim();

    if (!tenantId || !clientId || !clientSecret || !senderEmail) {
      throw new Error("Missing Microsoft Graph configuration fields (Tenant ID, Client ID, Client Secret, or Sender Email)");
    }

    // 1. Obter Token de Acesso via OAuth2 Client Credentials Flow
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'client_credentials');
    tokenParams.append('client_id', clientId);
    tokenParams.append('client_secret', clientSecret);
    tokenParams.append('scope', 'https://graph.microsoft.com/.default');

    const tokenRes = await axios.post(tokenUrl, tokenParams, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 8000
    });

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      throw new Error("Não foi possível obter o token de acesso da Microsoft");
    }

    // 2. Enviar E-mail via Microsoft Graph API
    const sendMailUrl = `https://graph.microsoft.com/v1.0/users/${senderEmail}/sendMail`;
    const emailPayload = {
      message: {
        subject,
        body: {
          contentType: 'HTML',
          content: html || text.replace(/\n/g, '<br/>'),
        },
        toRecipients: to.split(',').map((email) => ({
          emailAddress: {
            address: email.trim(),
          },
        })),
      },
      saveToSentItems: false,
    };

    await axios.post(sendMailUrl, emailPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    console.log(`[MAIL Graph] 📨 E-mail enviado com sucesso para ${to}`);
    return true;
  } else {
    // Envio padrão via SMTP
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail || config.user}>`,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    });

    console.log(`[MAIL SMTP] 📨 E-mail enviado com sucesso: ${info.messageId} para ${to}`);
    return true;
  }
}

// Envia e-mail de alerta padrão do portal
export async function sendEmailNotification(to: string, subject: string, text: string, html?: string) {
  try {
    return await sendEmailWithConfig(getSmtpConfig(), to, subject, text, html);
  } catch (err: any) {
    console.error(`[MAIL] ❌ Falha ao enviar e-mail para ${to}:`, err.message);
    return false;
  }
}
