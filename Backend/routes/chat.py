from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.chat_service import chat_service

router = APIRouter(prefix="/chat")

class ChatRequest(BaseModel):
    doc_id: str
    question: str
    chat_history: Optional[List[dict]] = None   

@router.post("/")
async def chat(request: ChatRequest):
    
    if len(request.question) > 1000:
        raise HTTPException(status_code=400, detail="Question too long")

    result = await chat_service(
        doc_id=request.doc_id,
        question=request.question,
        chat_history=request.chat_history or []   
    )

    return result