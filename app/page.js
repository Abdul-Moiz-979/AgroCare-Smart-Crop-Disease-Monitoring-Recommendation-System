"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { useAppTranslations } from "@/contexts/I18nContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const tHome = useAppTranslations("home");
  const tCommon = useAppTranslations("common");

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4"> </div>
          <p className="text-gray-600">{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary py-20 md:py-32 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              {tHome("heroTitle1")}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                {" "}
                {tHome("heroTitle2")}
              </span>
              <br />
              {tHome("heroTitle3")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {tHome("heroDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/detect"
                className="btn btn-lg bg-white text-green-700 hover:bg-gray-100 shadow-lg"
              >
                {tCommon("startDetection")} 🔍
              </Link>
              <Link
                href="/awareness"
                className="btn btn-lg bg-white text-green-700 hover:bg-gray-100 shadow-lg"
              >
                {tHome("learnMore")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {tHome("howItWorks")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-3">
                {tHome("uploadImage")}
              </h3>
              <p className="text-gray-600">{tHome("uploadImageDesc")}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3">
                {tHome("aiAnalysis")}
              </h3>
              <p className="text-gray-600">{tHome("aiAnalysisDesc")}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="text-5xl mb-4">💊</div>
              <h3 className="text-xl font-semibold mb-3">
                {tHome("getResults")}
              </h3>
              <p className="text-gray-600">{tHome("getResultsDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {tHome("highlights")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="🌽"
              label={tHome("supportedCrop")}
              value="Corn"
              color="primary"
            />
            <StatCard
              icon="🦠"
              label={tHome("diseasesDetected")}
              value="3"
              color="secondary"
            />
            <StatCard
              icon="🎯"
              label={tHome("accuracyRate")}
              value="95%"
              color="success"
            />
            <StatCard
              icon="⚡"
              label={tHome("detectionSpeed")}
              value="< 2s"
              color="info"
            />
          </div>
        </div>
      </section>

      {/* Corn Diseases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {tHome("cornDetection")}
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {tHome("cornDetectionDesc")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center border-t-4 border-red-400">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-semibold mb-3">
                {tHome("commonRust")}
              </h3>
              <p className="text-gray-600 mb-4">{tHome("commonRustDesc")}</p>
              <Link
                href="/detect"
                className="text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                {tHome("scanNow")} →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center border-t-4 border-yellow-400">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-semibold mb-3">
                {tHome("grayLeafSpot")}
              </h3>
              <p className="text-gray-600 mb-4">{tHome("grayLeafSpotDesc")}</p>
              <Link
                href="/detect"
                className="text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                {tHome("scanNow")} →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center border-t-4 border-orange-400">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-semibold mb-3">
                {tHome("northernLeafBlight")}
              </h3>
              <p className="text-gray-600 mb-4">
                {tHome("northernLeafBlightDesc")}
              </p>
              <Link
                href="/detect"
                className="text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                {tHome("scanNow")} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {tHome("readyTitle")}
            </h2>
            <p className="text-xl text-white/90 mb-8">{tHome("readyDesc")}</p>
            <Link
              href="/detect"
              className="btn btn-lg bg-white text-green-700 hover:bg-gray-100 shadow-lg"
            >
              {tHome("getStartedNow")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
