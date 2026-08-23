import { NextResponse } from "next/server";
import { z } from "zod";
import { getStoreSettings, sendEmail } from "@/lib/notify";
import { siteConfig } from "@/config/site";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
  }

  const { name, email, message } = parsed.data;
  const settings = await getStoreSettings();
  const to = settings.ownerNotifyEmail ?? siteConfig.contact.email;

  const html = `
    <h2>New contact message — ${siteConfig.name}</h2>
    <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, "<br>")}</p>
  `;

  try {
    await sendEmail({
      to,
      subject: `[${siteConfig.name}] Contact from ${name}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact]", e);
    return NextResponse.json({ error: "Could not send message. Please call or WhatsApp us." }, { status: 500 });
  }
}
