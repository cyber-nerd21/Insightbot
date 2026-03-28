export default function Sidebar({ docId, activeTab, setActiveTab }: any) {
  const tabs = [
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "summary", label: "Summary", icon: "📄" },
    { id: "quiz", label: "Quiz", icon: "🧠" },
  ];

  return (
    <div className="flex flex-col h-full" style={{ width: "260px", background: "#1a1a1a", borderRight: "1px solid #2a2a2a" }}>
      
      {/* Logo */}
      {/* Logo */}
<div className="p-5 mb-2">
  <h1 
    className="text-2xl font-bold text-white cursor-pointer transition-all"
    style={{ textShadow: "none" }}
    onMouseEnter={(e) => (e.currentTarget.style.textShadow = "0 0 20px rgba(232,98,42,0.8)")}
    onMouseLeave={(e) => (e.currentTarget.style.textShadow = "none")}
  >
    InsightBot
  </h1>
</div>

      {/* Tabs */}
      <div className="flex flex-col gap-1 px-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-3 text-left px-4 py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? "#2a2a2a" : "transparent",
              color: activeTab === tab.id ? "white" : "#888",
            }}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-auto p-4">
        <a href="/" className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg"
          style={{ color: "#666" }}>
          + New Document
        </a>
      </div>
    </div>
  );
}