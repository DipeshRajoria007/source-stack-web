"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (session) {
      router.push("/dashboard");
      return;
    }

    // If session is still loading, wait
    if (status === "loading") {
      return;
    }

    // Automatically trigger Google sign-in
    signIn("google", { callbackUrl: "/" });
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to Google sign-in...</p>
      </div>
    </div>
  );
}
