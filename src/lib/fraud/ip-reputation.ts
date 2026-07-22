import type { IpRiskType } from "./types";

/**
 * Fast local IP reputation (<5ms).
 * Optional remote enrichment via IP_REPUTATION_URL (must respond <150ms).
 */

const PRIVATE_RE =
  /^(?:10\.|127\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.|::1|fc|fd|fe80)/i;

/** Well-known cloud / hosting CIDR prefixes (compact list for Morocco COD abuse) */
const DATACENTER_PREFIXES = [
  "3.", "13.", "18.", "23.", "34.", "35.", "44.", "52.", "54.", // AWS-ish
  "34.64.", "35.184.", "35.185.", "35.186.", "35.187.", "35.188.", "35.189.", "35.190.", // GCP
  "20.", "40.", "51.", "52.142.", "104.40.", "104.41.", "104.42.", "104.43.", "104.44.", "104.45.", "104.46.", // Azure-ish
  "45.8.", "45.9.", "45.32.", "45.33.", "45.63.", "45.76.", "45.77.", "66.135.", "104.156.", "108.61.", "149.28.", "207.246.", // Vultr / Linode-ish
  "64.225.", "64.227.", "67.205.", "68.183.", "134.122.", "137.184.", "138.68.", "139.59.", "143.110.", "143.198.", "146.190.", "157.230.", "159.65.", "159.89.", "161.35.", "164.90.", "165.22.", "167.71.", "167.99.", "174.138.", "178.62.", "178.128.", "188.166.", "206.189.", "209.38.", // DigitalOcean
  "5.161.", "5.75.", "49.12.", "49.13.", "65.108.", "65.109.", "78.46.", "88.99.", "91.107.", "95.216.", "116.202.", "128.140.", "135.181.", "136.243.", "142.132.", "148.251.", "157.90.", "159.69.", "162.55.", "167.235.", "168.119.", "176.9.", "178.63.", "188.34.", "188.40.", "195.201.", "213.133.", "213.239.", // Hetzner
  "104.16.", "104.17.", "104.18.", "104.19.", "104.20.", "104.21.", "104.22.", "104.23.", "104.24.", "104.25.", "104.26.", "104.27.", "172.64.", "172.65.", "172.66.", "172.67.", // Cloudflare anycast (proxy)
];

const VPN_UA_HINTS = /vpn|proxy|tor-browser|tails/i;

export interface IpReputationResult {
  risk: IpRiskType;
  highRisk: boolean;
  reasons: string[];
  provider?: string;
}

function startsWithAny(ip: string, prefixes: string[]): boolean {
  return prefixes.some((p) => ip.startsWith(p));
}

function analyzeHeaders(headers?: Record<string, string | null | undefined>): string[] {
  const reasons: string[] = [];
  if (!headers) return reasons;

  const via = headers["via"] || headers["Via"];
  const forwarded = headers["forwarded"] || headers["Forwarded"];
  const xForwarded = headers["x-forwarded-for"] || "";
  const clientHints = headers["sec-ch-ua"] || "";

  if (via && /proxy|squid|nginx/i.test(via)) reasons.push("proxy_via_header");
  if (forwarded && /for=/.test(forwarded) && xForwarded.split(",").length > 2) {
    reasons.push("multi_hop_proxy");
  }
  if (headers["x-tor"] || headers["x-onion"]) reasons.push("tor_header");
  if (!clientHints && headers["user-agent"] && /Chrome\/\d+/i.test(headers["user-agent"])) {
    // Missing Client Hints on modern Chrome can indicate headless/automation
    reasons.push("missing_client_hints");
  }
  return reasons;
}

export function analyzeIpReputation(input: {
  ip: string;
  userAgent?: string;
  headers?: Record<string, string | null | undefined>;
}): IpReputationResult {
  const reasons: string[] = [];
  const ip = (input.ip || "").trim();

  if (!ip || ip === "unknown") {
    return { risk: "unknown", highRisk: true, reasons: ["ip_unknown"] };
  }

  if (PRIVATE_RE.test(ip) || ip === "localhost" || ip === "::1") {
    // Local/dev — treat as residential-equivalent for DX, not high risk
    return { risk: "residential", highRisk: false, reasons: ["ip_private_local"], provider: "local" };
  }

  reasons.push(...analyzeHeaders(input.headers));

  if (input.userAgent && VPN_UA_HINTS.test(input.userAgent)) {
    reasons.push("vpn_ua_hint");
  }

  // Tor exit nodes often appear with atypical ports in X-Forwarded — soft signal
  if (reasons.includes("tor_header")) {
    return { risk: "tor", highRisk: true, reasons, provider: "headers" };
  }

  if (startsWithAny(ip, DATACENTER_PREFIXES) || reasons.includes("proxy_via_header")) {
    const risk: IpRiskType = reasons.includes("proxy_via_header") ? "proxy" : "datacenter";
    return { risk, highRisk: true, reasons: [...reasons, `ip_${risk}`], provider: "prefix" };
  }

  if (reasons.includes("vpn_ua_hint") || reasons.includes("multi_hop_proxy")) {
    return { risk: "vpn", highRisk: true, reasons, provider: "heuristics" };
  }

  // Moroccan residential ranges are diverse — default to residential when not flagged
  return { risk: "residential", highRisk: false, reasons: reasons.length ? reasons : ["ip_residential"], provider: "heuristics" };
}

/**
 * Optional async enrichment. Hard timeout so fraud pipeline stays under 300ms.
 */
export async function enrichIpReputation(
  base: IpReputationResult,
  ip: string,
  timeoutMs = 120
): Promise<IpReputationResult> {
  const url = process.env.IP_REPUTATION_URL;
  if (!url || !ip || ip === "unknown") return base;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const endpoint = url.includes("{ip}") ? url.replace("{ip}", encodeURIComponent(ip)) : `${url}${encodeURIComponent(ip)}`;
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(process.env.IP_REPUTATION_KEY
          ? { Authorization: `Bearer ${process.env.IP_REPUTATION_KEY}` }
          : {}),
      },
    });
    if (!res.ok) return base;
    const data = (await res.json()) as {
      proxy?: boolean;
      vpn?: boolean;
      tor?: boolean;
      hosting?: boolean;
      datacenter?: boolean;
      type?: string;
    };

    const reasons = [...base.reasons];
    let risk: IpRiskType = base.risk;

    if (data.tor) {
      risk = "tor";
      reasons.push("tor_api");
    } else if (data.vpn || data.type === "vpn") {
      risk = "vpn";
      reasons.push("vpn_api");
    } else if (data.proxy || data.type === "proxy") {
      risk = "proxy";
      reasons.push("proxy_api");
    } else if (data.hosting || data.datacenter || data.type === "hosting") {
      risk = "datacenter";
      reasons.push("datacenter_api");
    } else if (!base.highRisk) {
      risk = "residential";
      reasons.push("residential_api");
    }

    const highRisk = risk === "vpn" || risk === "proxy" || risk === "tor" || risk === "datacenter";
    return { risk, highRisk, reasons, provider: "api" };
  } catch {
    return base;
  } finally {
    clearTimeout(timer);
  }
}
