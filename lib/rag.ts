import type { Chunk, Doc, Workspace } from "../data/workspaces";

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "than", "so", "as",
  "is", "are", "was", "were", "be", "been", "being", "am", "do", "does", "did",
  "have", "has", "had", "will", "would", "should", "can", "could", "may", "might", "must",
  "i", "we", "you", "he", "she", "it", "they", "me", "us", "our", "your", "their", "my",
  "this", "that", "these", "those", "there", "here", "what", "which", "who", "whom",
  "whose", "where", "when", "why", "how", "much", "many", "of", "in", "on", "at",
  "to", "for", "from", "by", "with", "about", "into", "over", "after", "before",
  "up", "down", "out", "off", "again", "any", "all", "some", "such", "not",
  "only", "own", "same", "too", "very", "just", "also", "please", "tell", "give",
  "get", "got", "want", "need", "know", "explain",
]);

/** Small stemmer so "damaged" matches "damage" and "stored" matches "store". */
function stem(word: string): string {
  let w = word;
  if (w.length > 4 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  else if (w.length > 4 && w.endsWith("es")) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) w = w.slice(0, -1);
  if (w.length > 4 && w.endsWith("e")) w = w.slice(0, -1);
  return w;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9$%.\s-]/g, " ")
    .split(/[\s-]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter((t) => t.length > 0 && !STOPWORDS.has(t))
    .map(stem)
    .filter((t) => t.length > 1);
}

type Indexed = {
  entries: Array<{ chunk: Chunk; doc: Doc; tokens: string[] }>;
  idf: Map<string, number>;
};

const indexCache = new Map<string, Indexed>();

function buildIndex(workspace: Workspace): Indexed {
  const hit = indexCache.get(workspace.id);
  if (hit) return hit;

  const entries = workspace.docs.flatMap((doc) =>
    doc.chunks.map((chunk) => ({ chunk, doc, tokens: tokenize(chunk.text) })),
  );
  const df = new Map<string, number>();
  for (const entry of entries) {
    for (const term of new Set(entry.tokens)) df.set(term, (df.get(term) ?? 0) + 1);
  }
  const idf = new Map<string, number>();
  for (const [term, count] of df) {
    idf.set(term, Math.log((entries.length + 1) / (count + 1)) + 1);
  }
  const index = { entries, idf };
  indexCache.set(workspace.id, index);
  return index;
}

function termWeights(tokens: string[], idf: Map<string, number>, boost = 2.2): Map<string, number> {
  const counts = new Map<string, number>();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  const weights = new Map<string, number>();
  let norm = 0;
  for (const [term, count] of counts) {
    const weight = (1 + Math.log(count)) * (idf.get(term) ?? boost);
    weights.set(term, weight);
    norm += weight * weight;
  }
  norm = Math.sqrt(norm) || 1;
  for (const [term, weight] of weights) weights.set(term, weight / norm);
  return weights;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let sum = 0;
  for (const [term, weight] of a) sum += weight * (b.get(term) ?? 0);
  return sum;
}

export type Retrieved = {
  chunk: Chunk;
  doc: Doc;
  score: number;
  preview: string;
};

export type Reranked = Retrieved & {
  originalRank: number;
  rerankScore: number;
  reason: string;
};

