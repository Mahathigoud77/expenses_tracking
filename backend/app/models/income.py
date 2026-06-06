from __future__ import annotations

import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base



class IncomeCategory(str, enum.Enum):
    salary = "salary"
    freelance = "freelance"
    investments = "investments"
    rent = "rent"
    others = "others"


class Income(Base):
    __tablename__ = "incomes"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)

    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    category: Mapped[IncomeCategory] = mapped_column(Enum(IncomeCategory), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)

    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

