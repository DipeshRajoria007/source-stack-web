"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileSystemBrowser } from "@/components/drive/file-system-browser";
import Background from "@/components/Background";
import { useState } from "react";

export default function AppPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");

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
    // TODO: Save selected folder to backend/database
    console.log("Selected folder:", folderId, folderName);
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
