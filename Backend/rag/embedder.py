from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options={"api_version": "v1beta"}
)

def get_embeddings(text: str) -> list:
    response = client.models.embed_content(
        model="models/text-embedding-004",
        contents=text
    )
    return response.embeddings[0].values