import { PrismaClient } from "@prisma/client";

/**
 * Accept common Vercel/Supabase Postgres env aliases so the app leaves demo
 * mode when Marketplace injects POSTGRES_URL instead of DATABASE_URL.
 */
const resolvedDatabaseUrl =
  process.env.DATABASE_URL?.trim() ||
  process.env.POSTGRES_PRISMA_URL?.trim() ||
  process.env.POSTGRES_URL?.trim() ||
  process.env.DATABASE_URL_UNPOOLED?.trim() ||
  "";

if (resolvedDatabaseUrl && !process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = resolvedDatabaseUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** True when a database connection string is configured. */
export const isDbConfigured = Boolean(resolvedDatabaseUrl);
