"""
This module contains the endpoints for the API.
"""

from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db import get_db, save
from app.v1.models import Task
from app.v1.schemas import (
    ResponseDelete,
    ResponseUpdate,
    TaskCreate,
    TaskDB,
    TaskUpdate,
)

router = APIRouter()


NOT_FOUND = "Task not found"


@router.get("/{state}")
def get_all_pending_tasks(state: str, db=Depends(get_db)) -> List[TaskDB]:
    """
    Get all pending tasks

    if state is "all" return all tasks

    Args:
        state (str): The state of the task to get

    Returns:
        List[TaskDB]: A list of tasks
    """
    if state == "all":
        tasks = db.query(Task).all()
        return tasks

    tasks = db.query(Task).filter(Task.status == state).all()
    return tasks


@router.get("/{id}")
def get_task_by_id(id: str, db=Depends(get_db)) -> TaskDB:
    """
    Get a task by its ID

    Args:
        id (str): The ID of the task

    Returns:
        TaskDB: The task
    """
    task = db.query(Task).filter(Task.id == id).first()

    if not task:
        raise HTTPException(status_code=404, detail=NOT_FOUND)

    return task


@router.post("/")
def create_task(task: TaskCreate, db=Depends(get_db)) -> TaskDB:
    """
    Create a new task

    Args:
        task (TaskCreate): The task to create

    Returns:
        TaskDB: The created task
    """
    model = Task(**task.model_dump())
    result = save(model, db=db)
    return result  # type: ignore


@router.put("/{id}")
def update_task(id: str, task_update: TaskUpdate, db=Depends(get_db)) -> ResponseUpdate:
    """
    Update a task

    Args:
        id (str): The ID of the task
        task_update (TaskUpdate): The task to update

    Returns:
        ResponseUpdate: The response
    """
    task_db = db.query(Task).filter(Task.id == id).first()

    if not task_db:
        raise HTTPException(status_code=404, detail=NOT_FOUND)

    result = db.query(Task).filter(Task.id == id).update(task_update.model_dump())
    db.commit()
    return ResponseUpdate(message="Task updated successfully", result=result)


@router.patch("/success/{id}")
def patch_task(id: str, db=Depends(get_db)) -> ResponseUpdate:
    """
    Patch a task

    Args:
        id (str): The ID of the task
        db (Session): The database session

    Returns:
        ResponseUpdate: The response message
    """
    task_db = db.query(Task).filter(Task.id == id).first()

    if not task_db:
        raise HTTPException(status_code=404, detail=NOT_FOUND)

    result = db.query(Task).filter(Task.id == id).update({"status": "success"})
    db.commit()
    return ResponseUpdate(message="Task updated successfully", result=result)


@router.delete("/{id}")
def delete_task(id: str, db=Depends(get_db)) -> ResponseDelete:
    """
    Delete a task

    Args:
        id (str): The ID of the task
        db (Session): The database session

    Returns:
        ResponseDelete: The response message
    """
    task_db = db.query(Task).filter(Task.id == id).first()

    if not task_db:
        raise HTTPException(status_code=404, detail=NOT_FOUND)

    db.query(Task).filter(Task.id == id).update(
        {
            "status": "deleted",
            "deleted_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
    )
    db.commit()
    return ResponseDelete(message="Task deleted successfully")
