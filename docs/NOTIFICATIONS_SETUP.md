# Order notifications setup (email + WhatsApp)

Customer emails and phone numbers are **always taken from the order** (`customerEmail`, `customerPhone` on checkout). Your contact details below are only for **owner alerts** when someone places a new order.

Already saved in **Admin → Settings** (database):

| Setting | Value |
|---------|--------|
| Owner email | jawedmotors@outlook.com |
| Owner WhatsApp | 03053770002 |
| Customer email on order / dispatch / cancel | Enabled |
| Customer WhatsApp on order / dispatch | Enabled |

---

## 1. Email via Outlook (jawedmotors@outlook.com)

### A. Create a Microsoft app password

1. Sign in at [account.microsoft.com/security](https://account.microsoft.com/security).
2. Turn on **two-step verification** if it is off.
3. Under **App passwords**, create a new password (e.g. name: `Jawed Pumps Vercel`).
4. Copy the 16-character password — you will not see it again.

### B. Add these in Vercel

Project **water-pump-webstore** → **Settings** → **Environment Variables** → add for **Production**, **Preview**, and **Development**:

| Variable | Value |
|----------|--------|
| `SMTP_HOST` | `smtp.office365.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | `jawedmotors@outlook.com` |
| `SMTP_PASS` | *(paste app password)* |
| `EMAIL_FROM` | `Jawed Pumps & Motors <jawedmotors@outlook.com>` |
| `OWNER_NOTIFY_EMAIL` | `jawedmotors@outlook.com` |

### C. Redeploy

After saving env vars: **Deployments** → latest → **⋯** → **Redeploy**.

### D. Verify

1. Open **Admin → Settings** — **Email** should show **Connected**.
2. Place a test order with your personal email/phone, or cancel a test order — the customer address on that order receives the message.

---

## 2. WhatsApp via Meta Cloud API

WhatsApp sends to the **customer phone on the order** (normalized to Pakistan `92…` automatically).

### A. Meta Business setup

1. Go to [developers.facebook.com](https://developers.facebook.com) → **Create App** → type **Business**.
2. Add product **WhatsApp**.
3. In **WhatsApp → API Setup**, note:
   - **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - **Temporary access token** (for testing) or create a **System User** token (production)

4. Connect your business phone (`03053770002` or a dedicated WhatsApp Business number).

### B. Add in Vercel

| Variable | Value |
|----------|--------|
| `WHATSAPP_TOKEN` | Meta permanent access token |
| `WHATSAPP_PHONE_NUMBER_ID` | From API Setup |
| `OWNER_NOTIFY_WHATSAPP` | `03053770002` |

### C. Important: message templates

Meta often **blocks free-text** WhatsApp to customers who have not messaged you in the last 24 hours. For reliable order/cancel/dispatch messages you may need **approved utility templates** in Meta Business Manager.

Until templates are approved, WhatsApp may work for:

- Numbers that recently messaged your business WhatsApp
- Test numbers added in Meta **API Setup → test numbers**

Owner new-order alerts to `03053770002` follow the same API rules.

### D. Verify

**Admin → Settings** — **WhatsApp** should show **Connected** after redeploy.

---

## What sends where

| Event | To owner (you) | To customer |
|-------|----------------|-------------|
| New order | Email + WhatsApp (Settings) | Email + WhatsApp *(from order)* |
| Dispatch | — | Email + WhatsApp *(from order)* |
| Cancel | — | Email + WhatsApp *(from order)* |

---

## Local testing

Copy `.env.example` to `.env`, fill in `SMTP_PASS` and WhatsApp vars, then:

```bash
npm run dev
```

Place or cancel a test order; check the terminal if providers are missing (demo mode logs instead of sending).
