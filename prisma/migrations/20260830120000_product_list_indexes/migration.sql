-- Product listing performance indexes (Phase 3)
CREATE INDEX IF NOT EXISTS "Product_active_condition_createdAt_idx" ON "Product" ("active", "condition", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Product_active_price_idx" ON "Product" ("active", "price");
CREATE INDEX IF NOT EXISTS "Product_active_brand_idx" ON "Product" ("active", "brand");
