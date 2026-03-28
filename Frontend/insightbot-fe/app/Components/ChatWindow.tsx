"use client";
import { useState } from "react";
import { chatWithDoc, uploadFile } from "@/lib/api";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ docId, activeTab }: any) {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    const question = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: question }]);
    setLoading(true);
    const data = await chatWithDoc(docId, question, []);
    setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#f9f9f7" }}>

        {/* Top bar */}
<div className="px-6 py-4 border-b flex items-center"
  style={{ borderColor: "#e0e0dc" }}>
  <p className="font-medium text-sm" style={{ color: "#1a1a1a" }}>Document Chat</p>
</div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: "#999" }}>Ask anything about your document</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <MessageBubble role="assistant" content="Thinking..." />
        )}
      </div>

      {/* Input */}
      <div className="p-4 px-16">
        <div className="flex items-end gap-3 px-4 py-3 rounded-2xl" style={{ background: "#1a1a1a" }}>

          {/* + button */}
          <div className="relative group flex-shrink-0">
            <input type="file" accept=".pdf" className="hidden" id="new-upload"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const data = await uploadFile(e.target.files[0]);
                  window.location.href = `/document/${data.doc_id}`;
                }
              }}
            />
            <button onClick={() => document.getElementById("new-upload")?.click()}
              className="text-xl transition-colors hover:text-white"
              style={{ color: "#666" }}>
              +
            </button>
            <div className="absolute bottom-8 left-0 hidden group-hover:block whitespace-nowrap text-xs px-2 py-1 rounded"
              style={{ background: "#333", color: "white" }}>
              Add files to get started
            </div>
          </div>
<textarea
  rows={1}
  value={input}
  onChange={(e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }}
  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
  placeholder="Ask about your document..."
  className="flex-1 bg-transparent text-sm outline-none resize-none"
  style={{ color: "white", overflow: "hidden", maxHeight: "200px" }}
/>
          {input.trim() && (
            <button onClick={handleSend}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#E8622A" }}>
              ↑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}