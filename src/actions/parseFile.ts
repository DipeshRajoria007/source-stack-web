"use server";

import { parseFile as apiParseFile } from "@/lib/api";
import { auth } from "@/auth";
import type { ParsedCandidate } from "@/types/fastapi";

/**
 * Server action to parse a single file
 *
 * Accepts a File object and uploads it to the FastAPI /parse endpoint.
 *
 * @param file - The file to parse
 * @returns Parsed candidate data
 * @throws Error if authentication fails or API request fails
 */
export async function parseFileAction(file: File): Promise<ParsedCandidate> {
  // Get session for optional Google Bearer token
  const session = await auth();
  const googleBearer = session
    ? (session as { accessToken?: string })?.accessToken
    : undefined;

  // Call API
  return apiParseFile(file, googleBearer);
}
