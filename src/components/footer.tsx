import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#7a5c3e] text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row">

        {/* Internal links */}
        <div className="flex gap-6">
          <Link
            href="/about"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            Contact Us
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm text-white/60">
          &copy; {year} Handcrafted Haven. All rights reserved.
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="opacity-80 transition-opacity hover:opacity-100"
          >
            <img
              src="/items/facebook.svg"
              alt="Facebook"
              className="h-8 w-8"
            />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="opacity-80 transition-opacity hover:opacity-100"
          >
            <img
              src="/items/instagram.svg"
              alt="Instagram"
              className="h-8 w-8"
            />
          </a>
        </div>

      </div>
    </footer>
  );
}