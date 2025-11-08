import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import { FEATURES_CONFIG } from "@/constants";
import { GetStartedLink } from "@/components/ui/get-started-link";
import { Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features - SourceStack",
  description:
    "Everything you need to automate HR data. From Drive ingestion to Sheet sync — built for speed, accuracy, and control.",
};

export default function FeaturesPage() {
  const { header, features, highlights, cta } = FEATURES_CONFIG;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-6 md:px-12 lg:px-16 py-24">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-sm font-medium mb-6">
                {header.badge}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {header.title}
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                {header.subtitle}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {feature.badge && (
                        <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white text-xs font-medium">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Highlights Section */}
            <div className="space-y-24 mb-24">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    highlight.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
                  } items-center gap-12`}
                >
                  <div className="flex-1">
                    <span className="text-white/60 text-sm font-medium uppercase tracking-wide mb-4 block">
                      {highlight.overline}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {highlight.title}
                    </h2>
                    <p className="text-gray-300 text-lg mb-6">
                      {highlight.description}
                    </p>
                    <ul className="space-y-3">
                      {highlight.points.map((point, pointIndex) => (
                        <li
                          key={pointIndex}
                          className="flex items-center gap-3 text-gray-300"
                        >
                          <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                    <div className="text-center text-white/40">
                      <p className="text-sm">Image placeholder</p>
                      <p className="text-xs mt-2">{highlight.image}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to automate your hiring stack?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Start syncing resumes from Drive to Sheets in seconds.
              </p>
              <GetStartedLink className="inline-block bg-white text-black px-8 py-4 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors">
                {cta.label}
              </GetStartedLink>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
