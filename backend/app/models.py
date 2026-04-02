from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    works = relationship("Work", back_populates="author")

class Work(Base):
    __tablename__ = "works"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    image_path = Column(String(500))
    created_at = Column(TIMESTAMP, server_default=func.now())

    author = relationship("User", back_populates="works")
    comments = relationship("Comment", back_populates="work")
    reactions = relationship("Reaction", back_populates="work")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    work_id = Column(Integer, ForeignKey("works.id", ondelete="CASCADE"), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    work = relationship("Work", back_populates="comments")
    author = relationship("User")

class Reaction(Base):
    __tablename__ = "reactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    work_id = Column(Integer, ForeignKey("works.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    work = relationship("Work", back_populates="reactions")
    
    __table_args__ = (UniqueConstraint('user_id', 'work_id', name='_user_work_uc'),)