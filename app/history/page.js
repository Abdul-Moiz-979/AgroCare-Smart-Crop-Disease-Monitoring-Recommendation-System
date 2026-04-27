"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet, apiDelete } from "@/lib/api";
import Link from "next/link";
import { useAppTranslations, useLocaleSettings } from "@/contexts/I18nContext";

export default function HistoryPage() {
  const { user } = useAuth();
  const t = useAppTranslations("history");
  const { locale } = useLocaleSettings();
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const predictions = await apiGet("/api/predictions/");
        // Map created_at to date for compatibility
        const mapped = predictions.map((item) => ({
          ...item,
          date: item.created_at,
        }));
        setHistory(mapped);
      } catch (err) {
        console.error("Failed to load history:", err);
        setHistory([]);
      }
      setIsLoading(false);
    };

    loadHistory();
  }, [user]);

  const filteredHistory = useMemo(() => {
    let filtered = [...history];
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.disease.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return filtered;
  }, [history, searchQuery]);

  const reloadHistory = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    try {
      const predictions = await apiGet("/api/predictions/");
      const mapped = predictions.map((item) => ({
        ...item,
        date: item.created_at,
      }));
      setHistory(mapped);
    } catch (err) {
      console.error("Failed to reload history:", err);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm(t("confirmDelete"))) {
      try {
        await apiDelete(`/api/predictions/${id}`);
        await reloadHistory();
      } catch (err) {
        console.error("Failed to delete prediction:", err);
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm(t("confirmClear"))) {
      try {
        await apiDelete("/api/predictions/");
        setHistory([]);
      } catch (err) {
        console.error("Failed to clear predictions:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-4 animate-spin">⏳</span>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("searchLabel")}
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {history.length > 0 && (
              <button
                className="btn btn-secondary w-full md:w-auto"
                onClick={handleClearAll}
              >
                🗑️ {t("clearAll")}
              </button>
            )}
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:shadow-lg transition-all"
              >
                <div className="text-4xl">🌽</div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.disease}
                    </h3>
                    <span
                      className={`badge ${
                        item.severity === "High"
                          ? "badge-error"
                          : item.severity === "Medium"
                            ? "badge-warning"
                            : item.severity === "None"
                              ? "badge-success"
                              : "badge-info"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>
                      <strong>{t("crop")}:</strong> Corn
                    </span>
                    <span>
                      <strong>{t("confidence")}:</strong> {item.confidence}%
                    </span>
                    <span>
                      <strong>{t("date")}:</strong>{" "}
                      {new Date(item.date).toLocaleDateString(
                        locale === "ur" ? "ur-PK" : "en-US",
                      )}
                    </span>
                  </div>
                </div>

                <button
                  className="w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                  onClick={() => handleDelete(item.id)}
                  aria-label={t("delete")}
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-md text-center">
              <span className="text-6xl block mb-4">
                {searchQuery ? "🔍" : "📭"}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? t("noMatch") : t("noHistory")}
              </h2>
              <p className="text-gray-600 mb-6">
                {searchQuery ? t("adjustSearch") : t("buildHistory")}
              </p>
              {!searchQuery && (
                <Link href="/detect" className="btn btn-primary">
                  {t("startDetection")}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
