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
import { absoluteUrl } from "@/lib/seo";
import { JAWED_LOGO_PNG_BASE64 } from "@/lib/jawed-logo-base64";

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
const EMAIL_LOGO_CID = "jawed-logo";

function emailLogoAttachment() {
  return {
    filename: "jawed-logo.png",
    content: JAWED_LOGO_PNG_BASE64,
    contentId: EMAIL_LOGO_CID,
    content_id: EMAIL_LOGO_CID,
    contentType: "image/png",
    content_type: "image/png",
  };
}

export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<void> {
  const from = process.env.EMAIL_FROM ?? `${siteConfig.name} <onboarding@resend.dev>`;
  const logo = emailLogoAttachment();

  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [opts.to],
          subject: opts.subject,
          html: opts.html,
          attachments: [logo],
        }),
      });
      if (!res.ok) console.warn("[notify] Resend error:", await res.text());
      return;
    } catch (e) {
      console.warn("[notify] Resend request failed:", (e as Error).message);
      return;
    }
  }

  if (process.env.SMTP_HOST) {
    try {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transport.sendMail({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        attachments: [
          {
            filename: "jawed-logo.png",
            content: Buffer.from(JAWED_LOGO_PNG_BASE64, "base64"),
            cid: EMAIL_LOGO_CID,
            contentDisposition: "inline",
          },
        ],
      });
      return;
    } catch (e) {
      console.warn("[notify] SMTP send failed:", (e as Error).message);
      return;
    }
  }

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
  subtotal?: number;
  shipping?: number;
  discount?: number;
  couponCode?: string | null;
  tax?: number;
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

function paymentLabel(method: string): string {
  if (method === "COD") return "Cash on Delivery (COD)";
  if (method === "BANK_TRANSFER") return "Bank Transfer";
  return method;
}

function deliveryAddress(order: OrderLike): string {
  return [order.address, order.city].filter(Boolean).join(", ");
}

