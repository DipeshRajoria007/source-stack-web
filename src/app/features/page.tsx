"use client";

import { useEffect, useState } from "react";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import { FEATURES_CONFIG } from "@/constants";
import { GetStartedLink } from "@/components/ui/get-started-link";
import {
  Check,
  FileText,
  Mail,
  Phone,
  User,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";

function ResumeExtractionDemo() {
  const [extractedFields, setExtractedFields] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isExtracting, setIsExtracting] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [currentField, setCurrentField] = useState<
    "name" | "email" | "phone" | null
  >(null);

  // Generate random Indian resume details
  const generateRandomResume = () => {
    const firstNames = [
      "Rajesh",
      "Priya",
      "Amit",
      "Sneha",
      "Vikram",
      "Anjali",
      "Rahul",
      "Kavita",
      "Suresh",
      "Meera",
      "Arjun",
      "Divya",
      "Karan",
      "Pooja",
      "Rohan",
      "Neha",
    ];
    const lastNames = [
      "Kumar",
      "Sharma",
      "Patel",
      "Singh",
      "Gupta",
      "Reddy",
      "Mehta",
      "Verma",
      "Joshi",
      "Malhotra",
      "Agarwal",
      "Chopra",
      "Kapoor",
      "Nair",
      "Iyer",
      "Rao",
    ];
    const emailDomains = [
      "gmail.com",
      "yahoo.co.in",
      "outlook.com",
      "hotmail.com",
      "rediffmail.com",
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${
      emailDomains[Math.floor(Math.random() * emailDomains.length)]
    }`;
    const phone = `${Math.floor(Math.random() * 9) + 1}${
      Math.floor(Math.random() * 90000) + 10000
    } ${Math.floor(Math.random() * 90000) + 10000}`;

    return { name, email, phone };
  };

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    let isMounted = true;

    const clearAllTimeouts = () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.length = 0;
    };

    const startExtraction = () => {
      if (!isMounted) return;

      const resumeData = generateRandomResume();
      const fields = [
        { key: "name" as const, value: resumeData.name, icon: User },
        { key: "email" as const, value: resumeData.email, icon: Mail },
        { key: "phone" as const, value: resumeData.phone, icon: Phone },
      ];

      // Reset fields
      setExtractedFields({ name: "", email: "", phone: "" });
      setCurrentField(null);
      setIsExtracting(true);
      setIsComplete(false);

      let fieldIndex = 0;

      const processField = () => {
        if (!isMounted) return;

        if (fieldIndex >= fields.length) {
          // All fields extracted, show completion briefly then restart
          setIsExtracting(false);
          setIsComplete(true);
          const restartTimeout = setTimeout(() => {
            if (isMounted) {
              setIsComplete(false);
              startExtraction();
            }
          }, 2000);
          timeouts.push(restartTimeout);
          return;
        }

        const currentFieldData = fields[fieldIndex];
        if (!currentFieldData) {
          return;
        }

        setCurrentField(currentFieldData.key);

        const extractTimeout = setTimeout(() => {
          if (!isMounted) return;

          setExtractedFields((prev) => ({
            ...prev,
            [currentFieldData.key]: currentFieldData.value,
          }));
          setCurrentField(null);
          fieldIndex++;

          // Process next field after a delay
          const nextTimeout = setTimeout(() => {
            if (isMounted) {
              processField();
            }
          }, 500);
          timeouts.push(nextTimeout);
        }, 800);
        timeouts.push(extractTimeout);
      };

      // Start processing fields after initial delay
      const startTimeout = setTimeout(() => {
        if (isMounted) {
          processField();
        }
      }, 500);
      timeouts.push(startTimeout);
    };

    // Start the first extraction
    startExtraction();

    return () => {
      isMounted = false;
      clearAllTimeouts();
    };
  }, []);

  return (
    <div className="w-full mx-auto px-2">
      <div className="flex  w-full flex-col md:flex-row items-center gap-4 md:gap-6">
        {/* Left: Resume Document */}
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 md:p-4 shadow-lg flex-shrink-0 w-full max-w-[180px] md:w-48">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 md:w-5 md:h-5 text-white" />
            <span className="text-white font-medium text-xs md:text-sm">
              Resume.pdf
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 bg-white/20 rounded w-3/4"></div>
            <div className="h-1.5 bg-white/20 rounded w-1/2"></div>
            <div className="h-1.5 bg-white/20 rounded w-5/6 mt-2"></div>
            <div className="h-1.5 bg-white/20 rounded w-2/3"></div>
          </div>
          {/* Scanning overlay */}
          {isExtracting && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent rounded-lg animate-pulse" />
          )}
        </div>

        {/* Center: Extraction Arrow/Spinner */}
        <div className="flex-shrink-0">
          <div
            className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white/30 border-t-white flex items-center justify-center transition-all duration-500 ${
              isExtracting ? "animate-spin" : ""
            } {isComplete ? "hidden" : ""} `}
          >
            {isComplete && !isExtracting && (
              <Check className="w-3 h-3 md:w-4 md:h-4 text-white animate-in fade-in-0 duration-300" />
            )}
          </div>
        </div>

        {/* Right: Extracted Fields */}
        <div className="flex-1 w-full md:w-auto space-y-2">
          {[
            { key: "name" as const, label: "Name", icon: User },
            { key: "email" as const, label: "Email", icon: Mail },
            { key: "phone" as const, label: "Phone", icon: Phone },
          ].map((field) => {
            const Icon = field.icon;
            const value = extractedFields[field.key];
            const isActive = currentField === field.key;

            return (
              <div
                key={field.key}
                className={`bg-white/5 border rounded-lg p-2 md:p-3 transition-all duration-500 ${
                  value
                    ? "border-white/30 bg-white/10"
                    : isActive
                    ? "border-white/20 bg-white/5 animate-pulse"
                    : "border-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      value ? "bg-white/20" : "bg-white/10"
                    }`}
                  >
                    <Icon
                      className={`w-3 h-3 transition-all duration-300 ${
                        value ? "text-white" : "text-white/40"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/60 text-[10px] md:text-xs mb-0.5">
                      {field.label}
                    </div>
                    <div
                      className={`text-white font-medium text-xs md:text-sm transition-all duration-500 truncate ${
                        value ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {value || (
                        <span className="text-white/30 italic text-xs">
                          {isActive ? "Extracting..." : "—"}
                        </span>
                      )}
                    </div>
                  </div>
                  {value && (
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SheetsSyncDemo() {
  const [syncedRows, setSyncedRows] = useState<
    Array<{
      name: string;
      email: string;
      phone: string;
      status: "syncing" | "synced";
    }>
  >([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(-1);

  // Generate random Indian resume details
  const generateRandomResume = () => {
    const firstNames = [
      "Rajesh",
      "Priya",
      "Amit",
      "Sneha",
      "Vikram",
      "Anjali",
      "Rahul",
      "Kavita",
      "Suresh",
      "Meera",
      "Arjun",
      "Divya",
      "Karan",
      "Pooja",
      "Rohan",
      "Neha",
    ];
    const lastNames = [
      "Kumar",
      "Sharma",
      "Patel",
      "Singh",
      "Gupta",
      "Reddy",
      "Mehta",
      "Verma",
      "Joshi",
      "Malhotra",
      "Agarwal",
      "Chopra",
      "Kapoor",
      "Nair",
      "Iyer",
      "Rao",
    ];
    const emailDomains = [
      "gmail.com",
      "yahoo.co.in",
      "outlook.com",
      "hotmail.com",
      "rediffmail.com",
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${
      emailDomains[Math.floor(Math.random() * emailDomains.length)]
    }`;
    const phone = `${Math.floor(Math.random() * 9) + 1}${
      Math.floor(Math.random() * 90000) + 10000
    } ${Math.floor(Math.random() * 90000) + 10000}`;

    return { name, email, phone };
  };

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    let isMounted = true;

    const clearAllTimeouts = () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.length = 0;
    };

    const syncRow = (rowIndex: number) => {
      if (!isMounted) return;

      const newRow = generateRandomResume();

      // Add row with syncing status
      setSyncedRows((prev) => {
        const updated = [...prev];
        updated[rowIndex] = { ...newRow, status: "syncing" };
        return updated;
      });
      setCurrentRowIndex(rowIndex);
      setIsSyncing(true);

      // Simulate sync delay
      const syncTimeout = setTimeout(() => {
        if (!isMounted) return;

        setSyncedRows((prev) => {
          const updated = [...prev];
          updated[rowIndex] = { ...updated[rowIndex], status: "synced" };
          return updated;
        });
        setIsSyncing(false);
        setCurrentRowIndex(-1);

        // Sync next row or restart
        if (rowIndex < 2) {
          const nextTimeout = setTimeout(() => {
            if (isMounted) {
              syncRow(rowIndex + 1);
            }
          }, 800);
          timeouts.push(nextTimeout);
        } else {
          // All rows synced, wait and restart
          const restartTimeout = setTimeout(() => {
            if (isMounted) {
              setSyncedRows([]);
              syncRow(0);
            }
          }, 2000);
          timeouts.push(restartTimeout);
        }
      }, 1200);
      timeouts.push(syncTimeout);
    };

    // Start syncing first row
    const startTimeout = setTimeout(() => {
      if (isMounted) {
        syncRow(0);
      }
    }, 500);
    timeouts.push(startTimeout);

    return () => {
      isMounted = false;
      clearAllTimeouts();
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        {/* Sync Indicator */}
        <div className="flex items-center gap-3 w-full justify-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full border-2 border-white/30 border-t-white flex items-center justify-center transition-all duration-500 ${
                isSyncing ? "animate-spin" : ""
              }`}
            >
              {!isSyncing &&
                syncedRows.length > 0 &&
                syncedRows.every((r) => r.status === "synced") && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
            </div>
            <span className="text-white/60 text-xs">
              {isSyncing
                ? "Syncing..."
                : syncedRows.length > 0 &&
                  syncedRows.every((r) => r.status === "synced")
                ? "Synced"
                : "Ready"}
            </span>
          </div>
          <ArrowDown
            className={`w-5 h-5 text-white/50 transition-all duration-300 ${
              isSyncing ? "animate-bounce" : ""
            }`}
          />
        </div>

        {/* Google Sheets Table */}
        <div className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-white/10 border-b border-white/20 grid grid-cols-3 gap-2 p-2 md:p-3">
            <div className="text-white font-semibold text-xs md:text-sm">
              Name
            </div>
            <div className="text-white font-semibold text-xs md:text-sm">
              Email
            </div>
            <div className="text-white font-semibold text-xs md:text-sm">
              Phone
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/10">
            {[0, 1, 2].map((index) => {
              const row = syncedRows[index];
              const isCurrentRow = currentRowIndex === index;
              const isSyncingRow = row?.status === "syncing";
              const isSyncedRow = row?.status === "synced";

              return (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-2 p-2 md:p-3 transition-all duration-500 ${
                    isSyncingRow
                      ? "bg-white/10 animate-pulse"
                      : isSyncedRow
                      ? "bg-white/5"
                      : "bg-transparent"
                  }`}
                >
                  <div className="text-white text-xs md:text-sm truncate flex items-center gap-2">
                    {isSyncingRow && (
                      <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin flex-shrink-0" />
                    )}
                    {isSyncedRow && (
                      <CheckCircle2 className="w-3 h-3 text-white flex-shrink-0" />
                    )}
                    <span className={isSyncedRow ? "opacity-100" : "opacity-0"}>
                      {row?.name || "—"}
                    </span>
                  </div>
                  <div
                    className={`text-white text-xs md:text-sm truncate transition-all duration-500 ${
                      isSyncedRow ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {row?.email || "—"}
                  </div>
                  <div
                    className={`text-white text-xs md:text-sm truncate transition-all duration-500 ${
                      isSyncedRow ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {row?.phone || "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  const { header, features, highlights, cta } = FEATURES_CONFIG;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-6 md:px-12 lg:px-16 py-24">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div
              className={`text-center mb-20 transition-all duration-1000 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
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
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 transition-all duration-1000 ease-out delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
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
            <div
              className={`space-y-24 mb-24 transition-all duration-1000 ease-out delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
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
                  <div className="flex-1 w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 md:p-8 min-h-[300px] flex items-center justify-center">
                    {highlight.image === "/images/highlight-parsing.png" ? (
                      <ResumeExtractionDemo />
                    ) : highlight.image === "/images/highlight-sync.png" ? (
                      <SheetsSyncDemo />
                    ) : (
                      <div className="text-center text-white/40">
                        <p className="text-sm">Image placeholder</p>
                        <p className="text-xs mt-2">{highlight.image}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div
              className={`text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-12 transition-all duration-1000 ease-out delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
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
