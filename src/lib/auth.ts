import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { resolveAuthSecret } from "@/lib/auth-secret";
import { prisma, isDbConfigured } from "@/lib/prisma";

function getAuthSecret(): string {
  return (
    resolveAuthSecret() ||
    (process.env.NODE_ENV !== "production" ? "dev-insecure-secret-change-me" : "")
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const secret = getAuthSecret();
        if ((process.env.VERCEL || process.env.NODE_ENV === "production") && !secret) {
          console.error("[auth] NEXTAUTH_SECRET must be set in production");
          return null;
        }

        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        if (!email || !password) return null;

        // With a database: only real user accounts can sign in.
        if (isDbConfigured) {
          try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (user && (await bcrypt.compare(password, user.passwordHash))) {
              return { id: user.id, email: user.email, name: user.name, role: user.role };
            }
          } catch (e) {
            console.warn("[auth] DB lookup failed:", (e as Error).message);
          }
          return null;
        }

        // Demo mode only (no database): allow the env-configured admin so you
        // can explore the dashboard before connecting a database. Defaults to
        // the seed credentials. This path is DISABLED once DATABASE_URL is set.
        const envEmail = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase().trim();
        const envPass = process.env.ADMIN_PASSWORD ?? "admin1234";
        if (email === envEmail && password === envPass) {
          return { id: "env-admin", email: envEmail, name: "Administrator", role: "ADMIN" };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role ?? "STAFF";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  secret: getAuthSecret() || undefined,
};
