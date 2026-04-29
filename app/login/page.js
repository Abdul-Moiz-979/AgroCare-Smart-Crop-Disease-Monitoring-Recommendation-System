"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useAppTranslations } from "@/contexts/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const t = useAppTranslations("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError(t("required"));
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError(t("invalidEmail"));
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || t("loginFailed"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
          {/* Left Section - Branding */}
          <div className="bg-gradient-primary p-8 md:p-12 text-white hidden md:flex flex-col justify-center min-w-0 overflow-hidden">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-1 mb-6 justify-center md:justify-start flex-nowrap min-w-0">
                <Image
                  src="/AgroCare_logo.png"
                  alt="AgroCare Logo"
                  width={120}
                  height={120}
                  className="h-9 lg:h-10 w-auto object-contain rounded-lg shrink-0"
                  style={{ mixBlendMode: "multiply" }}
                />
                <h1 className="text-[clamp(1.05rem,1.15vw,1.35rem)] font-bold text-white whitespace-nowrap leading-none tracking-tight">
                  AgroCare
                </h1>
              </div>
              <p className="text-xl text-white/90 mb-8">{t("tagline")}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">✓</span>
                  <span>{t("feature1")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✓</span>
                  <span>{t("feature2")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✓</span>
                  <span>{t("feature3")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="p-8 md:p-12">
            <div className="flex items-center justify-center gap-1 mb-4 md:hidden flex-nowrap min-w-0">
              <Image
                src="/AgroCare_logo.png"
                alt="AgroCare Logo"
                width={96}
                height={96}
                className="h-7 w-auto object-contain rounded-lg shrink-0"
                style={{ mixBlendMode: "multiply" }}
              />
              <span className="text-[clamp(0.95rem,3vw,1.05rem)] font-bold text-gray-900 whitespace-nowrap leading-none tracking-tight">
                AgroCare
              </span>
            </div>
            <div className="flex justify-end mb-4">
              <LanguageSwitcher tone="light" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("welcome")}
            </h2>
            <p className="text-gray-600 mb-6">{t("subtitle")}</p>

            {error && (
              <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-600">{t("remember")}</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  {t("forgot")}
                </Link>
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? t("signingIn") : t("signIn")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t("noAccount")}{" "}
                <Link
                  href="/signup"
                  className="text-green-600 font-medium hover:text-green-700"
                >
                  {t("createAccount")} →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
