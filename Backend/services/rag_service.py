# rag_service.py
from rag.parser import parse_pdf
from rag.chunker import chunk_text
from rag.embedder import get_embeddings, get_embeddings_batch
from services.db import supabase

async def process_document(file_bytes: bytes, doc_id: str):
    text = parse_pdf(file_bytes)
    text = text.replacec('\x00', '') 
    chunks = chunk_text(text)
    
    embeddings = get_embeddings_batch(chunks)
    
    for index, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        supabase.table("document_chunks").insert({
            "document_id": doc_id,
            "content": chunk,
            "embedding": embedding,
            "chunk_index": index
        }).execute()

    return {"document_id": doc_id, "chunks_processed": len(chunks)}

async def retrieve_relevant_chunks(query: str, doc_id: str, top_k: int = 5):
    query_embedding = get_embeddings(query)
    response = supabase.rpc("match_chunks", {
        "query_embedding": query_embedding,
        "match_count": top_k,
        "match_document_id": doc_id
    }).execute()

    return [row["content"] for row in response.data] if response.data else []