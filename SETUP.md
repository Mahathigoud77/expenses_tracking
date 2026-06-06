# Smart Expense Tracker - Setup & Installation Guide

This guide covers all the packages and dependencies needed to run the Smart Expense Tracker project (both frontend and backend).

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Project](#running-the-project)
5. [Environment Configuration](#environment-configuration)

---

## System Requirements

- **Node.js**: v18+ (for frontend)
- **Python**: v3.10+ (for backend)
- **npm**: v8+ (frontend package manager)
- **pip**: Python package manager (comes with Python)
- **Git**: Version control (optional but recommended)

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create a Python Virtual Environment (Optional but Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Backend Dependencies

The backend uses FastAPI with SQLAlchemy. All dependencies are listed in `pyproject.toml`.

**Install dependencies:**
```bash
pip install -e .
```

Or install manually:
```bash
pip install \
  fastapi>=0.100 \
  uvicorn[standard]>=0.20 \
  SQLAlchemy>=2.0 \
  psycopg2-binary>=2.9 \
  pydantic-settings>=2.0 \
  python-jose[cryptography]>=3.3 \
  passlib[bcrypt]>=1.7 \
  alembic>=1.11 \
  python-multipart>=0.0.9
```

### 4. Backend Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | >=0.100 | Web framework |
| uvicorn | >=0.20 | ASGI server |
| SQLAlchemy | >=2.0 | ORM for database |
| psycopg2-binary | >=2.9 | PostgreSQL adapter |
| pydantic-settings | >=2.0 | Configuration management |
| python-jose | >=3.3 | JWT token handling |
| passlib | >=1.7 | Password hashing |
| alembic | >=1.11 | Database migrations |
| python-multipart | >=0.0.9 | Form data parsing |

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Frontend Dependencies

**Using npm:**
```bash
npm install
```

### 3. Frontend Dependencies Overview

**Production Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI library |
| react-dom | ^18.3.1 | React DOM rendering |
| react-router-dom | ^6.26.2 | Client-side routing |
| @mui/material | ^9.0.1 | Material Design components |
| @mui/icons-material | ^9.0.1 | Material Design icons |
| @emotion/react | ^11.14.0 | CSS-in-JS library (MUI dependency) |
| @emotion/styled | ^11.14.1 | Styled components (MUI dependency) |
| react-hook-form | ^7.77.0 | Form state management |
| @hookform/resolvers | ^5.4.0 | Form validation |
| zod | ^4.4.3 | Schema validation |
| axios | ^1.7.2 | HTTP client |
| recharts | ^3.8.1 | Charts library |
| jspdf | ^2.5.1 | PDF export |
| xlsx | ^0.18.5 | Excel export |

**Development Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^5.4.2 | Build tool |
| @vitejs/plugin-react | ^4.3.1 | React plugin for Vite |
| typescript | ^5.6.3 | TypeScript compiler |
| @types/react | ^18.3.3 | React type definitions |
| @types/react-dom | ^18.3.0 | React DOM type definitions |
| @types/react-router-dom | ^5.3.3 | React Router type definitions |

---

## Running the Project

### Backend

1. **Ensure you're in the backend directory:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment (if using one):**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload
   ```

   The backend will run on: `http://localhost:8000`
   
   API documentation available at: `http://localhost:8000/docs`

### Frontend

1. **In a new terminal, navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on: `http://localhost:5173` (or the port shown in terminal)

3. **Build for production (optional):**
   ```bash
   npm run build
   ```

---

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL=sqlite:///./test.db

# JWT Secret (change in production)
SECRET_KEY=your-secret-key-here

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Environment Variables

The frontend uses `http://localhost:8000` as the default API base URL. This can be modified in:
- `frontend/src/services/api.ts`: Change the `apiBase` constant

---

## Quick Start Checklist

- [ ] Python 3.10+ installed
- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed (`pip install -e .`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend running on `http://localhost:8000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Can access backend docs at `http://localhost:8000/docs`
- [ ] Can login/register in the frontend

---

## Troubleshooting

### Backend Issues

**Issue: `ModuleNotFoundError: No module named 'fastapi'`**
- Solution: Ensure virtual environment is activated and dependencies are installed

**Issue: `Port 8000 already in use`**
- Solution: Change port with: `uvicorn app.main:app --reload --port 8001`

### Frontend Issues

**Issue: `npm command not found`**
- Solution: Ensure Node.js and npm are installed globally

**Issue: `Cannot GET /`**
- Solution: Ensure frontend is running and backend is accessible

---

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)

---

## Support

For issues or questions, refer to the project README.md or check the API documentation at `http://localhost:8000/docs`
