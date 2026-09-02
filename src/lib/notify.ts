/**
 * Order notifications, email + WhatsApp, for the shop owner and the customer.
 *
 * Providers are configured via environment variables and used only if present;
 * otherwise messages are logged to the server console (demo mode) so nothing
 * crashes. See .env.example / README for setup.
 *
 *   Email:     RESEND_API_KEY (+ EMAIL_FROM)  , https://resend.com  (recommended)
 *          or  SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS  (any SMTP, e.g. Gmail)
 *   WhatsApp:  WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID . Meta WhatsApp Cloud API
 */
import nodemailer from "nodemailer";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { formatCurrency } from "@/lib/format";
import { sendWhatsAppSmart, sendWhatsAppText } from "@/lib/whatsapp";

export type StoreSettings = {
  ownerNotifyEmail: string | null;
  ownerNotifyWhatsapp: string | null;
  notifyCustomerEmail: boolean;
  notifyCustomerWhatsapp: boolean;
  shippingFlatRate: number;
  freeShippingThreshold: number;
  installationFee: number;
};

const DEFAULT_SETTINGS: StoreSettings = {
  ownerNotifyEmail: process.env.OWNER_NOTIFY_EMAIL ?? null,
  ownerNotifyWhatsapp: process.env.OWNER_NOTIFY_WHATSAPP ?? null,
  notifyCustomerEmail: true,
  notifyCustomerWhatsapp: true,
  shippingFlatRate: siteConfig.shipping.flatRate,
  freeShippingThreshold: siteConfig.shipping.freeShippingThreshold,
  installationFee: siteConfig.installation.fee,
};

export async function getStoreSettings(): Promise<StoreSettings> {
  if (isDbConfigured) {
    try {
      const row = await prisma.storeSettings.findUnique({ where: { id: 1 } });
      if (row) {
        return {
          ownerNotifyEmail: row.ownerNotifyEmail ?? DEFAULT_SETTINGS.ownerNotifyEmail,
          ownerNotifyWhatsapp: row.ownerNotifyWhatsapp ?? DEFAULT_SETTINGS.ownerNotifyWhatsapp,
          notifyCustomerEmail: row.notifyCustomerEmail,
          notifyCustomerWhatsapp: row.notifyCustomerWhatsapp,
          shippingFlatRate: row.shippingFlatRate ?? DEFAULT_SETTINGS.shippingFlatRate,
          freeShippingThreshold: row.freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold,
          installationFee: row.installationFee ?? DEFAULT_SETTINGS.installationFee,
        };
      }
    } catch (e) {
      console.warn("[notify] settings read failed:", (e as Error).message);
    }
  }
  return DEFAULT_SETTINGS;
}

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------
export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<void> {
  const from = process.env.EMAIL_FROM ?? `${siteConfig.name} <onboarding@resend.dev>`;

  // 1) Resend (HTTP API, no dependency needed)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to: [opts.to], subject: opts.subject, html: opts.html }),
      });
      if (!res.ok) console.warn("[notify] Resend error:", await res.text());
      return;
    } catch (e) {
      console.warn("[notify] Resend request failed:", (e as Error).message);
      return;
    }
  }

  // 2) SMTP via nodemailer (Outlook, Gmail, etc.)
  if (process.env.SMTP_HOST) {
    try {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transport.sendMail({ from, to: opts.to, subject: opts.subject, html: opts.html });
      return;
    } catch (e) {
      console.warn("[notify] SMTP send failed:", (e as Error).message);
      return;
    }
  }

  // 3) Demo fallback
  console.log(`\n📧 [EMAIL → ${opts.to}] ${opts.subject}\n(No email provider configured, set RESEND_API_KEY or SMTP_* to send.)`);
}

/** @deprecated Use sendWhatsAppText or sendWhatsAppSmart from @/lib/whatsapp */
export async function sendWhatsApp(opts: { to: string; text: string }): Promise<void> {
  await sendWhatsAppText(opts);
}

function templateName(key: "order" | "dispatch" | "cancel" | "owner"): string | null {
  const map: Record<string, string | undefined> = {
    order: process.env.WHATSAPP_TEMPLATE_ORDER_CONFIRM,
    dispatch: process.env.WHATSAPP_TEMPLATE_ORDER_DISPATCH,
    cancel: process.env.WHATSAPP_TEMPLATE_ORDER_CANCEL,
    owner: process.env.WHATSAPP_TEMPLATE_OWNER_NEW_ORDER,
  };
  return map[key]?.trim() || null;
}

// ---------------------------------------------------------------------------
// Message builders
// ---------------------------------------------------------------------------
type OrderLike = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  total: number;
  paymentMethod: string;
  installationType?: "NONE" | "WARRANTY" | "PAID" | string | null;
  installationFee?: number | null;
  replacementSerial?: string | null;
  items: {
    name: string;
    quantity: number;
    price: number;
    listPrice?: number | null;
    underWarranty?: boolean;
  }[];
};

