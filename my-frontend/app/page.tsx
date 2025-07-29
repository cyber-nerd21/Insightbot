// app/page.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatDisplay from './components/ChatDisplay';
import ChatInput from './components/ChatInput';
import LandingPage from './components/LandingPage';

interface Message {
  id: number;
  role: string;
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // RefObject<HTMLDivElement | null>
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [inputValue]);

  const handleStart = () => {
    console.log('handleStart triggered');
    setIsStarted(true);
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: "Hello! I'm your AI assistant. Upload a PDF to ask questions, and I'll simulate RAG-based answers. How can I help?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      console.log('File uploaded:', file.name);
      setUploadedFile(file);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'system',
          content: `📄 Successfully uploaded: ${file.name}.`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = uploadedFile
        ? [
            "Based on your PDF, the main topic seems to be [mock topic].",
            "I’ve simulated a quiz question: What’s the key point on page 1?",
            "Analyzing your PDF, it mentions [mock detail].",
            "Let me explain: [mock explanation] from your document.",
          ]
        : [
            "Please upload a PDF to ask about documents.",
            "I can’t generate a quiz without a PDF.",
            "Upload a document for analysis.",
            "Let’s chat generally for now!",
          ];
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = ["Ask questions about PDFs", "Generate study quizzes", "Document analysis"];

  if (!isStarted) return <LandingPage handleStart={handleStart} quickActions={quickActions} />;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header
        uploadedFile={uploadedFile}
        handleFileUpload={handleFileUpload}
        setIsStarted={setIsStarted}
      />
      <ChatDisplay messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>} />
      <ChatInput
        inputValue={inputValue}
        isRecording={false}
        setInputValue={setInputValue}
        handleSend={handleSend}
        handleKeyPress={handleKeyPress}
        setIsRecording={() => {}}
      />
    </div>
  );
}