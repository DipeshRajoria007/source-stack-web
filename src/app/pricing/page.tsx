import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import { GetStartedButton } from "@/components/ui/get-started-button";
import { ButtonLink } from "@/components/ui/button-link";
import { Check, Zap, Shield, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - SourceStack",
  description:
    "Start automating your hiring workflow today. SourceStack is free to use — automate resume parsing and Google Sheets sync.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-6 md:px-12 lg:px-16 py-24">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-sm font-medium mb-6">
                Simple Pricing
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Automate your workflow.
                <br />
                <span className="text-white/80">
                  Right now, it&apos;s free.
                </span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                Start automating your hiring stack today. No credit card
                required. Get started in seconds and transform how you manage
                candidate data.
              </p>
            </div>

            {/* Free Plan Card */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                {/* Free Badge */}
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold">
                    FREE
                  </span>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Free Forever
                  </h2>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl md:text-6xl font-bold text-white">
                      $0
                    </span>
                    <span className="text-gray-400 text-lg">/month</span>
                  </div>
                  <p className="text-gray-300 text-lg">
                    Everything you need to automate your hiring workflow. No
                    hidden fees, no credit card required.
                  </p>
                </div>

                <GetStartedButton size="lg" className="w-full mb-8" />

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-medium">
                        Unlimited resume uploads
                      </span>
                      <p className="text-gray-400 text-sm">
                        Process as many resumes as you need
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-medium">
                        Automatic data extraction
                      </span>
                      <p className="text-gray-400 text-sm">
                        Extract name, email, phone with OCR fallback
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-medium">
                        Google Sheets sync
                      </span>
                      <p className="text-gray-400 text-sm">
                        Automatic sync with de-duplication
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-medium">
                        Review & approve workflow
                      </span>
                      <p className="text-gray-400 text-sm">
                        Fix fields inline and merge duplicates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-medium">
                        Secure by design
                      </span>
                      <p className="text-gray-400 text-sm">
                        Encrypted tokens and activity logs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-300">
                  Process resumes in seconds with async workers and smart
                  batching
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Secure & Private
                </h3>
                <p className="text-gray-300">
                  Your data stays secure with least-privilege scopes and
                  encryption
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Save Time
                </h3>
                <p className="text-gray-300">
                  Automate repetitive tasks and focus on what matters most
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to automate your workflow?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join teams already saving hours every week with SourceStack.
                Start free, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <GetStartedButton size="lg" />
                <ButtonLink href="/features" variant="outline" size="lg">
                  View Features
                </ButtonLink>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
