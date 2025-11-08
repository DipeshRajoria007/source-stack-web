"use client";

import { useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If already authenticated, redirect to callbackUrl or /app
    if (session) {
      const callbackUrl = searchParams.get("callbackUrl") || "/app";
      router.push(callbackUrl);
      return;
    }

    // If session is still loading, wait
    if (status === "loading") {
      return;
    }

    // Get callback URL from query params or default to /app
    const callbackUrl = searchParams.get("callbackUrl") || "/app";

    // Automatically trigger Google sign-in
    signIn("google", { callbackUrl });
  }, [session, status, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to Google sign-in...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
