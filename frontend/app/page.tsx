"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import UploadPanel from "@/components/UploadPanel";
import ChatPanel from "@/components/ChatPanel";
import SummaryPanel from "@/components/SummaryPanel";
import QuizPanel from "@/components/QuizPanel";

export type ActiveTab = "upload" | "chat" | "summary" | "quiz";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("upload");
  const [docId, setDocId] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);

  return (
    <div className="app-shell">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} docId={docId} docName={docName} />
      <main className="main-content">
        {activeTab === "upload" && <UploadPanel setDocId={setDocId} setDocName={setDocName} setActiveTab={setActiveTab} />}
        {activeTab === "chat" && <ChatPanel docId={docId} />}
        {activeTab === "summary" && <SummaryPanel docId={docId} />}
        {activeTab === "quiz" && <QuizPanel docId={docId} />}
      </main>
    </div>
  );
}