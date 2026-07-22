import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  addSecurityBlacklist,
  pushSecurityLog,
  getSecurityLogs,
  getSecurityBlacklist,
  getSecurityStats,
} from "@/lib/security";
import { recordBlock, shouldAutoBlacklist } from "@/lib/security/velocity";
import type { ClientSecurityReport } from "@/lib/security/types";

/**
 * Client behavior reports: DevTools, scrape, image download, mouse automation, etc.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`sec-report:${ip}`, 40, 60000).success) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as ClientSecurityReport & {
      pathname?: string;
      severity?: "low" | "medium" | "high";
    };

    const reasons: string[] = [];
    const flags: string[] = [];

    if (body.webdriver) {
      reasons.push("webdriver");
      flags.push("selenium_or_webdriver");
    }
    if (body.automationTool) {
      reasons.push(body.automationTool);
      flags.push(`tool_${body.automationTool}`);
    }
    if (body.headlessHints?.length) {
      reasons.push("headless_hints");
      flags.push(...body.headlessHints.map((h) => `headless_${h}`));
    }
    if (body.devtoolsOpen) {
      reasons.push("devtools_open");
      flags.push("devtools");
    }
    if (body.scrapeSignals?.length) {
      reasons.push("page_scraping");
      flags.push(...body.scrapeSignals.map((s) => `scrape_${s}`));
    }
    if ((body.imageDownloadAttempts || 0) >= 3) {
      reasons.push("image_downloading");
      flags.push("image_harvest");
    }
    if ((body.rapidNavCount || 0) >= 15) {
      reasons.push("mass_page_visits");
      flags.push("rapid_nav");
    }
    if (typeof body.mouseEntropy === "number" && body.mouseEntropy >= 0 && body.mouseEntropy < 0.08) {
      reasons.push("automated_mouse");
      flags.push("linear_mouse");
    }
    if (body.fakeBrowser) {
      reasons.push("fake_browser");
      flags.push("fake_browser");
    }

    const severity = body.severity || (reasons.length >= 2 ? "high" : reasons.length === 1 ? "medium" : "low");
    const decision = severity === "high" ? "block" : severity === "medium" ? "challenge" : "allow";
    const score = decision === "block" ? 20 : decision === "challenge" ? 40 : 70;

    if (decision !== "allow") {
      pushSecurityLog({
        ip,
        userAgent: request.headers.get("user-agent") || "",
        referer: request.headers.get("referer") || "",
        pathname: body.pathname || "/",
        score,
        decision,
        reasons,
        flags,
        ipRisk: "unknown",
      });
    }

    if (decision === "block") {
      recordBlock(ip);
      if (shouldAutoBlacklist(ip) || body.webdriver || body.automationTool) {
        addSecurityBlacklist({
          type: "ip",
          value: ip,
          reason: reasons.slice(0, 3).join(",") || "client_malicious",
          source: "auto",
        });
      }
      return NextResponse.json({ ok: true, action: "block" }, { status: 403 });
    }

    return NextResponse.json({ ok: true, action: decision, reasons });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    stats: getSecurityStats(),
    logs: getSecurityLogs(100),
    blacklist: getSecurityBlacklist(),
  });
}
