"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PromoPopupConfig } from "@/lib/promo";
import { Icons } from "@/components/ui/icons";

const STORAGE_KEY = "promo-popup-dismissed";

export function DealPopup({ promo }: { promo: PromoPopupConfig }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!promo.enabled) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(t);
  }, [promo.enabled]);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  function copyCode() {
    if (!promo.couponCode) return;
    navigator.clipboard?.writeText(promo.couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  if (!promo.enabled || !open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="promo-heading">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} aria-hidden />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          onClick={close}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow hover:bg-white"
          aria-label="Close"
        >
          <Icons.close className="h-5 w-5" />
        </button>

        <div className="grid sm:grid-cols-2">
          <div className="relative hidden aspect-square sm:block">
            <Image src={promo.image} alt="" fill sizes="50vw" className="object-cover" />
          </div>

          <div className="p-6 text-center sm:p-7 sm:text-left">
            {promo.badge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
                <Icons.tag className="h-3.5 w-3.5" /> {promo.badge}
              </span>
            )}
            <h2 id="promo-heading" className="mt-3 text-2xl font-extrabold text-gray-900">{promo.heading}</h2>
            <p className="mt-2 text-sm text-gray-600">{promo.message}</p>

            {promo.couponCode && (
              <button
                onClick={copyCode}
                className="mt-4 flex w-full items-center justify-between gap-2 rounded-lg border-2 border-dashed border-brand-300 bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 hover:bg-brand-100"
              >
                <span>Code: {promo.couponCode}</span>
                <span className="text-xs font-medium text-brand-600">{copied ? "Copied!" : "Tap to copy"}</span>
              </button>
            )}

            <Link
              href={promo.ctaHref}
              onClick={close}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-lg bg-accent font-semibold text-white hover:brightness-95"
            >
              {promo.ctaLabel}
            </Link>
            <button onClick={close} className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600">
              No thanks, maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