function installLabel(type?: string | null): string {
  if (type === "WARRANTY") return "Warranty claim";
  if (type === "PAID") return "Installation & Removal";
  if (type === "NONE") return "No Installation & Removal";
  return "";
}

function itemsTextLines(order: OrderLike): string {
  return order.items
    .map((i) => {
      const tag = i.underWarranty ? " [warranty]" : "";
      return `• ${i.name} × ${i.quantity}${tag}, ${formatCurrency(i.price * i.quantity)}`;
    })
    .join("\n");
}
function itemsHtmlRows(order: OrderLike): string {
  return order.items
    .map((i) => {
      const tag = i.underWarranty ? ' <span style="color:#15803d;font-size:12px">(warranty)</span>' : "";
      return `<tr><td style="padding:6px 0;color:#374151">${i.name} × ${i.quantity}${tag}</td><td style="padding:6px 0;text-align:right;color:#111827">${formatCurrency(i.price * i.quantity)}</td></tr>`;
    })
    .join("");
}

function installTextBlock(order: OrderLike): string {
  const label = installLabel(order.installationType);
  if (!label) return "";
  const fee = formatCurrency(order.installationFee ?? 0);
  const serial = order.replacementSerial ? `\nReplacement serial: ${order.replacementSerial}` : "";
  return `\nInstallation: ${label} (${fee})${serial}`;
}

function installHtmlBlock(order: OrderLike): string {
  const label = installLabel(order.installationType);
  if (!label) return "";
  const fee = formatCurrency(order.installationFee ?? 0);
  const serial = order.replacementSerial
    ? `<br/>Replacement serial: <b>${order.replacementSerial}</b>`
    : "";
  return `<p style="color:#374151;margin-top:8px">Installation: <b>${label}</b>, ${fee}${serial}</p>`;
}
function emailShell(title: string, body: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
    <h2 style="color:#0067a5;margin:0 0 4px">${siteConfig.name}</h2>
    <h3 style="margin:16px 0 8px;color:#111827">${title}</h3>
    ${body}
    <p style="margin-top:24px;color:#6b7280;font-size:13px">${siteConfig.name} · ${siteConfig.contact.phone} · ${siteConfig.contact.email}</p>
  </div>`;
}

// ---------------------------------------------------------------------------
// High-level notifications
// ---------------------------------------------------------------------------

/** Fire when a new order is placed: alert the owner + confirm to the customer. */
export async function notifyNewOrder(order: OrderLike): Promise<void> {
  const settings = await getStoreSettings();
  const tasks: Promise<void>[] = [];

  // → Owner alert
  if (settings.ownerNotifyEmail) {
    tasks.push(
      sendEmail({
        to: settings.ownerNotifyEmail,
        subject: `🛒 New order ${order.orderNumber} (${formatCurrency(order.total)})`,
        html: emailShell(
          `New order received: ${order.orderNumber}`,
          `<p style="color:#374151">Customer: <b>${order.customerName}</b> (${order.customerPhone}, ${order.customerEmail})<br/>
           Deliver to: ${order.address}, ${order.city}<br/>Payment: ${order.paymentMethod}</p>
           ${installHtmlBlock(order)}
           <table style="width:100%;border-collapse:collapse;margin-top:8px">${itemsHtmlRows(order)}
           <tr><td style="padding-top:10px;font-weight:700">Total</td><td style="padding-top:10px;text-align:right;font-weight:700">${formatCurrency(order.total)}</td></tr></table>`
        ),
      })
    );
  }
  if (settings.ownerNotifyWhatsapp) {
    const ownerText = `🛒 *New order ${order.orderNumber}*\nCustomer: ${order.customerName} (${order.customerPhone})\nDeliver to: ${order.address}, ${order.city}\nPayment: ${order.paymentMethod}${installTextBlock(order)}\n\n${itemsTextLines(order)}\n\n*Total: ${formatCurrency(order.total)}*`;
    tasks.push(
      sendWhatsAppSmart({
        to: settings.ownerNotifyWhatsapp,
        text: ownerText,
        templateName: templateName("owner"),
        templateParams: [
          order.orderNumber,
          order.customerName,
          order.customerPhone,
          `${order.address}, ${order.city}`,
          formatCurrency(order.total),
        ],
      }).then(() => {})
    );
  }

  // → Customer confirmation
  if (settings.notifyCustomerEmail && order.customerEmail) {
    tasks.push(
      sendEmail({
        to: order.customerEmail,
        subject: `Order confirmed: ${order.orderNumber}`,
        html: emailShell(
          `Thank you for your order, ${order.customerName}!`,
          `<p style="color:#374151">We've received your order <b>${order.orderNumber}</b> and will contact you shortly to confirm delivery.</p>
           ${installHtmlBlock(order)}
           <table style="width:100%;border-collapse:collapse;margin-top:8px">${itemsHtmlRows(order)}
           <tr><td style="padding-top:10px;font-weight:700">Total</td><td style="padding-top:10px;text-align:right;font-weight:700">${formatCurrency(order.total)}</td></tr></table>
           <p style="color:#374151;margin-top:12px">Payment method: ${order.paymentMethod}</p>`
        ),
      })
    );
  }
  if (settings.notifyCustomerWhatsapp && order.customerPhone) {
    const customerText = `Hi ${order.customerName}, thank you for your order at ${siteConfig.name}! 🙏\n\n*Order ${order.orderNumber}*${installTextBlock(order)}\n${itemsTextLines(order)}\n\n*Total: ${formatCurrency(order.total)}*\nPayment: ${order.paymentMethod}\n\nWe'll contact you shortly to confirm delivery.`;
    tasks.push(
      sendWhatsAppSmart({
        to: order.customerPhone,
        text: customerText,
        templateName: templateName("order"),
        templateParams: [
          order.customerName,
          order.orderNumber,
          formatCurrency(order.total),
          order.paymentMethod,
        ],
      }).then(() => {})
    );
  }

  await Promise.allSettled(tasks);
}

