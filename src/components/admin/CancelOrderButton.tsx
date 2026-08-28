"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export function CancelOrderButton({
  action,
  disabled,
}: {
  action: () => Promise<void>;
  disabled?: boolean;
}) {
  const [pending, start] = useTransition();

  function onClick() {
    if (
      !confirm(
        "Cancel this order? The customer will be notified by email and WhatsApp, and product stock will be restored."
      )
    ) {
      return;
    }
    start(() => action());
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-orange-300 text-orange-800 hover:bg-orange-50"
      disabled={disabled || pending}
      onClick={onClick}
    >
      <Icons.close className="h-4 w-4" />
      {pending ? "Cancelling…" : "Cancel Order & Notify Customer"}
    </Button>
  );
}
