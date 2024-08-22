"""
This module contains the database configuration and helper functions
"""

from typing import Generator, Mapping, Optional, Type
from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy import URL, Engine, MetaData, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
import os


def _create_engine() -> Engine:
    """
    Create a SQLAlchemy engine using the environment variables

    Returns:
        Engine: A SQLAlchemy engine
    """

    def get_env_variables() -> Mapping:
        """
        Get the environment variables

        Returns:
            Mapping: A mapping of the environment variables
        """
        return {
            "username": os.getenv("DB_USER"),
            "password": os.getenv("DB_PASSWORD"),
            "host": os.getenv("DB_HOST"),
            "database": os.getenv("DB_NAME"),
        }

    def generate_url() -> URL:
        """
        Generate a URL for the SQLAlchemy engine

        Returns:
            URL: A URL object
        """
        return URL.create(drivername="postgresql", **get_env_variables())

    return create_engine(generate_url())


METADATA = MetaData(schema=os.environ.get("DB_SCHEMA", "todo"))
ENGINE = _create_engine()
SESSION_LOCAL = sessionmaker(autocommit=False, autoflush=False, bind=ENGINE)
BASE = declarative_base(metadata=METADATA)


def get_db() -> Generator:
    """
    Get a database session

    Yields:
        Generator: A database session
    """
    db = SESSION_LOCAL()
    try:
        yield db
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()


def save(model: BaseModel, db: Session) -> BaseModel:
    """
    Save a model to the database

    Args:
        model (BaseModel): The model to save
        db (Session): The database session

    Returns:
        BaseModel: The saved model
    """
    db.add(model)
    db.commit()
    db.refresh(model)
    return model
