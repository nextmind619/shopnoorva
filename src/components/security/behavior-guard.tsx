"use client";

import { useEffect, useRef } from "react";

/**
 * Client behavior guard: bots, DevTools, scrape, image harvest, automated mouse, mass nav.
 * Reports only — never interrupts real shoppers with modals.
 */
export function BehaviorGuard() {
  const navCount = useRef(0);
  const imageAttempts = useRef(0);
  const mouseSamples = useRef<Array<{ x: number; y: number; t: number }>>([]);
  const reported = useRef(new Set<string>());

  useEffect(() => {
    const report = (payload: Record<string, unknown>, key: string, severity: "low" | "medium" | "high") => {
      if (reported.current.has(key)) return;
      reported.current.add(key);
      void fetch("/api/security/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          ...payload,
          pathname: window.location.pathname,
          severity,
        }),
      }).then(async (res) => {
        if (res.status === 403) {
          window.location.href = "/access-denied";
        }
      });
    };

    // --- Automation / fake browser ---
    const nav = navigator as Navigator & {
      webdriver?: boolean;
      __selenium_unwrapped?: unknown;
      __webdriver_evaluate?: unknown;
      __driver_evaluate?: unknown;
      __fxdriver_evaluate?: unknown;
      _phantom?: unknown;
      callPhantom?: unknown;
    };

    const headlessHints: string[] = [];
    if (nav.webdriver) headlessHints.push("webdriver");
    if (nav.__selenium_unwrapped || nav.__webdriver_evaluate || nav.__driver_evaluate) {
      headlessHints.push("selenium_hooks");
    }
    if (nav._phantom || nav.callPhantom) headlessHints.push("phantom");
    if ((window as Window & { chrome?: { runtime?: unknown } }).chrome && !(window as Window & { chrome?: { runtime?: unknown } }).chrome?.runtime) {
      // soft headless chrome signal — many real Chrome have runtime; don't flag alone
    }
    if (window.outerWidth === 0 && window.outerHeight === 0) headlessHints.push("zero_outer");

    let automationTool: string | undefined;
    if (nav.webdriver) automationTool = "selenium";
    const ua = navigator.userAgent || "";
    if (/HeadlessChrome/i.test(ua)) {
      headlessHints.push("headless_ua");
      automationTool = "headless_chrome";
    }
    if (/Playwright/i.test(ua)) automationTool = "playwright";
    if (/Puppeteer/i.test(ua)) automationTool = "puppeteer";

    const fakeBrowser =
      !/Mozilla\/5\.0/i.test(ua) ||
      ((navigator.languages || []).length === 0 && /Chrome/i.test(ua));

    if (headlessHints.length || automationTool || fakeBrowser) {
      report(
        {
          webdriver: Boolean(nav.webdriver),
          headlessHints,
          automationTool,
          fakeBrowser,
        },
        `auto:${automationTool || headlessHints.join(",")}`,
        automationTool || nav.webdriver ? "high" : "medium"
      );
    }

    // --- DevTools detection (approximate, thresholded) ---
    let devtoolsHits = 0;
    const checkDevtools = () => {
      const widthGap = Math.abs(window.outerWidth - window.innerWidth) > 160;
      const heightGap = Math.abs(window.outerHeight - window.innerHeight) > 160;
      if (widthGap || heightGap) {
        devtoolsHits += 1;
        if (devtoolsHits >= 3) {
          report({ devtoolsOpen: true }, "devtools", "medium");
        }
      } else {
        devtoolsHits = Math.max(0, devtoolsHits - 1);
      }
    };
    const devtoolsTimer = window.setInterval(checkDevtools, 5000);

    // --- Image downloading / scrape ---
    const onDragStart = (e: DragEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "IMG" || t.closest("img"))) {
        imageAttempts.current += 1;
        e.preventDefault();
        if (imageAttempts.current >= 3) {
          report({ imageDownloadAttempts: imageAttempts.current }, "imgdl", "medium");
        }
      }
    };
    document.addEventListener("dragstart", onDragStart, true);

    // Copy of many images via selection / scrape patterns
    const onCopy = () => {
      const sel = window.getSelection()?.toString() || "";
      if (sel.length > 800) {
        report({ scrapeSignals: ["large_copy"] }, "scrape_copy", "medium");
      }
    };
    document.addEventListener("copy", onCopy);

    // Rapid SPA-like navigations / soft crawl (same session)
    navCount.current += 1;
    const navKey = "nv_nav_n";
    const prev = Number(sessionStorage.getItem(navKey) || "0") + 1;
    sessionStorage.setItem(navKey, String(prev));
    if (prev >= 20) {
      report({ rapidNavCount: prev, scrapeSignals: ["mass_nav"] }, "mass_nav", "high");
    }

    // --- Automated mouse (near-linear low entropy) ---
    const onPointer = (e: PointerEvent) => {
      const samples = mouseSamples.current;
      samples.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (samples.length > 40) samples.shift();
      if (samples.length >= 30) {
        const entropy = mouseEntropy(samples);
        if (entropy < 0.06) {
          report({ mouseEntropy: entropy }, "mouse", "high");
        }
      }
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      clearInterval(devtoolsTimer);
      document.removeEventListener("dragstart", onDragStart, true);
      document.removeEventListener("copy", onCopy);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return null;
}

function mouseEntropy(samples: Array<{ x: number; y: number; t: number }>): number {
  let angleChanges = 0;
  let prevAngle = 0;
  for (let i = 1; i < samples.length; i++) {
    const dx = samples[i].x - samples[i - 1].x;
    const dy = samples[i].y - samples[i - 1].y;
    const angle = Math.atan2(dy, dx);
    if (i > 1) {
      const delta = Math.abs(angle - prevAngle);
      if (delta > 0.15) angleChanges += 1;
    }
    prevAngle = angle;
  }
  return angleChanges / Math.max(1, samples.length - 2);
}
