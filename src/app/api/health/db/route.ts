import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/prisma";

/** Runtime database configuration and connectivity check. */
export async function GET() {
  if (!isDbConfigured) {
    return NextResponse.json({ configured: false, connected: false });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ configured: true, connected: true });
  } catch (e) {
    console.warn("[health/db] connection failed:", (e as Error).message);
    return NextResponse.json({ configured: true, connected: false });
  }
}
