# Installation Commands - Copy & Paste Ready

Use these commands to quickly install all dependencies for the Smart Expense Tracker project.

---

## Backend Installation

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment (Recommended)

**Windows PowerShell (safe):**
```bat
python -m venv venv
venv\Scripts\activate
```

> Note: In PowerShell, avoid `&&` one-liners. Run commands line-by-line in the same terminal session.

**macOS/Linux:**
```bash
python3 -m venv venv && source venv/bin/activate
```

### Step 3: Install All Backend Dependencies

**Option A - Using pyproject.toml (Recommended):**
```bash
pip install -e .
```

**Option B - Manual Installation:**
```bash
pip install fastapi uvicorn[standard] SQLAlchemy psycopg2-binary pydantic-settings python-jose[cryptography] passlib[bcrypt] alembic python-multipart
```

**Option C - One Liner (Copy & Paste Directly):**
```bash
pip install fastapi>=0.100 uvicorn[standard]>=0.20 SQLAlchemy>=2.0 psycopg2-binary>=2.9 pydantic-settings>=2.0 python-jose[cryptography]>=3.3 passlib[bcrypt]>=1.7 alembic>=1.11 python-multipart>=0.0.9
```

### Step 4: Verify Backend Installation
```bash
python -c "import fastapi; import sqlalchemy; print('Backend dependencies installed successfully!')"
```

### Step 5: Run Backend Server
```bash
uvicorn app.main:app --reload
```

Backend will be available at: `http://localhost:8000`

---

## Frontend Installation

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install All Frontend Dependencies

**Using npm install (Recommended):**
```bash
npm install
```

### Step 3: Verify Frontend Installation
```bash
npm list
```

### Step 4: Run Frontend Development Server
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Step 5: Build Frontend for Production (Optional)
```bash
npm run build
```

---

## Complete Project Setup (Full Script)

### For Windows Users - Copy and Paste (Use one terminal for activation)

1) Create + activate venv:
```bat
cd backend
python -m venv venv
venv\Scripts\activate
```

2) Install backend deps:
```bat
pip install fastapi>=0.100 uvicorn[standard]>=0.20 SQLAlchemy>=2.0 psycopg2-binary>=2.9 pydantic-settings>=2.0 python-jose[cryptography]>=3.3 passlib[bcrypt]>=1.7 alembic>=1.11 python-multipart>=0.0.9
```

3) Install frontend deps (new folder, same terminal is fine):
```bat
cd ..\frontend
npm install
```

### For macOS/Linux Users - Copy and Paste All At Once:

```bash
cd backend && python3 -m venv venv && source venv/bin/activate && pip install fastapi>=0.100 uvicorn[standard]>=0.20 SQLAlchemy>=2.0 psycopg2-binary>=2.9 pydantic-settings>=2.0 python-jose[cryptography]>=3.3 passlib[bcrypt]>=1.7 alembic>=1.11 python-multipart>=0.0.9 && cd ../frontend && npm install
```

---

## Running Both Servers

### Terminal 1 - Backend:
```bash
cd backend && source venv/bin/activate && uvicorn app.main:app --reload
```

Or on Windows:
```bash
cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
```

### Terminal 2 - Frontend:
```bash
cd frontend && npm run dev
```

---

## Quick Reference Commands

### Backend - Only Essential Commands

**Install Backend:**
```bash
cd backend && pip install -e .
```

**Activate Virtual Environment (Windows):**
```bash
venv\Scripts\activate
```

**Activate Virtual Environment (macOS/Linux):**
```bash
source venv/bin/activate
```

**Run Backend:**
```bash
uvicorn app.main:app --reload
```

**Deactivate Virtual Environment:**
```bash
deactivate
```

### Frontend - Only Essential Commands

**Install Frontend:**
```bash
cd frontend && npm install
```

**Run Frontend:**
```bash
cd frontend && npm run dev
```

**Build Frontend:**
```bash
cd frontend && npm run build
```

---

## Package Lists for Copy & Paste

### Backend Packages (for manual pip install):
```
fastapi>=0.100
uvicorn[standard]>=0.20
SQLAlchemy>=2.0
psycopg2-binary>=2.9
pydantic-settings>=2.0
python-jose[cryptography]>=3.3
passlib[bcrypt]>=1.7
alembic>=1.11
python-multipart>=0.0.9
```

### Frontend Packages (automatically installed with npm install):
```
@emotion/react @emotion/styled @hookform/resolvers @mui/icons-material @mui/material axios react react-dom react-hook-form react-router-dom recharts jspdf xlsx zod
```

---

## Troubleshooting Install Commands

### If pip install fails:
```bash
pip install --upgrade pip
```

Then retry the installation command.

### If npm install fails:
```bash
npm cache clean --force && npm install
```

### Check versions installed:
```bash
pip list
npm list
```

---

## URLs After Running

- **Backend API:** `http://localhost:8000`
- **Backend Docs:** `http://localhost:8000/docs`
- **Frontend:** `http://localhost:5173`
