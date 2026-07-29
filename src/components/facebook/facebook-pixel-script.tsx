/**
 * Meta Pixel bootstrap — loads Pixel ID at runtime so EasyPanel env works
 * without baking NEXT_PUBLIC_* into the Docker build.
 */

"use client";

import { useEffect } from "react";

/** Install Meta's fbq stub early so events can queue before fbevents.js loads. */
function installFbqStub() {
  if (typeof window === "undefined" || window.fbq) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const n: any = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  };
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
}

function loadFbevents() {
  if (typeof document === "undefined") return;
  if (document.getElementById("facebook-jssdk")) return;
  const script = document.createElement("script");
  script.id = "facebook-jssdk";
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const first = document.getElementsByTagName("script")[0];
  first?.parentNode?.insertBefore(script, first);
}

export function FacebookPixelScript() {
  // Sync stub on client render so ViewContent/etc. can queue immediately
  installFbqStub();

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const res = await fetch("/api/facebook/pixel", { credentials: "same-origin" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { pixelId?: string | null };
        const pixelId = data.pixelId?.trim();
        if (!pixelId || cancelled) return;
        if (document.documentElement.dataset.fbPixel === pixelId) return;

        installFbqStub();
        loadFbevents();
        const fbq = window.fbq;
        if (!fbq) return;
        fbq("init", pixelId);
        fbq("track", "PageView");
        document.documentElement.dataset.fbPixel = pixelId;
      } catch {
        /* best-effort — CAPI still covers server events */
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
