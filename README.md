# SourceStack

Automate your hiring stack — from Drive to Sheet. Upload shortlisted resumes, extract candidate data automatically, and sync to Google Sheets in seconds.

## Overview

SourceStack is a modern web application that automates HR data workflows by:
- **One-click Ingest**: Pick a Drive folder and let SourceStack discover and queue resumes automatically
- **Accurate Parsing**: Extract name, email, and phone from PDFs/DOCX with OCR fallback for scans
- **Review & Approve**: Fix fields inline, merge duplicates, and keep a clean candidate list
- **Sync to Sheets**: Append or update rows with headers and de-duplication out of the box
- **Secure by Design**: Least-privilege scopes, encrypted tokens, and activity logs
- **Faster Every Day**: Async workers and smart batching cut your wait time to seconds

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: [Lucide React](https://lucide.dev)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm 10.20.0+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd source-stack-web
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:4000](http://localhost:4000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── features/          # Features page
│   ├── icon.svg           # Favicon
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page
├── components/
│   ├── Background.tsx     # Background gradient and effects
│   ├── Hero.tsx          # Hero section component
│   └── Navbar.tsx        # Navigation bar component
└── constants.ts           # Feature configuration and constants
```

## Available Scripts

- `pnpm dev` - Start development server on port 4000
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint

## Features

### Home Page
- Hero section with main value proposition
- Visual demonstration of resume-to-spreadsheet flow
- Call-to-action buttons

### Features Page
- Comprehensive feature list with icons
- Highlight sections for key features (Parsing & Sync)
- Feature cards with badges and descriptions

## Design

The application features a modern, minimalist design with:
- Black and white color scheme
- Gradient backgrounds (black to white)
- Glassmorphism effects
- Responsive design for all screen sizes

## License

Private - All rights reserved
