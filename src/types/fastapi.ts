/**
 * FastAPI response types
 */

export interface ParsedCandidate {
  drive_file_id?: string;
  source_file?: string;
  name?: string;
  email?: string;
  phone?: string;
  confidence: number;
  errors: string[];
}

export interface HealthResponse {
  status: string;
  message?: string;
}

/**
 * Batch parse job request
 */
export interface BatchParseJobRequest {
  folder_id: string;
  spreadsheet_id?: string; // Optional existing spreadsheet ID
}

/**
 * Batch parse job response (async endpoint)
 */
export interface BatchParseJobResponse {
  job_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  message?: string;
}

/**
 * Batch parse job status response
 */
export interface BatchParseJobStatus {
  job_id: string;
  status: "pending" | "processing" | "completed" | "failed" | "revoked";
  progress?: number; // 0-100
  total_files?: number;
  processed_files?: number;
  spreadsheet_id?: string; // Google Sheets spreadsheet ID
  results_count?: number;
  message?: string;
  error?: string | null;
}
