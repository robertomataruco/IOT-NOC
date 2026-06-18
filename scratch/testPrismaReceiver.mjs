import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const devices = await prisma.device.findMany();
  console.log(`Prisma works inside ES module! Found ${devices.length} devices.`);
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
