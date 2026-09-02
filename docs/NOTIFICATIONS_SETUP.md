# Order notifications setup (email + WhatsApp Business)

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

See previous sections in this file — SMTP via `smtp.office365.com` with an app password.

---

## 2. WhatsApp Business (Meta Cloud API)

Automated WhatsApp messages fire on:

| Event | Customer | You (owner) |
|-------|----------|-------------|
| New order | Order confirmation | New order alert |
| Dispatch | Shipped notification | — |
| Cancel | Cancellation notice | — |
| Customer messages you | Auto-reply (optional) | — |

### Step A — Create Meta Business app

1. Go to [business.facebook.com](https://business.facebook.com) and create or use your **Jawed Pumps & Motors** business portfolio.
2. Go to [developers.facebook.com](https://developers.facebook.com) → **Create App** → type **Business**.
3. Add product **WhatsApp**.
4. In **WhatsApp → API Setup**:
   - Add your phone number (`03053770002` or a dedicated WhatsApp Business SIM).
   - Copy **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - Generate a **Permanent access token** (System User with `whatsapp_business_messaging` permission) → `WHATSAPP_TOKEN`

### Step B — Add environment variables in Vercel

Project **water-pump-webstore** → **Settings** → **Environment Variables**:

| Variable | Value |
|----------|--------|
| `WHATSAPP_TOKEN` | Permanent token from Meta |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID from API Setup |
| `OWNER_NOTIFY_WHATSAPP` | `03053770002` |
| `WHATSAPP_VERIFY_TOKEN` | Any random string you invent (e.g. `jawed-wa-verify-2026`) |
| `WHATSAPP_AUTO_REPLY` | `true` (optional — instant reply to incoming chats) |

Redeploy after saving.

### Step C — Connect webhook (receive messages + auto-reply)

1. In Meta Developer Console → **WhatsApp → Configuration**.
2. **Callback URL**: `https://www.jawedpumps.com/api/webhooks/whatsapp`
   (Also shown in **Admin → Settings → Delivery channels**.)
3. **Verify token**: same as `WHATSAPP_VERIFY_TOKEN` in Vercel.
4. Click **Verify and save**.
5. Subscribe to webhook field: **messages**.

When a customer WhatsApp’s your business number, they get an automatic reply with your shop link and phone (if `WHATSAPP_AUTO_REPLY=true`).

### Step D — Message templates (required for reliable automation)

Meta **blocks free-text** messages to customers who have not messaged you in the last 24 hours. For order confirmations after checkout, you **must** use **approved utility templates**.

Create these in **Meta Business Manager → WhatsApp Manager → Message templates** (category: **Utility**):

#### Template 1: `order_confirmation` (customer — new order)

```
Hello {{1}},

Thank you for your order at Jawed Pumps & Motors!

Order: {{2}}
Total: {{3}}
Payment: {{4}}

We will contact you shortly to confirm delivery.

— Jawed Pumps, Karachi
```

Env: `WHATSAPP_TEMPLATE_ORDER_CONFIRM=order_confirmation`

Body parameters sent by the store: `customerName`, `orderNumber`, `total`, `paymentMethod`

#### Template 2: `order_dispatched` (customer — shipped)

```
Hi {{1}}, your order {{2}} has been dispatched and is on its way to {{3}}.

Total: {{4}}

Thank you for shopping with Jawed Pumps!
```

Env: `WHATSAPP_TEMPLATE_ORDER_DISPATCH=order_dispatched`

Parameters: `customerName`, `orderNumber`, `city`, `total`

#### Template 3: `order_cancelled` (customer — cancel)

```
Hi {{1}}, your order {{2}} at Jawed Pumps has been cancelled.

Order total was {{3}}.

Questions? Call 03053770002.
```

Env: `WHATSAPP_TEMPLATE_ORDER_CANCEL=order_cancelled`

Parameters: `customerName`, `orderNumber`, `total`

#### Template 4: `owner_new_order` (optional — you)

```
New order {{1}} from {{2}} ({{3}}).

Deliver to: {{4}}
Total: {{5}}
```

Env: `WHATSAPP_TEMPLATE_OWNER_NEW_ORDER=owner_new_order`

Parameters: `orderNumber`, `customerName`, `phone`, `address`, `total`

Also set: `WHATSAPP_TEMPLATE_LANGUAGE=en` (or `en_US` if Meta requires it).

**Until templates are approved**, the store falls back to free-text (works for test numbers and customers who recently messaged you).

### Step E — Verify

1. **Admin → Settings** — **WhatsApp Business API** should show **Connected** after redeploy.
2. Add your personal number as a **test recipient** in Meta API Setup.
3. Use **Send test to my email & WhatsApp** in Admin → Settings.
4. Place a test order with your phone number at checkout.

---

## 3. What the floating WhatsApp button does

The green **Chat on WhatsApp** button on the store opens `wa.me/923053770002` — this is for **manual** customer chats. The **API** above handles **automated** order messages separately through Meta’s servers.

Both can use the same business number once connected to WhatsApp Business API.

---

## Local testing

Copy `.env.example` to `.env.local`, fill WhatsApp vars, then:

```bash
npm run dev
```

Place a test order; check the terminal if providers are missing (demo mode logs instead of sending).

For webhook testing locally, use [ngrok](https://ngrok.com) and point Meta callback to `https://YOUR-NGROK/api/webhooks/whatsapp`.
