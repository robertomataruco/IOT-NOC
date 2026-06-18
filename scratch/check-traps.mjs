import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const traps = await prisma.trap.findMany({
    orderBy: { timestamp: 'desc' },
    take: 30,
    include: {
      device: {
        select: {
          name: true,
          ip: true
        }
      }
    }
  });

  console.log("=== LAST 30 TRAPS ===");
  for (const t of traps) {
    console.log(`[${t.timestamp.toISOString()}] ID: ${t.id} | Device: ${t.device?.name || 'N/A'} (${t.deviceSerial || 'no serial'}) | Alarm: ${t.alarmName} | Cleared: ${t.isCleared} | NotifiedAt: ${t.lastNotifiedAt?.toISOString() || 'Never'}`);
    console.log(`  Desc: ${t.description}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
