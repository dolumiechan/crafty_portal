import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .api import auth, works
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Crafty Portal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "static/uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Example: http://127.0.0.1:8000/static/uploads/filename.jpg
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router)
app.include_router(works.router)

@app.get("/")
def home():
    return {"status": "Server is running", "docs": "/docs"}