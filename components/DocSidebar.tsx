"use client";

import { CheckCircle2, FileText, Info, Sparkles, Upload } from "lucide-react";
import type { Workspace } from "@/data/workspaces";
import { docTypeStyles } from "@/data/workspaces";

export function DocSidebar({ workspace }: { workspace: Workspace }) {
  const chunkCount = workspace.docs.reduce((sum, doc) => sum + doc.chunks.length, 0);

  return (
    <aside className="flex h-full min-h-0 flex-col bg-slate-50/70">
      <div className="border-b border-slate-200/80 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</p>
        <h2 className="mt-1 truncate text-[14px] font-semibold text-slate-900">{workspace.name}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
            {workspace.plan}
          </span>
          <span>{workspace.docs.length} documents</span>
          <span className="text-slate-300">·</span>
          <span>{chunkCount} chunks</span>
        </div>

        <div className="group relative mt-4">
          <button
            type="button"
            disabled
            title="Enabled in MVP (S3 + ingestion worker)"
            className="inline-flex h-9 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white/60 text-[12px] font-medium text-slate-400"
          >
            <Upload size={14} />
            Upload documents
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-center text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
          >
            Enabled in MVP (S3 + ingestion worker)
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-1.5 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Documents</p>
        <span className="rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
          {workspace.docs.length}
        </span>
      </div>

      <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {workspace.docs.map((doc) => (
          <li key={doc.id}>
            <div className="group flex cursor-default items-start gap-2.5 rounded-lg px-2 py-2 transition hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200/80">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 shadow-sm">
                <FileText size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium leading-5 text-slate-700">{doc.title}</p>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-slate-400">
                  <span
                    className={`rounded px-1 py-px text-[9px] font-semibold ring-1 ring-inset ${docTypeStyles[doc.type]}`}
                  >
                    {doc.type}
                  </span>
                  <span>{doc.chunks.length} chunks</span>
                  <span className="ml-auto inline-flex items-center gap-0.5 text-emerald-600">
                    <CheckCircle2 size={10} />
                    Indexed
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-200/80 p-4">
        <div className="flex items-start gap-2 rounded-lg border border-indigo-100 bg-indigo-50/60 p-2.5">
          <Sparkles size={13} className="mt-0.5 shrink-0 text-indigo-500" />
          <p className="text-[10.5px] leading-4 text-indigo-900/80">
            <span className="font-semibold">In-browser TF-IDF index.</span> Production swaps in pgvector
            embeddings with the same interface.
          </p>
        </div>
        <p className="mt-2.5 flex items-center gap-1 text-[10px] text-slate-400">
          <Info size={10} />
          Index refreshed 2 min ago
        </p>
      </div>
    </aside>
  );
}
