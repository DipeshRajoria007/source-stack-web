"use client";

import { useState, useEffect } from "react";
import {
  X,
  FileText,
  Folder,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleSheetsCard } from "@/components/GoogleSheetsCard";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    id: 1,
    title: "Stack 'em up!",
    description: "Got a folder full of resumes? We've got you covered.",
    pun: "No need to stack them manually—we'll do the heavy lifting!",
    icon: Folder,
    animation: "bounce",
  },
  {
    id: 2,
    title: "We read between the lines",
    description:
      "Our AI extracts candidate info faster than you can say 'hire me'.",
    pun: "Literally. We read every line. Every. Single. Line.",
    icon: FileText,
    animation: "pulse",
  },
  {
    id: 3,
    title: "Spreadsheet magic ✨",
    description:
      "Watch your resumes transform into organized rows and columns.",
    pun: "Abracadabra! Your hiring data is now spreadsheet-ready.",
    icon: Sparkles,
    animation: "spin",
  },
];

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [displayStep, setDisplayStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setDisplayStep(0);
      setPreviousStep(0);
      setIsExiting(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setIsExiting(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setDisplayStep(currentStep + 1);
        setIsExiting(false);
      }, 300);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setIsExiting(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setDisplayStep(currentStep - 1);
        setIsExiting(false);
      }, 300);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = steps[displayStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-black backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 mb-6 sm:mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-500 ease-in-out ${
                    index === currentStep
                      ? "border-white bg-white/10 scale-110"
                      : index < currentStep
                      ? "border-white/60 bg-white/10 scale-100"
                      : "border-white/20 bg-transparent scale-100"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <span
                      className={`text-xs sm:text-sm font-semibold transition-all duration-500 ${
                        index === currentStep
                          ? "text-white"
                          : index < currentStep
                          ? "text-white/60"
                          : "text-white/30"
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
              </div>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-4 sm:w-6 md:w-8 mx-1 sm:mx-2 transition-all duration-500 ease-in-out ${
                    index < currentStep ? "bg-white/60" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content with smooth transitions */}
        <div className="text-center mb-6 sm:mb-8 relative min-h-[150px] sm:min-h-[200px]">
          <div
            key={displayStep}
            className={`transition-all duration-500 ease-in-out ${
              isExiting
                ? "opacity-0 translate-y-4 scale-95"
                : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4 sm:mb-6">
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
              {currentStepData.title}
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-base sm:text-lg mb-3 sm:mb-4 px-2">
              {currentStepData.description}
            </p>

            {/* Pun */}
            <p className="text-white/60 text-xs sm:text-sm italic px-2">
              {currentStepData.pun}
            </p>
          </div>
        </div>

        {/* Visual Demo */}
        <div className="bg-white/5 rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-white/10 min-h-[200px] sm:min-h-[280px] flex items-center justify-center overflow-hidden">
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 w-full flex-wrap">
            {/* Resume Stack - Visible in steps 0, 1, and 2 - No fade animation, always visible */}
            <div className="relative w-24 h-32 sm:w-32 sm:h-40 md:w-40 md:h-48 flex items-center justify-center">
              {[0, 1, 2].map((index) => {
                const shouldShow = displayStep <= 2;
                const isProcessing = displayStep === 1;
                const isFinalStep = displayStep === 2;
                return (
                  <div
                    key={index}
                    className="absolute bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-300 ease-in-out shadow-lg"
                    style={{
                      width: "clamp(80px, 20vw, 120px)",
                      height: "clamp(100px, 25vw, 160px)",
                      transform: `translate(${index * 4}px, ${
                        index * 4
                      }px) rotate(${
                        index === 0 ? -3 : index === 1 ? 2 : 0
                      }deg)`,
                      opacity: shouldShow
                        ? isProcessing
                          ? index === 2
                            ? 0.5
                            : index === 1
                            ? 0.4
                            : 0.3
                          : isFinalStep
                          ? index === 2
                            ? 0.6
                            : index === 1
                            ? 0.5
                            : 0.4
                          : index === 2
                          ? 1
                          : index === 1
                          ? 0.75
                          : 0.6
                        : 0,
                      zIndex: 10 - index,
                      filter: isProcessing
                        ? "blur(2px)"
                        : isFinalStep
                        ? "blur(1px)"
                        : "none",
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full gap-1 sm:gap-2">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white mb-1 sm:mb-2" />
                      <div className="w-full h-1.5 sm:h-2 bg-white/20 rounded mb-0.5 sm:mb-1"></div>
                      <div className="w-3/4 h-1.5 sm:h-2 bg-white/20 rounded mb-0.5 sm:mb-1"></div>
                      <div className="w-full h-1.5 sm:h-2 bg-white/20 rounded mb-0.5 sm:mb-1"></div>
                      <div className="w-2/3 h-1.5 sm:h-2 bg-white/20 rounded"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Arrow 1 - Appears in step 1, stays in step 2 */}
            {(() => {
              const wasVisible = previousStep >= 1;
              const willBeVisible = currentStep >= 1;
              const isVisible = displayStep >= 1;
              // Animate if: appearing (wasn't visible, will be visible) or disappearing (was visible, won't be visible)
              const isNew = !wasVisible && willBeVisible;
              const isRemoving = wasVisible && !willBeVisible;
              const shouldAnimate = isNew || isRemoving;
              return (
                <ArrowRight
                  className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white/50 ${
                    shouldAnimate
                      ? "transition-opacity duration-500 ease-in-out"
                      : ""
                  }`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                  }}
                />
              );
            })()}

            {/* Processing Indicator - Appears in step 1, stays in step 2 */}
            {(() => {
              const wasVisible = previousStep === 1 || previousStep === 2;
              const willBeVisible = currentStep === 1 || currentStep === 2;
              const isVisible = displayStep === 1 || displayStep === 2;
              const isNew = !wasVisible && willBeVisible;
              const isRemoving = wasVisible && !willBeVisible;
              const shouldAnimate = isNew || isRemoving;
              return (
                <div
                  className={`w-28 h-32 sm:w-32 sm:h-40 md:w-40 md:h-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 ${
                    shouldAnimate
                      ? "transition-opacity duration-500 ease-in-out"
                      : ""
                  }`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-3 border-white/30 border-t-white rounded-full transition-all duration-300 ${
                      displayStep === 1 && isVisible ? "animate-spin" : ""
                    }`}
                  />
                  <span className="text-white text-xs sm:text-sm font-medium">
                    Processing...
                  </span>
                </div>
              );
            })()}

            {/* Arrow 2 - Appears in step 2 */}
            {(() => {
              const wasVisible = previousStep === 2;
              const willBeVisible = currentStep === 2;
              const isVisible = displayStep === 2;
              const isNew = !wasVisible && willBeVisible;
              const isRemoving = wasVisible && !willBeVisible;
              const shouldAnimate = isNew || isRemoving;
              return (
                <ArrowRight
                  className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white/50 ${
                    shouldAnimate
                      ? "transition-opacity duration-500 ease-in-out"
                      : ""
                  }`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                  }}
                />
              );
            })()}

            {/* Spreadsheet - Appears in step 2 */}
            {(() => {
              const wasVisible = previousStep === 2;
              const willBeVisible = currentStep === 2;
              const isVisible = displayStep === 2;
              const isNew = !wasVisible && willBeVisible;
              const isRemoving = wasVisible && !willBeVisible;
              const shouldAnimate = isNew || isRemoving;
              return (
                <div
                  className={
                    shouldAnimate
                      ? "transition-opacity duration-500 ease-in-out"
                      : ""
                  }
                  style={{
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  <GoogleSheetsCard />
                </div>
              );
            })()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={handleSkip}
            className="text-white/60 hover:text-white transition-colors text-xs sm:text-sm text-center sm:text-left order-2 sm:order-1"
          >
            Skip Demo
          </button>

          <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2 w-full sm:w-auto">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isExiting}
                className="flex-1 sm:flex-none text-sm"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="min-w-[100px] sm:min-w-[120px] flex-1 sm:flex-none text-sm"
              disabled={isExiting}
            >
              {isLastStep ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
