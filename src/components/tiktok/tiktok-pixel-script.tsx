/**
 * TikTok Pixel bootstrap — loads Pixel ID at runtime so EasyPanel env works
 * without baking NEXT_PUBLIC_* into the Docker build.
 */

"use client";

import { useEffect } from "react";

function installTtqStub() {
  if (typeof window === "undefined" || window.ttq) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const t = "ttq";
  w.TiktokAnalyticsObject = t;
  const ttq = (w[t] = w[t] || []);
  ttq.methods = [
    "page",
    "track",
    "identify",
    "instances",
    "debug",
    "on",
    "off",
    "once",
    "ready",
    "alias",
    "group",
    "enableCookie",
    "disableCookie",
    "holdConsent",
    "revokeConsent",
    "grantConsent",
  ];
  ttq.setAndDefer = function (target: { push: (args: unknown[]) => void }, method: string) {
    target[method] = function (...args: unknown[]) {
      target.push([method, ...args]);
    };
  };
  for (let i = 0; i < ttq.methods.length; i++) {
    ttq.setAndDefer(ttq, ttq.methods[i]);
  }
  ttq.instance = function (id: string) {
    const instance = ttq._i[id] || [];
    for (let i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(instance, ttq.methods[i]);
    }
    return instance;
  };
  ttq.load = function (id: string, options?: Record<string, unknown>) {
    const src = "https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i = ttq._i || {};
    ttq._i[id] = [];
    ttq._i[id]._u = src;
    ttq._t = ttq._t || {};
    ttq._t[id] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[id] = options || {};
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `${src}?sdkid=${id}&lib=${t}`;
    const first = document.getElementsByTagName("script")[0];
    first?.parentNode?.insertBefore(script, first);
  };
}

async function fetchTikTokPixelId(): Promise<string | null> {
  const endpoints = ["/api/tiktok/pixel", "/api/facebook/pixel"];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, { credentials: "same-origin" });
      if (!res.ok) continue;
      const data = (await res.json()) as { pixelId?: string | null; tiktokPixelId?: string | null };
      const id = (url.includes("tiktok") ? data.pixelId : data.tiktokPixelId)?.trim();
      if (id) return id;
    } catch {
      /* try next endpoint */
    }
  }
  return process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() || null;
}

function bootTikTokPixel(pixelId: string) {
  if (document.documentElement.dataset.ttPixel === pixelId) return;
  installTtqStub();
  window.ttq?.load(pixelId);
  window.ttq?.page();
  document.documentElement.dataset.ttPixel = pixelId;
}

export function TikTokPixelScript() {
  installTtqStub();

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const pixelId = await fetchTikTokPixelId();
      if (!pixelId || cancelled) return;
      bootTikTokPixel(pixelId);
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
