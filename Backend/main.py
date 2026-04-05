from dotenv import load_dotenv
load_dotenv()

import logging
logging.basicConfig(level=logging.INFO)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from routes.upload import router as upload_router
    from routes.documents import router as documents_router
    from routes.chat import router as chat_router
    from routes.summary import router as summary_router
    from routes.quiz import router as quiz_router
except Exception as e:
    logging.error(f"Failed to import routes: {e}")
    raise

app = FastAPI()