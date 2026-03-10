import uuid
from fastapi import UploadFile
from services.db import supabase
from services.rag_service import process_document

async def upload_service(file: UploadFile, doc_id: str):
    
    # Step 1 - Supabase storage mein save
    contents = await file.read()
    
    supabase.storage.from_("documents").upload(
        path=f"{doc_id}/{file.filename}",
        file=contents,
        file_options={"content-type": "application/pdf"}
    )
    
    # Step 2 - DB mein document record insert
    supabase.table("documents").insert({
        "id": doc_id,
        "filename": file.filename,
        "file_url": f"{doc_id}/{file.filename}",
    }).execute()
    
    await process_document(contents, doc_id)
    
    return {"doc_id": doc_id, "filename": file.filename, "status": "processed"}

