"use client";
import { useState, useRef, useEffect } from "react";
import { API_BASE } from "@/lib/api";

interface Message { role: "user" | "assistant"; content: string; sources?: Source[]; }
interface Source { chunk_index: number; content: string; }

export default function ChatPanel({ docId }: { docId: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  if (!docId) return (
    <div className="empty-state"><div className="empty-icon">◎</div><div>Upload a document first</div></div>
  );

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(`${API_BASE}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: docId, question: q, chat_history: history }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.answer || data.response || JSON.stringify(data),
        sources: data.sources,
      }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 4rem)" }}>
      <div className="page-header">
        <h1 className="page-title">Chat</h1>
        <p className="page-subtitle">Ask anything about your document</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {messages.length === 0 && (
          <div className="empty-state" style={{ marginTop: "4rem" }}>
            <div className="empty-icon">◎</div>
            <div>Ask your first question below</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "85%",
              background: m.role === "user" ? "var(--accent)" : "var(--bg-card)",
              border: m.role === "assistant" ? "1px solid var(--border)" : "none",
              borderRadius: "var(--radius)",
              padding: "0.75rem 1rem",
              fontSize: "14px",
              lineHeight: 1.7,
              color: m.role === "user" ? "#fff" : "var(--text-primary)",
              wordBreak: "break-word",
            }}>
              {m.content}
              {m.sources && m.sources.length > 0 && (
                <div style={{ marginTop: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "0.5rem" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>Sources</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {m.sources.map((s) => (
                      <span key={s.chunk_index} className="badge badge-purple" title={s.content}>
                        Chunk {s.chunk_index}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "0.75rem 1rem" }}>
              <span className="spinner" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <textarea
          className="textarea"
          placeholder="Ask a question… (Enter to send)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={2}
          style={{ flex: 1, resize: "none", fontSize: "14px" }}
        />
        <button
          className="btn btn-primary"
          onClick={send}
          disabled={!input.trim() || loading}
          style={{ padding: "0.7rem 1rem", height: "fit-content", whiteSpace: "nowrap" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}