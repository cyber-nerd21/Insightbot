from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from services.quiz_service import quiz_service, evaluate_quiz

router = APIRouter(prefix="/quiz")

class QuizRequest(BaseModel):
    doc_id: str
    num_questions: int = 5
    difficulty: Optional[str] = "medium"

class SubmitRequest(BaseModel):
    questions: List[Dict[str, Any]]
    answers: Dict[int, str]

@router.post("/")
async def generate_quiz(request: QuizRequest):
    
    if request.num_questions < 1 or request.num_questions > 20:
        raise HTTPException(
            status_code=400,
            detail="Questions must be between 1 and 20"
        )
    
    if request.difficulty not in ["easy", "medium", "hard"]:
        raise HTTPException(
            status_code=400,
            detail="Difficulty must be: easy, medium, hard"
        )
    
    quiz = await quiz_service(request)

    return {
        "doc_id": request.doc_id,
        "num_questions": request.num_questions,
        "difficulty": request.difficulty,
        "quiz": quiz
    }

@router.post("/submit")
async def submit_quiz(request: SubmitRequest):
    try:
        results = await evaluate_quiz(request.questions, request.answers)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))