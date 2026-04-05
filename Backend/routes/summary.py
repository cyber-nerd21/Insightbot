from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.summary_service import summary_service

router = APIRouter(prefix="/summary")

class SummaryRequest(BaseModel):
    doc_id: str
    summary_type: Optional[str] = "medium"  # short, medium, large, bullet, review, analysis
    query: Optional[str] = None

@router.post("/")
async def generate_summary(request: SummaryRequest):

    if request.summary_type not in ["short", "medium", "large", "bullet", "review", "analysis"]:
        raise HTTPException(
            status_code=400,
            detail="summary_type must be: short, medium, large, bullet, review, analysis"
        )

    result = await summary_service(request)

    return {
        "doc_id": request.doc_id,
        "summary_type": request.summary_type,
        "summary": result
    }