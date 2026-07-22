"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Security loads client-only. Behavior guard starts after LCP window
 * so fingerprinting/listeners never compete with first paint.
 */
const InvisibleChallenge = dynamic(
  () => import("./invisible-challenge").then((m) => m.InvisibleChallenge),
  { ssr: false }
);
const BehaviorGuard = dynamic(
  () => import("./behavior-guard").then((m) => m.BehaviorGuard),
  { ssr: false }
);
const ContentShield = dynamic(
  () => import("./content-shield").then((m) => m.ContentShield),
  { ssr: false }
);

function DeferredBehaviorGuard() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 3000);
    return () => window.clearTimeout(id);
  }, []);
  if (!ready) return null;
  return <BehaviorGuard />;
}

export function StoreSecurity() {
  return (
    <>
      <InvisibleChallenge />
      <DeferredBehaviorGuard />
      <ContentShield />
    </>
  );
}
