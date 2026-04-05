"use client";
import { ActiveTab } from "@/app/page";

const NAV = [
  { id: "upload",  label: "Upload",  icon: "↑" },
  { id: "chat",    label: "Chat",    icon: "◎" },
  { id: "summary", label: "Summary", icon: "≡" },
  { id: "quiz",    label: "Quiz",    icon: "◇" },
] as const;

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;
  docId: string | null;
  docName: string | null;
}

export default function Sidebar({ activeTab, setActiveTab, docId, docName }: Props) {
  return (
    <aside style={{
      width: "var(--sidebar-w)", minWidth: "var(--sidebar-w)", height: "100vh",
      background: "var(--bg-card)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", padding: "1.5rem 0",
    }}>
      <div style={{ padding: "0 1.25rem 1.5rem" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Insight<span style={{ color: "var(--accent)" }}>Bot</span>
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>AI Document Intelligence</div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: "1rem" }} />

      <nav style={{ flex: 1, padding: "0 0.75rem" }}>
        {NAV.map((item) => {
          const locked = item.id !== "upload" && !docId;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => !locked && setActiveTab(item.id as ActiveTab)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                width: "100%", padding: "0.6rem 0.75rem",
                borderRadius: "var(--radius-sm)", border: "none",
                background: active ? "var(--accent-glow)" : "transparent",
                color: active ? "var(--accent)" : locked ? "var(--text-muted)" : "var(--text-secondary)",
                fontFamily: "var(--font-body)", fontSize: "14px",
                fontWeight: active ? 600 : 400,
                cursor: locked ? "not-allowed" : "pointer",
                transition: "all var(--transition)", marginBottom: "2px",
                textAlign: "left",
                borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: "16px", opacity: locked ? 0.35 : 1 }}>{item.icon}</span>
              {item.label}
              {locked && <span style={{ marginLeft: "auto", fontSize: "11px", opacity: 0.4 }}>🔒</span>}
            </button>
          );
        })}
      </nav>

      {docId && (
        <div style={{ padding: "0 0.75rem", marginTop: "auto" }}>
          <div style={{
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)", padding: "0.75rem",
          }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Active document</div>
            <div style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
              {docName || docId.slice(0, 16) + "…"}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}