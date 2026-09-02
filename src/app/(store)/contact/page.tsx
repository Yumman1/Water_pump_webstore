"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { SocialLinks } from "@/components/store/SocialLinks";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send message");
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-gray-600">Have a water pump problem or need help choosing the right product? Get in touch.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border bg-white p-5">
              <Icons.phone className="mt-0.5 h-5 w-5 text-brand-600" />
              <div>
                <p className="font-semibold text-gray-900">Phone</p>
                <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="text-gray-600 hover:text-brand-600">
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border bg-white p-5">
              <Icons.whatsapp className="mt-0.5 h-5 w-5 text-green-500" />
              <div>
                <p className="font-semibold text-gray-900">WhatsApp</p>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "").replace(/^0/, "92")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-brand-600"
                >
                  {siteConfig.contact.whatsapp}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border bg-white p-5">
              <Icons.headset className="mt-0.5 h-5 w-5 text-brand-600" />
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-gray-600 hover:text-brand-600">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <p className="font-semibold text-gray-900">Head Office</p>
              <p className="mt-1 text-gray-600">{siteConfig.contact.address}</p>
              <p className="mt-3 font-semibold text-gray-900">Manufacturing</p>
              <p className="mt-1 text-gray-600">{siteConfig.contact.manufacturing}</p>
              <p className="mt-2 text-sm text-gray-500">{siteConfig.contact.hours}</p>
              <a
                href={siteConfig.contact.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                View on map →
              </a>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <SocialLinks variant="contact" />
              <p className="mt-3 text-sm text-gray-500">Follow Jawed Pumps for product updates, tips and offers.</p>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Icons.check className="h-8 w-8" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">Message sent!</h2>
                <p className="mt-1 text-gray-500">We&apos;ll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    required
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    required
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" size="lg" className="w-full" disabled={busy}>
                  {busy ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
