import type {
  ParsedCandidate,
  HealthResponse,
  BatchParseJobResponse,
  BatchParseJobStatus,
} from "@/types/fastapi";

/**
 * API client configuration
 */
const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.FASTAPI_KEY;

if (!FASTAPI_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

if (!API_KEY) {
  throw new Error("FASTAPI_KEY environment variable is not set");
}

// TypeScript type assertion: we've verified API_KEY exists above
const API_KEY_STRING: string = API_KEY;

/**
 * Options for apiFetch
 */
export interface ApiFetchOptions extends RequestInit {
  /**
   * Google OAuth access token to include in X-Google-Bearer header
   */
  googleBearer?: string;
  /**
   * Whether to handle the response as multipart/form-data
   */
  isMultipart?: boolean;
}

/**
 * Central fetch wrapper for FastAPI backend
 *
 * Automatically attaches:
 * - X-API-Key header
 * - X-Google-Bearer header (if provided)
 *
 * Handles:
 * - JSON responses
 * - Multipart/form-data requests
 * - Error handling with dev/prod differences
 *
 * @param path - API endpoint path (e.g., '/health', '/parse')
 * @param options - Fetch options with optional googleBearer and isMultipart flags
 * @returns Typed response data
 * @throws Error in production, logs to console in development
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { googleBearer, isMultipart, headers = {}, ...fetchOptions } = options;

  // Build headers
  const requestHeaders: HeadersInit = {
    "X-API-Key": API_KEY_STRING,
  };

  // Add Google Bearer token if provided
  if (googleBearer) {
    (requestHeaders as Record<string, string>)["X-Google-Bearer"] =
      googleBearer;
  }

  // Merge user-provided headers
  // Note: For multipart requests, don't set Content-Type - browser will set it automatically with boundary
  if (headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        // Skip Content-Type for multipart - browser handles it
        if (!(isMultipart && key.toLowerCase() === "content-type")) {
          (requestHeaders as Record<string, string>)[key] = value;
        }
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        if (!(isMultipart && key.toLowerCase() === "content-type")) {
          (requestHeaders as Record<string, string>)[key] = value;
        }
      });
    } else {
      Object.entries(headers).forEach(([key, value]) => {
        if (!(isMultipart && key.toLowerCase() === "content-type")) {
          (requestHeaders as Record<string, string>)[key] = value as string;
        }
      });
    }
  }

  // Set Content-Type for JSON requests (unless multipart or already set)
  if (
    !isMultipart &&
    !(requestHeaders as Record<string, string>)["Content-Type"]
  ) {
    (requestHeaders as Record<string, string>)["Content-Type"] =
      "application/json";
  }

  const url = `${FASTAPI_URL}${path}`;
  const isDev = process.env.NODE_ENV === "development";

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // Handle error responses
    if (!response.ok) {
      const status = response.status;
      let errorMessage = `API request failed: ${status} ${response.statusText}`;
      let errorDetails: unknown = null;
      let errorText: string | null = null;

      // Try to get error details from response
      // Clone response first so we can read it multiple times if needed
      const clonedResponse = response.clone();

      try {
        const errorData = await clonedResponse.json();
        errorDetails = errorData;
        // FastAPI typically uses 'detail' field for errors
        if (errorData.detail) {
          // Handle both string and object detail fields
          if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            // FastAPI validation errors are arrays
            errorMessage = errorData.detail
              .map((err: unknown) => {
                if (typeof err === "object" && err !== null && "msg" in err) {
                  return String((err as { msg: unknown }).msg);
                }
                return JSON.stringify(err);
              })
              .join(", ");
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          // If no standard error field, stringify the whole response
          errorMessage = `${errorMessage}. Response: ${JSON.stringify(
            errorData
          )}`;
        }
      } catch {
        // If JSON parsing fails, try to get text from original response
        try {
          errorText = await response.text();
          if (errorText) {
            errorMessage = `${errorMessage}. ${errorText}`;
          }
        } catch {
          // Ignore parsing errors
        }
      }

      // Log full error details in development (especially for 500 errors)
      if (isDev) {
        const logData: Record<string, unknown> = {
          url,
          status,
          statusText: response.statusText,
          errorMessage,
        };

        if (errorDetails) {
          logData.errorDetails = errorDetails;
        }
        if (errorText) {
          logData.errorText = errorText;
        }

        // Log request details for debugging
        if (status >= 500) {
          // For server errors, log request details too
          logData.requestDetails = {
            method: fetchOptions.method || "GET",
            headers: Object.fromEntries(
              Object.entries(requestHeaders as Record<string, string>).map(
                ([key, value]) => [
                  key,
                  key.toLowerCase().includes("bearer") ||
                  key.toLowerCase().includes("key")
                    ? `${value.substring(0, 10)}...` // Mask sensitive headers
                    : value,
                ]
              )
            ),
            body: fetchOptions.body
              ? typeof fetchOptions.body === "string"
                ? fetchOptions.body.substring(0, 200)
                : "[FormData or other]"
              : undefined,
          };
        }

        console.error(`[API] Error ${status}:`, logData);
      }

      // In production, throw error
      // In development, also throw but with more context
      throw new Error(errorMessage);
    }

    // Parse JSON response
    const data = await response.json();

    // Handle case where response might be wrapped unexpectedly
    if (isDev) {
      console.log("[API] Response received:", {
        path,
        dataType: Array.isArray(data) ? "array" : typeof data,
        dataLength: Array.isArray(data) ? data.length : undefined,
      });
    }

    return data as T;
  } catch (error) {
    // Re-throw if it's already an Error we created
    if (error instanceof Error) {
      throw error;
    }

    // Handle network errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (isDev) {
      console.error("[API] Network error:", errorMessage);
    }

    throw new Error(`API request failed: ${errorMessage}`);
  }
}

/**
 * Health check endpoint
 */
export async function healthCheck(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/health");
}

/**
 * Parse a single file (multipart upload)
 */
export async function parseFile(
  file: File,
  googleBearer?: string
): Promise<ParsedCandidate> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<ParsedCandidate>("/parse", {
    method: "POST",
    body: formData,
    isMultipart: true,
    googleBearer,
  });
}

