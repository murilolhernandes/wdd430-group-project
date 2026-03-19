import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="site-logo flex h-12 w-12 items-center justify-center text-sm font-bold">
            HH
          </div>
        </Link>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-2xl font-bold tracking-wide text-stone-800 md:text-3xl">
            Handcrafted Haven
          </h1>
        </Link>

        <nav>
          <ul className="flex items-center gap-3 md:gap-4">
            <li>
              <Link href="/search" className="nav-link text-sm font-medium">
                Search
              </Link>
            </li>
            <li>
              <Link href="/cart" className="nav-link text-sm font-medium">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/login" className="earth-button-primary text-sm">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}