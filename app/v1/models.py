"""
This file contains the models for the application.
"""

from uuid import uuid4

from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID

from app.db import BASE

class Task(BASE):
    """
    Task model

    Attributes:
        id (UUID): A unique identifier for the task
        title (str): The title of the task
        description (str): The description of the task
        created_at (str): The date and time the task was created
        updated_at (str): The date and time the task was last updated
        deleted_at (str): The date and time the task was deleted
        status (str): The status of the
    """
    __tablename__ = "tasks"
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        default=uuid4,
    )
    title = Column(String, index=True, nullable=False)
    description = Column(String, index=True, nullable=False)
    created_at = Column(String, index=True, nullable=False)
    updated_at = Column(String, index=True)
    deleted_at = Column(String, index=True)
    status = Column(String, index=True, nullable=False)
