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
- **Authentication**: NextAuth.js v5 (Google OAuth)
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

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following:

   ```env
   AUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
   AUTH_URL=http://localhost:4000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_API_URL=http://localhost:8000
   FASTAPI_KEY=your-fastapi-api-key-here
   ```

   **Google OAuth credentials:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new OAuth 2.0 Client ID
   - Add authorized redirect URI: `http://localhost:4000/api/auth/callback/google`
   - Copy the Client ID and Client Secret to your `.env.local` file

   **FastAPI Backend Configuration:**

   - `NEXT_PUBLIC_API_URL`: The URL of your FastAPI backend service (e.g., `http://localhost:8000` for local development)
   - `FASTAPI_KEY`: A shared secret API key for authenticating requests between Next.js and FastAPI

   **Generate secrets:**

   Generate AUTH_SECRET:

   ```bash
   openssl rand -base64 32
   ```

   Generate FASTAPI_KEY (use the same method):

   ```bash
   openssl rand -base64 32
   ```

   **Important:** The `FASTAPI_KEY` must be:

   - The same value configured in your FastAPI backend's environment variables
   - A secure, randomly generated string (use the command above)
   - Kept secret and never committed to version control

   Your FastAPI backend should validate this key by checking the `X-API-Key` header on incoming requests.

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:4000](http://localhost:4000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/route.ts  # NextAuth API routes
│   ├── features/          # Features page
│   ├── pricing/           # Pricing page
│   ├── icon.svg           # Favicon
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page
├── components/
│   ├── auth/
│   │   └── google-sign-in-button.tsx  # Google OAuth button
│   ├── providers/
│   │   └── session-provider.tsx        # NextAuth session provider
│   ├── ui/
│   │   ├── button.tsx                  # shadcn Button component
│   │   └── button-link.tsx             # ButtonLink component
│   ├── Background.tsx     # Background gradient and effects
│   ├── Hero.tsx          # Hero section component
│   └── Navbar.tsx        # Navigation bar component
├── lib/
│   └── utils.ts          # Utility functions (cn helper)
├── auth.ts               # NextAuth configuration
└── constants.ts          # Feature configuration and constants
```

## Available Scripts

- `pnpm dev` - Start development server on port 4000
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint

## Features

### Authentication

- Google OAuth sign-in (single sign-on option)
- Session management with NextAuth.js
- Protected routes and user state management

### Home Page

- Hero section with main value proposition
- Visual demonstration of resume-to-spreadsheet flow
- Google sign-in button for immediate access

### Features Page

- Comprehensive feature list with icons
- Highlight sections for key features (Parsing & Sync)
- Feature cards with badges and descriptions

### Pricing Page

- Free tier information
- Benefits and feature highlights
- Call-to-action for sign-up

## Design

The application features a modern, minimalist design with:

- Black and white color scheme
- Gradient backgrounds (black to white)
- Glassmorphism effects
- Responsive design for all screen sizes

## License

Private - All rights reserved
