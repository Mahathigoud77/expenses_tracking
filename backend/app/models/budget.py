from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String

from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base



class MonthlyBudget(Base):
    __tablename__ = "monthly_budgets"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)

    # Use first day of month as canonical value
    month: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)

    amount: Mapped[float] = mapped_column(Float, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

