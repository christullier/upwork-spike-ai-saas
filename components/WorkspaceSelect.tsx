"use client";

import { ChevronDown, Database } from "lucide-react";
import type { Workspace } from "@/data/workspaces";

type Props = {
  workspaces: Workspace[];
  value: string;
  onChange: (id: string) => void;
};

export function WorkspaceSelect({ workspaces, value, onChange }: Props) {
  const current = workspaces.find((workspace) => workspace.id === value) ?? workspaces[0];
  return (
    <label className="relative flex min-w-0 flex-1 items-center sm:inline-flex sm:flex-none">
      <span className="sr-only">Workspace</span>
      <Database size={14} className="pointer-events-none absolute left-2.5 hidden text-slate-400 sm:block" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full min-w-0 cursor-pointer appearance-none truncate rounded-lg border border-slate-200 bg-white py-0 pl-2.5 pr-7 text-[13px] font-medium text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-auto sm:max-w-none sm:pl-8"
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2 text-slate-400" />
      <span className="sr-only">Current workspace: {current.name}</span>
    </label>
  );
}