/**
 * Batch parse files from a Google Drive folder
 *
 * Sends folder details to FastAPI, which will fetch all files from the folder
 * using the provided Google Bearer token.
 */
export async function batchParse(
  folderId: string,
  folderName: string,
  googleBearer: string
): Promise<ParsedCandidate[]> {
  const requestBody = {
    folder_id: folderId,
    folder_name: folderName,
  };
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("[API] Batch parse request:", {
      url: `${FASTAPI_URL}/batch-parse`,
      folderId,
      folderName,
    });
  }

  const response = await apiFetch<any>("/batch-parse", {
    method: "POST",
    body: JSON.stringify(requestBody),
    googleBearer,
  });

  // Handle different response formats
  // FastAPI might return the array directly or wrapped
  if (Array.isArray(response)) {
    return response as ParsedCandidate[];
  }

  // If wrapped in an object, try to extract the array
  if (response && typeof response === "object") {
    if (Array.isArray(response.results)) {
      return response.results as ParsedCandidate[];
    }
    if (Array.isArray(response.data)) {
      return response.data as ParsedCandidate[];
    }
    if (Array.isArray(response.files)) {
      return response.files as ParsedCandidate[];
    }
  }

  // If we get here, the response format is unexpected
  if (isDev) {
    console.error("[API] Unexpected batch parse response format:", {
      response,
      responseType: typeof response,
      isArray: Array.isArray(response),
    });
  }

  throw new Error(
    `Unexpected response format from batch-parse endpoint. Expected array, got: ${typeof response}`
  );
}

