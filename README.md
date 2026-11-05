# DocPilot — AI knowledge-base demo

A working RAG workspace built as a static Next.js app. It shows the core of an AI SaaS product:
documents, grounded chat answers with numbered citations, and a live pipeline trace.

## What it shows

- **Workspace chat** — two sample workspaces (Northwind Logistics, Acme Health Clinic) with indexed
  documents and suggested questions.
- **Grounded answers** — every answer sentence cites the source chunk. If the best match scores
  below 0.08, the assistant refuses instead of guessing.
- **Pipeline trace** — query embedding, top-4 retrieval with similarity scores, rerank order,
  generation latency, and input/output token cost for each answer.
- **Source drawer** — click a citation to read the full chunk with the sentences used in the answer
  highlighted.
- **Architecture page** — `/architecture/` gives the recommended production stack, a six-week MVP
  plan, cost estimate and the AI-assisted development workflow.

Everything runs in the browser. Retrieval uses a hand-written TF-IDF index in `lib/rag.ts` and the
answer generator is an extractive mock. The "Mock LLM mode" badge makes this clear. Production would
swap in FastAPI, pgvector and OpenAI/Claude behind the same interface.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to out/
```

Deploy `out/` to Cloudflare Pages. No environment variables, API keys, server code or login.
