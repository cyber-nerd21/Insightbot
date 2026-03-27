from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware   # 👈 ADD THIS

from routes.upload import router as upload_router
from routes.documents import router as documents_router
from routes.chat import router as chat_router
from routes.summary import router as summary_router
from routes.quiz import router as quiz_router

app = FastAPI()

# 👇 ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes
app.include_router(upload_router)
app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(summary_router)
app.include_router(quiz_router)