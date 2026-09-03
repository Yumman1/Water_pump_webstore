"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function TestNotificationsButton({
  action,
  disabled,
}: {
  action: () => Promise<string>;
  disabled?: boolean;
}) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        disabled={disabled || pending}
        onClick={() =>
          start(async () => {
            setMessage(null);
            setFailed(false);
            try {
              const result = await action();
              setFailed(/failed/i.test(result));
              setMessage(result);
            } catch (e) {
              setFailed(true);
              setMessage((e as Error).message || "Test failed.");
            }
          })
        }
      >
        {pending ? "Sending…" : "Send test to my email & WhatsApp"}
      </Button>
      {message && (
        <p className={`text-sm ${failed ? "text-red-600" : "text-green-700"}`}>{message}</p>
      )}
    </div>
  );
}
