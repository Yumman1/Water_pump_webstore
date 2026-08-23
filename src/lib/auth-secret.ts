/** Resolve NextAuth secret from env (supports NEXTAUTH_SECRET and AUTH_SECRET aliases). */
export function resolveAuthSecret(): string {
  return (
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    ""
  );
}
