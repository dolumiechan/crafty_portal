from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import List

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72) 

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    pass

class CommentOut(CommentBase):
    id: int
    user_id: int
    work_id: int
    author_username: str | None = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
    
class WorkBase(BaseModel):
    title: str
    description: str | None = None

class WorkCreate(WorkBase):
    pass

class WorkOut(WorkBase):
    id: int
    user_id: int
    image_path: str | None = None
    author_username: str | None = None 
    comments: List[CommentOut] = []
    model_config = ConfigDict(from_attributes=True)

class ReactionOut(BaseModel):
    user_id: int
    work_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)