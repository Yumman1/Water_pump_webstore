"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function TestNotificationsButton({
  action,
  disabled,
}: {
  action: () => Promise<void>;
  disabled?: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || pending}
      onClick={() => start(() => action())}
    >
      {pending ? "Sending…" : "Send test to my email & WhatsApp"}
    </Button>
  );
}
