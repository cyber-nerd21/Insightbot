"use client";
import { useState } from "react";
import { API_BASE } from "../lib/api";

const TYPES = [
  { value: "short",    label: "Short",    desc: "2–3 lines" },
  { value: "medium",   label: "Medium",   desc: "5–6 lines" },
  { value: "large",    label: "Detailed", desc: "10–12 lines" },
  { value: "bullet",   label: "Bullets",  desc: "5–8 points" },
  { value: "review",   label: "Review",   desc: "Pros & cons" },
  { value: "analysis", label: "Analysis", desc: "Deep insights" },
];

export default function SummaryPanel({ docId }: { docId: string | null }) {
  const [type, setType] = useState("medium");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!docId) return (
    <div className="empty-state"><div className="empty-icon">≡</div><div>Upload a document first</div></div>
  );

  const generate = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/summary/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: docId, summary_type: type, query: query || undefined }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data.summary || data.result || JSON.stringify(data));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, width: "100%" }}>
      <div className="page-header">
        <h1 className="page-title">Summary</h1>
        <p className="page-subtitle">Generate AI summaries in different styles</p>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "0.6rem" }}>Summary style</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "8px" }}>
          {TYPES.map(t => (
            <button key={t.value} onClick={() => setType(t.value)} style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${type === t.value ? "var(--accent)" : "var(--border)"}`,
              background: type === t.value ? "var(--accent-glow)" : "var(--bg-card)",
              color: type === t.value ? "var(--accent)" : "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all var(--transition)",
            }}>
              <div style={{ fontWeight: 500 }}>{t.label}</div>
              <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "2px" }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Focus on (optional)</div>
        <input className="input" placeholder="e.g. 'key findings' or 'methodology section'"
          value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <button className="btn btn-primary" onClick={generate} disabled={loading}
        style={{ width: "100%", justifyContent: "center", padding: "0.7rem", marginBottom: "1.5rem" }}>
        {loading ? <><span className="spinner" /> Generating…</> : "Generate Summary"}
      </button>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
          color: "#f87171", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", fontSize: "13px",
        }}>{error}</div>
      )}

      {result && (
        <div className="card" style={{ lineHeight: 1.8, fontSize: "15px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span className="badge badge-purple">{TYPES.find(t => t.value === type)?.label}</span>
            <button className="btn btn-ghost" style={{ fontSize: "12px", padding: "4px 10px" }}
              onClick={() => navigator.clipboard.writeText(result)}>Copy</button>
          </div>
          {result}
        </div>
      )}
    </div>
  );
}