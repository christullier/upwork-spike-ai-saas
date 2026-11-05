"use client";

import { FileText } from "lucide-react";
import type { Citation } from "@/lib/rag";

export function CitationPill({
  citation,
  onClick,
  compact = false,
}: {
  citation: Citation;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${citation.docTitle} — open source chunk`}
      className={`inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 font-medium text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 ${
        compact ? "px-1 py-0 text-[10px] leading-4" : "px-2 py-1 text-[11px]"
      }`}
    >
      <FileText size={compact ? 9 : 11} />
      {compact ? citation.n : citation.docTitle}
    </button>
  );
}
