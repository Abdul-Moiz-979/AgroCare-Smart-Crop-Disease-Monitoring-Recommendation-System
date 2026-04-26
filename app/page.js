"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import StatCard from "@/components/StatCard";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
          <p className="text-gray-600">Loading...</p>
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
              Protect Your Corn Crops with
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                {" "}
                AI-Powered
              </span>
              <br />
              Disease Detection
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Advanced disease detection for corn crops. Upload a leaf image and
              get instant diagnosis with treatment recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/detect"
                className="btn btn-lg bg-white text-green-700 hover:bg-gray-100 shadow-lg"
              >
                Start Detection 🔍
              </Link>
              <Link
                href="/awareness"
                className="btn btn-lg bg-white text-green-700 hover:bg-gray-100 shadow-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-3">1. Upload Image</h3>
              <p className="text-gray-600">
                Take a clear photo of your corn leaf and upload it to our
                platform
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced system validates the image and analyzes it to
                detect diseases
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="text-5xl mb-4">💊</div>
              <h3 className="text-xl font-semibold mb-3">3. Get Results</h3>
              <p className="text-gray-600">
                Receive detailed diagnosis with symptoms and treatment
                recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Platform Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="🌽"
              label="Supported Crop"
              value="Corn"
              color="primary"
            />
            <StatCard
              icon="🦠"
              label="Diseases Detected"
              value="3"
              color="secondary"
            />
            <StatCard
              icon="🎯"
              label="Accuracy Rate"
              value="95%"
              color="success"
            />
            <StatCard
              icon="⚡"
              label="Detection Speed"
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
            Corn Disease Detection
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our AI can detect the following corn diseases with high accuracy
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center border-t-4 border-red-400">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-semibold mb-3">Common Rust</h3>
              <p className="text-gray-600 mb-4">
                Small circular to elongate reddish-brown pustules appearing on
                both leaf surfaces
              </p>
              <Link
                href="/detect"
                className="text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                Scan Now →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center border-t-4 border-yellow-400">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-semibold mb-3">Gray Leaf Spot</h3>
              <p className="text-gray-600 mb-4">
                Rectangular gray to tan lesions parallel to leaf veins that can
                cover entire leaves
              </p>
              <Link
                href="/detect"
                className="text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                Scan Now →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center border-t-4 border-orange-400">
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-semibold mb-3">
                Northern Leaf Blight
              </h3>
              <p className="text-gray-600 mb-4">
                Long cigar-shaped gray-green lesions that turn tan or brown with
                reduced photosynthesis
              </p>
              <Link
                href="/detect"
                className="text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                Scan Now →
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
              Ready to Protect Your Corn Crops?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start detecting corn diseases today and get expert recommendations
            </p>
            <Link
              href="/detect"
              className="btn btn-lg bg-white text-green-700 hover:bg-gray-100 shadow-lg"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
