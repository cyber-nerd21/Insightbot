from fastapi import APIRouter , HTTPException

router = APIRouter(prefix = ("/documents"))

@router.get("")
async def list_documents(): 

    return { " " : [] } 


@router.get("/{doc_id}") 
async def  get_document(): 
    return { " " : [] } 


@router.delete("/{doc_id}")
async def delete_document(): 
    return {"" : [] } 

