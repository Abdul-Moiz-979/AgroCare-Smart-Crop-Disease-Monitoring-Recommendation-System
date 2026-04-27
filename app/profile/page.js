"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet } from "@/lib/api";
import StatCard from "@/components/StatCard";
import { useAppTranslations, useLocaleSettings } from "@/contexts/I18nContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const t = useAppTranslations("profile");
  const { locale } = useLocaleSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [totalScans, setTotalScans] = useState(0);

  const profileData = {
    name: user?.name || "AgroCare User",
    email: user?.email || "",
    location: user?.location || "",
    farmSize: user?.farmSize || "",
    primaryCrops: user?.primaryCrops || ["Wheat", "Rice", "Maize"],
    joinedDate: user?.createdAt || new Date().toISOString(),
  };

  const [formData, setFormData] = useState(profileData);

  useEffect(() => {
    if (user) {
      // Fetch total scans count from backend API
      const loadScans = async () => {
        try {
          const predictions = await apiGet("/api/predictions/");
          setTotalScans(predictions.length);
        } catch (err) {
          console.error("Failed to load scan count:", err);
        }
      };
      loadScans();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: formData.name,
      location: formData.location,
      farmSize: formData.farmSize,
    });
    setIsEditing(false);
    alert(t("updated"));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-gray-200">
              <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {profileData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profileData.name}
                </h2>
                <p className="text-gray-600">{profileData.email}</p>
              </div>
            </div>

            <div>
              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm text-gray-600 block mb-1">
                        📍 {t("location")}
                      </span>
                      <span className="font-medium text-gray-900">
                        {profileData.location || t("notSpecified")}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm text-gray-600 block mb-1">
                        🌾 {t("farmSize")}
                      </span>
                      <span className="font-medium text-gray-900">
                        {profileData.farmSize || t("notSpecified")}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm text-gray-600 block mb-1">
                        🌱 {t("primaryCrops")}
                      </span>
                      <span className="font-medium text-gray-900">
                        {profileData.primaryCrops.join(", ")}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm text-gray-600 block mb-1">
                        📅 {t("memberSince")}
                      </span>
                      <span className="font-medium text-gray-900">
                        {new Date(profileData.joinedDate).toLocaleDateString(
                          locale === "ur" ? "ur-PK" : "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setFormData(profileData);
                      setIsEditing(true);
                    }}
                  >
                    ✏️ {t("edit")}
                  </button>
                </>
              ) : (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("name")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("location")}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("farmSize")}
                    </label>
                    <input
                      type="text"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button type="submit" className="btn btn-primary">
                      💾 {t("saveChanges")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {t("stats")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon="🔍" label={t("totalScans")} value={totalScans} />
              <StatCard
                icon="🌱"
                label={t("cropsMonitored")}
                value={profileData.primaryCrops.length}
              />
              <StatCard
                icon="📅"
                label={t("memberSince")}
                value={new Date(profileData.joinedDate).toLocaleDateString(
                  locale === "ur" ? "ur-PK" : "en-US",
                  { month: "short", year: "numeric" },
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
