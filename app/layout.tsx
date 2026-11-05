import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocPilot — AI knowledge base demo",
  description:
    "A working RAG workspace demo: grounded answers with citations, retrieval scores and a live pipeline trace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
