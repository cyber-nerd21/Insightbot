"use client";
import { useState, useRef } from "react";
import { ActiveTab } from "@/app/page";
import { API_BASE } from "@/lib/api";

interface Props {
  setDocId: (id: string) => void;
  setDocName: (name: string) => void;
  setActiveTab: (t: ActiveTab) => void;
}

export default function UploadPanel({ setDocId, setDocName, setActiveTab }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") { setError("Only PDF files are supported."); return; }
    setError(null);
    setFile(f);
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const id = data.doc_id || data.id || data.document_id;
      if (!id) throw new Error("No doc_id returned from server.");
      setDocId(id);
      setDocName(file.name);
      setSuccess(true);
      setTimeout(() => setActiveTab("chat"), 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <div className="page-header">
        <h1 className="page-title">Upload document</h1>
        <p className="page-subtitle">Select a PDF to start chatting, summarizing, and quizzing</p>
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "0.5rem" }}>PDF file (max 500 MB)</div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <button className="btn btn-ghost" onClick={() => inputRef.current?.click()} style={{ whiteSpace: "nowrap" }}>
              Choose file
            </button>
            <span style={{
              fontSize: "14px", color: file ? "var(--text-primary)" : "var(--text-muted)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {file ? file.name : "No file chosen"}
            </span>
          </div>
          {file && (
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            color: "#f87171", borderRadius: "var(--radius-sm)", padding: "0.65rem 0.9rem", fontSize: "13px",
          }}>{error}</div>
        )}

        {success && (
          <div style={{
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            color: "#34d399", borderRadius: "var(--radius-sm)", padding: "0.65rem 0.9rem", fontSize: "13px",
          }}>Document processed! Redirecting to Chat…</div>
        )}

        <button className="btn btn-primary" onClick={upload} disabled={!file || loading}
          style={{ justifyContent: "center", padding: "0.7rem" }}>
          {loading ? <><span className="spinner" /> Processing…</> : "Upload & Analyse"}
        </button>
      </div>
    </div>
  );
}