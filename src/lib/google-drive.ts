import { auth } from "@/auth";

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
}

export interface GoogleDriveFolder extends GoogleDriveFile {
  mimeType: "application/vnd.google-apps.folder";
}

/**
 * Get Google Drive API access token from session
 *
 * This function will trigger token refresh if needed via NextAuth's JWT callback
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await auth();

  if (!session) {
    console.warn("No session found. User needs to sign in.");
    return null;
  }

  // Check for access token in session
  // Note: If token is expired, NextAuth's JWT callback should refresh it
  const accessToken = (session as { accessToken?: string })?.accessToken;

  if (!accessToken) {
    console.warn(
      "Access token not found in session. User may need to sign out and sign in again to grant permissions."
    );
  }

  return accessToken || null;
}

/**
 * Fetch folders from Google Drive
 */
export async function fetchDriveFolders(
  accessToken: string,
  parentFolderId?: string
): Promise<GoogleDriveFolder[]> {
  const query = parentFolderId
    ? `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
    : `mimeType='application/vnd.google-apps.folder' and trashed=false and 'root' in parents`;

  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,mimeType,parents)&orderBy=name`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Failed to fetch folders: ${response.status} ${response.statusText}`;

    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error?.message || errorMessage;

      // Provide helpful error messages
      if (response.status === 403) {
        errorMessage = `Access forbidden. Please ensure:
1. Google Drive API is enabled in Google Cloud Console
2. The OAuth consent screen is properly configured
3. You have granted Drive permissions during sign-in
Error details: ${errorData.error?.message || response.statusText}`;
      } else if (response.status === 401) {
        errorMessage = `Authentication failed. The access token may be invalid or expired. Please sign out and sign in again.`;
      }
    } catch {
      // If error response is not JSON, use the text
      errorMessage = `Failed to fetch folders: ${response.status} ${response.statusText}. ${errorText}`;
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Get folder details by ID
 */
export async function getFolderById(
  accessToken: string,
  folderId: string
): Promise<GoogleDriveFolder | null> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name,mimeType,parents`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const folder = await response.json();
  if (folder.mimeType !== "application/vnd.google-apps.folder") {
    return null;
  }

  return folder as GoogleDriveFolder;
}

/**
 * Get folder path (breadcrumb)
 */
export async function getFolderPath(
  accessToken: string,
  folderId: string
): Promise<Array<{ id: string; name: string }>> {
  const path: Array<{ id: string; name: string }> = [];
  let currentId: string | undefined = folderId;

  while (currentId && currentId !== "root") {
    const folder = await getFolderById(accessToken, currentId);
    if (!folder) break;

    path.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parents?.[0];
  }

  return path;
}

/**
 * Fetch files from a specific folder
 */
export async function fetchFolderFiles(
  accessToken: string,
  folderId: string
): Promise<GoogleDriveFile[]> {
  const query = `'${folderId}' in parents and trashed=false`;

  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,mimeType,parents,size,modifiedTime)&orderBy=name`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Failed to fetch files: ${response.status} ${response.statusText}`;

    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      errorMessage = `Failed to fetch files: ${response.status} ${response.statusText}. ${errorText}`;
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.files || [];
}
