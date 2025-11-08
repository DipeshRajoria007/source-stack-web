import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    // Return session info (excluding sensitive data in production)
    return NextResponse.json({
      hasSession: true,
      user: session.user,
      hasAccessToken: !!(session as any).accessToken,
      accessTokenLength: (session as any).accessToken?.length || 0,
      // Don't expose the actual token in response
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

