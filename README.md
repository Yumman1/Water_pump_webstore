# 💧 Water Pump Webstore — Complete E‑Commerce Platform

A production-ready e-commerce store with a customer storefront **and** a full
admin dashboard / CRM (products, inventory, orders, customers, categories) —
built with **Next.js 14, TypeScript, Tailwind CSS, Prisma & PostgreSQL**, ready
to deploy on **Vercel**.

> Built as a turnkey product: **replace the branding, the products and the logo,
> and you have your own online store.** Everything else is already wired up.

---

## ✨ What's included

### Storefront (customer-facing)
- 🏠 Homepage with hero, categories, featured products & trust badges
- 🛍️ Shop page with category filters, sorting & pagination
- 🔎 Product search
- 📄 Product detail pages with image gallery, specs & related products
- 🛒 Cart (persists in the browser) & multi-step checkout
- 💵 Cash-on-Delivery & Bank Transfer (card/online payment ready to add)
- 📱 Fully responsive + WhatsApp chat button
- 📃 About, Contact, Shipping pages
- 🔍 SEO metadata + auto-generated sitemap

### Admin dashboard / CRM (`/admin`)
- 🔐 Secure login (NextAuth)
- 📊 Dashboard: revenue, orders, low-stock alerts, top products, recent orders
- 📦 **Product management** — full create / edit / delete with images, specs, pricing
- 📉 **Inventory management** — live stock editing, low-stock & out-of-stock tracking, audit log
- 🧾 **Order management** — view orders, update order & payment status
- 👥 **Customers** — auto-created from orders, with spend totals
- 🏷️ **Categories** — create / delete
- 🎟️ Coupon support (schema + checkout logic included; `WELCOME10` seeded)

### Under the hood
- **Runs immediately with zero setup** — the storefront renders from bundled
  demo data, so your first Vercel deploy won't crash. Connect a database when
  you're ready for real orders & inventory.
- Type-safe throughout, atomic order transactions, stock decrement + audit logs.

---

## 🚀 Quick start (local)

```bash
# 1. Install
npm install

# 2. (Optional but recommended) configure environment
cp .env.example .env
#    → edit .env and set DATABASE_URL, NEXTAUTH_SECRET, ADMIN_EMAIL/PASSWORD

# 3. If you set a DATABASE_URL, create the schema and seed demo data
npm run db:push
npm run db:seed

# 4. Run
npm run dev
# → http://localhost:3000        (storefront)
# → http://localhost:3000/admin  (dashboard)
```

**Admin login (demo):** `admin@example.com` / `admin1234`
(change via `ADMIN_EMAIL` / `ADMIN_PASSWORD`, or the seeded DB user).

> **No database yet?** That's fine — skip steps 2–3. The store runs in **demo
> mode** using the bundled catalog. You can browse, add to cart and “place”
> orders (not persisted), and explore the admin dashboard read-only.

---

## 🎨 Make it yours (the only files you need to touch)

| To change… | Edit… |
|---|---|
| Company name, logo, contact info, colors, currency, shipping, hero text | `src/config/site.ts` |
| Hero background video, homepage video clips, and the on-load deal pop-up | `src/config/site.ts` (`hero.video`, `showcase`, `promoPopup`) |
| Brand colors (palette) | CSS variables at the top of `src/app/globals.css` |
| Logo image | replace `public/logo.svg` (or point `siteConfig.logo` at a PNG) |
| Demo products & categories | `src/data/seed-data.ts`, then `npm run db:seed` |

Once a database is connected, you can also manage **all products, categories,
prices, stock and orders** visually from the **admin dashboard** — no code needed.

### Currency
Set in `src/config/site.ts` → `currency` (default `Rs`, PKR). Change `symbol`,
`position` and `locale` for any market.

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this there).
2. In [Vercel](https://vercel.com/new), **Import** the repository.
3. Add environment variables (Project → Settings → Environment Variables):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Supabase Postgres URI (`sslmode=require`). If Marketplace only added `POSTGRES_URL`, copy that value into `DATABASE_URL` too. |
   | `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | `https://your-store.vercel.app` |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Your admin login (must match seeded user) |
   | `RESEND_API_KEY` / `EMAIL_FROM` | Order emails |
   | `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | Order WhatsApp alerts |
   | `OWNER_NOTIFY_EMAIL` / `OWNER_NOTIFY_WHATSAPP` | Fallback owner contacts |

4. **Deploy.** The build runs `prisma generate` automatically.
5. Database schema + seed for this project are already applied on Supabase when using the Jawed production DB. For a fresh database:
   ```bash
   # locally, with the production DATABASE_URL in your .env
   npm run db:push
   npm run db:seed
   ```

Default seeded admin (change after first login): `admin@example.com` / `admin1234`

Checkout coupon: `WELCOME10` (10% off product subtotals over Rs 10,000).

> **WhatsApp note:** Meta often blocks free-form business-initiated messages until you
> use an approved template. Email via Resend works immediately once the API key is set.

### Getting a free PostgreSQL database
- **Supabase** — create a project → Settings → Database → Connection string (URI).
- **Neon** — create a project → copy the connection string.
- **Vercel Postgres** — Storage tab in your Vercel project.

Use the **pooled/connection-pooler** URL for serverless (Supabase & Neon provide one).

---

## 💳 Adding online card payments (optional)

Checkout currently supports **COD** and **Bank Transfer**. To add Stripe (or any
gateway):

1. Create a checkout/payment-intent in `src/app/api/orders/route.ts` after the
   order is created (the total is already computed there).
2. Redirect the customer to the gateway, then confirm via a webhook that flips
   `paymentStatus` to `PAID`.

The data model (`Order.paymentStatus`, `paymentMethod`) already supports this.

---

## 🗂️ Project structure

```
src/
├── config/site.ts          ← branding (EDIT ME)
├── data/seed-data.ts       ← demo catalog (EDIT ME)
├── app/
│   ├── (store)/            ← storefront pages
│   ├── admin/              ← dashboard (login + protected pages)
│   └── api/                ← orders + auth endpoints
├── components/
│   ├── store/              ← storefront UI
│   ├── admin/              ← dashboard UI
│   └── ui/                 ← shared primitives (buttons, icons)
└── lib/                    ← data access, auth, cart, helpers
prisma/
├── schema.prisma           ← database schema
└── seed.ts                 ← seed script
```

## 🛠️ Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Create/update database tables |
| `npm run db:seed` | Load demo catalog, admin user & sample orders |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |
| `npm run db:reset` | Wipe & re-seed the database |

---

## 🔒 Notes on security
- Change `ADMIN_PASSWORD` and set a strong `NEXTAUTH_SECRET` before going live.
- The default demo admin login only works in **demo mode** (no `DATABASE_URL`).
  Once a database is connected, only real user accounts can sign in.

---

Built with Next.js · Prisma · Tailwind CSS. Deploy anywhere Node runs.
