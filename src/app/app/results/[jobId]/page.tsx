"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Background from "@/components/Background";
import {
  ExternalLink,
  Calendar,
  Folder,
  FileText,
  CheckCircle2,
  Clock,
  Database,
  Copy,
  Check,
} from "lucide-react";
import type { BatchParseJobStatus } from "@/types/fastapi";
import type { ParsedCandidate } from "@/types/fastapi";

interface JobDetails {
  jobId: string;
  status: BatchParseJobStatus;
  results?: ParsedCandidate[];
  createdAt?: string;
  completedAt?: string;
  folderId?: string;
  folderName?: string;
}

export default function ResultsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId as string;

  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [completedAt, setCompletedAt] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!jobId) {
      setError("Job ID is required");
      setLoading(false);
      return;
    }

    // Fetch job details
    fetchJobDetails();
  }, [session, sessionStatus, jobId, router]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch job details");
      }

      const data = await response.json();

      // Retrieve folder info from localStorage
      const storedFolderName = localStorage.getItem(`job_${jobId}_folderName`);
      const storedFolderId = localStorage.getItem(`job_${jobId}_folderId`);

      if (storedFolderName || storedFolderId) {
        data.folderName = storedFolderName || undefined;
        data.folderId = storedFolderId || undefined;
      }

      setJobDetails(data);

      // Set timestamps - use current time as fallback if not provided
      if (data.createdAt) {
        setCreatedAt(new Date(data.createdAt));
      } else {
        // Estimate creation time (could be improved with actual API timestamps)
        setCreatedAt(new Date());
      }

      if (data.status.status === "completed") {
        if (data.completedAt) {
          setCompletedAt(new Date(data.completedAt));
        } else {
          setCompletedAt(new Date());
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load job details"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = () => {
    if (!createdAt || !completedAt) return null;
    const diffMs = completedAt.getTime() - createdAt.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes % 60}m`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ${diffSeconds % 60}s`;
    } else {
      return `${diffSeconds}s`;
    }
  };

  const handleCopyLink = async () => {
    if (!spreadsheetUrl) return;

    try {
      await navigator.clipboard.writeText(spreadsheetUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error || !jobDetails) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <p className="text-red-400">{error || "Job not found"}</p>
              <button
                onClick={() => router.push("/app")}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
              >
                Back to App
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { status, results } = jobDetails;
  const spreadsheetId = status.spreadsheet_id;
  const spreadsheetUrl = spreadsheetId
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
    : null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/app")}
              className="text-gray-400 hover:text-white mb-4 text-sm"
            >
              ← Back to App
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">Job Results</h1>
            <p className="text-gray-300">Job ID: {jobId}</p>
          </div>

          {/* Job Summary */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Job Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Status</span>
                    <p className="text-white font-medium capitalize">
                      {status.status}
                    </p>
                  </div>
                </div>

                {/* Source Folder */}
                {jobDetails.folderName && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Folder className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-400">
                        Source Folder
                      </span>
                      <p className="text-white font-medium truncate">
                        {jobDetails.folderName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Files Processed */}
                {status.total_files !== undefined && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">
                        Files Processed
                      </span>
                      <p className="text-white font-medium">
                        {status.processed_files || 0} / {status.total_files}
                      </p>
                    </div>
                  </div>
                )}

                {/* Results Count */}
                {status.results_count !== undefined && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">
                        Candidates Found
                      </span>
                      <p className="text-white font-medium">
                        {status.results_count}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Progress */}
                {status.progress !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm font-medium">
                        Progress
                      </span>
                      <span className="text-white text-sm font-medium">
                        {status.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${status.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="space-y-3">
                  {createdAt && (
                    <div className="flex items-start gap-2 text-gray-300">
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-400">Started</span>
                        <p className="text-white text-sm">
                          {formatTimestamp(createdAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {completedAt && (
                    <div className="flex items-start gap-2 text-gray-300">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-400">Completed</span>
                        <p className="text-white text-sm">
                          {formatTimestamp(completedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {createdAt && completedAt && (
                    <div className="flex items-start gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-400">Duration</span>
                        <p className="text-white text-sm">
                          {getDuration() || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message */}
                {status.message && (
                  <div className="flex items-start gap-2 text-gray-300">
                    <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-400">Message</span>
                      <p className="text-white text-sm">{status.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Spreadsheet Section */}
          {spreadsheetUrl && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    Google Spreadsheet
                  </h2>
                  <p className="text-sm text-gray-400">
                    View and edit your parsed candidate data
                  </p>
                </div>
                <a
                  href={spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Sheets
                </a>
              </div>

              {/* Spreadsheet Link */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-gray-400">Link:</span>
                  <a
                    href={spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 truncate flex-1 min-w-0"
                  >
                    {spreadsheetUrl}
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center p-1.5 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    title={copied ? "Copied!" : "Copy link"}
                    aria-label="Copy spreadsheet link"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Embedded Preview */}
              <div
                className="w-full bg-white/5 rounded-lg overflow-hidden border border-white/10"
                style={{ height: "600px" }}
              >
                <iframe
                  src={`${spreadsheetUrl}/preview`}
                  className="w-full h-full"
                  title="Spreadsheet Preview"
                  allow="fullscreen"
                  style={{ border: "none" }}
                />
              </div>
            </div>
          )}

          {/* Results Preview */}
          {results && results.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Parsed Candidates ({results.length})
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.slice(0, 10).map((result, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/5 rounded border border-white/10"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {result.source_file || `File ${index + 1}`}
                        </p>
                        <div className="mt-2 space-y-1 text-sm text-gray-300">
                          {result.name && (
                            <p>
                              <span className="font-medium">Name:</span>{" "}
                              {result.name}
                            </p>
                          )}
                          {result.email && (
                            <p>
                              <span className="font-medium">Email:</span>{" "}
                              {result.email}
                            </p>
                          )}
                          {result.phone && (
                            <p>
                              <span className="font-medium">Phone:</span>{" "}
                              {result.phone}
                            </p>
                          )}
                          <p>
                            <span className="font-medium">Confidence:</span>{" "}
                            {(result.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {results.length > 10 && (
                  <p className="text-gray-400 text-sm text-center mt-4">
                    Showing first 10 of {results.length} results. View full
                    results in the spreadsheet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
