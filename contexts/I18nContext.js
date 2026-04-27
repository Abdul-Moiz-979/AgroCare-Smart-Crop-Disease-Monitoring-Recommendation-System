"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { apiPost } from "@/lib/api";
import enMessages from "@/locales/en.json";
import urMessages from "@/locales/ur.json";

const I18nContext = createContext(null);

const SUPPORTED_LOCALES = ["en", "ur"];
const DEFAULT_LOCALE = "en";
const STORAGE_KEY = "agrocare_lang";
const COOKIE_KEY = "agrocare_lang";

const MESSAGES = {
  en: enMessages,
  ur: urMessages,
};

function mergeMessages(base, override) {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }

  if (typeof base !== "object" || base === null) {
    return override ?? base;
  }

  const merged = { ...base };
  const overrideObject =
    typeof override === "object" && override !== null ? override : {};

  Object.keys(overrideObject).forEach((key) => {
    merged[key] = mergeMessages(base[key], overrideObject[key]);
  });

  return merged;
}

function normalizeLocale(value) {
  const locale = (value || "").toLowerCase();
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

function readCookie(name) {
  if (typeof document === "undefined") {
    return null;
  }

  const pair = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return pair ? decodeURIComponent(pair.split("=")[1]) : null;
}

function detectBrowserLocale() {
  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE;
  }

  const preferred = [navigator.language, ...(navigator.languages || [])]
    .filter(Boolean)
    .map((item) => item.toLowerCase());

  const hasUrdu = preferred.some((item) => item.startsWith("ur"));
  return hasUrdu ? "ur" : DEFAULT_LOCALE;
}

function applyDocumentDirection(locale) {
  if (typeof document === "undefined") {
    return;
  }

  const dir = locale === "ur" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const savedFromStorage =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const saved = savedFromStorage || readCookie(COOKIE_KEY);
    const browserLocale =
      typeof window !== "undefined" ? detectBrowserLocale() : DEFAULT_LOCALE;
    return normalizeLocale(saved || browserLocale);
  });

  useEffect(() => {
    applyDocumentDirection(locale);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, locale);
    }

    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
    }
  }, [locale]);

  const setLocale = useCallback((nextLocale) => {
    setLocaleState(normalizeLocale(nextLocale));
  }, []);

  const translateDynamicText = useCallback(
    async (text, targetLang = locale) => {
      if (!text || targetLang === "en") {
        return text;
      }

      try {
        const response = await apiPost("/api/translate", {
          text,
          target_lang: normalizeLocale(targetLang),
        });
        return response.translated_text || text;
      } catch {
        return text;
      }
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      isRtl: locale === "ur",
      dir: locale === "ur" ? "rtl" : "ltr",
      setLocale,
      translateDynamicText,
      supportedLocales: SUPPORTED_LOCALES,
    }),
    [locale, setLocale, translateDynamicText],
  );

  const resolvedMessages = useMemo(() => {
    if (locale === "ur") {
      return mergeMessages(MESSAGES.en, MESSAGES.ur);
    }

    return MESSAGES.en;
  }, [locale]);

  return (
    <I18nContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={resolvedMessages}>
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}

export function useLocaleSettings() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useLocaleSettings must be used within an I18nProvider");
  }
  return context;
}

export function useAppTranslations(namespace) {
  return useTranslations(namespace);
}
