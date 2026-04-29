"use client";

import { useAppTranslations, useLocaleSettings } from "@/contexts/I18nContext";

export default function LanguageSwitcher({
  tone = "light",
  compact = false,
  className = "",
}) {
  const tCommon = useAppTranslations("common");
  const { locale, setLocale } = useLocaleSettings();
  const isDark = tone === "dark";

  const wrapperClasses = compact
    ? "inline-flex items-center"
    : "inline-flex items-center rounded-2xl px-2 py-1.5";

  const shellClasses = isDark
    ? "bg-white/20 border border-white/35 backdrop-blur-sm"
    : "bg-green-50 border border-green-200";

  const labelClasses = isDark ? "text-white/90" : "text-green-900/75";

  const selectClasses = isDark
    ? "bg-white text-emerald-900 border-white/60 focus:ring-white/65"
    : "bg-white text-emerald-900 border-emerald-200 focus:ring-emerald-400";

  return (
    <div className={`${wrapperClasses} ${shellClasses} ${className}`.trim()}>
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] font-semibold mr-2 ${labelClasses}`}
      >
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
            isDark ? "bg-white/20" : "bg-emerald-100"
          }`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-3.5 w-3.5 ${isDark ? "text-white" : "text-emerald-700"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3a13 13 0 0 1 0 18" />
            <path d="M12 3a13 13 0 0 0 0 18" />
          </svg>
        </span>
        {tCommon("language")}
      </span>
      <div className="relative">
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className={`appearance-none w-auto min-w-[3.25rem] text-center rounded-xl border px-3 py-2 pr-4 text-[13px] font-semibold shadow-sm outline-none transition-all duration-200 hover:shadow-md cursor-pointer ${selectClasses}`}
          aria-label={tCommon("language")}
        >
          <option value="en">En</option>
          <option value="ur">Ur</option>
        </select>
      </div>
    </div>
  );
}
