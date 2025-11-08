"use server";

import { batchParse as apiBatchParse } from "@/lib/api";
import { auth } from "@/auth";
import type { ParsedCandidate } from "@/types/fastapi";

/**
 * Server action to batch parse files from a Google Drive folder
 *
 * Sends folder details to FastAPI, which will fetch all files from the folder
 * using the provided Google OAuth access token.
 *
 * @param folderId - Google Drive folder ID
 * @param folderName - Google Drive folder name (optional, for logging)
 * @returns Array of parsed candidate data
 * @throws Error if user is not authenticated or API request fails
 */
export async function batchParseAction(
  folderId: string,
  folderName?: string
): Promise<ParsedCandidate[]> {
  try {
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

    // Validate input
    if (!folderId || folderId.trim() === "") {
      throw new Error("Folder ID is required for batch parsing");
    }

    // Call API with folder details and Google Bearer token
    // FastAPI will fetch all files from the folder using the access token
    return await apiBatchParse(folderId, folderName || "Unknown Folder", accessToken);
  } catch (error) {
    // Log error on server side for debugging
    const errorDetails = {
      error,
      errorType: typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      folderId,
      folderName,
      errorStringified: JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      ),
    };

    console.error("[batchParseAction] Error:", errorDetails);

    // Re-throw with a clear message
    if (error instanceof Error) {
      // Preserve the original error message
      const errorMessage = error.message || "Unknown error occurred";
      const enhancedError = new Error(`Batch parse failed: ${errorMessage}`);
      // Copy stack if available
      if (error.stack) {
        enhancedError.stack = error.stack;
      }
      throw enhancedError;
    }

    // For non-Error objects, create a proper Error
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : `Failed to batch parse files: ${JSON.stringify(error)}`;

    throw new Error(errorMessage);
  }
}
