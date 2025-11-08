"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GoogleSignInButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
}

export function GoogleSignInButton({
  size,
  className,
}: GoogleSignInButtonProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button className={cn("rounded-full", className)} size={size} disabled>
        Loading...
      </Button>
    );
  }

  if (session?.user) {
    const profileImage = session.user.image;
    const displayName = session.user.name || session.user.email;

    return (
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="flex items-center gap-3 text-white">
          {profileImage ? (
            <div className="relative w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden">
              <Image
                src={profileImage}
                alt={displayName || "User"}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-xs text-gray-400">Signed in</span>
          </div>
        </div>
        <Button
          variant="outline"
          className={cn("rounded-full", className)}
          size={size}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      className={cn("rounded-full", className)}
      size={size}
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      Sign in with Google
    </Button>
  );
}
