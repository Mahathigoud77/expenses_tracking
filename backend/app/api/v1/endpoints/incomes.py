from __future__ import annotations

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.v1.dependencies import get_current_user_id, get_db
from app.models.income import Income, IncomeCategory

router = APIRouter(prefix="/incomes", tags=["incomes"])


class IncomeCreate(BaseModel):
    amount: int
    category: IncomeCategory
    description: str | None = None
    occurred_at: datetime | None = None


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create income")
def create_income(income: IncomeCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    record = Income(
        user_id=user_id,
        amount=income.amount,
        category=income.category,
        description=income.description,
        occurred_at=income.occurred_at or datetime.utcnow(),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {
        "id": record.id,
        "amount": record.amount,
        "category": record.category.value if hasattr(record.category, "value") else str(record.category),
        "description": record.description,
        "occurred_at": record.occurred_at.isoformat() if record.occurred_at else None,
        "created_at": record.created_at.isoformat() if record.created_at else None,
        "updated_at": record.updated_at.isoformat() if record.updated_at else None,
    }


@router.get("", summary="List incomes")
def list_incomes(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    stmt = (
        select(Income)
        .where(Income.user_id == user_id)
        .order_by(Income.occurred_at.desc())
        .limit(limit)
        .offset(offset)
    )
    items = db.execute(stmt).scalars().all()
    return [
        {
            "id": i.id,
            "amount": i.amount,
            "category": i.category.value if hasattr(i.category, "value") else str(i.category),
            "description": i.description,
            "occurred_at": i.occurred_at.isoformat() if i.occurred_at else None,
            "created_at": i.created_at.isoformat() if i.created_at else None,
            "updated_at": i.updated_at.isoformat() if i.updated_at else None,
        }
        for i in items
    ]
