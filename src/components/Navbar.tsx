import Link from "next/link";
import { Layers } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full px-6 md:px-12 lg:px-16 py-6 flex items-center justify-between relative z-20">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <Layers />
        <span className="text-white text-lg font-semibold">SourceStack</span>
      </Link>

      {/* Center Navigation */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
        <Link
          href="/features"
          className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
        >
          Features
        </Link>
        <Link
          href="/pricing"
          className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
        >
          Pricing
        </Link>
        <a
          href="#"
          className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
        >
          Login
        </a>
      </nav>

      {/* Right CTA */}
      <div className="ml-auto">
        <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
          Get Started
        </button>
      </div>
    </header>
  );
}
