import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAccessToken, fetchDriveFolders } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated. Please sign in." },
        { status: 401 }
      );
    }

    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Access token not found. Please sign out and sign in again to grant Drive and Sheets permissions.",
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get("parentId") || undefined;

    const folders = await fetchDriveFolders(accessToken, parentId);

    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Error fetching folders:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const statusCode =
      errorMessage.includes("403") || errorMessage.includes("forbidden")
        ? 403
        : errorMessage.includes("401") ||
          errorMessage.includes("Authentication")
        ? 401
        : 500;

    return NextResponse.json(
      {
        error: "Failed to fetch folders",
        details: errorMessage,
      },
      { status: statusCode }
    );
  }
}
