const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function run() {
  const traps = await prisma.trap.findMany();
  
  let count = 0;
  for (const trap of traps) {
    if (!trap.fullText) continue;

    // Fazer o parsing manual simulado igual ao trapParser
    const fieldRegex = /(?:enterprises|1\.3\.6\.1\.4\.1)\.15921\.60\.1\.1\.(\d+)\s*=\s*.*?: (.*?)(?:$|,|\r|\n)/g;
    let match;
    const rawFields = {};
    while ((match = fieldRegex.exec(trap.fullText)) !== null) {
      const fieldId = match[1];
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
      rawFields[fieldId] = value;
    }

    const channelId = rawFields['10'];
    const channelDesc = rawFields['11'];

    if (channelId && channelId !== "0" && channelId !== "NA" && channelId !== "N/A") {
      let extraInfo = ` [Canal/Porta: `;
      if (channelDesc && channelDesc !== "0" && channelDesc !== "NA" && channelDesc !== "N/A") {
        extraInfo += `${channelDesc} `;
      }
      extraInfo += `${channelId}]`;
      
      // Se a descrição ainda não tiver essa info, a gente anexa
      if (!trap.description.includes(extraInfo)) {
        await prisma.trap.update({
          where: { id: trap.id },
          data: {
            description: trap.description + extraInfo
          }
        });
        count++;
      }
    }
  }

  console.log(`Atualizados ${count} traps no banco de dados adicionando informações de Canal/Porta.`);
  await prisma.$disconnect();
}

run();
