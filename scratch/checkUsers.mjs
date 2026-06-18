import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:");
  for (const user of users) {
    console.log(`- Username: "${user.username}", Email: "${user.email}", Role: "${user.role}", Password Hash: "${user.password}"`);
  }
}

main().finally(() => prisma.$disconnect());
