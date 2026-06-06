from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import SessionLocal
from app.models.user import User
from app.api.v1.dependencies import get_current_user_id
from app.schemas.token import LoginResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str | None = None
    phone_number: str | None = None
    role: str = "user"


class UpdateProfileRequest(BaseModel):
    full_name: str | None = None
    phone_number: str | None = None


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.execute(select(User).where(User.email == request.email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=request.email,
        hashed_password=hash_password(request.password),
        full_name=request.full_name,
        phone_number=request.phone_number,
        role=request.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=str(user.id), role=user.role.value)
    return LoginResponse(
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        role=user.role.value,
        access_token=token,
    )


@router.get("/me", response_model=UserResponse)
def get_current_user(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        role=user.role.value,
    )


@router.put("/me", response_model=UserResponse)
def update_profile(
    request: UpdateProfileRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if request.full_name is not None:
        user.full_name = request.full_name
    if request.phone_number is not None:
        user.phone_number = request.phone_number

    db.commit()
    db.refresh(user)

    return UserResponse(
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        role=user.role.value,
    )


@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)):
    existing_user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if existing_user:
        return {"message": "Password reset instructions sent if the email is registered."}
    return {"message": "Password reset instructions sent if the email is registered."}


@router.post("/login", response_model=LoginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = form_data.username
    password = form_data.password

    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(subject=str(user.id), role=user.role.value)
    return LoginResponse(
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        role=user.role.value,
        access_token=token,
    )

