/**
 * Meta WhatsApp Business Cloud API — text + template messages.
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 */
import { siteConfig } from "@/config/site";

export function isWhatsAppConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

/** Normalize a phone number to international digits (Pakistan 92… when local 0…). */
export function normalizeWhatsAppPhone(raw: string): string {
  let digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) digits = "92" + digits.slice(1);
  return digits;
}

type TemplateComponent = {
  type: "body" | "header" | "button";
  parameters: { type: "text"; text: string }[];
};

async function postWhatsApp(body: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) {
    return { ok: false, error: "not_configured" };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      console.warn("[whatsapp] API error:", err);
      return { ok: false, error: err };
    }
    return { ok: true };
  } catch (e) {
    console.warn("[whatsapp] request failed:", (e as Error).message);
    return { ok: false, error: (e as Error).message };
  }
}

/** Free-form text — only works within 24h of customer's last message to you. */
export async function sendWhatsAppText(opts: { to: string; text: string }): Promise<boolean> {
  const to = normalizeWhatsAppPhone(opts.to);
  if (!to) return false;

  if (!isWhatsAppConfigured()) {
    console.log(
      `\n💬 [WHATSAPP → ${to}]\n${opts.text}\n(Set WHATSAPP_TOKEN & WHATSAPP_PHONE_NUMBER_ID to send.)`
    );
    return false;
  }

  const result = await postWhatsApp({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: opts.text },
  });
  return result.ok;
}

/** Business-initiated message via approved Meta template (works outside 24h window). */
export async function sendWhatsAppTemplate(opts: {
  to: string;
  templateName: string;
  languageCode?: string;
  bodyParams?: string[];
}): Promise<boolean> {
  const to = normalizeWhatsAppPhone(opts.to);
  if (!to || !opts.templateName) return false;

  const languageCode = opts.languageCode ?? process.env.WHATSAPP_TEMPLATE_LANGUAGE ?? "en";

  const components: TemplateComponent[] = [];
  if (opts.bodyParams?.length) {
    components.push({
      type: "body",
      parameters: opts.bodyParams.map((text) => ({ type: "text", text })),
    });
  }

  if (!isWhatsAppConfigured()) {
    console.log(
      `\n💬 [WHATSAPP TEMPLATE → ${to}] ${opts.templateName}\nParams: ${opts.bodyParams?.join(" | ") ?? "(none)"}`
    );
    return false;
  }

  const result = await postWhatsApp({
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: opts.templateName,
      language: { code: languageCode },
      ...(components.length ? { components } : {}),
    },
  });
  return result.ok;
}

/** Prefer template when env is set; fall back to free text. */
export async function sendWhatsAppSmart(opts: {
  to: string;
  text: string;
  templateName?: string | null;
  templateParams?: string[];
}): Promise<boolean> {
  if (opts.templateName) {
    const sent = await sendWhatsAppTemplate({
      to: opts.to,
      templateName: opts.templateName,
      bodyParams: opts.templateParams,
    });
    if (sent) return true;
  }
  return sendWhatsAppText({ to: opts.to, text: opts.text });
}

export function getWhatsAppWebhookUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    "https://www.jawedpumps.com";
  return `${base.replace(/\/$/, "")}/api/webhooks/whatsapp`;
}

/** Short auto-reply when customers message your WhatsApp Business number. */
export function whatsAppAutoReplyText(): string {
  return (
    `Thanks for contacting ${siteConfig.name}! 🙏\n\n` +
    `• Shop online: ${process.env.NEXT_PUBLIC_SITE_URL ?? "www.jawedpumps.com"}\n` +
    `• Call / WhatsApp: ${siteConfig.contact.phone}\n` +
    `• Price list & support: our team will reply shortly during business hours (${siteConfig.contact.hours}).`
  );
}
