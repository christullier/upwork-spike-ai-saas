"use client";

import Link from "next/link";
import { Activity, FlaskConical, Layers, PanelLeft } from "lucide-react";
import type { Workspace } from "@/data/workspaces";
import { Logo } from "./Logo";
import { WorkspaceSelect } from "./WorkspaceSelect";

type Props = {
  workspaces: Workspace[];
  workspaceId: string;
  onWorkspaceChange: (id: string) => void;
  onOpenDocs: () => void;
  onOpenTrace: () => void;
};

export function TopBar({ workspaces, workspaceId, onWorkspaceChange, onOpenDocs, onOpenTrace }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="flex h-[60px] items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <Link href="/" className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-200">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight text-slate-900 max-[420px]:hidden">
            DocPilot
          </span>
        </Link>

        <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
        <WorkspaceSelect workspaces={workspaces} value={workspaceId} onChange={onWorkspaceChange} />

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenDocs}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 lg:hidden"
            aria-label="Open documents"
            title="Documents"
          >
            <PanelLeft size={15} />
          </button>
          <button
            type="button"
            onClick={onOpenTrace}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 lg:hidden"
            aria-label="Open pipeline trace"
            title="Pipeline trace"
          >
            <Activity size={15} />
          </button>

          <span className="hidden h-9 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 text-[12px] font-medium text-amber-700 sm:inline-flex">
            <FlaskConical size={13} />
            Mock LLM mode
          </span>

          <Link
            href="/architecture/"
            className="hidden h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
          >
            <Layers size={15} />
            Architecture
          </Link>

          <div className="ml-1 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-[11px] font-semibold text-white ring-2 ring-white">
              DU
            </span>
            <span className="hidden text-[12px] font-medium text-slate-600 xl:block">Demo User</span>
          </div>
        </div>
      </div>
    </header>
  );
}
