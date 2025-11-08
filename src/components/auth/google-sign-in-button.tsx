"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown } from "lucide-react";
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
    const userEmail = session.user.email;

    return (
      <DropdownMenu
        align="right"
        trigger={
          <button className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity cursor-pointer">
            {profileImage ? (
              <div className="relative w-8 h-8 rounded-full border-2 border-white/20 overflow-hidden">
                <Image
                  src={profileImage}
                  alt={displayName || "User"}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>
        }
      >
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
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
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate">
                {displayName}
              </span>
              {userEmail && (
                <span className="text-xs text-gray-400 truncate">
                  {userEmail}
                </span>
              )}
            </div>
          </div>
        </div>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenu>
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
