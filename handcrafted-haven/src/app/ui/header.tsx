import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-800 text-sm font-bold text-amber-50 shadow-sm">
            HH
          </div>
        </Link>

        {/* Center: Title */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-2xl font-bold tracking-wide text-stone-800 md:text-3xl">
            Handcrafted Haven
          </h1>
        </Link>

        {/* Right: Nav */}
        <nav>
          <ul className="flex items-center gap-3 md:gap-6">
            <li>
              <Link
                href="/search"
                className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200 hover:text-stone-900"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200 hover:text-stone-900"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="rounded-full bg-amber-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-900"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}