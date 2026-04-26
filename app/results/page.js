"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PredictionCard from "@/components/PredictionCard";
import { capitalizeFirst } from "@/lib/utils";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const crop = searchParams.get("crop");
  const diseaseName = searchParams.get("disease");
  const confidence = parseInt(searchParams.get("confidence")) || 0;
  const severity = searchParams.get("severity") || "Medium";
  const treatmentParam = searchParams.get("treatment");

  const prediction =
    crop && diseaseName
      ? {
          name: diseaseName,
          crop,
          confidence,
          severity,
          treatment: treatmentParam || "No treatment information available.",
        }
      : null;

  if (!prediction) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="container">
          <div className="max-w-lg mx-auto bg-white rounded-2xl p-12 shadow-md text-center">
            <span className="text-6xl block mb-6">❌</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Results Available
            </h2>
            <p className="text-gray-600 mb-8">
              Please upload an image first to detect diseases
            </p>
            <Link href="/detect" className="btn btn-primary">
              Go to Detection
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
            Detection Results
          </h1>
          <p className="text-lg text-gray-600">
            Analysis complete for {capitalizeFirst(prediction.crop)} crop
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <PredictionCard prediction={prediction} />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/detect" className="btn btn-primary">
              🔄 Scan Another Crop
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              📊 View Dashboard
            </Link>
            <Link href="/history" className="btn btn-secondary">
              📜 View History
            </Link>
          </div>

          {prediction.severity !== "None" && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-5 sm:p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Important Notice
                </h3>
                <p className="text-yellow-700 text-sm">
                  This is a preliminary diagnosis based on image analysis. For
                  critical cases or confirmation, please consult with a
                  certified agricultural expert or your local extension officer.
                  Early intervention is key to managing crop diseases
                  effectively.
                </p>
              </div>
            </div>
          )}

          {prediction.severity === "None" && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-5 sm:p-6 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <span className="text-2xl shrink-0">✅</span>
              <div>
                <h3 className="font-semibold text-green-800 mb-2">
                  Great News!
                </h3>
                <p className="text-green-700 text-sm">
                  Your crop appears to be healthy. Continue following good
                  agricultural practices and regular monitoring to maintain crop
                  health.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
