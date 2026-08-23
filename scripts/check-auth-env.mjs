import fs from "node:fs";

const path = process.argv[2] ?? ".env.vercel.production";
const text = fs.readFileSync(path, "utf8");
for (const key of ["NEXTAUTH_SECRET", "NEXTAUTH_URL", "DATABASE_URL"]) {
  const m = text.match(new RegExp(`^${key}=(.*)$`, "m"));
  const raw = m?.[1] ?? "";
  const value = raw.replace(/^"|"$/g, "");
  console.log(`${key}: set=${value.length > 0} length=${value.length}`);
}
