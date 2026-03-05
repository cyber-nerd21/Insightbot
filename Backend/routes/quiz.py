from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/quiz")

class QuizRequest(BaseModel):
    doc_id: str
    num_questions: int = 5  # default 5 questions

@router.post("/")
async def generate_quiz(request: QuizRequest):
    
    if request.num_questions < 1 or request.num_questions > 20:
        raise HTTPException(status_code=400, detail="Questions must be between 1 and 20")
    
    # response = await quiz_service(request)
    
    return {
        "doc_id": request.doc_id,
        "num_questions": request.num_questions,
        "quiz": []
    }