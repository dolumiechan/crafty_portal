from sqlalchemy.orm import Session
from . import models, schemas
from .core import security

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.hash_password(user.password)
    
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_user_work(db: Session, work: schemas.WorkCreate, user_id: int, image_path: str = None):
    db_work = models.Work(**work.model_dump(), user_id=user_id, image_path=image_path)
    db.add(db_work)
    db.commit()
    db.refresh(db_work)
    return db_work

def get_works(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Work).offset(skip).limit(limit).all()

def create_comment(db: Session, comment: schemas.CommentCreate, user_id: int, work_id: int):
    db_comment = models.Comment(**comment.model_dump(), user_id=user_id, work_id=work_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def toggle_reaction(db: Session, user_id: int, work_id: int):
    existing = db.query(models.Reaction).filter(
        models.Reaction.user_id == user_id, 
        models.Reaction.work_id == work_id
    ).first()
    
    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "removed"}
    
    new_reaction = models.Reaction(user_id=user_id, work_id=work_id)
    db.add(new_reaction)
    db.commit()
    return {"status": "added"}

def get_works(db: Session, skip: int = 0, limit: int = 100):
    works = db.query(models.Work).offset(skip).limit(limit).all()
    for work in works:
        work.author_username = work.author.username
    return works