/**
 * Create an async batch parse job for large batches
 *
 * Returns a job ID that can be used to poll for status and results.
 *
 * @param folderId - Google Drive folder ID
 * @param googleBearer - Google OAuth access token
 * @param spreadsheetId - Optional existing Google Sheets spreadsheet ID
 */
export async function createBatchParseJob(
  folderId: string,
  googleBearer: string,
  spreadsheetId?: string
): Promise<BatchParseJobResponse> {
  const requestBody: {
    folder_id: string;
    spreadsheet_id?: string;
  } = {
    folder_id: folderId,
  };

  // Only include spreadsheet_id if provided
  if (spreadsheetId) {
    requestBody.spreadsheet_id = spreadsheetId;
  }

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("[API] Create batch parse job:", {
      url: `${FASTAPI_URL}/batch-parse-job`,
      folderId,
      spreadsheetId,
      requestBody,
    });
  }

  return apiFetch<BatchParseJobResponse>("/batch-parse-job", {
    method: "POST",
    body: JSON.stringify(requestBody),
    googleBearer,
  });
}

/**
 * Get the status of a batch parse job
 */
export async function getBatchParseJobStatus(
  jobId: string,
  googleBearer: string
): Promise<BatchParseJobStatus> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("[API] Get batch parse job status:", {
      url: `${FASTAPI_URL}/batch-parse-job/${jobId}/status`,
      jobId,
    });
  }

  return apiFetch<BatchParseJobStatus>(`/batch-parse-job/${jobId}/status`, {
    method: "GET",
    googleBearer,
  });
}

/**
 * Get the results of a completed batch parse job
 *
 * This endpoint returns the full list of parsed candidates.
 * Only available when job status is "completed".
 */
export async function getBatchParseJobResults(
  jobId: string,
  googleBearer: string
): Promise<ParsedCandidate[]> {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("[API] Get batch parse job results:", {
      url: `${FASTAPI_URL}/batch-parse-job/${jobId}/results`,
      jobId,
    });
  }

  return apiFetch<ParsedCandidate[]>(`/batch-parse-job/${jobId}/results`, {
    method: "GET",
    googleBearer,
  });
}

/**
 * Poll for batch parse job completion
 *
 * Polls the job status endpoint until the job is completed or failed.
 *
 * @param jobId - The job ID returned from createBatchParseJob
 * @param googleBearer - Google OAuth access token
 * @param options - Polling options
 * @returns Array of parsed candidate data
 */
export async function pollBatchParseJob(
  jobId: string,
  googleBearer: string,
  options: {
    interval?: number; // Polling interval in milliseconds (default: 2000)
    maxAttempts?: number; // Maximum polling attempts (default: 300 = 10 minutes)
    onProgress?: (status: BatchParseJobStatus) => void; // Progress callback
  } = {}
): Promise<ParsedCandidate[]> {
  const { interval = 2000, maxAttempts = 300, onProgress } = options;

  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await getBatchParseJobStatus(jobId, googleBearer);

    // Call progress callback if provided
    if (onProgress) {
      onProgress(status);
    }

    if (status.status === "completed") {
      console.log("[API] Job completed:", {
        jobId,
        status: status.status,
        spreadsheetId: status.spreadsheet_id,
        resultsCount: status.results_count,
      });

      // Fetch results from the separate results endpoint
      try {
        const results = await getBatchParseJobResults(jobId, googleBearer);
        return results;
      } catch (error) {
        // If results endpoint fails, log but don't fail the whole operation
        console.error("[API] Failed to fetch job results:", error);
        throw new Error(
          `Job completed but failed to fetch results: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    if (status.status === "failed") {
      throw new Error(
        status.error || status.message || "Job failed without error message"
      );
    }

    // Job is still pending or processing, wait and poll again
    await new Promise((resolve) => setTimeout(resolve, interval));
    attempts++;
  }

  throw new Error(
    `Job polling timeout after ${maxAttempts} attempts (${
      (maxAttempts * interval) / 1000
    }s)`
  );
}
