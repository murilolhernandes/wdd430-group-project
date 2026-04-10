"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useRef, useTransition } from "react";

type FilterBarProps = {
  categories: string[];
  totalCount: number;
  filteredCount: number;
  priceRange: string;
};

const PRICE_OPTIONS = [
  { label: "Any price", value: "" },
  { label: "Under $25", value: "0-25" },
  { label: "$25 – $50", value: "25-50" },
  { label: "$50 – $100", value: "50-100" },
  { label: "$100 – $200", value: "100-200" },
  { label: "Over $200", value: "200-0" },
];

export default function FilterBar({
  categories,
  totalCount,
  filteredCount,
  priceRange,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  // Always use replace + scroll:false so the page never jumps to the top
  const navigate = (updates: Record<string, string | null>) => {
    startTransition(() => {
      router.replace(`${pathname}?${createQueryString(updates)}`, {
        scroll: false,
      });
    });
  };

  // Debounced version for the text input so we don't fire on every keystroke
  const navigateDebounced = (updates: Record<string, string | null>) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => navigate(updates), 300);
  };

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const inStock = searchParams.get("inStock") ?? "";
  // priceRange comes from props (server-rendered), not searchParams, to avoid hydration mismatch
  const hasFilters = q || category || inStock || priceRange;

  return (
    <div className="earth-card p-5 space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="search"
          placeholder="Search products…"
          defaultValue={q}
          onChange={(e) =>
            navigateDebounced({ q: e.target.value, category, inStock })
          }
          className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 animate-pulse">
            …
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => navigate({ q, category: e.target.value, inStock })}
          className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Price filter */}
        <select
          value={priceRange}
          onChange={(e) => navigate({ q, category, inStock, price: e.target.value })}
          className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200"
        >
          {PRICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* In-stock toggle */}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 select-none hover:bg-stone-100">
          <input
            type="checkbox"
            checked={inStock === "1"}
            onChange={(e) =>
              navigate({ q, category, inStock: e.target.checked ? "1" : null })
            }
            className="accent-stone-700"
          />
          In stock only
        </label>

        {/* Result count */}
        <span className="ml-auto text-sm text-stone-500">
          {filteredCount === totalCount ? (
            <>{totalCount} items</>
          ) : (
            <>
              {filteredCount} of {totalCount} items
            </>
          )}
        </span>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => navigate({ q: null, category: null, inStock: null, price: null })}
            className="text-sm font-medium text-stone-500 underline underline-offset-2 hover:text-stone-800"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}