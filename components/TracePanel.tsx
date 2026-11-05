"use client";

import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Cpu,
  Database,
  Layers3,
  ListFilter,
  Sparkles,
  Zap,
} from "lucide-react";
import type { Trace } from "@/hooks/useChat";

type Props = {
  trace: Trace | null;
  pending: boolean;
};

const STEPS = [
  { id: "embed", label: "Embed query", icon: Cpu },
  { id: "retrieve", label: "Retrieve chunks", icon: Database },
  { id: "rerank", label: "Rerank", icon: ListFilter },
  { id: "generate", label: "Generate", icon: Sparkles },
  { id: "usage", label: "Usage & cost", icon: CircleDollarSign },
] as const;

const STEP_NUMBER: Record<string, number> = { embed: 1, retrieve: 2, rerank: 3, generate: 4, usage: 5 };

function costLabel(cost: number): string {
  if (cost < 0.000001) return "<$0.000001";
  return `$${cost.toFixed(6)}`;
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${score >= 0.08 ? "bg-indigo-500" : "bg-slate-300"}`}
        style={{ width: `${Math.max(4, Math.min(100, score * 100))}%` }}
      />
    </div>
  );
}

export function TracePanel({ trace, pending }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    embed: true,
    retrieve: true,
    rerank: true,
    generate: true,
    usage: true,
  });

  const toggle = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="flex h-full min-h-0 flex-col bg-slate-50/70">
      <div className="flex items-center gap-2 border-b border-slate-200/80 px-4 py-3.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-indigo-500 shadow-sm ring-1 ring-slate-200">
          <Activity size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold text-slate-900">Pipeline Trace</p>
          <p className="text-[10px] text-slate-400">Every step behind the last answer</p>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-[9.5px] font-semibold text-slate-500 ring-1 ring-slate-200">
          RAG
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {!trace && !pending && (
          <div className="flex h-full flex-col">
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-4 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-400">
                <Zap size={17} />
              </span>
              <p className="mt-2.5 text-[12px] font-medium text-slate-600">No query yet</p>
              <p className="mt-1 text-[10.5px] leading-4 text-slate-400">
                Ask a question to inspect retrieval scores, reranking, latency and token cost.
              </p>
            </div>
            <div className="mt-3 space-y-1.5 px-1">
              {STEPS.map((step) => (
                <div key={step.id} className="flex items-center gap-2 text-[10.5px] text-slate-400">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 bg-white text-[8.5px] font-semibold text-slate-400">
                    {STEP_NUMBER[step.id]}
                  </span>
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {pending && (
          <div className="space-y-2">
            <div className="h-9 animate-shimmer rounded-lg bg-gradient-to-r from-slate-100 via-white to-slate-100 bg-[length:200%_100%]" />
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-shimmer rounded-full bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:200%_100%]" />
                  <div className="h-2 w-24 animate-shimmer rounded bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:200%_100%]" />
                </div>
                <div className="mt-2 h-1.5 w-full animate-shimmer rounded bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:200%_100%]" />
                <div className="mt-1.5 h-1.5 w-2/3 animate-shimmer rounded bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:200%_100%]" />
              </div>
            ))}
            <p className="px-1 pt-1 text-[10px] text-slate-400">Running the retrieval pipeline…</p>
          </div>
        )}

        {trace && !pending && (
          <div className="animate-fade-up space-y-2">
            <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-indigo-500">Query</p>
              <p className="mt-0.5 line-clamp-2 text-[11.5px] font-medium leading-5 text-indigo-950">
                {trace.query}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm">
              <div className="rounded-md bg-slate-50 px-1.5 py-1 text-center">
                <p className="text-[8.5px] uppercase tracking-wide text-slate-400">Latency</p>
                <p className="text-[10.5px] font-semibold text-slate-700">{trace.generation.latencyMs} ms</p>
              </div>
              <div className="rounded-md bg-slate-50 px-1.5 py-1 text-center">
                <p className="text-[8.5px] uppercase tracking-wide text-slate-400">Tokens</p>
                <p className="text-[10.5px] font-semibold text-slate-700">
                  {trace.usage.inputTokens + trace.usage.outputTokens}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 px-1.5 py-1 text-center">
                <p className="text-[8.5px] uppercase tracking-wide text-slate-400">Cost</p>
                <p className="text-[10.5px] font-semibold text-indigo-700">{costLabel(trace.usage.cost)}</p>
              </div>
            </div>

            {STEPS.map((step) => {
              const isOpen = open[step.id];
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggle(step.id)}
                    className="flex w-full items-center gap-2 px-2.5 py-2 text-left transition hover:bg-slate-50"
                    aria-expanded={isOpen}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[9px] font-bold text-indigo-600">
                      {STEP_NUMBER[step.id]}
                    </span>
                    <Icon size={12} className="shrink-0 text-slate-400" />
                    <span className="flex-1 text-[11.5px] font-semibold text-slate-700">{step.label}</span>
                    {step.id === "retrieve" && (
                      <span className="text-[9px] text-slate-400">{trace.retrieved.length} chunks</span>
                    )}
                    <ChevronDown
                      size={12}
                      className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-2.5 pb-2.5 pt-2">
                      {step.id === "embed" && (
                        <div className="space-y-1.5">
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="rounded-md bg-slate-50 px-2 py-1.5">
                              <p className="text-[9px] text-slate-400">Input tokens</p>
                              <p className="text-[11px] font-semibold text-slate-700">{trace.embed.tokens}</p>
                            </div>
                            <div className="rounded-md bg-slate-50 px-2 py-1.5">
                              <p className="text-[9px] text-slate-400">Dimensions</p>
                              <p className="text-[11px] font-semibold text-slate-700">{trace.embed.dims}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5">
                            <span className="text-[9px] text-slate-400">Model</span>
                            <span className="font-mono text-[9.5px] text-slate-600">
                              {trace.embed.model}
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400">Simulated in-browser · same interface as OpenAI embeddings</p>
                        </div>
                      )}

                      {step.id === "retrieve" && (
                        <div className="space-y-2">
                          {trace.retrieved.map((item, index) => (
                            <div key={item.chunk.id} className="rounded-md border border-slate-100 bg-slate-50/60 p-2">
                              <div className="flex items-baseline gap-1.5">
                                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[8px] font-bold text-slate-500">
                                  {index + 1}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-slate-600">
                                  {item.doc.title}
                                </span>
                                <span
                                  className={`font-mono text-[9.5px] font-semibold ${
                                    item.score >= 0.08 ? "text-indigo-600" : "text-slate-400"
                                  }`}
                                >
                                  {item.score.toFixed(2)}
                                </span>
                              </div>
                              <ScoreBar score={item.score} />
                              <p className="mt-1 line-clamp-2 text-[9.5px] leading-4 text-slate-400">
                                {item.preview}
                              </p>
                            </div>
                          ))}
                          <p className="text-[9px] text-slate-400">
                            Cosine similarity over TF-IDF vectors · top 4 results
                          </p>
                        </div>
                      )}

                      {step.id === "rerank" && (
                        <div className="space-y-1.5">
                          {trace.reranked.map((item, index) => {
                            const moved = item.originalRank - (index + 1);
                            return (
                              <div
                                key={item.chunk.id}
                                className="flex items-start gap-1.5 rounded-md border border-slate-100 bg-slate-50/60 px-2 py-1.5"
                              >
                                <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[8px] font-bold text-indigo-700">
                                  {index + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[10px] font-medium text-slate-600">
                                    {item.doc.title}
                                  </p>
                                  <p className="truncate text-[9px] text-slate-400">{item.reason}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                  {moved !== 0 && (
                                    <span
                                      className={`inline-flex items-center gap-0.5 text-[8.5px] font-semibold ${
                                        moved > 0 ? "text-emerald-600" : "text-rose-500"
                                      }`}
                                    >
                                      {moved > 0 ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                                      {Math.abs(moved)}
                                    </span>
                                  )}
                                  <span className="font-mono text-[9px] font-semibold text-slate-500">
                                    {item.rerankScore.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          <p className="text-[9px] text-slate-400">Exact phrase and numeric match boost</p>
                        </div>
                      )}

                      {step.id === "generate" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5">
                            <span className="text-[9px] text-slate-400">Model</span>
                            <span className="font-mono text-[9px] text-slate-600">
                              {trace.generation.model}
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5">
                            <span className="text-[9px] text-slate-400">Latency</span>
                            <span className="font-mono text-[9.5px] font-semibold text-slate-700">
                              {trace.generation.latencyMs} ms
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 ${
                              trace.generation.fallback
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            <CheckCircle2 size={10} />
                            <span className="text-[9.5px] font-medium">
                              {trace.generation.fallback
                                ? "Refused · no chunk above 0.08"
                                : `Grounded in ${trace.reranked.length} chunks · citations attached`}
                            </span>
                          </div>
                        </div>
                      )}

                      {step.id === "usage" && (
                        <div className="space-y-1.5">
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="rounded-md bg-slate-50 px-2 py-1.5">
                              <p className="text-[9px] text-slate-400">Input</p>
                              <p className="text-[11px] font-semibold text-slate-700">
                                {trace.usage.inputTokens} tok
                              </p>
                            </div>
                            <div className="rounded-md bg-slate-50 px-2 py-1.5">
                              <p className="text-[9px] text-slate-400">Output</p>
                              <p className="text-[11px] font-semibold text-slate-700">
                                {trace.usage.outputTokens} tok
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-indigo-50 px-2 py-1.5">
                            <span className="text-[9px] font-medium text-indigo-700">Estimated cost</span>
                            <span className="font-mono text-[10px] font-bold text-indigo-700">
                              {costLabel(trace.usage.cost)}
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400">
                            $0.15 / 1M input · $0.60 / 1M output (mock)
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <p className="px-1 pt-1 text-[9px] text-slate-400">
              <Layers3 size={9} className="mr-1 inline" />
              Production trace ships to LangSmith / OpenTelemetry.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
