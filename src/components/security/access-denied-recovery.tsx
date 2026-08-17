"use client";

import { useCallback, useState } from "react";
import { InvisibleChallenge } from "./invisible-challenge";

/**
 * Completes the invisible browser challenge on /access-denied, then opens the storefront.
 * Without this, "Try storefront" immediately re-hits the proxy and loops.
 */
export function AccessDeniedRecovery() {
  const [status, setStatus] = useState<"checking" | "opening">("checking");

  const onComplete = useCallback(() => {
    setStatus("opening");
    window.location.replace("/ar");
  }, []);

  return (
    <>
      <InvisibleChallenge force onComplete={onComplete} />
      <p style={{ opacity: 0.55, fontSize: 13, marginTop: 18 }}>
        {status === "opening" ? "Opening storefront…" : "Verifying browser…"}
      </p>
    </>
  );
}
