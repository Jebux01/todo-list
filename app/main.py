"""
Main module for the FastAPI application.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.v1.endpoints import router as v1_router


app = FastAPI(
    title="TODO List",
    description="A simple TODO list API",
    version="0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
)

app.include_router(v1_router, prefix="/v1/tasks", tags=["Tasks"])
