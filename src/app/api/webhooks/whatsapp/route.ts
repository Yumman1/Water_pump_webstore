import { NextResponse } from "next/server";
import { sendWhatsAppText, whatsAppAutoReplyText } from "@/lib/whatsapp";

/**
 * Meta WhatsApp Business webhook.
 * GET  — verification handshake (Meta Developer Console)
 * POST — incoming messages (optional auto-reply)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN?.trim();
  if (mode === "subscribe" && verifyToken && token === verifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (process.env.WHATSAPP_AUTO_REPLY !== "true") {
    return NextResponse.json({ ok: true });
  }

  try {
    const entry = (body as { entry?: { changes?: { value?: { messages?: { from: string; type: string }[] } }[] }[] })
      .entry?.[0];
    const change = entry?.changes?.[0];
    const messages = change?.value?.messages ?? [];

    for (const msg of messages) {
      if (msg.type !== "text" && msg.type !== "button") continue;
      const from = msg.from;
      if (!from) continue;
      await sendWhatsAppText({ to: from, text: whatsAppAutoReplyText() });
    }
  } catch (e) {
    console.warn("[whatsapp webhook]", (e as Error).message);
  }

  return NextResponse.json({ ok: true });
}
