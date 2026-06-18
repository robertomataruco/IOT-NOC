import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    console.log('--- DIAGNÓSTICO DO BANCO ---');
    const states = await prisma.state.findMany();
    console.log(`Estados encontrados: ${states.length}`);
    
    const cities = await prisma.city.findMany();
    console.log(`Cidades encontradas: ${cities.length}`);
    
    const devices = await prisma.device.findMany();
    console.log(`Dispositivos encontrados: ${devices.length}`);
    console.log('---------------------------');
  } catch (error) {
    console.error('ERRO NO DIAGNÓSTICO:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
