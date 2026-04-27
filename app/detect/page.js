"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { useAuth } from "@/contexts/AuthContext";
import { apiCall } from "@/lib/api";
import { useAppTranslations } from "@/contexts/I18nContext";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

export default function DetectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const t = useAppTranslations("detect");

  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleImageSelect = (file, preview) => {
    setSelectedImage(file);
    setError("");
  };

  const handleDetect = async () => {
    if (!selectedImage) {
      setError(t("uploadFirst"));
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      // Add a timeout so the request doesn't hang indefinitely
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout (first prediction loads models)

      let response;
      try {
        response = await fetch(`${API_URL}/api/predict`, {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if (fetchErr.name === "AbortError") {
          throw new Error(t("requestTimeout"));
        }
        throw new Error(t("connectError"));
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const detail = errData.detail;
        const message =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail
                  .map((d) => d.msg || d.message || JSON.stringify(d))
                  .join("; ")
              : `Server error: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();

      if (!data.success) {
        setError(data.treatment || t("invalidImage"));
        setIsAnalyzing(false);
        return;
      }

      // Derive severity from disease name
      const severity = data.disease.toLowerCase().includes("healthy")
        ? "None"
        : "Medium";

      // Save to PostgreSQL via backend API (don't block navigation)
      if (user?.id) {
        apiCall("/api/predictions/", {
          method: "POST",
          body: JSON.stringify({
            crop: "corn",
            disease: data.disease,
            confidence: data.confidence,
            severity: severity,
            treatment: data.treatment,
          }),
          headers: { "Content-Type": "application/json" },
        }).catch((err) => console.error("Failed to save prediction:", err));
      }

      // Navigate to results
      const params = new URLSearchParams({
        crop: "corn",
        disease: data.disease,
        confidence: data.confidence.toString(),
        severity: severity,
        treatment: data.treatment || "",
      });

      router.push(`/results?${params.toString()}`);
    } catch (err) {
      console.error("Detection error:", err);
      setError(err.message || t("analyzeFail"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Corn Info Banner */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <span className="text-5xl">🌽</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("bannerTitle")}
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  {t("bannerDesc")}
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("uploadTitle")}
            </h2>
            <ImageUploader
              onImageSelect={handleImageSelect}
              selectedCrop="corn"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Detect Button */}
          <button
            onClick={handleDetect}
            disabled={!selectedImage || isAnalyzing}
            className={`w-full btn btn-primary btn-lg text-lg
                            ${!selectedImage || isAnalyzing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> {t("analyzing")}
              </span>
            ) : (
              `🔍 ${t("detectDisease")}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
