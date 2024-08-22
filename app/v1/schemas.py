"""
Module contains the Schema for the Task Model
"""

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID


from pydantic import BaseModel


class Status(Enum):
    pending = "pending"
    completed = "completed"
    deleted = "deleted"

class TaskBase(BaseModel):
    title: str
    description: str
    created_at: str | datetime
    updated_at: str | datetime
    status: str


class Task(TaskBase):
    deleted_at: Optional[str | datetime] = None


class TaskDB(Task):
    id: UUID


class TaskUpdate(BaseModel):
    title: str
    description: str
    updated_at: str | datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")


class TaskCreate(TaskBase):
    created_at: str | datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    updated_at: str | datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    status: str = Status.pending.value


class TaskDelete(BaseModel):
    deleted_at: str | datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    status: str = Status.deleted.value


class ResponseUpdate(BaseModel):
    message: str
    result: Optional[int] = None

class ResponseDelete(ResponseUpdate):
    message: str