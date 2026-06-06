from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database: use local SQLite by default for easier local setup.
    DATABASE_URL: str = "sqlite:///./smart_expenses.db"

    # JWT
    JWT_SECRET_KEY: str = "CHANGE_ME"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # Uploads
    UPLOAD_DIR: str = "./uploads"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

