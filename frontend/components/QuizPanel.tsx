"use client";
import { useState } from "react";
import { API_BASE } from "../lib/api";

interface QuizQuestion {
  question: string;
  options: Record<string, string>;
  answer: string;
  explanation?: string;
}

interface ResultDetail {
  correct: boolean;
  explanation: string;
  correct_answer: string;
}

export default function QuizPanel({ docId }: { docId: string | null }) {
  const [numQ, setNumQ] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Record<number, ResultDetail>>({});

  if (!docId) return (
    <div className="empty-state">
      <div className="empty-icon">◇</div>
      <div>Upload a document first</div>
    </div>
  );

  const generate = async () => {
    setLoading(true); setError(null); setQuestions([]); setAnswers({}); setSubmitted(false); setResults({});
    try {
      const res = await fetch(`${API_BASE}/quiz/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: docId, num_questions: numQ, difficulty }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const raw = data.quiz;
      const qs: QuizQuestion[] = Array.isArray(raw) ? raw : raw?.questions || [];
      setQuestions(qs);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResults(data.results);
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to submit quiz.");
    } finally {
      setLoading(false);
    }
  };

  const score = Object.values(results).filter(r => r.correct).length;

  const diffColors: Record<string, string> = {
    easy: "badge-green",
    medium: "badge-cyan",
    hard: "badge-red",
  };

  return (
    <div style={{ maxWidth: 700, width: "100%" }}>
      <div className="page-header">
        <h1 className="page-title">Quiz</h1>
        <p className="page-subtitle">Test your understanding of the document</p>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Questions ({numQ})
            </div>
            <input
              type="range" min={1} max={20} value={numQ}
              onChange={e => setNumQ(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Difficulty</div>
              <select className="select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={generate}
              disabled={loading}
              style={{ padding: "0.65rem 1.25rem", whiteSpace: "nowrap", flex: "0 0 auto" }}
            >
              {loading ? <><span className="spinner" /> Generating…</> : "Generate Quiz"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
          color: "#f87171", borderRadius: "var(--radius-sm)",
          padding: "0.75rem 1rem", fontSize: "13px", marginBottom: "1rem",
        }}>{error}</div>
      )}

      {submitted && (
        <div style={{
          background: score === questions.length ? "rgba(16,185,129,0.12)" : "rgba(139,92,246,0.12)",
          border: `1px solid ${score === questions.length ? "rgba(16,185,129,0.3)" : "rgba(139,92,246,0.3)"}`,
          borderRadius: "var(--radius)", padding: "1rem 1.25rem", marginBottom: "1.5rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "15px" }}>{score} / {questions.length} correct</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {score === questions.length ? "Perfect score!" : score >= questions.length / 2 ? "Good job!" : "Keep studying!"}
            </div>
          </div>
          <button className="btn btn-ghost" onClick={() => { setSubmitted(false); setAnswers({}); setResults({}); }}>
            Retry
          </button>
        </div>
      )}

      {questions.map((q, i) => {
        const userAns = answers[i];
        const correct = q.answer;
        const isCorrect = results[i]?.correct;
        const resultDetail = results[i];

        return (
          <div key={i} className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Q{i + 1}</div>
              <span className={`badge ${diffColors[difficulty]}`}>{difficulty}</span>
            </div>

            <div style={{ fontWeight: 500, marginBottom: "1rem", wordBreak: "break-word" }}>{q.question}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {Object.entries(q.options).map(([key, value]) => {
                let bg = "var(--bg-surface)";
                let border = "var(--border)";
                let color = "var(--text-primary)";

                if (submitted) {
                  if (key === correct) { bg = "rgba(16,185,129,0.12)"; border = "rgba(16,185,129,0.4)"; color = "#34d399"; }
                  else if (key === userAns && !isCorrect) { bg = "rgba(239,68,68,0.12)"; border = "rgba(239,68,68,0.3)"; color = "#f87171"; }
                } else if (key === userAns) {
                  bg = "var(--accent-glow)"; border = "var(--accent)"; color = "var(--accent)";
                }

                return (
                  <button key={key} onClick={() => !submitted && setAnswers(prev => ({ ...prev, [i]: key }))} style={{
                    padding: "0.6rem 0.9rem", borderRadius: "var(--radius-sm)",
                    border: `1px solid ${border}`, background: bg, color,
                    textAlign: "left", cursor: submitted ? "default" : "pointer",
                    wordBreak: "break-word", lineHeight: 1.5,
                  }}>
                    {key}. {value}
                  </button>
                );
              })}
            </div>

            {submitted && resultDetail && !resultDetail.correct && (
              <div style={{
                marginTop: "12px", fontSize: "13px", color: "var(--text-secondary)",
                padding: "10px", background: "rgba(139,92,246,0.08)",
                borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--accent)",
              }}>
                <strong>✓ Correct answer:</strong> {resultDetail.correct_answer}<br />
                <strong>📖 Explanation:</strong> {resultDetail.explanation}
              </div>
            )}

            {submitted && resultDetail && resultDetail.correct && (
              <div style={{
                marginTop: "12px", fontSize: "13px", color: "var(--text-secondary)",
                padding: "10px", background: "rgba(16,185,129,0.08)",
                borderRadius: "var(--radius-sm)", borderLeft: "3px solid #10b981",
              }}>
                <strong>📖 Explanation:</strong> {resultDetail.explanation}
              </div>
            )}
          </div>
        );
      })}

      {questions.length > 0 && !submitted && (
        <button className="btn btn-primary" onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length || loading}
          style={{ width: "100%", padding: "0.7rem", justifyContent: "center" }}>
          {loading ? "Submitting..." : "Submit Quiz"}
        </button>
      )}
    </div>
  );
}