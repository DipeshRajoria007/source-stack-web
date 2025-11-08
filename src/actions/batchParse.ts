"use server";

import { batchParse as apiBatchParse } from "@/lib/api";
import { auth } from "@/auth";
import type { ParsedCandidate } from "@/types/fastapi";
import type { GoogleDriveFile } from "@/lib/google-drive";

/**
 * Server action to batch parse files from Google Drive
 *
 * Accepts an array of Google Drive files and sends them to the FastAPI
 * /batch-parse endpoint with the user's Google OAuth access token.
 *
 * @param files - Array of Google Drive files with id and name
 * @returns Array of parsed candidate data
 * @throws Error if user is not authenticated or API request fails
 */
export async function batchParseAction(
  files: Array<Pick<GoogleDriveFile, "id" | "name">>
): Promise<ParsedCandidate[]> {
  // Require authentication for batch parse
  const session = await auth();

  if (!session) {
    throw new Error("Authentication required for batch parsing");
  }

  const accessToken = (session as { accessToken?: string })?.accessToken;

  if (!accessToken) {
    throw new Error(
      "Google access token not found. Please sign out and sign in again."
    );
  }

  // Transform files to match API expectations
  const apiFiles = files.map((file) => ({
    id: file.id,
    name: file.name,
  }));

  // Call API with Google Bearer token
  return apiBatchParse(apiFiles, accessToken);
}
