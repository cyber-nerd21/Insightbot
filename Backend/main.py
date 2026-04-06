from dotenv import load_dotenv
load_dotenv()

import logging
logging.basicConfig(level=logging.INFO)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://insightbot-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    from routes.upload import router as upload_router
    from routes.documents import router as documents_router
    from routes.chat import router as chat_router
    from routes.summary import router as summary_router
    from routes.quiz import router as quiz_router

    app.include_router(upload_router)
    app.include_router(documents_router)
    app.include_router(chat_router)
    app.include_router(summary_router)
    app.include_router(quiz_router)

except Exception as e:
    logging.error(f"Failed to import routes: {e}")
    raise