function orderSubtotal(order: OrderLike): number {
  if (typeof order.subtotal === "number") return order.subtotal;
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function installNote(type?: string | null): string {
  if (type === "WARRANTY") return "Under warranty";
  if (type === "PAID") return "Without warranty";
  if (type === "NONE") return "No installation";
  return "";
}

function itemsTextLines(order: OrderLike): string {
  return order.items
    .map((i) => {
      const tag = i.underWarranty ? " [warranty]" : "";
      return `• ${i.name} × ${i.quantity}${tag} — ${formatCurrency(i.price * i.quantity)}`;
    })
    .join("\n");
}

function itemsHtmlRows(order: OrderLike): string {
  return order.items
    .map((i) => {
      const tag = i.underWarranty
        ? ' <span style="color:#15803d;font-size:12px">(warranty)</span>'
        : "";
      return `<tr>
        <td style="padding:8px 0;color:#374151;font-size:14px">${i.name} × ${i.quantity}${tag}</td>
        <td style="padding:8px 0;text-align:right;color:#111827;font-size:14px;white-space:nowrap">${formatCurrency(i.price * i.quantity)}</td>
      </tr>`;
    })
    .join("");
}

function htmlMoneyRow(opts: {
  label: string;
  amount: string;
  color?: string;
  note?: string;
  bold?: boolean;
  total?: boolean;
}): string {
  const color = opts.color ?? (opts.bold || opts.total ? "#111827" : "#6b7280");
  const amountColor = opts.color ?? "#111827";
  const weight = opts.bold || opts.total ? "700" : "400";
  const border = opts.total ? "border-top:2px solid #e5e7eb;" : "";
  const padTop = opts.total ? "12px" : "6px";
  const note = opts.note
    ? `<br/><span style="font-size:12px;font-weight:400;color:#6b7280">${opts.note}</span>`
    : "";
  return `<tr>
    <td style="padding:${padTop} 0 6px;color:${color};font-size:${opts.total ? "16px" : "14px"};font-weight:${weight};${border}">${opts.label}${note}</td>
    <td style="padding:${padTop} 0 6px;text-align:right;color:${amountColor};font-size:${opts.total ? "16px" : "14px"};font-weight:${weight};white-space:nowrap;${border}">${opts.amount}</td>
  </tr>`;
}

function totalsHtmlTable(order: OrderLike): string {
  const note = installNote(order.installationType);
  const serial = order.replacementSerial ? `Serial: ${order.replacementSerial}` : "";
  const installDetail = [note, serial].filter(Boolean).join(" · ");
  const discount = order.discount ?? 0;
  const tax = order.tax ?? 0;
  const coupon = order.couponCode?.trim();

  let summary = htmlMoneyRow({
    label: "Subtotal",
    amount: formatCurrency(orderSubtotal(order)),
  });
  summary += htmlMoneyRow({
    label: "Installation &amp; removal",
    amount: formatCurrency(order.installationFee ?? 0),
    note: installDetail || undefined,
  });
  if (typeof order.shipping === "number") {
    summary += htmlMoneyRow({
      label: "Delivery",
      amount: order.shipping === 0 ? "Free" : formatCurrency(order.shipping),
    });
  }
  if (discount > 0) {
    summary += htmlMoneyRow({
      label: coupon ? `Discount (${coupon})` : "Discount",
      amount: `-${formatCurrency(discount)}`,
      color: "#15803d",
    });
  }
  if (tax > 0) {
    summary += htmlMoneyRow({ label: "Tax", amount: formatCurrency(tax) });
  }
  summary += htmlMoneyRow({
    label: "Total",
    amount: formatCurrency(order.total),
    total: true,
  });

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:8px">
    ${itemsHtmlRows(order)}
    <tr><td colspan="2" style="padding:8px 0 0;border-top:1px solid #e5e7eb;font-size:0;line-height:0">&nbsp;</td></tr>
    ${summary}
  </table>`;
}

function totalsTextBlock(order: OrderLike): string {
  const note = installNote(order.installationType);
  const lines = [
    itemsTextLines(order),
    "",
    `Subtotal: ${formatCurrency(orderSubtotal(order))}`,
    `Installation & removal: ${formatCurrency(order.installationFee ?? 0)}${note ? ` (${note})` : ""}`,
  ];
  if (order.replacementSerial) {
    lines.push(`Replacement serial: ${order.replacementSerial}`);
  }
  if (typeof order.shipping === "number") {
    lines.push(`Delivery: ${order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}`);
  }
  const discount = order.discount ?? 0;
  if (discount > 0) {
    const coupon = order.couponCode?.trim();
    lines.push(`Discount${coupon ? ` (${coupon})` : ""}: -${formatCurrency(discount)}`);
  }
  if ((order.tax ?? 0) > 0) {
    lines.push(`Tax: ${formatCurrency(order.tax ?? 0)}`);
  }
  lines.push(`*Total: ${formatCurrency(order.total)}*`);
  return lines.join("\n");
}

function sectionHtml(title: string, body?: string): string {
  const heading = `<p style="margin:16px 0 0;color:#6b7280;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase">${title}</p>`;
  if (!body) return heading;
  return `${heading}
    <p style="margin:4px 0 0;color:#111827;font-size:14px;line-height:1.6">${body}</p>`;
}

function customerHtmlBlock(order: OrderLike): string {
  const email = order.customerEmail?.trim() || "No email provided";
  return sectionHtml(
    "Customer",
    `<b>${order.customerName}</b><br/>${order.customerPhone}<br/>${email}`
  );
}

function deliveryHtmlBlock(order: OrderLike): string {
  return sectionHtml("Delivery address", deliveryAddress(order));
}

function paymentHtmlBlock(order: OrderLike): string {
  return sectionHtml("Payment", paymentLabel(order.paymentMethod));
}

export function emailShell(title: string, body: string): string {
  const shopUrl = absoluteUrl("/");
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f3f4f6">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6">
    <tr>
      <td align="center" style="padding:24px 12px">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden">
          <tr>
            <td align="center" style="background:#ffffff;padding:28px 24px 12px">
              <a href="${shopUrl}" style="text-decoration:none">
                <img src="cid:${EMAIL_LOGO_CID}" alt="${siteConfig.name}" width="240" height="65" style="display:block;width:240px;max-width:80%;height:auto;border:0;outline:none" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px;font-family:system-ui,Segoe UI,sans-serif">
              <h2 style="margin:0 0 16px;color:#111827;font-size:20px;line-height:1.3">${title}</h2>
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px;border-top:1px solid #f3f4f6;font-family:system-ui,Segoe UI,sans-serif;text-align:center">
              <p style="margin:0 0 6px;color:#ea580c;font-size:13px;font-weight:600">${siteConfig.legalName}</p>
              <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6">
                <a href="tel:${siteConfig.contact.phone.replace(/\s/g, "")}" style="color:#4b5563;text-decoration:none">${siteConfig.contact.phone}</a>
                ·
                <a href="mailto:${siteConfig.contact.email}" style="color:#4b5563;text-decoration:none">${siteConfig.contact.email}</a><br/>
                <a href="${shopUrl}" style="color:#ea580c;text-decoration:none">www.jawedpumps.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// High-level notifications
// ---------------------------------------------------------------------------

/** Fire when a new order is placed: alert the owner + confirm to the customer. */
export async function notifyNewOrder(order: OrderLike): Promise<void> {
  const settings = await getStoreSettings();
  const tasks: Promise<void>[] = [];

  // → Owner alert (always — checkout email is optional for the customer)
  const ownerEmail = settings.ownerNotifyEmail?.trim() || siteConfig.contact.email;
  if (ownerEmail) {
    tasks.push(
      sendEmail({
        to: ownerEmail,
        subject: `🛒 New order ${order.orderNumber} (${formatCurrency(order.total)})`,
        html: emailShell(
          `New order received: ${order.orderNumber}`,
          `${customerHtmlBlock(order)}
           ${deliveryHtmlBlock(order)}
           ${paymentHtmlBlock(order)}
           ${sectionHtml("Items")}
           ${totalsHtmlTable(order)}`
        ),
      })
    );
  }
  if (settings.ownerNotifyWhatsapp) {
    const ownerText = `🛒 *New order ${order.orderNumber}*\nCustomer: ${order.customerName} (${order.customerPhone})\nDelivery: ${deliveryAddress(order)}\nPayment: ${paymentLabel(order.paymentMethod)}\n\n${totalsTextBlock(order)}`;
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
          `<p style="margin:0;color:#374151;font-size:14px;line-height:1.6">We've received your order <b>${order.orderNumber}</b> and will contact you shortly to confirm delivery.</p>
           ${deliveryHtmlBlock(order)}
           ${paymentHtmlBlock(order)}
           ${sectionHtml("Items")}
           ${totalsHtmlTable(order)}`
        ),
      })
    );
  }
  if (settings.notifyCustomerWhatsapp && order.customerPhone) {
    const customerText = `Hi ${order.customerName}, thank you for your order at ${siteConfig.name}! 🙏\n\n*Order ${order.orderNumber}*\nDelivery: ${deliveryAddress(order)}\nPayment: ${paymentLabel(order.paymentMethod)}\n\n${totalsTextBlock(order)}\n\nWe'll contact you shortly to confirm delivery.`;
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
          `<p style="margin:0;color:#374151;font-size:14px;line-height:1.6">Good news ${order.customerName}. Your order <b>${order.orderNumber}</b> has been dispatched and will reach you soon.</p>
           ${deliveryHtmlBlock(order)}
           ${paymentHtmlBlock(order)}
           ${sectionHtml("Items")}
           ${totalsHtmlTable(order)}`
        ),
      })
    );
  }
  if (settings.notifyCustomerWhatsapp && order.customerPhone) {
    const dispatchText = `🚚 Hi ${order.customerName}, your order *${order.orderNumber}* from ${siteConfig.name} has been *dispatched* and is on its way!\n\nDelivery: ${deliveryAddress(order)}\nPayment: ${paymentLabel(order.paymentMethod)}\n\n${totalsTextBlock(order)}\n\nThank you for shopping with us!`;
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
          `<p style="margin:0;color:#374151;font-size:14px;line-height:1.6">Hi ${order.customerName}, your order <b>${order.orderNumber}</b> at ${siteConfig.name} has been <b>cancelled</b>.</p>
           ${deliveryHtmlBlock(order)}
           ${totalsHtmlTable(order)}
           <p style="color:#374151;margin-top:16px;font-size:14px;line-height:1.6">If you have any questions or did not request this cancellation, please contact us at ${siteConfig.contact.phone} or ${siteConfig.contact.email}.</p>`
        ),
      })
    );
  }

  if (order.customerPhone) {
    const cancelText = `Hi ${order.customerName}, your order *${order.orderNumber}* at ${siteConfig.name} has been *cancelled*.\n\n${totalsTextBlock(order)}\n\nIf you have questions, call ${siteConfig.contact.phone} or email ${siteConfig.contact.email}.`;
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
