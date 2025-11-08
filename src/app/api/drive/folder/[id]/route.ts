import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAccessToken, getFolderPath } from "@/lib/google-drive";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const folderId = params.id;
    const path = await getFolderPath(accessToken, folderId);

    return NextResponse.json({ path });
  } catch (error) {
    console.error("Error fetching folder path:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch folder path",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
