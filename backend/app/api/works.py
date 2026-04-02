import os
import shutil
from uuid import uuid4
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas, crud, models
from .deps import get_current_user

router = APIRouter(prefix="/works", tags=["Works"])

@router.post("/", response_model=schemas.WorkOut)
def create_work(
    title: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    UPLOAD_DIR = "static/uploads"
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename).replace("\\", "/")

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception:
        raise HTTPException(status_code=500, detail="Could not save file")

    work_data = schemas.WorkCreate(title=title, description=description)
    return crud.create_user_work(
        db=db, 
        work=work_data, 
        user_id=current_user.id, 
        image_path=file_path
    )

@router.get("/", response_model=List[schemas.WorkOut])
def read_works(db: Session = Depends(get_db)):
    return crud.get_works(db)

@router.post("/{work_id}/comments", response_model=schemas.CommentOut)
def add_comment(
    work_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_comment(db, comment, user_id=current_user.id, work_id=work_id)

@router.post("/{work_id}/like")
def like_work(
    work_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.toggle_reaction(db, user_id=current_user.id, work_id=work_id)

@router.get("/{work_id}", response_model=schemas.WorkOut)
def read_work(work_id: int, db: Session = Depends(get_db)):
    work = db.query(models.Work).filter(models.Work.id == work_id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    
    work.author_username = work.author.username
    
    for comment in work.comments:
        comment.author_username = comment.author.username
        
    return work

@router.delete("/{work_id}")
def delete_work(
    work_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    work = db.query(models.Work).filter(models.Work.id == work_id).first()
    
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    
    if work.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this work")

    if work.image_path and os.path.exists(work.image_path):
        os.remove(work.image_path)

    db.delete(work)
    db.commit()
    return {"message": "Work deleted successfully"}