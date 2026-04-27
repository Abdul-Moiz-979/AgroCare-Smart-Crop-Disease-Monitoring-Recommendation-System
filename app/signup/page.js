"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useAppTranslations } from "@/contexts/I18nContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const t = useAppTranslations("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    farmSize: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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

  const validatePassword = (password) => {
    if (password.length < 6) {
      return t("passwordShort");
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(t("requiredFields"));
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError(t("invalidEmail"));
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatch"));
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError(t("acceptTerms"));
      setLoading(false);
      return;
    }

    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.location,
      formData.farmSize,
    );

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || t("signupFailed"));
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return null;
    if (password.length < 6)
      return { text: t("weak"), color: "bg-red-500", width: "33%" };
    if (password.length < 10)
      return { text: t("medium"), color: "bg-yellow-500", width: "66%" };
    return { text: t("strong"), color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
          {/* Left Section - Form */}
          <div className="p-8 md:p-12 order-2 md:order-1">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 mb-6 text-green-600 hover:text-green-700 min-w-0"
            >
              <Image
                src="/AgroCare_logo.png"
                alt="AgroCare Logo"
                width={96}
                height={96}
                className="h-11 sm:h-12 w-auto object-contain rounded-lg"
              />
              <span className="font-bold text-2xl sm:text-3xl truncate">
                AgroCare
              </span>
            </Link>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("title")}
            </h2>
            <p className="text-gray-600 mb-6">{t("subtitle")}</p>

            {error && (
              <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("fullName")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={t("fullName")}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("email")} <span className="text-red-500">*</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("location")}
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Punjab, Pakistan"
                  />
                </div>
                <div>
                  <label
                    htmlFor="farmSize"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t("farmSize")}
                  </label>
                  <input
                    type="text"
                    id="farmSize"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="25 acres"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("password")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color}`}
                        style={{ width: passwordStrength.width }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("confirmPassword")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Re-enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded mt-1"
                />
                <span className="text-sm text-gray-600">
                  {t("termsPrefix")}{" "}
                  <Link
                    href="/terms"
                    className="text-green-600 hover:underline"
                  >
                    {t("terms")}
                  </Link>{" "}
                  <Link
                    href="/privacy"
                    className="text-green-600 hover:underline"
                  >
                    {t("privacy")}
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                className="w-full btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? t("creating") : t("create")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t("already")}{" "}
                <Link
                  href="/login"
                  className="text-green-600 font-medium hover:text-green-700"
                >
                  {t("signIn")} →
                </Link>
              </p>
            </div>
          </div>

          {/* Right Section - Benefits */}
          <div className="bg-gradient-primary p-8 md:p-12 text-white order-1 md:order-2">
            <h3 className="text-2xl font-bold mb-8 text-white">
              {t("whyJoin")}
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-3xl">🎯</div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {t("accurate")}
                  </h4>
                  <p className="text-white/80 text-sm">{t("accurateDesc")}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-3xl">⚡</div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {t("instant")}
                  </h4>
                  <p className="text-white/80 text-sm">{t("instantDesc")}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-3xl">📊</div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {t("track")}
                  </h4>
                  <p className="text-white/80 text-sm">{t("trackDesc")}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-3xl">📚</div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {t("knowledge")}
                  </h4>
                  <p className="text-white/80 text-sm">{t("knowledgeDesc")}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-white">3</div>
                <div className="text-sm text-white/80">
                  {t("cropsSupported")}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">12+</div>
                <div className="text-sm text-white/80">{t("detected")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/80">{t("available")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