/** Fire when the owner dispatches an order: notify the customer. */
export async function notifyDispatch(order: OrderLike): Promise<void> {
  const settings = await getStoreSettings();
  const tasks: Promise<void>[] = [];

  if (settings.notifyCustomerEmail && order.customerEmail) {
    tasks.push(
      sendEmail({
        to: order.customerEmail,
        subject: `Your order ${order.orderNumber} has been dispatched 🚚`,
        html: emailShell(
          `Your order is on its way!`,
          `<p style="color:#374151">Good news ${order.customerName}. Your order <b>${order.orderNumber}</b> has been dispatched and will reach you soon.</p>
           <p style="color:#374151">Deliver to: ${order.address}, ${order.city}</p>
           <p style="color:#374151">Total: <b>${formatCurrency(order.total)}</b> (${order.paymentMethod})</p>`
        ),
      })
    );
  }
  if (settings.notifyCustomerWhatsapp && order.customerPhone) {
    const dispatchText = `🚚 Hi ${order.customerName}, your order *${order.orderNumber}* from ${siteConfig.name} has been *dispatched* and is on its way!\n\nDeliver to: ${order.address}, ${order.city}\nTotal: ${formatCurrency(order.total)} (${order.paymentMethod})\n\nThank you for shopping with us!`;
    tasks.push(
      sendWhatsAppSmart({
        to: order.customerPhone,
        text: dispatchText,
        templateName: templateName("dispatch"),
        templateParams: [order.customerName, order.orderNumber, order.city, formatCurrency(order.total)],
      }).then(() => {})
    );
  }

  await Promise.allSettled(tasks);
}

/** Fire when an order is cancelled: notify the customer by email and WhatsApp. */
export async function notifyCancellation(order: OrderLike): Promise<void> {
  const tasks: Promise<void>[] = [];

  if (order.customerEmail) {
    tasks.push(
      sendEmail({
        to: order.customerEmail,
        subject: `Order cancelled: ${order.orderNumber}`,
        html: emailShell(
          "Your order has been cancelled",
          `<p style="color:#374151">Hi ${order.customerName}, your order <b>${order.orderNumber}</b> at ${siteConfig.name} has been <b>cancelled</b>.</p>
           <table style="width:100%;border-collapse:collapse;margin-top:8px">${itemsHtmlRows(order)}
           <tr><td style="padding-top:10px;font-weight:700">Total</td><td style="padding-top:10px;text-align:right;font-weight:700">${formatCurrency(order.total)}</td></tr></table>
           <p style="color:#374151;margin-top:12px">If you have any questions or did not request this cancellation, please contact us at ${siteConfig.contact.phone} or ${siteConfig.contact.email}.</p>`
        ),
      })
    );
  }

  if (order.customerPhone) {
    const cancelText = `Hi ${order.customerName}, your order *${order.orderNumber}* at ${siteConfig.name} has been *cancelled*.\n\n${itemsTextLines(order)}\n\n*Total: ${formatCurrency(order.total)}*\n\nIf you have questions, call ${siteConfig.contact.phone} or email ${siteConfig.contact.email}.`;
    tasks.push(
      sendWhatsAppSmart({
        to: order.customerPhone,
        text: cancelText,
        templateName: templateName("cancel"),
        templateParams: [order.customerName, order.orderNumber, formatCurrency(order.total)],
      }).then(() => {})
    );
  }

  await Promise.allSettled(tasks);
}
