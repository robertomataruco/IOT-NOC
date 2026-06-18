import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { syncUserPasswordToGlpi } from "@/lib/glpi";
import { sendEmailNotification } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        access: {
          include: { city: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { name, username, password, role, company, companyId, phone, email, sites: userCities, canAccessInfo } = await req.json();
    
    let finalPassword = password;
    if (!finalPassword) {
      // Gera uma senha padrão de 8 dígitos numérica não complexa
      finalPassword = Math.floor(10000000 + Math.random() * 90000000).toString();
    }
    
    const passwordHash = await bcrypt.hash(finalPassword, 10);

    const isUserAdmin = role === 'ADMIN';
    const finalCanAccessInfo = isUserAdmin ? (canAccessInfo ?? false) : false;

    // Sincronizar nome da empresa antigo/novo para compatibilidade
    let finalCompany = company;
    if (companyId) {
      const dbCompany = await prisma.company.findUnique({ where: { id: companyId } });
      if (dbCompany) {
        finalCompany = dbCompany.name;
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        username,
        passwordHash,
        role: role || 'USER',
        canAccessInfo: finalCanAccessInfo,
        company: finalCompany,
        companyId: companyId || null,
        phone,
        email,
        mustChangePassword: true,
        access: {
          create: userCities?.map((c: any) => ({
            cityId: c.cityId || c.siteId, // Aceita siteId para compatibilidade temporária
            permission: c.permission || 'VIEW'
          })) || []
        }
      }
    });

    if (user.phone) {
      const welcomeMessage = `*Olá, ${user.name}! Bem-vindo(a) ao Dashboard da Ricas Tecnologia.* 👋\n\n` +
        `Seu cadastro foi realizado com sucesso e seus acessos já foram configurados.\n` +
        `*Acesso:* http://ricasti.dyndns.org:53005\n` +
        `*Login:* ${user.username}\n` +
        `*Senha Inicial:* ${finalPassword}\n\n` +
        `⚠️ _No seu primeiro acesso, o sistema exigirá que você crie uma nova senha de no mínimo 8 caracteres para sua própria segurança._\n\n` +
        `🔒 *Política Básica de Segurança:*\n` +
        `• Sua senha é pessoal e intransferível. Nunca a compartilhe.\n` +
        `• Você será notificado por este canal sempre que houver um alarme crítico nos equipamentos sob sua visão.\n` +
        `• Caso suspeite de acesso indevido, avise a administração imediatamente.\n\n` +
        `_Esta é uma mensagem automática, por favor não responda._`;
        
      try {
        await sendWhatsAppMessage(user.phone, welcomeMessage);
      } catch (err) {
        console.error('Erro ao enviar boas-vindas:', err);
      }
    }

    if (user.email) {
      const emailSubject = `🚀 Bem-vindo(a) ao Portal de Monitoramento - Ricas Tecnologia`;
      const emailText = `Olá ${user.name},\n\nSeu cadastro no Portal de Monitoramento da Ricas Tecnologia foi concluído!\n\nLink de Acesso: http://ricasti.dyndns.org:53005\nUsuário: ${user.username}\nSenha Inicial: ${finalPassword}\n\nNo primeiro acesso, você será solicitado a alterar sua senha para uma de sua preferência (mínimo de 8 caracteres).\n\nQualquer dúvida, entre em contato com o administrador.\n\nAtenciosamente,\nEquipe Ricas Tecnologia`;
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #3b82f6;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">🚀 Bem-vindo ao Portal de Monitoramento</h2>
          <p style="font-size: 16px; color: #cbd5e1;">Olá <strong>${user.name}</strong>,</p>
          <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">Seu cadastro foi realizado com sucesso! A partir de agora você terá acesso ao nosso painel de monitoramento e alertas.</p>
          
          <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin: 20px 0; font-size: 14px;">
            <p style="margin: 5px 0;"><strong style="color: #94a3b8;">Link de Acesso:</strong> <a href="http://ricasti.dyndns.org:53005" style="color: #3b82f6; text-decoration: underline;">Portal Ricas Tecnologia</a></p>
            <p style="margin: 5px 0;"><strong style="color: #94a3b8;">Usuário:</strong> <code style="color: #ffffff; background: #0f172a; padding: 2px 6px; border-radius: 4px;">${user.username}</code></p>
            <p style="margin: 5px 0;"><strong style="color: #94a3b8;">Senha Inicial:</strong> <code style="color: #ffffff; background: #0f172a; padding: 2px 6px; border-radius: 4px;">${finalPassword}</code></p>
          </div>
          
          <p style="font-size: 13px; color: #94a3b8; background-color: #0f172a; padding: 10px; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 15px 0;">
            ⚠️ <strong>Importante:</strong> No seu primeiro acesso, o sistema exigirá que você altere sua senha por questões de segurança.
          </p>
          
          <p style="font-size: 14px; color: #cbd5e1; margin-top: 25px;">Seja muito bem-vindo!</p>
          <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 35px; border-top: 1px solid #1e293b; padding-top: 15px;">Ricas Tecnologia - Monitoramento Inteligente</p>
        </div>
      `;

      sendEmailNotification(user.email, emailSubject, emailText, emailHtml)
        .catch(err => console.error('Erro ao enviar e-mail de boas-vindas:', err));
    }

    // Sincroniza o usuário e sua senha com o GLPI em segundo plano
    syncUserPasswordToGlpi(user.username, finalPassword, user.name, user.email, user.company)
      .catch(err => console.error('[GLPI Sync Admin Create] Erro ao sincronizar usuário:', err));

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
