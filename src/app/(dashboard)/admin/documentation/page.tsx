import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DocumentationClient from "./DocumentationClient";

export default async function DocumentationPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  // Fetch complete user profile from database to verify permissions securely
  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  });

  // Strict check: only user 'roberto.mataruco' is allowed to access this documentation
  if (!dbUser || dbUser.username !== 'roberto.mataruco') {
    redirect("/");
  }

  return <DocumentationClient />;
}
