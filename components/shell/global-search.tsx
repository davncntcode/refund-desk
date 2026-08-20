"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function GlobalSearch() {
  const router = useRouter();
  const current = useSearchParams().get("q") ?? "";

  return (
    // key remounts the field when the url changes, so no state to sync
    <form
      key={current}
      role="search"
      className="relative w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault();
        const value = String(new FormData(event.currentTarget).get("q") ?? "").trim();
        router.push(value ? `/refunds?q=${encodeURIComponent(value)}` : "/refunds");
      }}
    >
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden
      />
      <input
        type="search"
        name="q"
        defaultValue={current}
        placeholder="Search name, email or reference"
        aria-label="Search refund requests"
        className="border-input bg-card focus-visible:ring-ring h-10 w-full rounded-full border pr-4 pl-9 text-sm focus-visible:ring-2 focus-visible:outline-none"
      />
    </form>
  );
}
