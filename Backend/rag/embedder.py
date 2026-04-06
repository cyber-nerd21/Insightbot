from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
)

def get_embeddings(text: str) -> list:
    response = client.models.embed_content(
        model="text-embedding-004",  # ← removed "models/" prefix
        contents=text
    )
    return response.embeddings[0].values