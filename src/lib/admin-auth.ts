import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type AdminSession = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string;
};

/** Returns the current admin session user, or null. */
export async function getAdminUser(): Promise<AdminSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return session.user as AdminSession;
}
