from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.api.v1.endpoints.expenses import router as expenses_router
from app.api.v1.endpoints.incomes import router as incomes_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(expenses_router)
api_router.include_router(incomes_router)



