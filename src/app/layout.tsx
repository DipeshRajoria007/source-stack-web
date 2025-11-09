import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SourceStack - Automate your hiring stack from Drive to Sheet",
  description:
    "Upload shortlisted resumes, extract candidate data automatically, and sync to Google Sheets in seconds. Automate your HR data workflow with SourceStack.",
  keywords: [
    "hiring automation",
    "resume parsing",
    "Google Sheets",
    "HR automation",
    "candidate management",
    "Drive to Sheets",
  ],
  authors: [{ name: "SourceStack" }],
  creator: "SourceStack",
  publisher: "SourceStack",
  openGraph: {
    title: "SourceStack - Automate your hiring stack from Drive to Sheet",
    description:
      "Upload shortlisted resumes, extract candidate data automatically, and sync to Google Sheets in seconds.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SourceStack - Automate your hiring stack",
    description:
      "Upload shortlisted resumes, extract candidate data automatically, and sync to Google Sheets in seconds.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Toaster position="bottom-right" richColors closeButton theme="dark" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
