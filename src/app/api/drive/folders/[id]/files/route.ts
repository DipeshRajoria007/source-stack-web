import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAccessToken, fetchFolderFiles } from "@/lib/google-drive";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
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

    // Handle both sync and async params (Next.js 15+)
    const resolvedParams = await Promise.resolve(params);
    const folderId = resolvedParams.id;

    console.log("Fetching files for folder ID:", folderId);

    if (!folderId || folderId === "." || folderId === "") {
      console.error("Invalid folder ID:", folderId);
      return NextResponse.json(
        { error: "Invalid folder ID provided", receivedId: folderId },
        { status: 400 }
      );
    }

    const files = await fetchFolderFiles(accessToken, folderId);

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error fetching folder files:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const statusCode = errorMessage.includes("403") || errorMessage.includes("forbidden") 
      ? 403 
      : errorMessage.includes("401") || errorMessage.includes("Authentication")
      ? 401
      : 500;
    
    return NextResponse.json(
      {
        error: "Failed to fetch folder files",
        details: errorMessage,
      },
      { status: statusCode }
    );
  }
}

