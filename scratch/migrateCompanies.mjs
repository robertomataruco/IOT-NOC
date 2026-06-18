import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando migração de dados de empresas...");

  const users = await prisma.user.findMany();
  console.log(`Encontrados ${users.length} usuários.`);

  for (const user of users) {
    if (user.company && user.company.trim() !== '') {
      const companyName = user.company.trim();
      console.log(`Usuário "${user.username}" possui empresa cadastrada como: "${companyName}"`);

      // Buscar ou criar a empresa no novo modelo
      let company = await prisma.company.findUnique({
        where: { name: companyName }
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            name: companyName,
            status: "ATIVO",
            paymentStatus: "PAGO",
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) // 1 mês a partir de hoje
          }
        });
        console.log(`Nova empresa criada: "${companyName}" (ID: ${company.id})`);
      } else {
        console.log(`Empresa já existente: "${companyName}" (ID: ${company.id})`);
      }

      // Atualizar o usuário para apontar para a nova tabela
      await prisma.user.update({
        where: { id: user.id },
        data: { companyId: company.id }
      });
      console.log(`Usuário "${user.username}" vinculado com sucesso.`);
    } else {
      console.log(`Usuário "${user.username}" não possui empresa registrada.`);
    }
  }

  console.log("Migração concluída com sucesso!");
}

main()
  .catch((err) => console.error("Erro na migração:", err))
  .finally(() => prisma.$disconnect());
