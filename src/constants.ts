import {
  Upload,
  FileSearch,
  CheckCircle2,
  Table2,
  ShieldCheck,
  TimerReset,
} from "lucide-react";

export const FEATURES_CONFIG = {
  header: {
    badge: "Why SourceStack",
    title: "Everything you need to automate HR data",
    subtitle:
      "From Drive ingestion to Sheet sync — built for speed, accuracy, and control.",
  },
  features: [
    {
      title: "One-click Ingest",
      description:
        "Pick a Drive folder and let SourceStack discover and queue resumes automatically.",
      icon: Upload,
      badge: "Drive",
    },
    {
      title: "Accurate Parsing",
      description:
        "Extract name, email and phone from PDFs/DOCX with OCR fallback for scans.",
      icon: FileSearch,
      badge: "OCR",
    },
    {
      title: "Review & Approve",
      description:
        "Fix fields inline, merge duplicates, and keep a clean candidate list.",
      icon: CheckCircle2,
    },
    {
      title: "Sync to Sheets",
      description:
        "Append or update rows with headers and de-duplication out of the box.",
      icon: Table2,
    },
    {
      title: "Secure by Design",
      description:
        "Least-privilege scopes, encrypted tokens, and activity logs.",
      icon: ShieldCheck,
    },
    {
      title: "Faster Every Day",
      description:
        "Async workers and smart batching cut your wait time to seconds.",
      icon: TimerReset,
    },
  ],
  highlights: [
    {
      overline: "Parsing",
      title: "Best-in-class resume extraction",
      description:
        "Python OCR fallback and smart heuristics ensure clean fields every time.",
      points: [
        "Email & phone normalization",
        "Confidence scoring",
        "Duplicate detection",
      ],
      image: "/images/highlight-parsing.png",
    },
    {
      overline: "Sync",
      title: "Sheets that stay up to date",
      description:
        "Batch updates with header assurance and conflict-safe merging for peace of mind.",
      points: [
        "Auto header mapping",
        "Append or update intelligently",
        "Idempotent operations",
      ],
      image: "/images/highlight-sync.png",
      reverse: true,
    },
  ],
  cta: {
    label: "Get Started",
    href: "/login",
  },
};
