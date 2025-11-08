import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBatchParseJobStatus, getBatchParseJobResults } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> | { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated. Please sign in." },
        { status: 401 }
      );
    }

    const accessToken = (session as { accessToken?: string })?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Google access token not found. Please sign out and sign in again.",
        },
        { status: 401 }
      );
    }

    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params);
    const jobId =
      "jobId" in resolvedParams ? resolvedParams.jobId : resolvedParams.id;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Get job status
    const status = await getBatchParseJobStatus(jobId, accessToken);

    // If job is completed, also fetch results
    let results = undefined;
    if (status.status === "completed") {
      try {
        results = await getBatchParseJobResults(jobId, accessToken);
      } catch (error) {
        console.error("Failed to fetch job results:", error);
        // Continue without results if fetch fails
      }
    }

    return NextResponse.json({
      jobId,
      status,
      results,
      // Pass through timestamp fields from the status
      createdAt: status.created_at,
      startedAt: status.started_at,
      completedAt: status.completed_at,
      durationSeconds: status.duration_seconds,
    });
  } catch (error) {
    console.error("Error fetching job details:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const statusCode =
      errorMessage.includes("404") || errorMessage.includes("not found")
        ? 404
        : errorMessage.includes("401") ||
          errorMessage.includes("Authentication")
        ? 401
        : 500;

    return NextResponse.json(
      {
        error: "Failed to fetch job details",
        details: errorMessage,
      },
      { status: statusCode }
    );
  }
}
