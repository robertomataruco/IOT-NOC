const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const traps = await prisma.trap.findMany();
  
  const translations = {
    "Overall Alarm (Geral)": "Alarme Geral do Módulo",
    "a-poiDlRfLowPower": "Baixa Potência de RF DL (A-POI)"
  };

  const descTranslations = {
    "Ocorre quando qualquer sub-alarme no módulo é acionado.": "Ocorre quando qualquer sub-alarme no módulo é acionado. Verifique a causa primária no equipamento.",
    "The detected channel power <-40dBm(default value) .": "Potência do canal detectada está muito baixa. Verifique a entrada de RF ou cabos coaxiais."
  };

  let count = 0;
  for (const trap of traps) {
    let changed = false;
    let newName = trap.alarmName;
    let newDesc = trap.description;

    if (translations[trap.alarmName]) {
      newName = translations[trap.alarmName];
      changed = true;
    }
    if (descTranslations[trap.description]) {
      newDesc = descTranslations[trap.description];
      changed = true;
    }

    if (changed) {
      await prisma.trap.update({
        where: { id: trap.id },
        data: {
          alarmName: newName,
          description: newDesc
        }
      });
      count++;
    }
  }

  console.log(`Atualizados ${count} traps no banco de dados com a tradução correta.`);
  await prisma.$disconnect();
}

run();
