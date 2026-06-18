import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DeviceMonitorClient from "./DeviceMonitorClient";

export default async function DevicePage({ params }: { params: { id: string } }) {
  const device = await prisma.device.findUnique({
    where: { id: params.id },
    include: {
      city: {
        include: {
          state: true
        }
      },
      company: true
    }
  });

  if (!device) {
    return notFound();
  }

  return (
    <div className="flex-1 h-full bg-zabbix-dark overflow-hidden">
      <DeviceMonitorClient device={JSON.parse(JSON.stringify(device))} />
    </div>
  );
}
