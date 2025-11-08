"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileSystemBrowser } from "@/components/drive/file-system-browser";
import {
  ProcessFolderButton,
  ProcessStatusDisplay,
} from "@/components/drive/process-folder-button";
import Background from "@/components/Background";
import { useState } from "react";
import type { ParsedCandidate } from "@/types/fastapi";

type ProcessingStatus =
  | "idle"
  | "creating"
  | "discovering"
  | "parsing"
  | "creating-spreadsheet"
  | "exporting"
  | "completed";

export default function AppPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedFolderId, setSelectedFolderId] = useState<
    string | undefined
  >();
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [processStatus, setProcessStatus] = useState<{
    processing: boolean;
    currentStatus: ProcessingStatus;
    statusMessage: string;
    progress: number | null;
    totalFiles: number | null;
    processedFiles: number | null;
    hasError: boolean;
  }>({
    processing: false,
    currentStatus: "idle",
    statusMessage: "",
    progress: null,
    totalFiles: null,
    processedFiles: null,
    hasError: false,
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const handleFolderSelect = (folderId: string, folderName: string) => {
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);
    // Reset error when selecting a new folder
    setProcessingError(null);
  };

  const handleProcessError = (error: string) => {
    setProcessingError(error);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">
              Select Folder
            </h1>
            <p className="text-gray-300 text-lg">
              Choose a Google Drive folder containing resumes to process and
              sync to Google Sheets
            </p>
          </div>

          {/* Status Display - At the top */}
          <ProcessStatusDisplay
            processing={processStatus.processing}
            currentStatus={processStatus.currentStatus}
            statusMessage={processStatus.statusMessage}
            progress={processStatus.progress}
            totalFiles={processStatus.totalFiles}
            processedFiles={processStatus.processedFiles}
            hasError={processStatus.hasError}
          />

          {/* Add spacing if status is showing */}
          {(processStatus.processing || processStatus.hasError) && (
            <div className="mb-6" />
          )}

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6 relative">
            <FileSystemBrowser
              onFolderSelect={handleFolderSelect}
              selectedFolderId={selectedFolderId}
              disabled={processStatus.processing}
            />
          </div>

          {/* Process Folder Section */}
          {selectedFolderId && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    Process Folder
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Selected:{" "}
                    <span className="text-white font-medium">
                      {selectedFolderName}
                    </span>
                  </p>
                </div>
                <ProcessFolderButton
                  folderId={selectedFolderId}
                  folderName={selectedFolderName}
                  onError={handleProcessError}
                  onStatusChange={setProcessStatus}
                />
              </div>

              {/* Error Display */}
              {processingError && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{processingError}</p>
                </div>
              )}
            </div>
          )}

          {session.user && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                User Information
              </h2>
              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="font-medium">Name:</span> {session.user.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {session.user.email}
                </p>
                {session.user.id && (
                  <p>
                    <span className="font-medium">ID:</span> {session.user.id}
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
