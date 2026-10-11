"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageMeta } from "@/lib/types";

interface PagerProps {
  meta?: PageMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pager({ meta, onPageChange, className }: PagerProps) {
  if (!meta || meta.total <= meta.limit) return null;

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));
  const current = meta.page;
  const from = (current - 1) * meta.limit + 1;
  const to = Math.min(current * meta.limit, meta.total);

  return (
    <div
      className={`flex flex-col items-center justify-between gap-3 sm:flex-row ${className ?? ""}`}
    >
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}</span>–
        <span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{meta.total}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          <ChevronLeft className="size-4" /> Previous
        </Button>
        <span className="px-2 text-sm text-muted-foreground">
          {current} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={current >= totalPages}
          onClick={() => onPageChange(current + 1)}
        >
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
