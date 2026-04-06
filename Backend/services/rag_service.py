from rag.parser import parse_pdf
from rag.chunker import chunk_text
from rag.embedder import get_embeddings
from services.db import supabase

async def process_document(file_bytes: bytes, doc_id: str):
    # Parse
    text = parse_pdf(file_bytes)
    
    # Chunk
    chunks = chunk_text(text)
    
    # Embed + save one at a time → memory stays low
    for index, chunk in enumerate(chunks):
        embedding = get_embeddings(chunk)
        supabase.table("document_chunks").insert({
            "document_id": doc_id,
            "content": chunk,
            "embedding": embedding,
            "chunk_index": index
        }).execute()
        del embedding  # explicitly free memory

    return {"document_id": doc_id, "chunks_processed": len(chunks)}


async def retrieve_relevant_chunks(query: str, doc_id: str, top_k: int = 5):
    query_embedding = get_embeddings(query)
    response = supabase.rpc("match_chunks", {
        "query_embedding": query_embedding,
        "match_count": top_k,
        "match_document_id": doc_id
    }).execute()

    return [row["content"] for row in response.data] if response.data else []
