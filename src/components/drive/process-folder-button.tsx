"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { batchParseAction } from "@/actions/batchParse";
import { toast } from "sonner";
import type { ParsedCandidate } from "@/types/fastapi";

interface ProcessFolderButtonProps {
  folderId: string;
  folderName?: string;
  onProcessComplete?: (results: ParsedCandidate[]) => void;
  onError?: (error: string) => void;
}

export function ProcessFolderButton({
  folderId,
  folderName,
  onProcessComplete,
  onError,
}: ProcessFolderButtonProps) {
  const [processing, setProcessing] = useState(false);
  const [fileCount, setFileCount] = useState<number | null>(null);

  const handleProcess = async () => {
    if (!folderId) return;

    setProcessing(true);
    setFileCount(null);

    try {
      // Show processing toast
      const processingToast = toast.loading(
        `Processing folder "${folderName || folderId}"...`
      );

      // Call batch parse action with folder details
      // FastAPI will fetch all files from the folder using the Google Bearer token
      // Note: Server actions can throw errors that need to be caught
      const results = await batchParseAction(folderId, folderName);

      // Validate results
      if (!Array.isArray(results)) {
        throw new Error(
          `Unexpected response format. Expected array, got: ${typeof results}`
        );
      }

      // Dismiss loading toast and show success
      toast.dismiss(processingToast);
      toast.success(
        `Successfully processed ${results.length} file${
          results.length > 1 ? "s" : ""
        }`,
        {
          description: `Extracted data from ${results.length} resume${
            results.length > 1 ? "s" : ""
          }`,
        }
      );

      if (onProcessComplete) {
        onProcessComplete(results);
      }
    } catch (error) {
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

      toast.error("Failed to process folder", {
        description: errorMessage,
        duration: 5000,
      });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleProcess}
      disabled={processing || !folderId}
      size="lg"
      className="w-full sm:w-auto"
    >
      {processing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {fileCount
            ? `Processing ${fileCount} file${fileCount > 1 ? "s" : ""}...`
            : "Processing..."}
        </>
      ) : (
        <>
          <Play className="w-4 h-4 mr-2" />
          Process Folder
        </>
      )}
    </Button>
  );
}
