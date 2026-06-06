from __future__ import annotations

import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base



class ExpenseCategory(str, enum.Enum):
    food = "food"
    transport = "transport"
    bills = "bills"
    entertainment = "entertainment"
    health = "health"
    shopping = "shopping"
    others = "others"


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)

    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    category: Mapped[ExpenseCategory] = mapped_column(Enum(ExpenseCategory), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)

    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    bill_file_path: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

