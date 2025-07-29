// app/components/ChatInput.tsx
'use client';
import { useRef, useEffect } from 'react';

interface ChatInputProps {
  inputValue: string;
  isRecording: boolean;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatInput({ inputValue, isRecording, setInputValue, handleSend, handleKeyPress, setIsRecording }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [inputValue]);

  return (
    <div className="p-4 bg-gray-100 border-t">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="w-full p-2 border rounded resize-none"
      />
      <div className="flex justify-end mt-2 space-x-2">
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-gray-500'} text-white`}
        >
          {isRecording ? 'Stop' : 'Record'}
        </button>
      </div>
    </div>
  );
}