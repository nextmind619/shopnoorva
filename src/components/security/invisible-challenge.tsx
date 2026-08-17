"use client";

import { useEffect, useRef } from "react";

/**
 * Invisible JS challenge — runs quietly for suspicious / unknown visitors.
 * Collects canvas/WebGL/timing/mouse entropy and posts proof to the server.
 */
export function InvisibleChallenge({
  force = false,
  onComplete,
}: {
  force?: boolean;
  onComplete?: () => void;
}) {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const need =
      force ||
      document.cookie.includes("nv_need_ch=1") ||
      !document.cookie.includes("nv_vt=");

    // Always warm challenge for first-time visitors; skip if trust cookie exists and not forced
    if (!force && document.cookie.includes("nv_vt=") && !document.cookie.includes("nv_need_ch=1")) {
      return;
    }

    void need;

    let mouseMoves = 0;
    const onMove = () => {
      mouseMoves += 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const started = performance.now();

    const run = async () => {
      try {
        const boot = await fetch("/api/security/challenge", { method: "GET", credentials: "same-origin" });
        if (!boot.ok) return;
        const { token } = (await boot.json()) as { token: string };

        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 50;
        const ctx = canvas.getContext("2d");
        let canvasHash = "";
        if (ctx) {
          ctx.fillStyle = "#1a1a2e";
          ctx.fillRect(0, 0, 200, 50);
          ctx.fillStyle = "#e94560";
          ctx.font = "16px sans-serif";
          ctx.fillText("nv-ch", 10, 28);
          canvasHash = await sha256(canvas.toDataURL());
        }

        let webglHash = "";
        try {
          const gl =
            (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
            (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
          if (gl) {
            const dbg = gl.getExtension("WEBGL_debug_renderer_info");
            const vendor = dbg ? String(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL)) : "";
            const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
            webglHash = await sha256(`${vendor}|${renderer}`);
          }
        } catch {
          webglHash = "na";
        }

        // Small human delay
        await sleep(120 + Math.random() * 180);

        const timingMs = Math.round(performance.now() - started);
        const proof = await sha256(`${token.split(".")[0]}:${canvasHash}:${Math.floor(timingMs / 50)}`);

        const signals = {
          canvas: canvasHash,
          webgl: webglHash,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
          language: navigator.language || "",
          platform: navigator.platform || "",
          hardwareConcurrency: navigator.hardwareConcurrency || 0,
          maxTouchPoints: navigator.maxTouchPoints || 0,
          webdriver: Boolean((navigator as Navigator & { webdriver?: boolean }).webdriver),
          outerWidth: window.outerWidth || 0,
          outerHeight: window.outerHeight || 0,
          timingMs,
          mouseMoves,
          proof,
        };

        const posted = await fetch("/api/security/challenge", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, signals }),
        });

        // Clear need-challenge soft flag
        document.cookie = "nv_need_ch=; Max-Age=0; path=/";
        if (posted.ok) onComplete?.();
      } catch {
        /* silent — never break checkout UX */
      } finally {
        window.removeEventListener("pointermove", onMove);
      }
    };

    // Defer so LCP / checkout stay fast
    if ("requestIdleCallback" in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
        void run();
      });
    } else {
      setTimeout(() => void run(), 400);
    }
  }, [force, onComplete]);

  return null;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
