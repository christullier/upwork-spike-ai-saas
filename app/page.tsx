"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel";
import { DocSidebar } from "@/components/DocSidebar";
import { SourceDrawer } from "@/components/SourceDrawer";
import { TopBar } from "@/components/TopBar";
import { TracePanel } from "@/components/TracePanel";
import { workspaces } from "@/data/workspaces";
import { useChat } from "@/hooks/useChat";
import type { Citation } from "@/lib/rag";

type Drawer = "docs" | "trace" | null;

export default function Home() {
  const [workspaceId, setWorkspaceId] = useState(workspaces[0].id);
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [source, setSource] = useState<{ citation: Citation; sentences: string[] } | null>(null);
  const workspace = workspaces.find((item) => item.id === workspaceId) ?? workspaces[0];
  const { messages, trace, busy, thinking, ask } = useChat(workspace);

  const changeWorkspace = (id: string) => {
    setWorkspaceId(id);
    setDrawer(null);
    setSource(null);
  };

  const openCitation = (citation: Citation, sentences: string[]) => setSource({ citation, sentences });

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-slate-50">
      <TopBar
        workspaces={workspaces}
        workspaceId={workspaceId}
        onWorkspaceChange={changeWorkspace}
        onOpenDocs={() => setDrawer("docs")}
        onOpenTrace={() => setDrawer("trace")}
      />

      <div className="flex min-h-0 flex-1">
        <div className="hidden w-64 shrink-0 border-r border-slate-200/80 lg:block xl:w-[272px]">
          <DocSidebar workspace={workspace} />
        </div>

        <main className="min-w-0 flex-1">
          <ChatPanel
            workspace={workspace}
            messages={messages}
            busy={busy}
            thinking={thinking}
            onAsk={ask}
            onCitationClick={openCitation}
          />
        </main>

        <div className="hidden w-[340px] shrink-0 border-l border-slate-200/80 lg:block xl:w-[360px]">
          <TracePanel trace={trace} pending={thinking} />
        </div>
      </div>

      <footer className="flex h-8 shrink-0 items-center justify-center gap-2 border-t border-slate-200/80 bg-white px-3 text-[10px] text-slate-400">
        <span className="truncate">
          <span className="hidden sm:inline">
            Demo runs fully in-browser on Cloudflare Pages · production swaps in FastAPI + pgvector +
            OpenAI/Claude
          </span>
          <span className="sm:hidden">In-browser demo · no keys, no backend</span>
        </span>
        <span className="hidden h-3 w-px bg-slate-200 sm:block" />
        <Link
          href="/architecture/"
          className="shrink-0 font-medium text-indigo-600 transition hover:text-indigo-500"
        >
          Architecture →
        </Link>
      </footer>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close panel"
            onClick={() => setDrawer(null)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
          />
          <div
            className={`absolute inset-y-0 flex w-[86%] max-w-[340px] animate-slide-in flex-col bg-white shadow-2xl ${
              drawer === "docs" ? "left-0" : "right-0"
            }`}
          >
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 px-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {drawer === "docs" ? "Documents" : "Pipeline Trace"}
              </span>
              <button
                type="button"
                onClick={() => setDrawer(null)}
                aria-label="Close"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              {drawer === "docs" ? (
                <DocSidebar workspace={workspace} />
              ) : (
                <TracePanel trace={trace} pending={thinking} />
              )}
            </div>
          </div>
        </div>
      )}

      {source && (
        <SourceDrawer
          citation={source.citation}
          selectedSentences={source.sentences}
          onClose={() => setSource(null)}
        />
      )}
    </div>
  );
}
