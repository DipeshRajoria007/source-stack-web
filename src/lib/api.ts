import type { ParsedCandidate, HealthResponse } from "@/types/fastapi";

/**
 * API client configuration
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.FASTAPI_KEY;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

if (!API_KEY) {
  throw new Error("FASTAPI_KEY environment variable is not set");
}

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
    "X-API-Key": API_KEY,
  };

  // Add Google Bearer token if provided
  if (googleBearer) {
    (requestHeaders as Record<string, string>)["X-Google-Bearer"] = googleBearer;
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
  if (!isMultipart && !(requestHeaders as Record<string, string>)["Content-Type"]) {
    (requestHeaders as Record<string, string>)["Content-Type"] = "application/json";
  }

  const url = `${API_URL}${path}`;
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

      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        // If response is not JSON, try to get text
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = `${errorMessage}. ${errorText}`;
          }
        } catch {
          // Ignore parsing errors
        }
      }

      // Log errors in development
      if (isDev) {
        if (status === 401) {
          console.error("[API] Authentication failed:", errorMessage);
        } else if (status >= 500) {
          console.error("[API] Server error:", errorMessage);
        } else {
          console.error("[API] Request failed:", errorMessage);
        }
      }

      // In production, throw error
      // In development, also throw but with more context
      throw new Error(errorMessage);
    }

    // Parse JSON response
    const data = await response.json();
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
 * Batch parse files from Google Drive
 */
export async function batchParse(
  files: Array<{ id: string; name: string }>,
  googleBearer: string
): Promise<ParsedCandidate[]> {
  return apiFetch<ParsedCandidate[]>("/batch-parse", {
    method: "POST",
    body: JSON.stringify({ files }),
    googleBearer,
  });
}

