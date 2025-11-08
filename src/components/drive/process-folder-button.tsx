"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Play,
  CheckCircle2,
  FileText,
  Database,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBatchParseJobAction } from "@/actions/batchParseJob";
import { toast } from "sonner";
import type { BatchParseJobStatus } from "@/types/fastapi";

interface ProcessFolderButtonProps {
  folderId: string;
  folderName?: string;
  onError?: (error: string) => void;
  onStatusChange?: (status: {
    processing: boolean;
    currentStatus: ProcessingStatus;
    statusMessage: string;
    progress: number | null;
    totalFiles: number | null;
    processedFiles: number | null;
    hasError: boolean;
  }) => void;
}

type ProcessingStatus =
  | "idle"
  | "creating"
  | "discovering"
  | "parsing"
  | "creating-spreadsheet"
  | "exporting"
  | "completed";

interface StatusStep {
  id: ProcessingStatus;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const statusSteps: StatusStep[] = [
  {
    id: "discovering",
    label: "Files Discovered",
    icon: <FileText className="w-4 h-4" />,
    description: "Scanning folder for files...",
  },
  {
    id: "parsing",
    label: "Parsing Files",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    description: "Extracting candidate information...",
  },
  {
    id: "creating-spreadsheet",
    label: "Creating Spreadsheet",
    icon: <Database className="w-4 h-4" />,
    description: "Setting up Google Sheets...",
  },
  {
    id: "exporting",
    label: "Exporting",
    icon: <Download className="w-4 h-4" />,
    description: "Writing data to spreadsheet...",
  },
];

export function ProcessFolderButton({
  folderId,
  folderName,
  onError,
  onStatusChange,
}: ProcessFolderButtonProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ProcessingStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [progress, setProgress] = useState<number | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [totalFiles, setTotalFiles] = useState<number | null>(null);
  const [processedFiles, setProcessedFiles] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleProcess = async () => {
    if (!folderId) return;

    // Reset all state
    setProcessing(true);
    setHasError(false);
    setCurrentStatus("creating");
    setStatusMessage("Creating job...");
    setProgress(null);
    setJobId(null);
    setTotalFiles(null);
    setProcessedFiles(null);

    // Notify parent of status change
    if (onStatusChange) {
      onStatusChange({
        processing: true,
        currentStatus: "creating",
        statusMessage: "Creating job...",
        progress: null,
        totalFiles: null,
        processedFiles: null,
        hasError: false,
      });
    }

    // Clear any existing polling interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    try {
      // Step 1: Create the job
      const { jobId: newJobId } = await createBatchParseJobAction(
        folderId,
        folderName
      );
      setJobId(newJobId);

      // Store folder info in localStorage for results page
      if (folderName) {
        localStorage.setItem(`job_${newJobId}_folderName`, folderName);
        localStorage.setItem(`job_${newJobId}_folderId`, folderId);
      }

      setCurrentStatus("discovering");
      setStatusMessage("Discovering files...");

      // Step 2: Poll for status updates
      const pollInterval = setInterval(async () => {
        try {
          const status = await fetch(`/api/jobs/${newJobId}`).then((res) =>
            res.json()
          );

          if (status.error) {
            throw new Error(status.error);
          }

          const jobStatus = status.status as BatchParseJobStatus;

          // Update progress and file counts
          let newProgress = progress;
          let newTotalFiles = totalFiles;
          let newProcessedFiles = processedFiles;

          if (jobStatus.progress !== undefined) {
            newProgress = jobStatus.progress;
            setProgress(newProgress);
          }
          if (jobStatus.total_files !== undefined) {
            newTotalFiles = jobStatus.total_files;
            setTotalFiles(newTotalFiles);
          }
          if (jobStatus.processed_files !== undefined) {
            newProcessedFiles = jobStatus.processed_files;
            setProcessedFiles(newProcessedFiles);
          }

          // Determine current status based on job status and progress
          let newStatus: ProcessingStatus = currentStatus;
          let newMessage: string = statusMessage;

          if (jobStatus.status === "pending") {
            newStatus = "discovering";
            newMessage = "Discovering files...";
            setCurrentStatus(newStatus);
            setStatusMessage(newMessage);
          } else if (jobStatus.status === "processing") {
            // Determine sub-status based on progress
            if (
              jobStatus.total_files &&
              jobStatus.processed_files !== undefined
            ) {
              const filesProgress =
                (jobStatus.processed_files / jobStatus.total_files) * 100;

              if (filesProgress < 30) {
                newStatus = "parsing";
                newMessage = `Parsing files... (${jobStatus.processed_files}/${jobStatus.total_files})`;
              } else if (filesProgress < 80) {
                newStatus = "creating-spreadsheet";
                newMessage = "Creating spreadsheet...";
              } else {
                newStatus = "exporting";
                newMessage = "Exporting to spreadsheet...";
              }
            } else {
              newStatus = "parsing";
              newMessage = "Processing files...";
            }
            setCurrentStatus(newStatus);
            setStatusMessage(newMessage);

            // Notify parent of status change after state updates
            if (onStatusChange) {
              onStatusChange({
                processing: true,
                currentStatus: newStatus,
                statusMessage: newMessage,
                progress: newProgress,
                totalFiles: newTotalFiles,
                processedFiles: newProcessedFiles,
                hasError: false,
              });
            }
          } else if (jobStatus.status === "completed") {
            clearInterval(pollInterval);
            pollIntervalRef.current = null;
            setCurrentStatus("completed");
            setStatusMessage("Completed!");
            setProgress(100);
            if (jobStatus.total_files !== undefined) {
              setProcessedFiles(jobStatus.total_files);
            }

            // Notify parent of completion
            if (onStatusChange) {
              onStatusChange({
                processing: true,
                currentStatus: "completed",
                statusMessage: "Completed!",
                progress: 100,
                totalFiles: jobStatus.total_files ?? totalFiles,
                processedFiles: jobStatus.total_files ?? processedFiles,
                hasError: false,
              });
            }

            // Redirect to results page after a short delay
            toast.success("Processing completed!", {
              description: "Redirecting to results page...",
            });

            setTimeout(() => {
              setProcessing(false);
              if (onStatusChange) {
                onStatusChange({
                  processing: false,
                  currentStatus: "idle",
                  statusMessage: "",
                  progress: null,
                  totalFiles: null,
                  processedFiles: null,
                  hasError: false,
                });
              }
              router.push(`/app/results/${newJobId}`);
            }, 1500);
          } else if (jobStatus.status === "failed") {
            clearInterval(pollInterval);
            pollIntervalRef.current = null;
            setHasError(true);
            setCurrentStatus("idle");
            setStatusMessage(jobStatus.error || "Job failed");

            // Notify parent of error
            if (onStatusChange) {
              onStatusChange({
                processing: false,
                currentStatus: "idle",
                statusMessage: jobStatus.error || "Job failed",
                progress: null,
                totalFiles: null,
                processedFiles: null,
                hasError: true,
              });
            }

            throw new Error(jobStatus.error || "Job failed");
          }
        } catch (err) {
          clearInterval(pollInterval);
          pollIntervalRef.current = null;
          setHasError(true);
          setCurrentStatus("idle");
          const errorMsg =
            err instanceof Error ? err.message : "An error occurred";
          setStatusMessage(errorMsg);

          // Notify parent of error
          if (onStatusChange) {
            onStatusChange({
              processing: true,
              currentStatus: "idle",
              statusMessage: errorMsg,
              progress: null,
              totalFiles: null,
              processedFiles: null,
              hasError: true,
            });
          }

          throw err;
        }
      }, 2000); // Poll every 2 seconds

      // Store interval reference
      pollIntervalRef.current = pollInterval;

      // Set a timeout to clear interval after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        pollIntervalRef.current = null;
      }, 600000);
    } catch (error) {
      // Clear polling interval if it exists
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }

      setHasError(true);
      let errorMessage = "Failed to process folder";

      // Handle different error types (server actions serialize errors differently)
      if (error instanceof Error) {
        errorMessage = error.message || "Unknown error occurred";
        // Log full error for debugging
        console.error("Error processing folder:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
          error,
        });
      } else if (error && typeof error === "object") {
        // Handle serialized server action errors
        const errorObj = error as Record<string, unknown>;
        errorMessage =
          (typeof errorObj.message === "string"
            ? errorObj.message
            : undefined) ||
          (typeof errorObj.error === "string" ? errorObj.error : undefined) ||
          (typeof errorObj.detail === "string" ? errorObj.detail : undefined) ||
          String(errorObj) ||
          JSON.stringify(errorObj);

        console.error("Error processing folder (serialized):", {
          error,
          errorType: typeof error,
          errorKeys: Object.keys(errorObj),
          errorMessage,
        });
      } else {
        // Handle primitive errors
        errorMessage = String(error) || "Unknown error occurred";
        console.error("Unknown error processing folder:", {
          error,
          errorType: typeof error,
        });
      }

      // Ensure we have a meaningful error message
      if (
        !errorMessage ||
        errorMessage === "{}" ||
        errorMessage === "[object Object]"
      ) {
        errorMessage =
          "An unexpected error occurred. Please check the console for details.";
      }

      // Update status to show error
      setCurrentStatus("idle");
      setStatusMessage(errorMessage);

      // Notify parent of error
      if (onStatusChange) {
        onStatusChange({
          processing: true,
          currentStatus: "idle",
          statusMessage: errorMessage,
          progress: null,
          totalFiles: null,
          processedFiles: null,
          hasError: true,
        });
      }

      toast.error("Failed to process folder", {
        description: errorMessage,
        duration: 5000,
      });

      if (onError) {
        onError(errorMessage);
      }

      // Keep processing state true for a bit to show error, then reset
      setTimeout(() => {
        setProcessing(false);
        setHasError(false);
        if (onStatusChange) {
          onStatusChange({
            processing: false,
            currentStatus: "idle",
            statusMessage: "",
            progress: null,
            totalFiles: null,
            processedFiles: null,
            hasError: false,
          });
        }
      }, 5000);
    }
  };

  const getCurrentStepIndex = () => {
    if (currentStatus === "completed") {
      return statusSteps.length; // All steps completed
    }
    const index = statusSteps.findIndex((step) => step.id === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-4">
      <Button
        onClick={handleProcess}
        disabled={processing || !folderId}
        size="lg"
        className="w-full sm:w-auto"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {statusMessage || "Processing..."}
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Process Folder
          </>
        )}
      </Button>
    </div>
  );
}

