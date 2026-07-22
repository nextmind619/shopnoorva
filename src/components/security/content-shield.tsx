"use client";

import { useEffect } from "react";

/**
 * Content / image shield for storefront pages.
 * Soft protections: right-click, drag, text select, common shortcut keys.
 * Does NOT break form inputs (order form remains usable).
 */
export function ContentShield() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "IMG" || t.closest("img"))) e.preventDefault();
    };

    const onSelectStart = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      // Allow selection inside product reviews / long descriptions with data-allow-select
      if (t?.closest("[data-allow-select]")) return;
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // F12
      if (key === "F12") {
        e.preventDefault();
        return;
      }
      // Ctrl+Shift+I / J / C
      if (ctrl && shift && ["I", "J", "C"].includes(key)) {
        e.preventDefault();
        return;
      }
      // Ctrl+U (view source), Ctrl+S (save)
      if (ctrl && (key === "U" || key === "S")) {
        e.preventDefault();
        return;
      }
      // Ctrl+C — allow inside inputs
      if (ctrl && key === "C") {
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
        if (t?.closest("[data-allow-select]")) return;
        e.preventDefault();
      }
    };

    // Protect images via CSS class hook
    document.documentElement.classList.add("nv-content-shield");

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart, true);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.documentElement.classList.remove("nv-content-shield");
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart, true);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return null;
}
