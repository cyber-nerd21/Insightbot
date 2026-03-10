from google import genai
from services.db import supabase
from rag.embedder import get_embeddings
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def chat_service(doc_id: str, question: str, chat_history: list):

    # Step 1 - Question embed karo
    question_embedding = get_embeddings(question)

    # Step 2 - Vector search
    result = supabase.rpc("match_chunks", {
        "query_embedding": question_embedding,
        "match_document_id": doc_id,
        "match_count": 5
    }).execute()

    chunks = result.data

    # Step 3 - Context banao
    context = "\n\n".join([c["content"] for c in chunks])
    sources = [{"chunk_index": c["chunk_index"], "content": c["content"][:100]} for c in chunks]

    # Step 4 - Gemini call
    prompt = f"""You are InsightBot - a precise and slightly witty AI assistant.
Answer based ONLY on the context below. Be concise - max 3-4 sentences.

Context:
{context}

Question: {question}

Answer:"""

    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=prompt
    )

    return {
        "answer": response.text,
        "sources": sources
    }