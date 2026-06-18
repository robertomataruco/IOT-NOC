import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MapaClient from "./MapaClient";

export default async function StandaloneMapaPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // Fetch logged in user details
  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  });

  if (!dbUser) {
    redirect("/login");
  }

  const isAdmin = dbUser.role === 'ADMIN';

  // Query cities and nested devices (DAS and Kron) scoped by user credentials
  const cities = await prisma.city.findMany({
    where: isAdmin ? {} : {
      OR: [
        {
          devices: {
            some: {
              companyId: dbUser.companyId
            }
          }
        },
        {
          kronDevices: {
            some: {
              companyId: dbUser.companyId
            }
          }
        }
      ]
    },
    include: {
      state: true,
      devices: {
        where: isAdmin ? {} : {
          companyId: dbUser.companyId
        },
        include: {
          traps: {
            where: { isCleared: false }
          }
        }
      },
      kronDevices: {
        where: isAdmin ? {} : {
          companyId: dbUser.companyId
        }
      }
    }
  });

  // Filter to keep only cities that have devices (or all if admin)
  const filteredCities = cities.filter(city => city.devices.length > 0 || city.kronDevices.length > 0 || isAdmin);

  return (
    <MapaClient 
      initialCities={filteredCities} 
      userCompanyId={dbUser.companyId}
      isAdmin={isAdmin}
    />
  );
}
