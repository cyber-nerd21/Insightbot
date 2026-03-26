// lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Upload file
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

// Chat with document
export async function chatWithDoc(doc_id: string, question: string, chat_history = []) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doc_id, question, chat_history }),
  });
  return res.json();
}

// Summary
export async function getSummary(doc_id: string, summary_type = "medium", query = "") {
  const res = await fetch(`${BASE_URL}/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doc_id, summary_type, query }),
  });
  return res.json();
}

// Quiz
export async function getQuiz(doc_id: string, num_questions = 5, difficulty = "medium") {
  const res = await fetch(`${BASE_URL}/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doc_id, num_questions, difficulty }),
  });
  return res.json();
}