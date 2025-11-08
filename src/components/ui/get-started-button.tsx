"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ButtonLink, type ButtonLinkProps } from "@/components/ui/button-link";

interface GetStartedButtonProps extends Omit<ButtonLinkProps, "href"> {
  children?: React.ReactNode;
}

export function GetStartedButton({
  children = "Get Started Free",
  ...props
}: GetStartedButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Determine the href based on authentication status
  const href = status === "loading" ? "/login" : session ? "/app" : "/login";

  // Handle click to redirect authenticated users to app
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (status === "loading") {
      e.preventDefault();
      return;
    }
    if (session) {
      e.preventDefault();
      router.push("/app");
    }
  };

  return (
    <ButtonLink href={href} onClick={handleClick} {...props}>
      {children}
    </ButtonLink>
  );
}
