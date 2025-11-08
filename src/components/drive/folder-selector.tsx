"use client";

import { useState, useEffect } from "react";
import { Folder, ChevronRight, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FolderItem {
  id: string;
  name: string;
}

interface FolderSelectorProps {
  onSelect: (folderId: string, folderName: string) => void;
  selectedFolderId?: string;
  selectedFolderName?: string;
  className?: string;
}

export function FolderSelector({
  onSelect,
  selectedFolderId,
  selectedFolderName,
  className,
}: FolderSelectorProps) {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [path, setPath] = useState<FolderItem[]>([]);

  const fetchFolders = async (parentId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = parentId
        ? `/api/drive/folders?parentId=${parentId}`
        : "/api/drive/folders";
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          `Failed to fetch folders (${response.status} ${response.statusText})`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setFolders(data.folders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load folders");
    } finally {
      setLoading(false);
    }
  };

  const fetchPath = async (folderId: string) => {
    try {
      const response = await fetch(`/api/drive/folder/${folderId}`);
      if (response.ok) {
        const data = await response.json();
        setPath(data.path || []);
      }
    } catch (err) {
      console.error("Failed to fetch path:", err);
    }
  };

  useEffect(() => {
    fetchFolders(currentParentId || undefined);
  }, [currentParentId]);

  useEffect(() => {
    if (selectedFolderId) {
      fetchPath(selectedFolderId);
    }
  }, [selectedFolderId]);

  const handleFolderClick = (folder: FolderItem) => {
    onSelect(folder.id, folder.name);
  };

  const handleNavigateToFolder = (folderId: string) => {
    setCurrentParentId(folderId);
    setPath((prev) => {
      const index = prev.findIndex((f) => f.id === folderId);
      return index >= 0 ? prev.slice(0, index + 1) : prev;
    });
  };

  const handleGoToRoot = () => {
    setCurrentParentId(null);
    setPath([]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumb */}
      {path.length > 0 && (
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
                  onClick={() => handleNavigateToFolder(folder.id)}
                  className="hover:text-white transition-colors"
                >
                  {folder.name}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Folder List */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-red-400">{error}</p>
          </div>
        ) : folders.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-gray-400">No folders found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => handleFolderClick(folder)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                  selectedFolderId === folder.id
                    ? "bg-white/10 border-white/30"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">{folder.name}</span>
                </div>
                {selectedFolderId === folder.id && (
                  <Check className="w-5 h-5 text-green-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Folder Display */}
      {selectedFolderId && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-sm text-green-400">
            Selected folder:{" "}
            <span className="font-medium text-white">
              {selectedFolderName ||
                path[path.length - 1]?.name ||
                "Loading..."}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
