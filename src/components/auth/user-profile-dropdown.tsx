"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";

interface UserProfileDropdownProps {
  size?: "sm" | "default" | "lg";
  className?: string;
  showName?: boolean;
}

export function UserProfileDropdown({
  size = "default",
  className,
  showName = false,
}: UserProfileDropdownProps) {
  const { data: session, status } = useSession();

  if (status === "loading" || !session?.user) {
    return null;
  }

  const profileImage = session.user.image;
  const displayName = session.user.name || session.user.email;
  const userEmail = session.user.email;

  const profileSize =
    size === "lg" ? "w-12 h-12" : size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize =
    size === "lg" ? "w-6 h-6" : size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <DropdownMenu
      align="right"
      trigger={
        <button
          className={
            className ||
            "flex items-center gap-2 text-white hover:opacity-80 transition-opacity cursor-pointer"
          }
        >
          {profileImage ? (
            <div
              className={`relative ${profileSize} rounded-full border-2 border-white/20 overflow-hidden`}
            >
              <Image
                src={profileImage}
                alt={displayName || "User"}
                width={size === "lg" ? 48 : size === "sm" ? 32 : 40}
                height={size === "lg" ? 48 : size === "sm" ? 32 : 40}
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className={`${profileSize} rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center`}
            >
              <User className={iconSize} />
            </div>
          )}
          {showName && (
            <>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{displayName}</span>
                <span className="text-xs text-gray-400">Signed in</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
          {!showName && <ChevronDown className="w-4 h-4" />}
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
