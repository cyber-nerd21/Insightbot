from google import genai
from services.db import supabase
from rag.embedder import get_embeddings
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options={"api_version": "v1"}
)

async def chat_service(doc_id: str, question: str, chat_history: list):

    # 🔹 Get embedding
    question_embedding = get_embeddings(question)

    # 🔹 Fetch relevant chunks
    result = supabase.rpc("match_chunks", {
        "query_embedding": question_embedding,
        "match_document_id": doc_id,
        "match_count": 5
    }).execute()

    chunks = result.data or []

    # 🔥 Handle no data case
    if not chunks:
        return {
            "answer": "Not enough data",
            "sources": []
        }

    # 🔹 Build context
    context = "\n\n".join([c["content"] for c in chunks])

    sources = [
        {
            "chunk_index": c["chunk_index"],
            "content": c["content"][:100]
        }
        for c in chunks
    ]

    # 🔹 Prompt
    prompt = f"""You are InsightBot.
Answer ONLY using the provided context.
If the answer is not in the context, say "Not enough data".
Do not make assumptions.

Context:
{context}

Question: {question}

Answer:"""

    # 🔹 LLM call
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    # 🔹 Safe extraction
    try:
        answer = response.text
    except:
        answer = response.candidates[0].content.parts[0].text

    return {
        "answer": answer,
        "sources": sources
    }