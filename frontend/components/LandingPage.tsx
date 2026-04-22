"use client";

import { supabase } from "@/lib/supabase";

interface Props {
  onContinueWithoutAuth: () => void;
}

export default function LandingPage({ onContinueWithoutAuth }: Props) {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="landing-root">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <nav className="nav">
        <span className="logo">
          Insight<span className="logo-accent">Bot</span>
        </span>
        <button className="btn-ghost" onClick={handleGoogleLogin}>Sign in</button>
      </nav>

      <main className="hero">
        <div className="badge">AI Document Intelligence</div>

        <h1 className="headline">
          Understand any document,
          <br />
          <span className="headline-accent">instantly.</span>
        </h1>

        <p className="subheadline">
          Upload a PDF. Chat with it, summarize it, quiz yourself on it.
          <br />
          Your documents, now intelligent.
        </p>

        <div className="cta-group">
          <button className="btn-primary" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" fill="#FFC107" />
              <path d="M6.3 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00" />
              <path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.3C9.7 35.6 16.3 44 24 44z" fill="#4CAF50" />
              <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.1 5.4l6.2 5.2C40 35.4 44 30.1 44 24c0-1.2-.1-2.4-.4-3.5z" fill="#1976D2" />
            </svg>
            Continue with Google
          </button>

          <button className="btn-secondary" onClick={handleGoogleLogin}>Create account</button>

          <button className="btn-ghost-full" onClick={onContinueWithoutAuth}>
            Try without account →
          </button>
        </div>

        <p className="fine-print">No credit card required. Free to try.</p>
      </main>

      <div className="features">
        {["RAG-powered Q&A", "Multi-style summaries", "Auto quiz generation"].map((f) => (
          <span className="pill" key={f}>{f}</span>
        ))}
      </div>

      <style jsx>{`
        .landing-root {
          min-height: 100vh;
          background: #0e0e0e;
          color: #f5f5f5;
          font-family: "Geist", "Inter", sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 0 1.5rem;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.18;
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 {
          width: 520px;
          height: 520px;
          background: #f97316;
          top: -160px;
          left: -120px;
        }
        .blob-2 {
          width: 380px;
          height: 380px;
          background: #c2692a;
          bottom: 80px;
          right: -100px;
        }
        .nav {
          width: 100%;
          max-width: 900px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          position: relative;
          z-index: 1;
        }
        .logo {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #fff;
        }
        .logo-accent {
          color: #f97316;
        }
        .btn-ghost {
          background: transparent;
          border: 1px solid #333;
          color: #aaa;
          padding: 0.45rem 1.1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover {
          border-color: #f97316;
          color: #fff;
        }
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-top: 1.5em;
          position: relative;
          z-index: 1;
          max-width: 720px;
        }
        .badge {
          background: rgba(249, 115, 22, 0.12);
          border: 1px solid rgba(249, 115, 22, 0.3);
          color: #f97316;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          margin-bottom: 1rem;
        }
        .headline {
          font-size: clamp(2.4rem, 6vw, 3.6rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin: 0 0 1.25rem;
          color: #fff;
        }
        .headline-accent {
          color: #f97316;
        }
        .subheadline {
          font-size: 1.05rem;
          color: #888;
          line-height: 1.65;
          margin: 0 0 1.5rem;
        }
        .cta-group {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          width: 100%;
          max-width: 360px;
        }
        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: #fff;
          color: #111;
          border: none;
          padding: 0.85rem 1.5rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: #f97316;
          color: #fff;
          border: none;
          padding: 0.85rem 1.5rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-secondary:hover {
          background: #ea6a0a;
          transform: translateY(-1px);
        }
        .btn-ghost-full {
          background: transparent;
          color: #888;
          border: 1px solid #2a2a2a;
          padding: 0.85rem 1.5rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .btn-ghost-full:hover {
          color: #fff;
          border-color: #444;
        }
        .fine-print {
          font-size: 0.75rem;
          color: #555;
          margin-top: 1rem;
        }
        .features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.6rem;
          margin-top: 2rem;
          position: relative;
          z-index: 1;
          padding-bottom: 4rem;
        }
        .pill {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #888;
          font-size: 0.8rem;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          transition: border-color 0.2s, color 0.2s;
        }
        .pill:hover {
          border-color: #f97316;
          color: #f97316;
        }
        @media (max-width: 600px) {
          .hero {
            margin-top: 3.5rem;
          }
          .headline {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
