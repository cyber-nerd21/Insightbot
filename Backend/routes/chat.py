from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/chat")

class ChatRequest(BaseModel):
    doc_id: str
    question: str
    chat_history: Optional[List[dict]] = []

@router.post("/")
async def chat(request: ChatRequest):
    
    if len(request.question) > 1000:
        raise HTTPException(status_code=400, detail="Question too long max 1000 chars")
    
    # TODO: witty humor in system prompt
    # TODO: precise answers max 3-4 sentences
    # response = await chat_service(request)
    
    return {
        "answer": "placeholder",
        "sources": []
    }