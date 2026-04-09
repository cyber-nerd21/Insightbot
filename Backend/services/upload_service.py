import uuid
from fastapi import UploadFile
from services.db import supabase
from services.rag_service import process_document

async def upload_service(file: UploadFile, doc_id: str):
    
    # Step 1 - Check if document already exists in storage
    try:
        # Try to get existing file info
        existing = supabase.table("documents") \
            .select("id") \
            .eq("filename", file.filename) \
            .execute()
        
        if existing.data:
            # Document exists, check if chunks already processed
            chunks_exist = supabase.table("document_chunks") \
                .select("id", count="exact") \
                .eq("document_id", existing.data[0]["id"]) \
                .execute()
            
            if chunks_exist.count > 0:
                return {
                    "doc_id": existing.data[0]["id"], 
                    "filename": file.filename, 
                    "status": "already_processed"
                }
    except Exception as e:
        print(f"Error checking existing document: {e}")
    
    # Step 2 - Saving in supabase storage 
    contents = await file.read()
    
    supabase.storage.from_("documents").upload(
        path=f"{doc_id}/{file.filename}",
        file=contents,
        file_options={"content-type": "application/pdf"}
    )
    
    # Step 3 - doc insert inside db
    supabase.table("documents").insert({
        "id": doc_id,
        "filename": file.filename,
        "file_url": f"{doc_id}/{file.filename}",
    }).execute()
    
    # Step 4 - Process document (only if new)
    await process_document(contents, doc_id)
    
    return {"doc_id": doc_id, "filename": file.filename, "status": "processed"}