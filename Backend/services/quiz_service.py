from google import genai
from services.db import supabase
from rag.embedder import get_embeddings
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options={"api_version": "v1"}
)

async def quiz_service(request):

    query = "Generate quiz questions from this document"
    embedding = get_embeddings(query)

    result = supabase.rpc("match_chunks", {
        "query_embedding": embedding,
        "match_document_id": request.doc_id,
        "match_count": 8
    }).execute()

    chunks = result.data or []

    if not chunks:
        return []

    context = "\n\n".join([c["content"] for c in chunks])

    # 🔥 Strong structured prompt
    prompt = f"""
You are InsightBot — an AI agent for intelligent document analysis.

Generate {request.num_questions} {request.difficulty} level multiple-choice questions from the context.

Rules:
- Questions must be based ONLY on the context
- Each question must have exactly 4 options
- Only ONE correct answer
- Keep questions clear and concise
- Do NOT add explanations

Return STRICT JSON only:

[
  {{
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": "exact correct option text"
  }}
]

Context:
{context}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    # 🔹 Safe extraction
    try:
        text = response.text
    except:
        text = response.candidates[0].content.parts[0].text

    # 🔥 Clean JSON (handles ```json issues)
    try:
        text = re.sub(r"```json|```", "", text).strip()
        return json.loads(text)
    except:
        return []