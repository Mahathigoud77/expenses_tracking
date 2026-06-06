from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.v1.router import api_router
from app.db.base import Base
from app.db.session import engine

app = FastAPI(title="Smart Expense Tracking System", version="0.1.0")


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)
    with engine.begin() as conn:
        for column_stmt in [
            "ALTER TABLE users ADD COLUMN full_name VARCHAR(255)",
            "ALTER TABLE users ADD COLUMN phone_number VARCHAR(32)",
        ]:
            try:
                conn.execute(text(column_stmt))
            except Exception:
                pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "ok"}

