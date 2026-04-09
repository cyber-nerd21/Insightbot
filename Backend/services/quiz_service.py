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

    prompt = f"""
You are InsightBot — an AI agent for intelligent document analysis.

Generate {request.num_questions} {request.difficulty} level multiple-choice questions from the context.

Rules:
- Questions must be based ONLY on the context
- Each question must have exactly 4 options
- Only ONE correct answer
- Randomize the position of the correct answer among A, B, C, D
- "answer" must be one of: "A", "B", "C", "D"
- The answer must correctly map to the right option
- Keep questions clear and concise
- Add a brief, helpful explanation for why the answer is correct

Return STRICT JSON only in this format:

[
  {{
    "question": "string",
    "options": {{
      "A": "option text",
      "B": "option text",
      "C": "option text",
      "D": "option text"
    }},
    "answer": "A",
    "explanation": "Brief explanation of why this is correct"
  }}
]

Context:
{context}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    try:
        text = response.text
    except:
        text = response.candidates[0].content.parts[0].text

    try:
        text = re.sub(r"```json|```", "", text).strip()
        data = json.loads(text)
    except:
        return []

    cleaned_quiz = []

    for q in data:
        try:
            question = q.get("question")
            options = q.get("options")
            answer = q.get("answer")
            explanation = q.get("explanation", "No explanation provided")

            if not question or not options or not answer:
                continue

            if answer not in ["A", "B", "C", "D"]:
                continue

            if isinstance(options, list) and len(options) == 4:
                options = {
                    "A": options[0],
                    "B": options[1],
                    "C": options[2],
                    "D": options[3],
                }

            if not isinstance(options, dict):
                continue

            if set(options.keys()) != {"A", "B", "C", "D"}:
                continue

            cleaned_options = {
                k: str(v).strip() for k, v in options.items()
            }

            cleaned_quiz.append({
                "question": str(question).strip(),
                "options": cleaned_options,
                "answer": answer,
                "explanation": str(explanation).strip()
            })

        except:
            continue

    return cleaned_quiz

async def evaluate_quiz(questions: list, user_answers: dict):
    results = {}
    
    for i, q in enumerate(questions):
        user_ans = user_answers.get(i)
        correct_ans = q.get("answer")
        is_correct = user_ans == correct_ans if user_ans else False
        
        results[i] = {
            "correct": is_correct,
            "explanation": q.get("explanation", "No explanation available"),
            "correct_answer": correct_ans
        }
    
    return results

