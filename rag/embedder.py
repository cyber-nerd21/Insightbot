# embedder.py
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_embeddings(text: str) -> list:
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text
    )
    return response.embeddings[0].values

def get_embeddings_batch(texts: list) -> list:
    all_embeddings = []
    batch_size = 50  # safe limit for Gemini
    
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=batch
        )
        all_embeddings.extend([e.values for e in response.embeddings])
    
    return all_embeddings