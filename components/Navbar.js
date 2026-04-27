"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppTranslations, useLocaleSettings } from "@/contexts/I18nContext";

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/detect", key: "detect" },
  { href: "/dashboard", key: "dashboard" },
  { href: "/history", key: "history" },
  { href: "/awareness", key: "awareness" },
  { href: "/profile", key: "profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const tNav = useAppTranslations("navbar");
  const tCommon = useAppTranslations("common");
  const { locale, setLocale, isRtl } = useLocaleSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    // Warm common routes to reduce perceived delay when switching pages.
    NAV_LINKS.forEach((link) => router.prefetch(link.href));
  }, [router, user]);

  // Don't show navbar if user is not logged in
  if (!user) {
    return null;
  }

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-gradient-primary shadow-md sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 xl:gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 font-heading font-bold text-white no-underline transition-transform duration-150 hover:scale-105 shrink-0"
        >
          <Image
            src="/AgroCare_logo.png"
            alt="AgroCare Logo"
            width={120}
            height={120}
            className="h-11 sm:h-14 md:h-16 w-auto object-contain rounded-lg"
            style={{ mixBlendMode: "multiply" }}
          />
          <span className="text-white font-bold text-lg sm:text-2xl lg:text-3xl whitespace-nowrap">
            AgroCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden xl:flex items-center gap-1 2xl:gap-2 list-none m-0 p-0 shrink-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                prefetch={true}
                style={{ color: "#ffffff" }}
                className={`
                                    relative font-semibold text-sm 2xl:text-base px-3 2xl:px-4 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap
                                    hover:bg-white/20 hover:scale-105
                                    ${
                                      isActive(link.href)
                                        ? "bg-white/25 shadow-md"
                                        : ""
                                    }
                                `}
              >
                {tNav(link.key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Info & Logout */}
        <div className="hidden xl:flex items-center gap-3 2xl:gap-4">
          <label className="flex flex-col text-white min-w-45">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-white/90 mb-1">
              {tCommon("language")}
            </span>
            <span className="relative block">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full appearance-none rounded-xl bg-white/95 border border-white/40 pl-3 pr-10 py-2 text-[13px] font-semibold text-emerald-800 shadow-sm outline-none transition-all duration-200 cursor-pointer hover:bg-white hover:border-white/80 hover:shadow-md focus:ring-2 focus:ring-white/60"
                aria-label={tCommon("language")}
              >
                <option value="en">{tCommon("english")}</option>
                <option value="ur">{tCommon("urdu")}</option>
              </select>
            </span>
          </label>
          <span className="text-white font-medium text-sm whitespace-nowrap">
            👤 {tNav("user")}: {user.name}
          </span>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="btn bg-white/20 border border-white/30 text-white hover:bg-white/30"
          >
            {tNav("logout")}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex xl:hidden flex-col gap-1 bg-transparent border-none cursor-pointer p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="w-6 h-0.5 bg-white rounded-full transition-all duration-150"></span>
          <span className="w-6 h-0.5 bg-white rounded-full transition-all duration-150"></span>
          <span className="w-6 h-0.5 bg-white rounded-full transition-all duration-150"></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`
                    xl:hidden overflow-hidden transition-all duration-250
                    bg-linear-to-b from-[hsl(142,76%,32%)] to-[hsl(166,73%,38%)]
                    ${mobileMenuOpen ? "max-h-[85vh] overflow-y-auto" : "max-h-0"}
                `}
      >
        <ul className="list-none p-4 m-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="mb-2">
              <Link
                href={link.href}
                prefetch={true}
                style={{ color: "#ffffff" }}
                className={`
                                    block font-medium p-4 rounded-lg transition-all duration-150
                                    hover:bg-white/10
                                    ${
                                      isActive(link.href)
                                        ? `bg-white/15 ${isRtl ? "border-r-4" : "border-l-4"} border-white`
                                        : ""
                                    }
                                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                {tNav(link.key)}
              </Link>
            </li>
          ))}

          <li className="mt-2 px-4">
            <label className="flex flex-col text-white text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-white/90 mb-2">
                {tCommon("language")}
              </span>
              <span className="relative block">
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="w-full appearance-none rounded-xl bg-white/95 border border-white/40 pl-3 pr-10 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm outline-none transition-all duration-200 cursor-pointer hover:bg-white hover:border-white/80 hover:shadow-md"
                  aria-label={tCommon("language")}
                >
                  <option value="en">{tCommon("english")}</option>
                  <option value="ur">{tCommon("urdu")}</option>
                </select>
              </span>
            </label>
          </li>

          {/* Mobile User Info & Logout */}
          <li className="mt-4 pt-4 border-t border-white/20">
            <div className="space-y-3">
              <div className="text-white font-medium px-4 wrap-break-word">
                👤 {tNav("user")}: {user.name}
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full btn bg-white/20 border border-white/30 text-white hover:bg-white/30"
              >
                {tNav("logout")}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
