"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PredictionCard from "@/components/PredictionCard";
import { capitalizeFirst } from "@/lib/utils";
import { useAppTranslations, useLocaleSettings } from "@/contexts/I18nContext";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const t = useAppTranslations("results");
  const tPrediction = useAppTranslations("predictionCard");
  const { locale, translateDynamicText } = useLocaleSettings();
  const crop = searchParams.get("crop");
  const diseaseName = searchParams.get("disease");
  const confidence = parseInt(searchParams.get("confidence")) || 0;
  const severity = searchParams.get("severity") || "Medium";
  const treatmentParam = searchParams.get("treatment");
  const [translatedDisease, setTranslatedDisease] = useState(diseaseName || "");
  const [translatedTreatment, setTranslatedTreatment] = useState(
    treatmentParam || "",
  );

  const prediction = useMemo(() => {
    if (!crop || !diseaseName) {
      return null;
    }

    return {
      name: translatedDisease || diseaseName,
      crop,
      confidence,
      severity,
      treatment:
        translatedTreatment || treatmentParam || tPrediction("noTreatment"),
    };
  }, [
    crop,
    diseaseName,
    confidence,
    severity,
    treatmentParam,
    translatedDisease,
    translatedTreatment,
    tPrediction,
  ]);

  useEffect(() => {
    let cancelled = false;

    const syncDynamicTranslation = async () => {
      if (!diseaseName) {
        return;
      }

      if (locale === "en") {
        setTranslatedDisease(diseaseName);
        setTranslatedTreatment(treatmentParam || "");
        return;
      }

      const [diseaseText, treatmentText] = await Promise.all([
        translateDynamicText(diseaseName, locale),
        translateDynamicText(treatmentParam || "", locale),
      ]);

      if (!cancelled) {
        setTranslatedDisease(diseaseText || diseaseName);
        setTranslatedTreatment(treatmentText || treatmentParam || "");
      }
    };

    syncDynamicTranslation();

    return () => {
      cancelled = true;
    };
  }, [locale, diseaseName, treatmentParam, translateDynamicText]);

  if (!prediction) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="container">
          <div className="max-w-lg mx-auto bg-white rounded-2xl p-12 shadow-md text-center">
            <span className="text-6xl block mb-6">❌</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("noResults")}
            </h2>
            <p className="text-gray-600 mb-8">{t("noResultsDesc")}</p>
            <Link href="/detect" className="btn btn-primary">
              {t("goToDetection")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("analysisComplete", { crop: capitalizeFirst(prediction.crop) })}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <PredictionCard prediction={prediction} />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/detect" className="btn btn-primary">
              🔄 {t("scanAnother")}
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              📊 {t("viewDashboard")}
            </Link>
            <Link href="/history" className="btn btn-secondary">
              📜 {t("viewHistory")}
            </Link>
          </div>

          {prediction.severity !== "None" && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-5 sm:p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  {t("important")}
                </h3>
                <p className="text-yellow-700 text-sm">{t("importantDesc")}</p>
              </div>
            </div>
          )}

          {prediction.severity === "None" && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-5 sm:p-6 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <span className="text-2xl shrink-0">✅</span>
              <div>
                <h3 className="font-semibold text-green-800 mb-2">
                  {t("greatNews")}
                </h3>
                <p className="text-green-700 text-sm">{t("greatNewsDesc")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
