"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Workspace } from "@/data/workspaces";
import {
  embeddingTokens,
  estimateUsage,
  generate,
  rerank,
  retrieve,
  type Citation,
  type Reranked,
  type Retrieved,
} from "@/lib/rag";

export type Trace = {
  query: string;
  embed: { tokens: number; model: string; dims: number };
  retrieved: Retrieved[];
  reranked: Reranked[];
  generation: { model: string; latencyMs: number; fallback: boolean };
  usage: { inputTokens: number; outputTokens: number; cost: number };
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  citations: Citation[];
  selectedSentences: string[];
  streaming: boolean;
  trace?: Trace;
};

let messageId = 0;
const nextId = () => `m-${Date.now()}-${messageId++}`;

export function useChat(workspace: Workspace) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState(false);
  const timers = useRef<number[]>([]);
  const workspaceId = workspace.id;

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => {
    clearTimers();
    setMessages([]);
    setTrace(null);
    setBusy(false);
    setThinking(false);
    return clearTimers;
  }, [workspaceId, clearTimers]);

  const ask = useCallback(
    (raw: string) => {
      const query = raw.trim();
      if (!query || busy) return;

      setBusy(true);
      setThinking(true);
      const userMessage: Message = {
        id: nextId(),
        role: "user",
        text: query,
        citations: [],
        selectedSentences: [],
        streaming: false,
      };
      setMessages((prev) => [...prev, userMessage]);

      const timer = window.setTimeout(() => {
        const retrievedChunks = retrieve(workspace, query, 4);
        const rerankedChunks = rerank(query, retrievedChunks, 3);
        const answer = generate(query, rerankedChunks);
        const contextText = rerankedChunks.map((item) => item.chunk.text).join(" ");
        const usage = estimateUsage(query, contextText, answer.text);
        const latencyMs = 640 + Math.round(Math.random() * 360);

        const nextTrace: Trace = {
          query,
          embed: {
            tokens: embeddingTokens(query),
            model: "text-embedding-3-small",
            dims: 1536,
          },
          retrieved: retrievedChunks,
          reranked: rerankedChunks,
          generation: {
            model: "gpt-4o-mini / claude-sonnet",
            latencyMs,
            fallback: answer.fallback,
          },
          usage,
        };

        const assistantId = nextId();
        setTrace(nextTrace);
        setThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            text: "",
            citations: answer.citations,
            selectedSentences: answer.selectedSentences,
            streaming: true,
            trace: nextTrace,
          },
        ]);

        const words = answer.text.split(" ");
        let index = 0;
        const stream = () => {
          index += 1;
          const text = words.slice(0, index).join(" ");
          const done = index >= words.length;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId ? { ...message, text, streaming: !done } : message,
            ),
          );
          if (done) {
            setBusy(false);
            return;
          }
          const streamTimer = window.setTimeout(stream, 26);
          timers.current.push(streamTimer);
        };
        stream();
      }, 620);

      timers.current.push(timer);
    },
    [busy, workspace],
  );

  return { messages, trace, busy, thinking, ask };
}
