import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const devices = await prisma.kronDevice.findMany();
  console.log('--- Kron Devices ---');
  console.dir(devices, { depth: null });

  const readings = await prisma.kronReading.findMany({ take: 10, orderBy: { receivedAt: 'desc' } });
  console.log('--- Latest 10 Readings ---');
  console.dir(readings, { depth: null });

  await prisma.$disconnect();
}

main().catch(console.error);
