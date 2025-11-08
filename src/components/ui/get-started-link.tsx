"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface GetStartedLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

export function GetStartedLink({
  children = "Get Started",
  className,
  ...props
}: GetStartedLinkProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Determine the href based on authentication status
  const href = status === "loading" ? "/login" : session ? "/dashboard" : "/login";

  // Handle click to redirect authenticated users to dashboard
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (status === "loading") {
      e.preventDefault();
      return;
    }
    if (session) {
      e.preventDefault();
      router.push("/dashboard");
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </Link>
  );
}

