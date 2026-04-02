import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.orm import sessionmaker
DATABASE_URL = "postgresql://postgres:5478@localhost:5432/crafts_portal"

engine = create_engine(DATABASE_URL)

Sessionlocal = sessionmaker(
    autocommit = False,
    autoflush = False,
    bind = engine
)

Base = declarative_base()

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally: db.close()