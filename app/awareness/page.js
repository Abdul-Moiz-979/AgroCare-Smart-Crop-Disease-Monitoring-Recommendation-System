"use client";

import { useState } from "react";
import { awarenessContent } from "@/lib/dummyData";

export default function AwarenessPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const cropData = awarenessContent.corn;

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Corn Disease Awareness & Education
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn about corn diseases, prevention methods, and best practices
            for healthy crops
          </p>
        </div>

        {/* Corn Header */}
        <div className="flex justify-center gap-4 mb-12">
          <div className="px-8 py-4 rounded-xl bg-gradient-primary text-white shadow-lg">
            <div className="flex justify-center mb-1">
              <span className="text-3xl block">🌽</span>
            </div>
            <span className="font-medium text-lg">Corn</span>
          </div>
        </div>

        {/* Common Diseases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span>🦠</span>
            Common Diseases in Corn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropData.commonDiseases.map((disease, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl mb-3"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {disease}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Prevention Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span>🛡️</span>
            Prevention Tips
          </h2>
          <div className="space-y-4">
            {cropData.preventionTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
              >
                <span className="shrink-0 w-10 h-10 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span>✅</span>
            Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cropData.bestPractices.map((practice, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md flex items-start gap-4"
              >
                <span className="text-green-500 text-xl shrink-0">✓</span>
                <p className="text-gray-700">{practice}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span>❓</span>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {awarenessContent.general.faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <button
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <span className="text-2xl text-gray-500">
                    {expandedFaq === index ? "−" : "+"}
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 animate-fade-in">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-primary rounded-2xl p-7 sm:p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Detect Corn Diseases?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Use our AI-powered detection tool to identify corn diseases early
          </p>
          <a
            href="/detect"
            className="btn btn-lg bg-white text-green-700 hover:bg-gray-100 shadow-lg"
          >
            Start Detection Now →
          </a>
        </section>
      </div>
    </div>
  );
}
