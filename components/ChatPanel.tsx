"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, CornerDownLeft, Sparkles, ShieldCheck } from "lucide-react";
import type { Workspace } from "@/data/workspaces";
import type { Message } from "@/hooks/useChat";
import type { Citation } from "@/lib/rag";
import { Logo } from "./Logo";
import { MessageBubble } from "./MessageBubble";
import { SuggestedChips } from "./SuggestedChips";

type Props = {
  workspace: Workspace;
  messages: Message[];
  busy: boolean;
  thinking: boolean;
  onAsk: (question: string) => void;
  onCitationClick: (citation: Citation, selectedSentences: string[]) => void;
};

export function ChatPanel({ workspace, messages, busy, thinking, onAsk, onCitationClick }: Props) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chunkCount = workspace.docs.reduce((sum, doc) => sum + doc.chunks.length, 0);
  const lastText = messages[messages.length - 1]?.text.length ?? 0;

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: messages.length > 1 ? "smooth" : "auto" });
  }, [messages.length, lastText, thinking]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || busy) return;
    onAsk(input);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          {messages.length === 0 ? (
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-600">
                <Sparkles size={11} />
                Retrieval-augmented answers
              </span>
              <h1 className="mt-4 text-[26px] font-semibold tracking-tight text-slate-900 sm:text-[30px]">
                Ask your knowledge base
              </h1>
              <p className="mt-2 max-w-xl text-[13px] leading-6 text-slate-500">
                Answers come from the {workspace.docs.length} indexed documents in{" "}
                <span className="font-medium text-slate-700">{workspace.name}</span>. Every sentence links
                to the chunk it came from.
              </p>

              <div className="mt-5">
                <SuggestedChips suggestions={workspace.suggestions} onPick={onAsk} />
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-3">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                <p className="text-[11.5px] leading-5 text-slate-500">
                  <span className="font-medium text-slate-700">Grounded by design.</span> If the best match
                  scores below 0.08, DocPilot refuses to answer instead of inventing an answer.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
                {[
                  { label: "Documents", value: workspace.docs.length },
                  { label: "Chunks", value: chunkCount },
                  { label: "Answer latency", value: "~0.8s" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[16px] font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} onCitationClick={onCitationClick} />
              ))}
              {thinking && (
                <div className="flex animate-fade-up gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    <Logo size="sm" />
                  </div>
                  <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.1s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Embedding query · searching {chunkCount} chunks
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200/80 bg-white px-4 pb-3 pt-3 sm:px-6">
        <form onSubmit={submit} className="mx-auto w-full max-w-3xl">
          <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white p-1.5 pl-3 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50">
            <Sparkles size={15} className="shrink-0 text-indigo-400" />
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={`Ask ${workspace.name} a question…`}
              disabled={busy}
              aria-label="Question"
              className="h-8 min-w-0 flex-1 bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send question"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              <ArrowUp size={15} strokeWidth={2.4} />
            </button>
          </div>
          <div className="mt-1.5 flex items-center justify-between px-1">
            <p className="text-[10px] text-slate-400">Mock LLM. No data leaves the browser.</p>
            <p className="hidden items-center gap-1 text-[10px] text-slate-400 sm:flex">
              <CornerDownLeft size={9} />
              Enter to send
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
