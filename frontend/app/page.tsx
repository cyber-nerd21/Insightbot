"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import UploadPanel from "@/components/UploadPanel";
import ChatPanel from "@/components/ChatPanel";
import SummaryPanel from "@/components/SummaryPanel";
import QuizPanel from "@/components/QuizPanel";
import LandingPage from "@/components/LandingPage";
import { supabase } from "@/lib/supabase";     
 
export type ActiveTab = "upload" | "chat" | "summary" | "quiz";
 
export default function Home() {
  const [showLanding, setShowLanding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("upload");
  const [docId, setDocId] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setShowLanding(!session);
      setLoading(false);
    });
  }, []);
 
  if (loading) return null;
 
  if (showLanding) {
    return <LandingPage onContinueWithoutAuth={() => setShowLanding(false)} />;
  }
 
  return (
    <div className="app-shell">
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
 
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(t) => { setActiveTab(t); setSidebarOpen(false); }}
        docId={docId}
        docName={docName}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
 
      <main className="main-content">
        <div className="mobile-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="mobile-logo">
            Insight<span style={{ color: "var(--accent)" }}>Bot</span>
          </span>
        </div>
 
        {activeTab === "upload" && <UploadPanel setDocId={setDocId} setDocName={setDocName} setActiveTab={setActiveTab} />}
        {activeTab === "chat" && <ChatPanel docId={docId} />}
        {activeTab === "summary" && <SummaryPanel docId={docId} />}
        {activeTab === "quiz" && <QuizPanel docId={docId} />}
      </main>
    </div>
  );
}