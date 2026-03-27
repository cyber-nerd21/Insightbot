"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Sidebar from "@/app/Components/Sidebar";
import ChatWindow from "@/app/Components/ChatWindow";
import TabBar from "@/app/Components/TabBar";

export default function DocumentPage() {
  const { id } = useParams() as { id: string };
  const [activeTab, setActiveTab] = useState<"chat" | "summary" | "quiz">("chat");

  return (
    <div className="flex h-screen" style={{ background: "var(--background)" }}>
      {/* Sidebar */}
      <Sidebar docId={id} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatWindow docId={id} activeTab={activeTab} />
      </div>
    </div>
  );
}