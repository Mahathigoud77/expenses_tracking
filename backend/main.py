# Backward-compatible entrypoint. Prefer `backend.app.main:app`.
from backend.app.main import app  # noqa: F401


