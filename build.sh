#!/bin/bash
# Build script for Render deployment

# Install Python dependencies
pip install -r backend/requirements.txt

# Run database migrations
cd backend
alembic upgrade head
