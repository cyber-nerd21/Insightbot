// app/components/ChatDisplay.tsx
import { useEffect } from 'react';

interface Message {
  id: number;
  role: string;
  content: string;
  timestamp: Date;
}

export default function ChatDisplay({
  messages,
  isLoading,
  messagesEndRef,
}: {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef?: React.RefObject<HTMLDivElement> | null; // Already correct
}) {
  useEffect(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <p>{msg.content}</p>
          <small className="text-gray-500">{msg.timestamp.toLocaleTimeString()}</small>
        </div>
      ))}
      {isLoading && <div className="p-2 text-gray-500">Loading...</div>}
      {messagesEndRef && <div ref={messagesEndRef} />}
    </div>
  );
}