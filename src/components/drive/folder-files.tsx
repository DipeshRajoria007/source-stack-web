"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
}

interface FolderFilesProps {
  folderId: string;
  className?: string;
}

export function FolderFiles({ folderId, className }: FolderFilesProps) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!folderId || folderId.trim() === "" || folderId === ".") {
        console.log("No valid folderId provided to FolderFiles:", folderId);
        setLoading(false);
        setError("Invalid folder ID");
        return;
      }

      console.log("Fetching files for folder:", folderId);
      setLoading(true);
      setError(null);

      try {
        // Ensure folderId is properly encoded
        const encodedFolderId = encodeURIComponent(folderId);
        const url = `/api/drive/folders/${encodedFolderId}/files`;
        console.log("Fetching from URL:", url);
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error ||
            `Failed to fetch files (${response.status} ${response.statusText})`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setFiles(data.files || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folderId]);

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return "";
    const size = parseInt(bytes, 10);
    if (isNaN(size)) return "";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) {
      return <FileText className="w-5 h-5 text-red-400" />;
    }
    if (mimeType.includes("word") || mimeType.includes("document")) {
      return <FileText className="w-5 h-5 text-blue-400" />;
    }
    return <File className="w-5 h-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-[300px]", className)}>
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center h-[300px]", className)}>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-[300px]", className)}>
        <p className="text-gray-400">No files found in this folder</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 rounded-lg border bg-white/5 border-white/10 hover:bg-white/10 transition-all"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getFileIcon(file.mimeType)}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{file.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                {file.size && (
                  <span>{formatFileSize(file.size)}</span>
                )}
                {file.modifiedTime && (
                  <>
                    {file.size && <span>•</span>}
                    <span>Modified {formatDate(file.modifiedTime)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

