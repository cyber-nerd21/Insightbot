export default function MessageBubble({ role, content }: { role: string, content: string }) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div style={{
        maxWidth: isUser ? "fit-content" : "85%",
        padding: isUser ? "8px 16px" : "4px 0px",
        borderRadius: isUser ? "20px" : "0px",
        background: isUser ? "#2a2a2a" : "transparent",
        color: isUser ? "white" : "#1a1a1a",
        fontSize: "14px",
        lineHeight: "1.6",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
      }}>
        {content}
      </div>
    </div>
  );
}