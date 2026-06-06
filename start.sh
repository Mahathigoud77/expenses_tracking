#!/bin/bash
# Start script for Render deployment

cd /opt/render/project/src/backend
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
