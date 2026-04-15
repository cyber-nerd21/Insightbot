# InsightBot

Upload a PDF. Ask questions. Get summaries. Test yourself.

I built this because I wanted to actually use my GenAI skills on something practical, not just another chatbot. The target user is a student who wants to study smarter — upload your notes, generate a summary, quiz yourself, ask questions like you're talking to someone who just read the whole thing. Also works well for research papers if you want a quick analysis without reading 40 pages.

Live at [insightbot-ai.vercel.app](https://insightbot-ai.vercel.app)

---

## Features

**Chat** — Ask anything about your document. Answers come from the actual content, not the model's training data. The UI shows which chunks were used to construct the answer.

**Summary** — Six styles: Short, Medium, Detailed, Bullets, Review, and Analysis. You can also pass a focus topic to steer it toward specific sections.

**Quiz** — The model generates MCQs from the document with difficulty labels. Each question shows the correct answer and an explanation after you answer.

---

## How it works

```
PDF Upload
    |
PyMuPDF extracts raw text page by page
    |
Split into 500-char chunks with 50-char overlap
    |
Batch embed all chunks via gemini-embedding-001
    |
Store chunks + vectors in Supabase pgvector
    |
Query comes in
    |
Embed the query with the same model
    |
Cosine similarity search, pull top 5 chunks
    |
Feed chunks as context to Gemini
    |
Return answer + chunk references to frontend
```

The overlap in chunking exists so that sentences split across a boundary don't lose context. I tested without it and retrieval quality dropped noticeably on longer documents.

I originally used sentence-transformers for embeddings but dropped it after noticing it was adding significant latency during testing. Switching to Gemini's embedding API kept everything in one ecosystem and response times improved.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.2.2, React 19, TypeScript, Tailwind CSS v4 |
| Backend | FastAPI 0.120, Python, Uvicorn |
| AI | Gemini API via google-genai SDK, gemini-embedding-001 |
| Vector Storage | Supabase with pgvector |
| PDF Parsing | PyMuPDF |
| Deployment | Vercel (frontend), Railway (backend) |

---

## Project Structure

```
insightbot/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── chat/
│   │   ├── summary/
│   │   └── quiz/
│   └── components/
│
└── backend/
    ├── main.py
    ├── routers/
    │   ├── upload.py
    │   ├── chat.py
    │   ├── summary.py
    │   └── quiz.py
    ├── rag/
    │   ├── parser.py
    │   ├── chunker.py
    │   ├── embedder.py
    │   └── rag_service.py
    └── services/
        └── db.py
```

---

## Running locally

**Backend**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Create a `.env` in `/backend`:

```
GEMINI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Create a `.env.local` in `/frontend`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## What I had to figure out

The frontend was the harder side for me since my background is mostly backend. Getting the state management right across upload, chat, summary, and quiz without things going stale took more iteration than I expected.

On the backend, keeping token usage low was a real constraint. Gemini has limits and hitting them mid-session is a bad experience, so I spent time making sure prompts were tight and context windows weren't bloated with irrelevant chunks.

Response time was the other thing. Sentence-transformers was too slow in testing so I moved to Gemini embeddings. The whole pipeline from query to response needed to feel fast enough to actually be usable.

---

## What's coming

- Flashcard generation from document content
- Chat history saved per document
- Deep analysis mode for research papers
