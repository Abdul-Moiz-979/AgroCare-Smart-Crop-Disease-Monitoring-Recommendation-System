"use client";

import StatCard from "@/components/StatCard";
import { PieChart, BarChart } from "@/components/Charts";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet } from "@/lib/api";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    diseasesDetected: 0,
    healthyScans: 0,
    avgConfidence: 0,
  });
  const [cropDistribution, setCropDistribution] = useState([]);
  const [monthlyScans, setMonthlyScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const predictions = await apiGet("/api/predictions/");
        // Map created_at to date for compatibility
        const userHistory = predictions.map((item) => ({
          ...item,
          date: item.created_at,
        }));
        setHistory(userHistory);

        // Compute stats from real data
        const total = userHistory.length;
        const diseased = userHistory.filter(
          (item) => !item.disease?.toLowerCase().includes("healthy"),
        ).length;
        const healthy = total - diseased;
        const avgConf =
          total > 0
            ? (
                userHistory.reduce(
                  (sum, item) => sum + (item.confidence || 0),
                  0,
                ) / total
              ).toFixed(1)
            : 0;

        setStats({
          totalScans: total,
          diseasesDetected: diseased,
          healthyScans: healthy,
          avgConfidence: avgConf,
        });

        // Compute crop distribution
        const cropCounts = {};
        userHistory.forEach((item) => {
          const crop =
            (item.crop || "unknown").charAt(0).toUpperCase() +
            (item.crop || "unknown").slice(1);
          cropCounts[crop] = (cropCounts[crop] || 0) + 1;
        });
        const cropData = Object.entries(cropCounts).map(([crop, scans]) => ({
          crop,
          scans,
          percentage:
            total > 0 ? parseFloat(((scans / total) * 100).toFixed(1)) : 0,
        }));
        setCropDistribution(cropData);

        // Compute monthly scans (last 6 months)
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthLabel = d.toLocaleDateString("en-US", { month: "short" });
          const count = userHistory.filter((item) => {
            if (!item.date) return false;
            const itemDate = new Date(item.date);
            return (
              itemDate.getFullYear() === d.getFullYear() &&
              itemDate.getMonth() === d.getMonth()
            );
          }).length;
          months.push({ month: monthLabel, scans: count });
        }
        setMonthlyScans(months);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }

      setIsLoading(false);
    };

    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-4 animate-spin">⏳</span>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Overview of your crop disease detection activities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon="🔍"
            label="Total Scans"
            value={stats.totalScans}
            color="primary"
          />
          <StatCard
            icon="🦠"
            label="Diseases Detected"
            value={stats.diseasesDetected}
            color="warning"
          />
          <StatCard
            icon="✅"
            label="Healthy Scans"
            value={stats.healthyScans}
            color="success"
          />
          <StatCard
            icon="🎯"
            label="Avg Confidence"
            value={stats.totalScans > 0 ? `${stats.avgConfidence}%` : "N/A"}
            color="info"
          />
        </div>

        {/* Charts Section */}
        {stats.totalScans > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {cropDistribution.length > 0 && (
              <PieChart data={cropDistribution} title="Crop Distribution" />
            )}
            <BarChart data={monthlyScans} title="Monthly Scans" />
          </div>
        )}

        {/* Empty state for charts */}
        {stats.totalScans === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-md text-center mb-12">
            <span className="text-5xl block mb-4">📊</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Data Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Charts will appear once you start scanning crops
            </p>
            <Link href="/detect" className="btn btn-primary">
              Start Your First Scan
            </Link>
          </div>
        )}

        {/* Recent Predictions */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Predictions
            </h2>
            {history.length > 0 && (
              <Link
                href="/history"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View All →
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {history.length > 0 ? (
              history.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="text-3xl">🌽</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.disease}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.crop.charAt(0).toUpperCase() + item.crop.slice(1)} •{" "}
                      {formatDate(item.date)}
                    </p>
                  </div>
                  <span
                    className={`badge self-start sm:self-auto ${
                      item.severity === "High"
                        ? "badge-error"
                        : item.severity === "Medium"
                          ? "badge-warning"
                          : item.severity === "None"
                            ? "badge-success"
                            : "badge-info"
                    }`}
                  >
                    {item.confidence}%
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <span className="text-5xl block mb-4">📭</span>
                <p className="text-gray-600 mb-4">
                  No predictions yet. Start by scanning a crop!
                </p>
                <Link href="/detect" className="btn btn-primary">
                  Start Detection
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/detect"
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center"
            >
              <span className="text-3xl block mb-2">🔍</span>
              <span className="font-medium text-gray-900">New Detection</span>
            </Link>
            <Link
              href="/history"
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center"
            >
              <span className="text-3xl block mb-2">📜</span>
              <span className="font-medium text-gray-900">View History</span>
            </Link>
            <Link
              href="/awareness"
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center"
            >
              <span className="text-3xl block mb-2">📚</span>
              <span className="font-medium text-gray-900">Disease Guide</span>
            </Link>
            <Link
              href="/profile"
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center"
            >
              <span className="text-3xl block mb-2">👤</span>
              <span className="font-medium text-gray-900">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
