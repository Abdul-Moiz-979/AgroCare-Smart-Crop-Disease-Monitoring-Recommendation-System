"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/detect", label: "Detect" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/awareness", label: "Awareness" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 font-heading font-bold text-white no-underline transition-transform duration-150 hover:scale-105 min-w-0"
        >
          <Image
            src="/AgroCare_logo.png"
            alt="AgroCare Logo"
            width={120}
            height={120}
            className="h-14 w-auto md:h-16 object-contain rounded-lg"
            style={{ mixBlendMode: "multiply" }}
          />
          <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl truncate">
            AgroCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-2 list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                prefetch={true}
                style={{ color: "#ffffff" }}
                className={`
                                    relative font-semibold text-base px-4 py-2.5 rounded-lg transition-all duration-200
                                    hover:bg-white/20 hover:scale-105
                                    ${
                                      isActive(link.href)
                                        ? "bg-white/25 shadow-md"
                                        : ""
                                    }
                                `}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Info & Logout */}
        <div className="hidden md:flex items-center gap-4 min-w-0">
          <span className="text-white font-medium text-sm max-w-36 truncate">
            👤 {user.name}
          </span>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="btn bg-white/20 border border-white/30 text-white hover:bg-white/30"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex md:hidden flex-col gap-1 bg-transparent border-none cursor-pointer p-2"
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
                    md:hidden overflow-hidden transition-all duration-250
                    bg-linear-to-b from-[hsl(142,76%,32%)] to-[hsl(166,73%,38%)]
                    ${mobileMenuOpen ? "max-h-125" : "max-h-0"}
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
                                        ? "bg-white/15 border-l-4 border-white"
                                        : ""
                                    }
                                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Mobile User Info & Logout */}
          <li className="mt-4 pt-4 border-t border-white/20">
            <div className="space-y-3">
              <div className="text-white font-medium px-4 wrap-break-word">
                👤 {user.name}
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full btn bg-white/20 border border-white/30 text-white hover:bg-white/30"
              >
                Logout
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
