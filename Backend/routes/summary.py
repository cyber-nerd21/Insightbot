from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/summary")

class SummaryRequest(BaseModel):
    doc_id: str
    summary_type: str = "short"  # short, detailed, bullet

@router.post("/")
async def generate_summary(request: SummaryRequest):
    
    if request.summary_type not in ["short", "detailed", "bullet"]:
        raise HTTPException(status_code=400, detail="Invalid summary type")
    
    # response = await summary_service(request)
    
    return {
        "doc_id": request.doc_id,
        "summary_type": request.summary_type,
        "summary": "placeholder summary"
    }