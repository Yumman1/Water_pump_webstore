"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export function ServiceRequestForm({ serviceTitle }: { serviceTitle: string }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "", details: "" });

  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi, I'd like to request the "${serviceTitle}" service.`
  )}`;

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

  if (sent) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Icons.check className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Request received!</h3>
        <p className="mt-1 text-gray-500">Our team will contact you shortly to arrange your {serviceTitle.toLowerCase()}.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-lg font-bold text-gray-900">Request this service</h3>
      <p className="mt-1 text-sm text-gray-500">Fill in your details and we&apos;ll call you back.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="mt-4 space-y-3"
      >
        <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        <input required placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
        <input placeholder="City / area" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
        <textarea placeholder="Describe what you need (optional)" rows={3} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
        <Button type="submit" size="lg" className="w-full">Request Service</Button>
      </form>
      <a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-green-500 py-2.5 text-sm font-semibold text-green-600 hover:bg-green-50">
        <Icons.whatsapp className="h-5 w-5" /> Chat on WhatsApp
      </a>
    </div>
  );
}
