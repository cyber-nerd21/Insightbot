import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsightBot — AI Document Intelligence",
  description: "Upload documents, chat, summarize, and quiz with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}