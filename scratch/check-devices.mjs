import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const devices = await prisma.device.findMany({
    select: {
      id: true,
      name: true,
      ip: true,
      serial: true,
      status: true,
      hasAlarm: true,
      lastSnmpSync: true,
      syncError: true,
      lastSnmpData: true
    }
  });

  console.log("=== DISPOSITIVOS ===");
  for (const d of devices) {
    console.log(`\nNome: ${d.name}`);
    console.log(`IP: ${d.ip}`);
    console.log(`Serial: ${d.serial}`);
    console.log(`Status: ${d.status}`);
    console.log(`HasAlarm: ${d.hasAlarm}`);
    console.log(`SyncError: ${d.syncError}`);
    console.log(`LastSync: ${d.lastSnmpSync}`);
    if (d.lastSnmpData) {
      try {
        const parsed = JSON.parse(d.lastSnmpData);
        console.log(`MetricsCount: ${parsed.metrics?.length || 0}`);
        const activeAlarms = parsed.metrics?.filter((m) => m.status === "PROBLEMA");
        console.log(`ActiveAlarmsCount: ${activeAlarms?.length || 0}`);
        if (activeAlarms?.length > 0) {
          console.log("ActiveAlarms List:", activeAlarms.map(a => `${a.name}: ${a.value} (${a.status})`));
        }
      } catch (err) {
        console.log("Error parsing lastSnmpData:", err.message);
      }
    }
  }

  const trapsCount = await prisma.trap.count();
  console.log(`\nTotal Traps no banco: ${trapsCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
