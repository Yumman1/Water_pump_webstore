/**
 * Emits prisma/seed-generated.sql for one-shot seeding via Supabase SQL
 * when a local DATABASE_URL is not available.
 */
import { writeFileSync } from "fs";
import { randomBytes } from "crypto";
import { categories, products } from "../src/data/seed-data";

const cuid = () => "c" + randomBytes(12).toString("hex");
const esc = (s: string) => s.replace(/'/g, "''");
const hash = "$2a$10$00.qhtepQDx1zfbigckA1O7g2jWE30mv8KD59rui0uHUv6l1bRPDe";
const now = new Date().toISOString();
const lines: string[] = [];

lines.push(
  `INSERT INTO "User" (id, email, name, "passwordHash", role, "createdAt", "updatedAt") VALUES ('${cuid()}', 'admin@example.com', 'Administrator', '${hash}', 'ADMIN', '${now}', '${now}') ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", role = 'ADMIN', name = 'Administrator', "updatedAt" = EXCLUDED."updatedAt";`
);

const catIds = new Map<string, string>();
for (const c of categories) {
  const id = cuid();
  catIds.set(c.slug, id);
  lines.push(
    `INSERT INTO "Category" (id, name, slug, description, image, "sortOrder", "createdAt", "updatedAt") VALUES ('${id}', '${esc(c.name)}', '${esc(c.slug)}', '${esc(c.description)}', '${esc(c.image)}', ${c.sortOrder}, '${now}', '${now}') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image = EXCLUDED.image, "sortOrder" = EXCLUDED."sortOrder", "updatedAt" = EXCLUDED."updatedAt";`
  );
}

// Resolve category IDs from DB on conflict by using slug subquery for products
for (const p of products) {
  const images = `ARRAY[${p.images.map((i) => `'${esc(i)}'`).join(",")}]::text[]`;
  const tags = `ARRAY[${p.tags.map((t) => `'${esc(t)}'`).join(",")}]::text[]`;
  const specs = `'${esc(JSON.stringify(p.specs))}'::jsonb`;
  const compare = p.compareAtPrice ?? null;
  const cost = p.cost ?? null;
  const weight = p.weightKg ?? null;
  lines.push(
    `INSERT INTO "Product" (id, name, slug, sku, brand, description, "shortDescription", price, "compareAtPrice", cost, stock, "lowStockThreshold", "weightKg", condition, featured, active, images, specs, tags, "categoryId", "createdAt", "updatedAt") SELECT '${cuid()}', '${esc(p.name)}', '${esc(p.slug)}', '${esc(p.sku)}', '${esc(p.brand)}', '${esc(p.description)}', '${esc(p.shortDescription ?? "")}', ${p.price}, ${compare === null ? "NULL" : compare}, ${cost === null ? "NULL" : cost}, ${p.stock}, ${p.lowStockThreshold}, ${weight === null ? "NULL" : weight}, '${p.condition ?? "NEW"}', ${p.featured}, ${p.active}, ${images}, ${specs}, ${tags}, c.id, '${now}', '${now}' FROM "Category" c WHERE c.slug = '${esc(p.categorySlug)}' ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sku = EXCLUDED.sku, brand = EXCLUDED.brand, description = EXCLUDED.description, "shortDescription" = EXCLUDED."shortDescription", price = EXCLUDED.price, stock = EXCLUDED.stock, images = EXCLUDED.images, specs = EXCLUDED.specs, tags = EXCLUDED.tags, "categoryId" = EXCLUDED."categoryId", "updatedAt" = EXCLUDED."updatedAt";`
  );
}

lines.push(
  `INSERT INTO "StoreSettings" (id, "ownerNotifyEmail", "notifyCustomerEmail", "notifyCustomerWhatsapp", "shippingFlatRate", "freeShippingThreshold", "installationFee", "updatedAt") VALUES (1, 'jawedmotors@outlook.com', true, true, 500, 50000, 5000, '${now}') ON CONFLICT (id) DO UPDATE SET "ownerNotifyEmail" = COALESCE("StoreSettings"."ownerNotifyEmail", EXCLUDED."ownerNotifyEmail"), "updatedAt" = EXCLUDED."updatedAt";`
);
lines.push(
  `INSERT INTO "Coupon" (id, code, type, value, "minSubtotal", active, "usageCount", "createdAt", "updatedAt") VALUES ('${cuid()}', 'WELCOME10', 'PERCENTAGE', 10, 10000, true, 0, '${now}', '${now}') ON CONFLICT (code) DO NOTHING;`
);

writeFileSync("prisma/seed-generated.sql", lines.join("\n"));
console.log(`Wrote ${lines.length} SQL statements`);
