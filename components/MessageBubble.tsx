"use client";

import { useState } from "react";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Message } from "@/hooks/useChat";
import type { Citation } from "@/lib/rag";
import { CitationPill } from "./CitationPill";
import { Logo } from "./Logo";

type Props = {
  message: Message;
  onCitationClick: (citation: Citation, selectedSentences: string[]) => void;
};

function AnswerText({
  text,
  citations,
  onCitationClick,
  selectedSentences,
}: {
  text: string;
  citations: Citation[];
  onCitationClick: Props["onCitationClick"];
  selectedSentences: string[];
}) {
  const parts = text.split(/(\[\d+\])/g);
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^\[(\d+)\]$/);
        if (!match) return <span key={index}>{part}</span>;
        const citation = citations.find((item) => item.n === Number(match[1]));
        if (!citation) return <span key={index}>{part}</span>;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onCitationClick(citation, selectedSentences)}
            title={`Open ${citation.docTitle}`}
            className="mx-0.5 inline-flex translate-y-[-1px] items-center rounded border border-indigo-200 bg-indigo-50 px-1 py-px align-middle text-[10px] font-semibold leading-4 text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
          >
            [{citation.n}]
          </button>
        );
      })}
    </>
  );
}
export function MessageBubble({ message, onCitationClick }: Props) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  if (message.role === "user") {
    return (
      <div className="flex animate-fade-up justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-indigo-600 px-4 py-2.5 text-[13px] leading-6 text-white shadow-sm shadow-indigo-600/20">
          {message.text}
        </div>
      </div>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex animate-fade-up gap-2.5">
      <div className="mt-0.5 shrink-0">
        <Logo size="sm" />
      </div>
      <div className="min-w-0 max-w-[92%]">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[12px] font-semibold text-slate-700">DocPilot</span>
          <span className="rounded bg-slate-100 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-slate-400">
            AI
          </span>
        </div>

        <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-3.5 py-3 text-[13px] leading-6 text-slate-700 shadow-sm">
          <AnswerText
            text={message.text}
            citations={message.citations}
            onCitationClick={onCitationClick}
            selectedSentences={message.selectedSentences}
          />
          {message.streaming && (
            <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-indigo-500" />
          )}
        </div>

        {!message.streaming && message.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Sources
            </span>
            {message.citations.map((citation) => (
              <CitationPill
                key={citation.chunkId}
                citation={citation}
                onClick={() => onCitationClick(citation, message.selectedSentences)}
              />
            ))}
          </div>
        )}

        {!message.streaming && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-6 items-center gap-1 rounded px-1.5 text-[10px] font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={() => setFeedback(feedback === "up" ? null : "up")}
              aria-label="Good answer"
              className={`inline-flex h-6 w-6 items-center justify-center rounded transition hover:bg-slate-100 ${
                feedback === "up" ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <ThumbsUp size={11} />
            </button>
            <button
              type="button"
              onClick={() => setFeedback(feedback === "down" ? null : "down")}
              aria-label="Bad answer"
              className={`inline-flex h-6 w-6 items-center justify-center rounded transition hover:bg-slate-100 ${
                feedback === "down" ? "text-rose-500" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <ThumbsDown size={11} />
            </button>
            {message.trace && (
              <span className="ml-1 truncate text-[10px] text-slate-400">
                {message.trace.generation.model} (mock) · {message.trace.generation.latencyMs} ms ·{" "}
                {message.trace.usage.inputTokens + message.trace.usage.outputTokens} tokens
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
