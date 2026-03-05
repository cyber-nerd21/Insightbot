import uuid 
from fastapi  import APIRouter  , UploadFile ,  File ,  HTTPException 

router = APIRouter()    


MAX_SIZE  =  500 * 1024 * 1024   #500MB 


@router.post("/upload") 
async def upload_pdf (file: UploadFile = File(...)):
    
    #size check 
    contents = await file.read()
    size = len(contents) 
    await file.seek(0)

    if size > MAX_SIZE: 
        raise HTTPException(status_code=400, detail = "File too large max 500MB")
    
    #uuid generate 

    doc_id = str(uuid.uuid4())

    # service call here  

    #  await upload_service(file , doc_id) 


    return  {   

          "doc_id" : doc_id, 
          "file_name": file.filename,
          "status": "uploaded" 
    } 

