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

