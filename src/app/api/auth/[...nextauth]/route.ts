import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        // Sincroniza a senha com o GLPI em segundo plano
        prisma.user.findUnique({
          where: { id: user.id },
          include: { companyRef: true }
        }).then(fullUser => {
          if (fullUser) {
            const companyName = fullUser.companyRef?.name || fullUser.company || 'Root';
            import("@/lib/glpi").then(({ syncUserPasswordToGlpi }) => {
              syncUserPasswordToGlpi(
                fullUser.username,
                credentials.password,
                fullUser.name,
                fullUser.email,
                companyName
              ).catch(err => console.error("[GLPI Sync Login] Error syncing user:", err));
            });
          }
        }).catch(err => console.error("[GLPI Sync Login] Error fetching full user:", err));

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          mustChangePassword: user.mustChangePassword
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.mustChangePassword = (user as any).mustChangePassword;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
        (session.user as any).mustChangePassword = token.mustChangePassword;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecret123",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
