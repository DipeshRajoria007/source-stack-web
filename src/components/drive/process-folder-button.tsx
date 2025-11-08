"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { batchParseAction } from "@/actions/batchParse";
import { toast } from "sonner";
import type { ParsedCandidate } from "@/types/fastapi";

interface ProcessFolderButtonProps {
  folderId: string;
  folderName: string;
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
      // First, fetch files from the folder
      const filesResponse = await fetch(
        `/api/drive/folders/${encodeURIComponent(folderId)}/files`
      );

      if (!filesResponse.ok) {
        throw new Error("Failed to fetch files from folder");
      }

      const filesData = await filesResponse.json();
      const files = filesData.files || [];

      if (files.length === 0) {
        throw new Error("No files found in this folder");
      }

      setFileCount(files.length);
      toast.info(
        `Found ${files.length} file${files.length > 1 ? "s" : ""} to process`
      );

      // Transform files to match API expectations
      const filesToProcess = files.map(
        (file: { id: string; name: string }) => ({
          id: file.id,
          name: file.name,
        })
      );

      // Show processing toast
      const processingToast = toast.loading(
        `Processing ${files.length} file${files.length > 1 ? "s" : ""}...`
      );

      // Call batch parse action
      const results = await batchParseAction(filesToProcess);

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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process folder";

      toast.error("Failed to process folder", {
        description: errorMessage,
      });

      if (onError) {
        onError(errorMessage);
      } else {
        console.error("Error processing folder:", error);
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
