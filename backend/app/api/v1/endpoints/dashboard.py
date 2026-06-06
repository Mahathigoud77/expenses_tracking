from __future__ import annotations

from datetime import datetime, date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session

from app.models.budget import MonthlyBudget
from app.models.expense import Expense
from app.models.income import Income
from app.api.v1.dependencies import get_current_user_id, get_db

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def parse_month_to_date(month: str) -> date:
    # month format: YYYY-MM
    try:
        return datetime.strptime(month, "%Y-%m").date().replace(day=1)
    except ValueError:
        raise HTTPException(status_code=400, detail="month must be in format YYYY-MM")


@router.get("/summary")
def dashboard_summary(
    month: Optional[str] = Query(default=None, description="Month in format YYYY-MM. Defaults to current month."),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    today = datetime.utcnow().date()

    if month is None:
        month_date = today.replace(day=1)
    else:
        month_date = parse_month_to_date(month)

    # Range: [month_date, next_month_date)
    if month_date.month == 12:
        next_month_date = month_date.replace(year=month_date.year + 1, month=1)
    else:
        next_month_date = month_date.replace(month=month_date.month + 1)

    # Income totals
    income_stmt = (
        select(func.coalesce(func.sum(Income.amount), 0))
        .where(
            and_(
                Income.user_id == user_id,
                Income.occurred_at >= month_date,
                Income.occurred_at < next_month_date,
            )
        )
    )

    income_total = db.execute(income_stmt).scalar_one()

    # Expense totals
    expense_stmt = (
        select(func.coalesce(func.sum(Expense.amount), 0))
        .where(
            and_(
                Expense.user_id == user_id,
                Expense.occurred_at >= month_date,
                Expense.occurred_at < next_month_date,
            )
        )
    )

    expense_total = db.execute(expense_stmt).scalar_one()

    remaining_balance = int(income_total) - int(expense_total)

    # Monthly budget (latest row for that month, regardless of category)
    budget_stmt = (
        select(MonthlyBudget.amount)
        .where(
            and_(
                MonthlyBudget.user_id == user_id,
                MonthlyBudget.month == month_date,
            )
        )
        .order_by(MonthlyBudget.created_at.desc())
        .limit(1)
    )
    monthly_budget = db.execute(budget_stmt).scalar_one_or_none()

    spent_pct: Optional[float] = None
    if monthly_budget is not None and float(monthly_budget) > 0:
        spent_pct = round((int(expense_total) / float(monthly_budget)) * 100, 2)

    return {
        "month": month_date.isoformat(),
        "total_income": int(income_total),
        "total_expenses": int(expense_total),
        "remaining_balance": remaining_balance,
        "monthly_budget": float(monthly_budget) if monthly_budget is not None else None,
        "spent_pct": spent_pct,
    }

