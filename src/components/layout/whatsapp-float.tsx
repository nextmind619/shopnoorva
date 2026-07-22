"use client";

import { useTranslations } from "next-intl";
import { WHATSAPP_URL } from "@/lib/site";

const PREFILL =
  "مرحباً NOORVA، أريد الاستفسار عن المنتجات والدفع عند الاستلام";

export function WhatsAppFloat() {
  const t = useTranslations("nav");
  const href = `${WHATSAPP_URL}?text=${encodeURIComponent(PREFILL)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      className="group fixed z-[70] bottom-5 end-5 sm:bottom-6 sm:end-6 flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,0.45)] hover:bg-[#1ebe57] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/ring-offset-2"
    >
      <span className="flex h-14 w-14 items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden>
          <path d="M16.02 3C9.4 3 4 8.36 4 14.94c0 2.1.56 4.14 1.62 5.94L4 29l8.3-1.66a12.1 12.1 0 0 0 3.72.58c6.62 0 12.02-5.36 12.02-11.94C28.04 8.36 22.64 3 16.02 3zm0 21.86c-1.2 0-2.38-.3-3.42-.88l-.24-.14-4.94.98 1.02-4.8-.16-.26a9.7 9.7 0 0 1-1.5-5.22c0-5.36 4.4-9.72 9.24-9.72s9.24 4.36 9.24 9.72-4.4 9.72-9.24 9.72zm5.36-7.28c-.3-.14-1.76-.86-2.04-.96-.26-.1-.46-.14-.66.14-.2.3-.76.96-.94 1.16-.16.2-.34.22-.64.08-.3-.14-1.26-.46-2.4-1.46-.88-.78-1.48-1.74-1.66-2.04-.16-.3-.02-.46.12-.6.14-.14.3-.34.46-.52.14-.16.2-.3.3-.5.1-.2.04-.38-.02-.52-.08-.14-.66-1.58-.9-2.16-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.08-.8.38-.26.3-1.04 1.02-1.04 2.48s1.06 2.88 1.22 3.08c.14.2 2.1 3.2 5.08 4.48.7.3 1.26.48 1.68.62.72.22 1.36.2 1.88.12.58-.08 1.76-.72 2.02-1.42.24-.7.24-1.3.16-1.42-.06-.14-.26-.22-.56-.36z" />
        </svg>
      </span>
      <span className="hidden sm:inline pe-5 text-sm font-bold tracking-wide whitespace-nowrap">
        {t("whatsapp")}
      </span>
    </a>
  );
}
