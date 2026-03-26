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

async def summary_service(request):

    # 🔹 Use user query or fallback
    query = request.query if hasattr(request, "query") and request.query else "Summarize this document"

    # 🔹 Embed query
    embedding = get_embeddings(query)

    # 🔹 Fetch chunks
    result = supabase.rpc("match_chunks", {
        "query_embedding": embedding,
        "match_document_id": request.doc_id,
        "match_count": 8
    }).execute()

    chunks = result.data or []

    if not chunks:
        return "Not enough data"

    # 🔹 Build context
    context = "\n\n".join([c["content"] for c in chunks])

    # 🔹 Updated style map (product-level)
    style_map = {
        "short": "Give a very short summary (2-3 lines max).",

        "medium": "Give a concise summary (5-6 lines, clear and structured).",

        "large": "Give a detailed but well-structured summary (10-12 lines max, still concise).",

        "bullet": "Give clean bullet points (5-8 max, short and crisp).",

        "review": "Give a review-style summary including key benefits, drawbacks (if present), and overall impression.",

        "analysis": "Give an analytical summary focusing on insights, key concepts, and deeper understanding."
    }

    instruction = style_map.get(request.summary_type, "Give a concise summary.")

    # 🔥 FINAL PROMPT (agent-style + strict)
    prompt = f"""
You are InsightBot — an AI agent built for intelligent document analysis.

You assist users with:
- Document understanding
- Summarization
- Quiz generation
- Question answering

For this task, you are generating a SUMMARY.

Core Rules:
- ALWAYS prioritize the user's query
- ONLY use the provided context
- Keep output concise and well-structured
- Do NOT add assumptions or outside knowledge
- If insufficient information, say "Not enough data"

User Query:
{query}

Context:
{context}

Instruction:
{instruction}

Output must be clean, readable, and properly structured.

Summary:
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    # 🔹 Safe extraction
    try:
        return response.text
    except:
        return response.candidates[0].content.parts[0].text