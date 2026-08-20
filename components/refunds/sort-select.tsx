"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildRefundsHref, SORT_OPTIONS, type RefundQuery, type SortKey } from "@/lib/refund-filters";

export function SortSelect({ query }: { query: RefundQuery }) {
  const router = useRouter();

  return (
    <Select
      value={query.sort}
      onValueChange={(value) =>
        router.push(buildRefundsHref(query, { sort: value as SortKey, page: 1 }))
      }
    >
      <SelectTrigger className="w-[184px]" aria-label="Sort refund requests">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
