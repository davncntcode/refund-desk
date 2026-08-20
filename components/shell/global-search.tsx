"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function GlobalSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      role="search"
      className="relative w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();
        router.push(query ? `/refunds?q=${encodeURIComponent(query)}` : "/refunds");
      }}
    >
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden
      />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search name, email or reference"
        aria-label="Search refund requests"
        className="border-input bg-card focus-visible:ring-ring h-10 w-full rounded-full border pr-4 pl-9 text-sm focus-visible:ring-2 focus-visible:outline-none"
      />
    </form>
  );
}
