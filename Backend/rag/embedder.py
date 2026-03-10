from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embeddings(text: str) -> list:
    embedding = model.encode(text)
    return embedding.tolist()