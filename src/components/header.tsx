'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

export default function Header({ session }: { session: Session | null }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  const handleMouseEnter = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const handleMouseLeave = () => {
    if (!query && document.activeElement !== inputRef.current) {
      setSearchOpen(false);
    }
  };

  const handleBlur = () => {
    if (!query) setSearchOpen(false);
  };

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Left: Logo + desktop "Create Listing" */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="site-logo flex h-12 w-12 items-center justify-center text-sm font-bold">
              HH
            </div>
          </Link>
          {/* Create Listing — desktop only, anchored to logo so search can't crush it */}
          <Link
            href="/listing"
            className="nav-link hidden text-sm font-medium md:inline-flex"
          >
            Create Listing
          </Link>
        </div>

        {/* Center: Site title — hides when search expands on mobile */}
        <div
          className={`flex flex-shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out md:max-w-none md:opacity-100 md:px-4 ${
            searchOpen
              ? 'max-w-0 opacity-0 px-0'
              : 'max-w-[250px] opacity-100 px-2 sm:px-4'
          }`}
        >
          <Link href="/">
            <h1 className="text-xl font-bold tracking-wide text-stone-800 sm:text-2xl md:text-3xl">
              Handcrafted Haven
            </h1>
          </Link>
        </div>

        {/* Right: Search + desktop nav + hamburger */}
        <div className="flex items-center justify-end gap-3">

          {/* Animated Search */}
          <form
            onSubmit={handleSearchSubmit}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="search-pill"
            data-open={searchOpen}
          >
            <button type="submit" aria-label="Search" className="search-icon-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="search-svg"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </button>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={handleBlur}
              placeholder="Search..."
              className="search-input"
              aria-label="Search query"
            />
          </form>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-3 md:gap-4">
              <li>
                <Link href="/cart" className="nav-link text-sm font-medium">
                  Cart
                </Link>
              </li>              
              {session?.user ? (
                <>
                  <li>
                    <Link href="/account-info" className="earth-button-primary text-sm">
                      Account
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="cursor-pointer text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
                    >
                      Log out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login" className="earth-button-primary text-sm">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Hamburger — mobile only */}
          <button
            className="hamburger md:!hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={`bar ${menuOpen ? 'bar-open-1' : ''}`} />
            <span className={`bar ${menuOpen ? 'bar-open-2' : ''}`} />
            <span className={`bar ${menuOpen ? 'bar-open-3' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Mobile dropdown menu */}
      <div className={`mobile-menu md:hidden ${menuOpen ? 'mobile-menu-open' : ''}`}>
        <nav className="flex flex-col gap-1 px-6 pb-4 pt-2">
          <Link
            href="/cart"
            className="mobile-nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </Link>
          <Link
            href="/listing"
            className="mobile-nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Create Listing
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/account-info"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Account
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="mobile-nav-link text-left"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      <style>{`
        /* ── Search pill ─────────────────────────────── */
        .search-pill {
          display: flex;
          align-items: center;
          overflow: hidden;
          border-radius: 9999px;
          border: 1px solid transparent;
          background: transparent;
          transition:
            width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
          width: 2.25rem;
          height: 2.25rem;
          cursor: pointer;
        }
        .search-pill[data-open="true"] {
          width: 13rem;
          border-color: var(--border);
          background: var(--card);
          box-shadow: 0 0 0 3px rgba(122, 92, 62, 0.15);
          cursor: auto;
        }
        .search-icon-btn {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: var(--muted-foreground);
          transition: color 0.2s ease;
        }
        .search-pill[data-open="true"] .search-icon-btn {
          color: var(--primary);
        }
        .search-svg {
          width: 1.1rem;
          height: 1.1rem;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .search-pill[data-open="true"] .search-svg {
          transform: rotate(-15deg) scale(1.1);
        }
        .search-input {
          flex: 1;
          min-width: 0;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.875rem;
          color: var(--foreground);
          padding-right: 0.75rem;
          opacity: 0;
          transition: opacity 0.2s ease 0.15s;
        }
        .search-pill[data-open="true"] .search-input {
          opacity: 1;
        }
        .search-input::placeholder {
          color: var(--muted-foreground);
        }
        .search-pill:not([data-open="true"]):hover .search-icon-btn {
          color: var(--foreground);
        }

        /* ── Hamburger ───────────────────────────────── */
        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 2.25rem;
          height: 2.25rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .bar {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--muted-foreground);
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.2s ease;
          transform-origin: center;
        }
        .hamburger:hover .bar {
          background: var(--foreground);
        }
        .bar-open-1 {
          transform: translateY(7px) rotate(45deg);
        }
        .bar-open-2 {
          opacity: 0;
          transform: scaleX(0);
        }
        .bar-open-3 {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* ── Mobile dropdown ─────────────────────────── */
        .mobile-menu {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      border-color 0.3s ease;
          border-top: 1px solid transparent;
        }
        .mobile-menu-open {
          max-height: 400px;
          border-top-color: var(--border);
        }
        .mobile-nav-link {
          display: block;
          padding: 0.65rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--muted-foreground);
          transition: background 0.15s ease, color 0.15s ease;
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
        }
        .mobile-nav-link:hover {
          background: var(--muted);
          color: var(--foreground);
        }
      `}</style>
    </header>
  );
}