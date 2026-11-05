"use client";

import { ArrowUpRight } from "lucide-react";

export function SuggestedChips({
  suggestions,
  onPick,
}: {
  suggestions: string[];
  onPick: (question: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onPick(suggestion)}
          className="group flex items-start justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 text-left text-[12px] font-medium leading-5 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-slate-900 hover:shadow-md hover:shadow-indigo-100/60"
        >
          <span>{suggestion}</span>
          <ArrowUpRight
            size={14}
            className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-indigo-500"
          />
        </button>
      ))}
    </div>
  );
}
