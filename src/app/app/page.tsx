"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileSystemBrowser } from "@/components/drive/file-system-browser";
import { ProcessFolderButton } from "@/components/drive/process-folder-button";
import Background from "@/components/Background";
import { useState } from "react";
import type { ParsedCandidate } from "@/types/fastapi";

export default function AppPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");
  const [processingResults, setProcessingResults] = useState<ParsedCandidate[] | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

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
    // Reset results when selecting a new folder
    setProcessingResults(null);
    setProcessingError(null);
  };

  const handleProcessComplete = (results: ParsedCandidate[]) => {
    setProcessingResults(results);
    setProcessingError(null);
  };

  const handleProcessError = (error: string) => {
    setProcessingError(error);
    setProcessingResults(null);
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
              Choose a Google Drive folder containing resumes to process and sync to Google Sheets
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
            <FileSystemBrowser
              onFolderSelect={handleFolderSelect}
              selectedFolderId={selectedFolderId}
            />
          </div>

          {/* Process Folder Section */}
          {selectedFolderId && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    Process Folder
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Selected: <span className="text-white font-medium">{selectedFolderName}</span>
                  </p>
                </div>
                <ProcessFolderButton
                  folderId={selectedFolderId}
                  folderName={selectedFolderName}
                  onProcessComplete={handleProcessComplete}
                  onError={handleProcessError}
                />
              </div>

              {/* Error Display */}
              {processingError && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{processingError}</p>
                </div>
              )}

              {/* Results Display */}
              {processingResults && (
                <div className="mt-4 p-4 bg-white/10 border border-white/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Processing Complete
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Processed {processingResults.length} file{processingResults.length !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {processingResults.map((result, index) => (
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
                                  <span className="font-medium">Name:</span> {result.name}
                                </p>
                              )}
                              {result.email && (
                                <p>
                                  <span className="font-medium">Email:</span> {result.email}
                                </p>
                              )}
                              {result.phone && (
                                <p>
                                  <span className="font-medium">Phone:</span> {result.phone}
                                </p>
                              )}
                              <p>
                                <span className="font-medium">Confidence:</span>{" "}
                                {(result.confidence * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </div>
                        {result.errors && result.errors.length > 0 && (
                          <div className="mt-2 text-xs text-red-400">
                            <p className="font-medium">Errors:</p>
                            <ul className="list-disc list-inside">
                              {result.errors.map((error, errIndex) => (
                                <li key={errIndex}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
