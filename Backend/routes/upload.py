import uuid 
from fastapi import APIRouter, UploadFile, File, HTTPException 
from services.upload_service import upload_service
from services.db import supabase  # ← ADD THIS LINE

router = APIRouter()    

MAX_SIZE = 500 * 1024 * 1024  # 500MB 

@router.post("/upload") 
async def upload_pdf(file: UploadFile = File(...)):
    
    # Size check 
    contents = await file.read()
    size = len(contents) 
    await file.seek(0)

    if size > MAX_SIZE: 
        raise HTTPException(status_code=400, detail="File too large max 500MB")
    
    # Check if file already exists in database
    existing_doc = supabase.table("documents") \
        .select("id") \
        .eq("filename", file.filename) \
        .execute()
    
    if existing_doc.data:
        doc_id = existing_doc.data[0]["id"]
        
        # Check if chunks already exist
        chunks_check = supabase.table("document_chunks") \
            .select("id", count="exact") \
            .eq("document_id", doc_id) \
            .execute()
        
        if chunks_check.count > 0:
            return {
                "doc_id": doc_id, 
                "filename": file.filename, 
                "status": "already_processed",
                "message": "Document already uploaded and processed"
            }
    
    # UUID generate 
    doc_id = str(uuid.uuid4())

    # Service call here  
    result = await upload_service(file, doc_id) 

    return result