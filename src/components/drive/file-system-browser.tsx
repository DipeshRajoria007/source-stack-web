"use client";

import { useState, useEffect } from "react";
import {
  Folder,
  FileText,
  File,
  ChevronRight,
  Loader2,
  ArrowLeft,
  ChevronRight as OpenIcon,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FolderItem {
  id: string;
  name: string;
  mimeType: string;
}

interface FileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
}

interface FileSystemBrowserProps {
  onFolderSelect?: (folderId: string, folderName: string) => void;
  selectedFolderId?: string;
  className?: string;
}

export function FileSystemBrowser({
  onFolderSelect,
  selectedFolderId,
  className,
}: FileSystemBrowserProps) {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string>("");
  const [path, setPath] = useState<Array<{ id: string; name: string }>>([]);

  const fetchFolderContents = async (folderId?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch folders
      const foldersUrl = folderId
        ? `/api/drive/folders?parentId=${folderId}`
        : "/api/drive/folders";
      const foldersResponse = await fetch(foldersUrl);

      if (!foldersResponse.ok) {
        throw new Error("Failed to fetch folders");
      }

      const foldersData = await foldersResponse.json();
      setFolders(foldersData.folders || []);

      // Fetch files if we're in a specific folder
      if (folderId) {
        const filesUrl = `/api/drive/folders/${encodeURIComponent(
          folderId
        )}/files`;
        const filesResponse = await fetch(filesUrl);

        if (filesResponse.ok) {
          const filesData = await filesResponse.json();
          setFiles(filesData.files || []);
        } else {
          setFiles([]);
        }
      } else {
        setFiles([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contents");
    } finally {
      setLoading(false);
    }
  };

  const fetchPath = async (
    folderId: string
  ): Promise<Array<{ id: string; name: string }>> => {
    try {
      const response = await fetch(`/api/drive/folder/${folderId}`);
      if (response.ok) {
        const data = await response.json();
        return data.path || [];
      }
    } catch (err) {
      console.error("Failed to fetch path:", err);
    }
    return [];
  };

  useEffect(() => {
    fetchFolderContents(currentFolderId || undefined);
  }, [currentFolderId]);

  useEffect(() => {
    if (currentFolderId) {
      fetchPath(currentFolderId).then((fetchedPath) => {
        setPath(fetchedPath || []);
        // Get folder name from fetched path
        const folderInPath = fetchedPath?.find((p) => p.id === currentFolderId);
        if (folderInPath) {
          setCurrentFolderName(folderInPath.name);
        }
      });
    } else {
      setPath([]);
      setCurrentFolderName("");
    }
  }, [currentFolderId]);

  const handleFolderClick = (folder: FolderItem) => {
    setCurrentFolderId(folder.id);
    setCurrentFolderName(folder.name);
    if (onFolderSelect) {
      onFolderSelect(folder.id, folder.name);
    }
  };

  const handleNavigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName);
  };

  const handleGoBack = () => {
    if (path.length > 1) {
      const parentFolder = path[path.length - 2];
      setCurrentFolderId(parentFolder.id);
      setCurrentFolderName(parentFolder.name);
    } else {
      setCurrentFolderId(null);
      setCurrentFolderName("");
    }
  };

  const handleGoToRoot = () => {
    setCurrentFolderId(null);
    setCurrentFolderName("");
  };

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
    // Use white/gray icons to match black and white theme
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("word") ||
      mimeType.includes("document") ||
      mimeType.includes("msword") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("excel")
    ) {
      return <FileText className="w-5 h-5 text-white" />;
    }
    return <File className="w-5 h-5 text-white" />;
  };

  const allItems = [
    ...folders.map((f) => ({ ...f, type: "folder" as const })),
    ...files.map((f) => ({ ...f, type: "file" as const })),
  ].sort((a, b) => {
    // Folders first, then files, both alphabetically
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 flex-wrap">
        {currentFolderId && (
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
          <button
            onClick={handleGoToRoot}
            className="hover:text-white transition-colors"
          >
            Drive
          </button>
          {path.map((folder, index) => (
            <div key={folder.id} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              {index === path.length - 1 ? (
                <span className="text-white font-medium">{folder.name}</span>
              ) : (
                <button
                  onClick={() => handleNavigateToFolder(folder.id, folder.name)}
                  className="hover:text-white transition-colors"
                >
                  {folder.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Location */}
      {currentFolderName && (
        <div className="text-sm text-gray-300">
          Current folder:{" "}
          <span className="text-white font-medium">{currentFolderName}</span>
        </div>
      )}

      {/* File System View */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-white">{error}</p>
          </div>
        ) : allItems.length === 0 ? (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-400">This folder is empty</p>
          </div>
        ) : (
          <div className="space-y-1">
            {allItems.map((item) => {
              const isSelected =
                selectedFolderId === item.id && item.type === "folder";

              if (item.type === "folder") {
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                      isSelected
                        ? "bg-white/10 border-white/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    )}
                    onClick={() => {
                      if (onFolderSelect) {
                        onFolderSelect(item.id, item.name);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Folder className="w-5 h-5 text-white shrink-0" />
                      <span className="text-white font-medium truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFolderClick(item);
                        }}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors text-white shrink-0"
                        title="Open folder"
                        aria-label={`Open folder ${item.name}`}
                      >
                        <OpenIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white/5 border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(item.mimeType)}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          {item.size && (
                            <span>{formatFileSize(item.size)}</span>
                          )}
                          {item.modifiedTime && (
                            <>
                              {item.size && <span>•</span>}
                              <span>
                                Modified {formatDate(item.modifiedTime)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
