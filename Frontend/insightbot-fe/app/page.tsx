"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleUpload(file: File) {
    setUploading(true);
    // fake progress
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 90) clearInterval(interval);
    }, 200);

    const data = await uploadFile(file);
    clearInterval(interval);
    setProgress(100);
    router.push(`/document/${data.doc_id}`);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6"
      style={{ background: "var(--background)" }}>
      
      <h1 className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>
        InsightBot
      </h1>
      <p className="text-lg opacity-60">Chat with your documents</p>

      {!uploading ? (
        <>
          <button
            onClick={() => inputRef.current?.click()}
            className="w-12 h-12 rounded-full text-2xl text-white flex items-center justify-center"
            style={{ background: "var(--accent)" }}>
            +
          </button>
          <p className="text-sm opacity-40">Click + to upload a PDF</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </>
      ) : (
        <div className="w-64">
          <p className="text-sm mb-2 opacity-60">Uploading... {progress}%</p>
          <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
            <div className="h-2 rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--accent)" }} />
          </div>
        </div>
      )}
    </main>
  );
}