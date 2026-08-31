import { NextResponse } from "next/server";
import { z } from "zod";
import { getStoreSettings, sendEmail } from "@/lib/notify";
import { siteConfig } from "@/config/site";

const schema = z.object({
  serviceTitle: z.string().min(1),
  name: z.string().min(2),
  phone: z.string().min(6),
  city: z.string().optional(),
  details: z.string().optional(),
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
    return NextResponse.json({ error: "Please fill in required fields." }, { status: 400 });
  }

  const { serviceTitle, name, phone, city, details } = parsed.data;
  const settings = await getStoreSettings();
  const to = settings.ownerNotifyEmail ?? siteConfig.contact.email;

  const html = `
    <h2>Service request: ${serviceTitle}</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    ${city ? `<p><strong>City:</strong> ${city}</p>` : ""}
    ${details ? `<p><strong>Details:</strong><br>${details.replace(/\n/g, "<br>")}</p>` : ""}
  `;

  try {
    await sendEmail({
      to,
      subject: `[${siteConfig.name}] Service request: ${serviceTitle}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[service-request]", e);
    return NextResponse.json({ error: "Could not submit request. Please WhatsApp us." }, { status: 500 });
  }
}
