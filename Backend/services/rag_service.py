from rag.parser import parse_pdf
from rag.chunker import chunk_text
from rag.embedder import get_embeddings
from services.db import supabase

# DOCUMENT INGESTION PIPELINE
async def process_document(file_bytes: bytes, doc_id: str):

    # Step 1 — Parse PDF
    text = parse_pdf(file_bytes)

    # Step 2 — Chunk text
    chunks = chunk_text(text)

    rows = []

    # Step 3 — Generate embeddings
    for index, chunk in enumerate(chunks):
        embedding = get_embeddings(chunk)

        rows.append({
            "document_id": doc_id,
            "content": chunk,
            "embedding": embedding,
            "chunk_index": index
        })

    # Step 4 — Batch insert into Supabase
    supabase.table("document_chunks").insert(rows).execute()

    return {
        "document_id": doc_id,
        "chunks_processed": len(chunks)
    }



# RETRIEVAL FUNCTION (RAG)
async def retrieve_relevant_chunks(query: str, doc_id: str, top_k: int = 5):

    # Step 1 — Embed user query
    query_embedding = get_embeddings(query)

    # Step 2 — Vector similarity search
    response = supabase.rpc(
        "match_document_chunks",
        {
            "query_embedding": query_embedding,
            "match_count": top_k,
            "doc_id": doc_id
        }
    ).execute()

    chunks = []

    if response.data:
        for row in response.data:
            chunks.append(row["content"])

    return chunks

