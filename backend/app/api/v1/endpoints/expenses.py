from __future__ import annotations

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.api.v1.dependencies import get_current_user_id, get_db
from app.models.expense import Expense, ExpenseCategory

router = APIRouter(prefix="/expenses", tags=["expenses"])


class ExpenseCreate(BaseModel):
    amount: int
    category: ExpenseCategory
    description: str | None = None
    occurred_at: datetime | None = None


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create expense")
def create_expense(expense: ExpenseCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    record = Expense(
        user_id=user_id,
        amount=expense.amount,
        category=expense.category,
        description=expense.description,
        occurred_at=expense.occurred_at or datetime.utcnow(),
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
        "bill_file_path": record.bill_file_path,
        "created_at": record.created_at.isoformat() if record.created_at else None,
        "updated_at": record.updated_at.isoformat() if record.updated_at else None,
    }


@router.get("/{expense_id}", summary="Get expense by id")
def get_expense(expense_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    record = db.get(Expense, expense_id)
    if record is None or record.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return {
        "id": record.id,
        "amount": record.amount,
        "category": record.category.value if hasattr(record.category, "value") else str(record.category),
        "description": record.description,
        "occurred_at": record.occurred_at.isoformat() if record.occurred_at else None,
        "bill_file_path": record.bill_file_path,
        "created_at": record.created_at.isoformat() if record.created_at else None,
        "updated_at": record.updated_at.isoformat() if record.updated_at else None,
    }


@router.put("/{expense_id}", summary="Update expense")
def update_expense(expense_id: int, expense: ExpenseCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    record = db.get(Expense, expense_id)
    if record is None or record.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")

    record.amount = expense.amount
    record.category = expense.category
    record.description = expense.description
    record.occurred_at = expense.occurred_at or record.occurred_at or datetime.utcnow()
    record.updated_at = datetime.utcnow()

    db.add(record)
    db.commit()
    db.refresh(record)
    return {
        "id": record.id,
        "amount": record.amount,
        "category": record.category.value if hasattr(record.category, "value") else str(record.category),
        "description": record.description,
        "occurred_at": record.occurred_at.isoformat() if record.occurred_at else None,
        "bill_file_path": record.bill_file_path,
        "created_at": record.created_at.isoformat() if record.created_at else None,
        "updated_at": record.updated_at.isoformat() if record.updated_at else None,
    }


@router.get("", summary="List expenses")
def list_expenses(
    category: Optional[ExpenseCategory] = Query(default=None),
    from_date: Optional[datetime] = Query(default=None, alias="from"),
    to_date: Optional[datetime] = Query(default=None, alias="to"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    filters = [Expense.user_id == user_id]
    if category is not None:
        filters.append(Expense.category == category)
    if from_date is not None:
        filters.append(Expense.occurred_at >= from_date)
    if to_date is not None:
        filters.append(Expense.occurred_at <= to_date)

    stmt = (
        select(Expense)
        .where(and_(*filters))
        .order_by(Expense.occurred_at.desc())
        .limit(limit)
        .offset(offset)
    )

    items = db.execute(stmt).scalars().all()

    # Return lightweight JSON (avoid schema scaffolding until phase-2)
    return [
        {
            "id": e.id,
            "amount": e.amount,
            "category": e.category.value if hasattr(e.category, "value") else str(e.category),
            "description": e.description,
            "occurred_at": e.occurred_at.isoformat() if e.occurred_at else None,
            "bill_file_path": e.bill_file_path,
            "created_at": e.created_at.isoformat() if e.created_at else None,
            "updated_at": e.updated_at.isoformat() if e.updated_at else None,
        }
        for e in items
    ]