function preview(text: string, max = 120): string {
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`;
}

export function retrieve(workspace: Workspace, query: string, k = 4): Retrieved[] {
  const index = buildIndex(workspace);
  const queryTokens = tokenize(query);
  const queryWeights = termWeights(queryTokens, index.idf);
  const seen = new Set<string>();

  const scored = index.entries
    .map(({ chunk, doc, tokens }) => {
      const idf = index.idf;
      const counts = new Map<string, number>();
      for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
      const docWeights = new Map<string, number>();
      let norm = 0;
      for (const [term, count] of counts) {
        const weight = (1 + Math.log(count)) * (idf.get(term) ?? 1);
        docWeights.set(term, weight);
        norm += weight * weight;
      }
      norm = Math.sqrt(norm) || 1;
      for (const [term, weight] of docWeights) docWeights.set(term, weight / norm);
      const score = Math.min(0.99, cosine(queryWeights, docWeights));
      return { chunk, doc, score, preview: preview(chunk.text) };
    })
    .sort((a, b) => b.score - a.score);

  const result: Retrieved[] = [];
  for (const item of scored) {
    if (seen.has(item.chunk.id)) continue;
    seen.add(item.chunk.id);
    result.push(item);
    if (result.length >= k) break;
  }
  return result;
}

export function rerank(query: string, retrieved: Retrieved[], top = 3): Reranked[] {
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  const bigrams: string[] = [];
  const words = normalizedQuery.split(" ").filter(Boolean);
  for (let i = 0; i < words.length - 1; i += 1) bigrams.push(`${words[i]} ${words[i + 1]}`);

  return retrieved
    .map((item, i) => {
      const text = item.chunk.text.toLowerCase();
      const phraseHits = bigrams.filter((bigram) => text.includes(bigram)).length;
      const hasNumber = /\d/.test(query) && /\d/.test(item.chunk.text) ? 0.02 : 0;
      const phraseBoost = Math.min(0.12, phraseHits * 0.06);
      const rerankScore = Math.min(0.99, item.score + phraseBoost + hasNumber);
      const reason =
        phraseBoost > 0 ? `vector + exact phrase (+${phraseBoost.toFixed(2)})` : "vector score";
      return { ...item, originalRank: i + 1, rerankScore, reason };
    })
    .sort((a, b) => b.rerankScore - a.rerankScore)
    .slice(0, top);
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9$])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function sentenceScore(sentence: string, queryTokens: string[], numericIntent: boolean): number {
  const tokens = new Set(tokenize(sentence));
  const overlap = queryTokens.filter((token) => tokens.has(token)).length;
  const numberBonus = numericIntent && /\d/.test(sentence) ? 0.35 : 0;
  return overlap + numberBonus;
}

export type Citation = {
  n: number;
  chunkId: string;
  docId: string;
  docTitle: string;
  docType: Doc["type"];
  text: string;
  score: number;
};

export type Answer = {
  text: string;
  citations: Citation[];
  fallback: boolean;
  selectedSentences: string[];
};

const NO_ANSWER = "I couldn't find that in this workspace's documents.";

export function generate(query: string, reranked: Reranked[]): Answer {
  const queryTokens = tokenize(query);
  const numericIntent = /\b(how (long|much|many|fast|soon)|when|window|fee|cost|price|limit|days?|hours?)\b/i.test(query);
  const topScore = reranked[0]?.rerankScore ?? 0;

  if (topScore < 0.08 || queryTokens.length === 0) {
    return { text: NO_ANSWER, citations: [], fallback: true, selectedSentences: [] };
  }

  const candidates: Array<{
    sentence: string;
    chunk: Chunk;
    doc: Doc;
    score: number;
    chunkRank: number;
    position: number;
  }> = [];

  reranked.forEach((item, chunkRank) => {
    if (item.rerankScore < 0.06) return;
    splitSentences(item.chunk.text).forEach((sentence, position) => {
      const score = sentenceScore(sentence, queryTokens, numericIntent);
      if (score > 0) {
        candidates.push({ sentence, chunk: item.chunk, doc: item.doc, score, chunkRank, position });
      }
    });
  });

  candidates.sort((a, b) => b.score - a.score || a.chunkRank - b.chunkRank || a.position - b.position);
  const cutoff = Math.max(1, (candidates[0]?.score ?? 0) * 0.6);
  const chosen: typeof candidates = [];
  for (const candidate of candidates) {
    if (chosen.length >= 2) break;
    if (candidate.score < cutoff) continue;
    if (chosen.some((c) => c.sentence === candidate.sentence)) continue;
    chosen.push(candidate);
  }

  if (chosen.length === 0) {
    return { text: NO_ANSWER, citations: [], fallback: true, selectedSentences: [] };
  }

  chosen.sort((a, b) => a.chunkRank - b.chunkRank || a.position - b.position);

  const citations: Citation[] = [];
  const parts: string[] = [];
  for (const item of chosen) {
    let citation = citations.find((c) => c.chunkId === item.chunk.id);
    if (!citation) {
      citation = {
        n: citations.length + 1,
        chunkId: item.chunk.id,
        docId: item.doc.id,
        docTitle: item.doc.title,
        docType: item.doc.type,
        text: item.chunk.text,
        score: reranked.find((r) => r.chunk.id === item.chunk.id)?.rerankScore ?? 0,
      };
      citations.push(citation);
    }
    parts.push(`${item.sentence} [${citation.n}]`);
  }

  return {
    text: parts.join(" "),
    citations,
    fallback: false,
    selectedSentences: chosen.map((c) => c.sentence),
  };
}

export function highlightParts(text: string, selectedSentences: string[]): Array<{ text: string; hit: boolean }> {
  if (selectedSentences.length === 0) return [{ text, hit: false }];
  const pattern = selectedSentences
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(`(${pattern})`, "g");
  return text
    .split(regex)
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, hit: selectedSentences.includes(part) }));
}

export function estimateUsage(query: string, contextText: string, answer: string) {
  const inputTokens = Math.ceil((query.length + contextText.length) / 4);
  const outputTokens = Math.ceil(answer.length / 4);
  const cost = (inputTokens / 1_000_000) * 0.15 + (outputTokens / 1_000_000) * 0.6;
  return { inputTokens, outputTokens, cost };
}

export function embeddingTokens(query: string): number {
  return Math.ceil(query.length / 4);
}

export function sentenceMatches(sentence: string, query: string): boolean {
  const tokens = new Set(tokenize(sentence));
  return tokenize(query).some((token) => tokens.has(token));
}
