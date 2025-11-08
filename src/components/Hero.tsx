"use client";

import { useState, useEffect } from "react";
import { FileText, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/components/ui/get-started-button";
import { DemoModal } from "@/components/DemoModal";
import { GoogleSheetsCard } from "@/components/GoogleSheetsCard";

export default function Hero() {
  const [topCard, setTopCard] = useState<number>(2); // 0, 1, or 2 (index of top card)
  const [isVisible, setIsVisible] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (index: number) => {
    setTopCard(index);
  };

  const getCardStyles = (index: number) => {
    const positions = [
      {
        bottom: 30,
        translateX: 8,
        translateY: 8,
        rotate: -3,
        opacity: 50,
        zIndex: 10,
        scale: 0.95,
      },
      {
        bottom: 42,
        translateX: 4,
        translateY: 4,
        rotate: 1.5,
        opacity: 70,
        zIndex: 20,
        scale: 0.98,
      },
      {
        bottom: 54,
        translateX: 0,
        translateY: 0,
        rotate: 0,
        opacity: 100,
        zIndex: 30,
        scale: 1,
      },
    ];

    // Create ordered array: cards before topCard, then topCard at the end
    const orderedIndices: number[] = [];
    for (let i = 0; i < 3; i++) {
      if (i !== topCard) {
        orderedIndices.push(i);
      }
    }
    orderedIndices.push(topCard); // Top card is always last

    // Find position of current card in the ordered array
    const position = orderedIndices.indexOf(index);
    const style = positions[position];

    return {
      bottom: `${style.bottom}px`,
      transform: `translate(${style.translateX}px, ${style.translateY}px) rotate(${style.rotate}deg) scale(${style.scale})`,
      opacity: style.opacity / 100,
      zIndex: style.zIndex,
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  const resumeCards = [
    {
      id: 0,
      name: "Resume_3.pdf",
      content: [
        { width: "3/4" },
        { width: "1/2" },
        { width: "5/6" },
        { width: "2/3", marginTop: true },
        { width: "4/5" },
      ],
    },
    {
      id: 1,
      name: "Resume_2.pdf",
      content: [
        { width: "4/5" },
        { width: "3/4" },
        { width: "2/3" },
        { width: "5/6", marginTop: true },
        { width: "1/2" },
      ],
    },
    {
      id: 2,
      name: "Resume_1.pdf",
      content: [
        { width: "3/4" },
        { width: "1/2" },
        { width: "5/6" },
        { width: "2/3", marginTop: true },
        { width: "4/5" },
      ],
    },
  ];

  return (
    <main className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16 py-24">
      <div className="max-w-5xl w-full">
        {/* Headline */}
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-center transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Automate your hiring stack — from Drive to Sheet.
        </h1>

        {/* Subtext */}
        <p
          className={`text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed text-center transition-all duration-1000 ease-out delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Upload shortlisted resumes, extract candidate data automatically, and
          sync to Google Sheets in seconds.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 ease-out delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <GetStartedButton size="lg" />
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsDemoOpen(true)}
            className="transition-all duration-200 hover:scale-105 hover:bg-white/5"
          >
            <Play className="w-4 h-4" />
            Watch Demo
          </Button>
        </div>

        {/* Demo Modal */}
        <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

        {/* Screenshot Mock - Resume PDF → Spreadsheet */}
        <div
          className={`relative mt-12 transition-all duration-1000 ease-out delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Stack of Resume PDF Cards */}
            <div className="relative w-full md:w-80 h-[320px]">
              {resumeCards.map((card, index) => {
                const styles = getCardStyles(index);
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className="absolute left-0 right-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl cursor-pointer transition-all duration-200 hover:border-white/30 hover:bg-white/12"
                    style={styles}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-6 h-6 text-white" />
                      <span className="text-white font-medium">
                        {card.name}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded p-4 space-y-2">
                      {card.content.map((line, lineIndex) => {
                        const widthClasses: Record<string, string> = {
                          "3/4": "w-3/4",
                          "1/2": "w-1/2",
                          "5/6": "w-5/6",
                          "2/3": "w-2/3",
                          "4/5": "w-4/5",
                        };
                        return (
                          <div
                            key={lineIndex}
                            className={`h-3 bg-white/20 rounded ${
                              widthClasses[line.width]
                            } ${line.marginTop ? "mt-4" : ""}`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Arrow */}
            <div className="hidden md:block group">
              <ArrowRight className="w-8 h-8 text-white/50 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white/70" />
            </div>
            <div className="md:hidden group">
              <ArrowRight className="w-8 h-8 text-white/50 rotate-90 transition-all duration-200 group-hover:translate-y-1 group-hover:text-white/70" />
            </div>

            {/* Spreadsheet Card */}
            <GoogleSheetsCard />
          </div>
        </div>
      </div>
    </main>
  );
}
