const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const trap = await prisma.trap.findFirst({
    where: { alarmName: 'Baixa Potência de RF DL (A-POI)' }
  });
  console.log(trap.fullText);
}

main().finally(() => prisma.$disconnect());
