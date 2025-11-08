"use server";

import {
  createBatchParseJob,
  getBatchParseJobStatus,
  pollBatchParseJob,
} from "@/lib/api";
import { auth } from "@/auth";
import type { ParsedCandidate } from "@/types/fastapi";
import type { BatchParseJobStatus } from "@/types/fastapi";

/**
 * Result of batch parse job action
 */
export interface BatchParseJobResult {
  results: ParsedCandidate[];
  spreadsheetId?: string;
  jobId: string;
}

/**
 * Create a batch parse job and return the job ID immediately
 *
 * This allows the client to poll for status updates in real-time.
 */
export async function createBatchParseJobAction(
  folderId: string,
  folderName?: string
): Promise<{ jobId: string }> {
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

    // Create async job
    const jobResponse = await createBatchParseJob(folderId, accessToken);

    console.log("[createBatchParseJobAction] Job created:", {
      jobId: jobResponse.job_id,
      status: jobResponse.status,
      folderId,
      folderName,
    });

    return {
      jobId: jobResponse.job_id,
    };
  } catch (error) {
    console.error("[createBatchParseJobAction] Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      `Failed to create batch parse job: ${JSON.stringify(error)}`
    );
  }
}

/**
 * Get job status (for client-side polling)
 */
export async function getJobStatusAction(
  jobId: string
): Promise<BatchParseJobStatus> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Authentication required");
    }

    const accessToken = (session as { accessToken?: string })?.accessToken;

    if (!accessToken) {
      throw new Error("Google access token not found");
    }

    return await getBatchParseJobStatus(jobId, accessToken);
  } catch (error) {
    console.error("[getJobStatusAction] Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to get job status: ${JSON.stringify(error)}`);
  }
}

/**
 * Server action to batch parse files from a Google Drive folder using async job endpoint
 *
 * Creates an async job and polls for completion. Recommended for large batches.
 * This is the full polling version that waits for completion.
 *
 * @param folderId - Google Drive folder ID
 * @param folderName - Google Drive folder name (optional, for logging)
 * @param onProgress - Optional callback for progress updates (server-side only)
 * @returns Batch parse job result with parsed candidates and spreadsheet ID
 * @throws Error if user is not authenticated or API request fails
 */
export async function batchParseJobAction(
  folderId: string,
  folderName?: string,
  onProgress?: (status: BatchParseJobStatus) => void
): Promise<BatchParseJobResult> {
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

    // Create async job
    const jobResponse = await createBatchParseJob(folderId, accessToken);

    console.log("[batchParseJobAction] Job created:", {
      jobId: jobResponse.job_id,
      status: jobResponse.status,
    });

    // Poll for job completion
    const results = await pollBatchParseJob(jobResponse.job_id, accessToken, {
      interval: 2000, // Poll every 2 seconds
      maxAttempts: 300, // Max 10 minutes (300 * 2s)
      onProgress: (status) => {
        // Log progress on server side
        console.log("[batchParseJobAction] Job progress:", {
          jobId: status.job_id,
          status: status.status,
          progress: status.progress,
          processedFiles: status.processed_files,
          totalFiles: status.total_files,
          spreadsheetId: status.spreadsheet_id,
          message: status.message,
        });

        // Call client-provided progress callback if available
        if (onProgress) {
          onProgress(status);
        }
      },
    });

    // Get final job status to retrieve spreadsheet_id
    const finalStatus = await getBatchParseJobStatus(
      jobResponse.job_id,
      accessToken
    );

    return {
      results,
      spreadsheetId: finalStatus.spreadsheet_id,
      jobId: jobResponse.job_id,
    };
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

    console.error("[batchParseJobAction] Error:", errorDetails);

    // Re-throw with a clear message
    if (error instanceof Error) {
      // Preserve the original error message
      const errorMessage = error.message || "Unknown error occurred";
      const enhancedError = new Error(
        `Batch parse job failed: ${errorMessage}`
      );
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
