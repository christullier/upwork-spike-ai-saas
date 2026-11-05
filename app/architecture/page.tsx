import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  Bot,
  Boxes,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  Database,
  DollarSign,
  GitBranch,
  Globe,
  Layers,
  Lock,
  Sparkles,
  Terminal,
  Timer,
  Workflow,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Architecture — DocPilot",
  description:
    "Recommended production architecture, MVP timeline and cost estimate for an AI knowledge-base SaaS.",
};

const phases = [
  {
    week: "Week 1",
    title: "Foundations",
    detail: "Repo, CI/CD, auth, Postgres + pgvector, S3 ingestion skeleton, staging environment.",
  },
  {
    week: "Week 2",
    title: "Ingestion",
    detail: "PDF/DOCX parsing, chunking, embeddings, backfill job, document status tracking.",
  },
  {
    week: "Week 3",
    title: "Retrieval",
    detail: "Hybrid search (vector + keyword), reranker, citation contract, golden-question evals.",
  },
  {
    week: "Week 4",
    title: "Agent & API",
    detail: "LangGraph graph, streaming FastAPI endpoint, guardrails, rate limits, tracing.",
  },
  {
    week: "Week 5",
    title: "Product UI",
    detail: "Workspace chat, document manager, source drawer, workspace switching, onboarding.",
  },
  {
    week: "Week 6",
    title: "Launch",
    detail: "Security review, load test, UAT, production deploy, runbook and handover.",
  },
];

const phaseTwo = [
  "Stripe billing and plan limits",
  "Multi-tenant roles and SSO",
  "Eval dashboard and regression gates",
  "Observability and alerting",
  "Queue-based ingestion at scale",
  "SOC 2 readiness evidence",
];

