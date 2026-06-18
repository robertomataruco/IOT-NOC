import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  if (count > 0) {
    console.log("Users already exist in database.");
    const users = await prisma.user.findMany();
    for (const u of users) {
      if (u.username === 'admin') {
        // Let's reset the password of the admin user to 'admin' to be absolutely sure
        const newHash = await bcrypt.hash('admin', 10);
        await prisma.user.update({
          where: { id: u.id },
          data: { passwordHash: newHash }
        });
        console.log("Reset admin user password to 'admin'.");
      }
    }
  } else {
    const passwordHash = await bcrypt.hash('admin', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        name: 'Administrador',
        passwordHash: passwordHash,
        role: 'ADMIN',
      },
    });
    console.log("Created default admin user with username 'admin' and password 'admin'.");
  }
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
