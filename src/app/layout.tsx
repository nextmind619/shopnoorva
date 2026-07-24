import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    other: {
      "facebook-domain-verification": "gsg759rql91jkxu1wywq1fibppl2tl",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
