"use client";

import { useEffect } from "react";
import { FileText, X } from "lucide-react";
import { docTypeStyles } from "@/data/workspaces";
import { highlightParts, type Citation } from "@/lib/rag";

type Props = {
  citation: Citation;
  selectedSentences: string[];
  onClose: () => void;
};

export function SourceDrawer({ citation, selectedSentences, onClose }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const parts = highlightParts(citation.text, selectedSentences);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Source chunk">
      <button
        type="button"
        aria-label="Close source"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-xl animate-slide-in flex-col bg-white shadow-2xl">
        <div className="flex items-start gap-3 border-b border-slate-200 px-4 py-3.5">
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
            <FileText size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="truncate text-[13.5px] font-semibold text-slate-900">{citation.docTitle}</h2>
              <span
                className={`rounded px-1 py-px text-[9px] font-semibold ring-1 ring-inset ${docTypeStyles[citation.docType]}`}
              >
                {citation.docType}
              </span>
            </div>
            <p className="mt-0.5 text-[10.5px] text-slate-400">
              Source chunk {citation.chunkId.split("-").pop()} · rerank score {citation.score.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <p className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-[13px] leading-7 text-slate-600">
            {parts.map((part, index) =>
              part.hit ? (
                <mark
                  key={index}
                  className="rounded bg-amber-200/60 px-0.5 text-slate-900 decoration-amber-400"
                >
                  {part.text}
                </mark>
              ) : (
                <span key={index}>{part.text}</span>
              ),
            )}
          </p>

          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-500">
              Why this chunk
            </p>
            <p className="mt-1 text-[11.5px] leading-5 text-indigo-950/80">
              Retrieved by cosine similarity, then reranked with exact phrase overlap. Highlighted
              sentences are the ones used in the answer.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <span className="text-[10px] text-slate-400">Read-only preview · full document views ship in the MVP</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-lg bg-slate-900 px-3 text-[11.5px] font-medium text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