// Export status display component separately
export function ProcessStatusDisplay({
  processing,
  currentStatus,
  statusMessage,
  progress,
  totalFiles,
  processedFiles,
  hasError,
}: {
  processing: boolean;
  currentStatus: ProcessingStatus;
  statusMessage: string;
  progress: number | null;
  totalFiles: number | null;
  processedFiles: number | null;
  hasError: boolean;
}) {
  const getCurrentStepIndex = () => {
    if (currentStatus === "completed") {
      return statusSteps.length; // All steps completed
    }
    const index = statusSteps.findIndex((step) => step.id === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  if (!processing && !hasError) {
    return null;
  }

  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border rounded-lg p-4 space-y-4 ${
        hasError ? "border-red-500/30 bg-red-500/5" : "border-white/10"
      }`}
    >
      {/* Progress Bar */}
      {progress !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Overall Progress</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* File Count */}
      {totalFiles !== null && (
        <div className="text-sm text-gray-300">
          <span className="font-medium text-white">
            {processedFiles !== null ? processedFiles : 0}
          </span>{" "}
          of <span className="font-medium text-white">{totalFiles}</span> files
          processed
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm font-medium">
            Error: {statusMessage}
          </p>
        </div>
      )}

      {/* Status Steps */}
      {!hasError && (
        <div className="space-y-3">
          {statusSteps.map((step, index) => {
            const isActive =
              index === currentStepIndex && currentStatus !== "completed";
            const isCompleted =
              index < currentStepIndex || currentStatus === "completed";
            const isUpcoming =
              index > currentStepIndex && currentStatus !== "completed";

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isActive
                    ? "bg-blue-500/20 border-blue-500/50"
                    : isCompleted
                    ? "bg-white/5 border-white/10 opacity-60"
                    : "bg-white/5 border-white/10 opacity-40"
                }`}
              >
                <div
                  className={`flex-shrink-0 ${
                    isActive
                      ? "text-blue-400"
                      : isCompleted
                      ? "text-green-400"
                      : "text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-white"
                        : isCompleted
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </div>
                  {isActive && (
                    <div className="text-xs text-gray-400 mt-1">
                      {statusMessage || step.description}
                    </div>
                  )}
                </div>
                {isActive && (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