function StackBox({
  title,
  subtitle,
  items,
  icon: Icon,
  accent = false,
}: {
  title: string;
  subtitle: string;
  items: string[];
  icon: typeof Layers;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3.5 shadow-sm ${
        accent
          ? "border-indigo-200 bg-indigo-50/60"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            accent ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          <Icon size={14} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-slate-900">{title}</p>
          <p className="text-[10px] text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <span className="h-3 w-px bg-slate-300" />
      <span className="my-0.5 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-medium text-slate-400">
        {label}
      </span>
      <ArrowDown size={13} className="text-slate-300" />
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <div className="min-h-[100dvh] bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[60px] max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">DocPilot</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[13px] font-medium text-slate-500">Architecture</span>
          <Link
            href="/"
            className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11.5px] font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft size={13} />
            Back to workspace
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-600">
            <Layers size={11} />
            Recommended stack & delivery plan
          </span>
          <h1 className="mt-3 text-[30px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[38px]">
            A production path from RAG demo to multi-tenant SaaS
          </h1>
          <p className="mt-3 text-[13.5px] leading-6 text-slate-500">
            This demo runs entirely in the browser. The production build keeps the same answer and
            citation contract, then adds real embeddings, a Python API, tenant isolation and evals.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            { icon: Timer, label: "MVP timeline", value: "6 weeks" },
            { icon: DollarSign, label: "MVP estimate", value: "$6.4k–9.4k" },
            { icon: Cpu, label: "Answer path", value: "4 LLM steps" },
            { icon: Lock, label: "Security", value: "SOC 2 ready" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <stat.icon size={14} className="text-indigo-500" />
              <p className="mt-2 text-[15px] font-semibold text-slate-900">{stat.value}</p>
              <p className="text-[9.5px] uppercase tracking-[0.1em] text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-9">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[17px] font-semibold text-slate-900">Reference architecture</h2>
              <p className="mt-0.5 text-[12px] text-slate-500">
                Stateless API, queue-based ingestion and a versioned retrieval contract.
              </p>
            </div>
            <span className="hidden rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500 sm:block">
              AWS · GitHub Actions
            </span>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-5">
            <StackBox
              icon={Globe}
              title="Client"
              subtitle="Next.js 14 · React · TypeScript · Tailwind"
              items={["App Router", "SSE streaming", "Citation drawer", "Mobile drawers"]}
              accent
            />
            <Arrow label="HTTPS · SSE" />
            <StackBox
              icon={Terminal}
              title="API"
              subtitle="FastAPI (Python) · Pydantic · Node worker"
              items={["Auth + tenant scope", "Streaming answers", "Rate limits", "OpenAPI"]}
            />
            <Arrow label="graph invoke" />
            <StackBox
              icon={Workflow}
              title="Orchestration"
              subtitle="LangGraph agent · retrieval · rerank · citations"
              items={["Query rewrite", "Hybrid retrieve", "Cross-encoder rerank", "Grounded prompt"]}
            />
            <Arrow label="read / write" />
            <div className="grid gap-2.5 md:grid-cols-2">
              <StackBox
                icon={Database}
                title="Data layer"
                subtitle="Postgres 16 · pgvector · Redis · S3"
                items={["Tenant RLS", "Vector index", "Answer cache", "Raw documents"]}
              />
              <StackBox
                icon={Bot}
                title="Model providers"
                subtitle="OpenAI · Anthropic · fallback routing"
                items={["text-embedding-3-small", "GPT-4o mini", "Claude Sonnet", "Cost guard"]}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-3 py-2.5 text-[10px] text-slate-500">
              <Cloud size={12} className="text-slate-400" />
              <span className="font-medium text-slate-600">Deployment:</span>
              <span>ECS Fargate</span>
              <span className="text-slate-300">·</span>
              <span>RDS Postgres</span>
              <span className="text-slate-300">·</span>
              <span>ElastiCache</span>
              <span className="text-slate-300">·</span>
              <span>S3 + CloudFront</span>
              <span className="text-slate-300">·</span>
              <span>GitHub Actions</span>
              <span className="text-slate-300">·</span>
              <span>LangSmith / OpenTelemetry</span>
            </div>
          </div>
        </section>

        <section className="mt-9">
          <h2 className="text-[17px] font-semibold text-slate-900">MVP delivery plan</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Six weekly milestones. Each week ends with a deployed, testable increment.
          </p>

          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[110px_150px_1fr] gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-2 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:grid">
              <span>Phase</span>
              <span>Milestone</span>
              <span>Deliverable</span>
            </div>
            {phases.map((phase) => (
              <div
                key={phase.week}
                className="grid gap-1 border-b border-slate-100 px-4 py-2.5 last:border-b-0 sm:grid-cols-[110px_150px_1fr] sm:gap-3 sm:py-2"
              >
                <span className="text-[10px] font-semibold text-indigo-600">{phase.week}</span>
                <span className="text-[11.5px] font-medium text-slate-800">{phase.title}</span>
                <span className="text-[11px] leading-5 text-slate-500">{phase.detail}</span>
              </div>
            ))}
            <div className="grid gap-1 bg-slate-50/60 px-4 py-3 sm:grid-cols-[110px_150px_1fr] sm:gap-3">
              <span className="text-[10px] font-semibold text-slate-500">Phase 2 · Weeks 7–14</span>
              <span className="text-[11.5px] font-medium text-slate-800">Full product</span>
              <span className="text-[11px] leading-5 text-slate-500">
                Billing, multi-tenancy, SSO, eval dashboard, observability and scale work.
              </span>
            </div>
          </div>
        </section>

        <section className="mt-9 grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <DollarSign size={14} />
              </span>
              <h3 className="text-[12.5px] font-semibold text-slate-900">Cost estimate</h3>
            </div>
            <div className="mt-3 space-y-2 text-[11px]">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">MVP build</span>
                <span className="font-semibold text-slate-800">160–200 h</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">At $40/h</span>
                <span className="font-semibold text-slate-800">$6,400–8,000</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Infra + tokens</span>
                <span className="font-semibold text-slate-800">~$80–120 / mo</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-slate-500">Phase 2</span>
                <span className="font-semibold text-slate-800">Scoped after MVP</span>
              </div>
            </div>
            <p className="mt-3 text-[10px] leading-4 text-slate-400">
              Estimate assumes 1,000 queries per day and a single-region AWS deployment.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <GitBranch size={14} />
              </span>
              <h3 className="text-[12.5px] font-semibold text-slate-900">Phase 2 scope</h3>
            </div>
            <ul className="mt-3 space-y-1.5">
              {phaseTwo.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-[11px] leading-5 text-slate-600">
                  <CheckCircle2 size={11} className="mt-1 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Sparkles size={14} />
              </span>
              <h3 className="text-[12.5px] font-semibold text-slate-900">How I use AI tools</h3>
            </div>
            <div className="mt-3 space-y-2.5">
              {[
                {
                  name: "Claude Code",
                  text: "Scaffolding, tests, migrations and repetitive refactors. Runs the full test suite before every PR.",
                },
                {
                  name: "Cursor",
                  text: "Faster UI iteration and safe renames across the workspace. Review each diff before commit.",
                },
                {
                  name: "Codex",
                  text: "Parallel spikes such as eval harnesses and provider adapters, kept on short-lived branches.",
                },
              ].map((tool) => (
                <div key={tool.name}>
                  <p className="flex items-center gap-1 text-[10.5px] font-semibold text-slate-800">
                    <Code2 size={10} className="text-indigo-500" />
                    {tool.name}
                  </p>
                  <p className="mt-0.5 text-[10.5px] leading-4 text-slate-500">{tool.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1 border-t border-indigo-100 pt-2 text-[9.5px] text-indigo-700">
              <Boxes size={10} />
              This demo was built with the same workflow.
            </p>
          </div>
        </section>

        <section className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Bot size={15} className="text-slate-400" />
            <h3 className="text-[12.5px] font-semibold text-slate-900">Answer contract</h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9.5px] font-medium text-slate-500">
              Shared by demo and production
            </span>
          </div>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
            {[
              {
                title: "Grounded",
                text: "Every answer sentence carries at least one chunk citation. No citation, no claim.",
              },
              {
                title: "Refuses low confidence",
                text: "A top rerank score below 0.08 returns a refusal instead of a guess.",
              },
              {
                title: "Measured",
                text: "Tokens, cost, latency and retrieval scores are logged for every request.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5">
                <p className="flex items-center gap-1 text-[10.5px] font-semibold text-slate-700">
                  <CheckCircle2 size={10} className="text-emerald-500" />
                  {item.title}
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-[10.5px] text-slate-400 sm:flex-row sm:px-6">
          <span>DocPilot demo · static export, no backend, no API keys</span>
          <Link href="/" className="font-medium text-indigo-600 transition hover:text-indigo-500">
            Open the workspace →
          </Link>
        </div>
      </footer>
    </div>
  );
}
