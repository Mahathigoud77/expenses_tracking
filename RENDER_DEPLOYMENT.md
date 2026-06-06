# Render.io Deployment Guide

## What Are Build & Start Commands?

### **Build Command**
Runs **once** when you deploy or redeploy. It:
- Installs dependencies
- Runs database migrations
- Prepares your app for running

**For your backend**:
```bash
pip install -r backend/requirements.txt
```
Then database migrations run automatically.

### **Start Command**
Runs **every time** the app starts/restarts. It:
- Starts your server
- Listens for incoming requests
- Keeps the app running

**For your backend**:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## Deployment Options on Render

### **Option 1: Using render.yaml (Recommended)**
Deploy both frontend and backend from one file.

**Steps:**
1. Push code to GitHub with `render.yaml`
2. Go to [render.com](https://render.com)
3. Click "New +" → "Blueprint"
4. Connect your GitHub repo
5. Render reads `render.yaml` and deploys both services

✅ **File created**: `render.yaml`

### **Option 2: Manual Deploy on Render Dashboard**

**For Backend:**
1. Go to Render Dashboard → New Web Service
2. Connect GitHub repo
3. Set configuration:
   - **Name**: `smart-expense-tracker-backend`
   - **Runtime**: Python 3.10+
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Working Directory**: `backend`
   - **Plan**: Free (starter recommended)

4. Add Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SECRET_KEY`: Generate a secure key

5. Deploy!

**For Frontend:**
1. New Static Site
2. Connect GitHub repo
3. Set configuration:
   - **Name**: `smart-expense-tracker-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variables:
   - `VITE_API_BASE`: `https://your-backend-url.onrender.com`

5. Deploy!

---

## Files Needed for Render

### **Backend (`backend/requirements.txt`)**
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

### **Build Script (`build.sh`)**
```bash
#!/bin/bash
pip install -r backend/requirements.txt
cd backend
alembic upgrade head
```

### **Render Config (`render.yaml`)**
Defines both backend and frontend deployment configuration.

---

## Step-by-Step Deployment to Render

### **Step 1: Prepare Your Project**

```bash
# Ensure files exist:
# ✓ backend/requirements.txt
# ✓ build.sh
# ✓ render.yaml
# ✓ .gitignore (with node_modules, venv, etc.)
# ✓ netlify.toml or render.yaml for frontend routing
```

### **Step 2: Push to GitHub**

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### **Step 3: Create PostgreSQL Database**

Option A: Use Render's free PostgreSQL
1. On Render → New PostgreSQL
2. Create database
3. Copy connection string

Option B: Use external service
- Railway.app
- Supabase
- ElephantSQL

### **Step 4: Deploy via render.yaml**

```bash
# Option 1: Use Blueprint (Recommended)
1. Go to render.com
2. New → Blueprint
3. Connect GitHub
4. Select your repo
5. Render auto-deploys both services

# Option 2: Deploy manually
1. Backend: New Web Service
2. Frontend: New Static Site
3. Configure each separately
```

### **Step 5: Set Environment Variables**

**On Render Dashboard → Your Service → Environment:**

```
DATABASE_URL=postgresql://user:password@host:5432/db
SECRET_KEY=your-secret-key-here-min-32-chars
CORS_ORIGINS=https://your-frontend.onrender.com
```

### **Step 6: Deploy & Test**

1. Click "Manual Deploy" or push to git
2. Wait for build to complete ⏳
3. Check logs for errors
4. Visit your frontend URL
5. Test login and API calls

---

## Environment Variables Explained

### **Backend (.env)**
```
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://your-frontend-url.onrender.com
DEBUG=false  # Set to true only for debugging
```

### **Frontend (.env.local)**
```
VITE_API_BASE=https://your-backend.onrender.com
```

---

## Common Build/Start Issues

### **Build fails: "ModuleNotFoundError"**
- ❌ Problem: `requirements.txt` is missing or incomplete
- ✅ Solution: Ensure `backend/requirements.txt` exists and has all packages

### **App won't start: "Port already in use"**
- ❌ Problem: Not using `$PORT` environment variable
- ✅ Solution: Use `--port $PORT` in start command

### **Database connection fails**
- ❌ Problem: `DATABASE_URL` not set
- ✅ Solution: Set `DATABASE_URL` in Environment Variables

### **Build takes forever or times out**
- ❌ Problem: Building frontend during backend build
- ✅ Solution: Deploy frontend and backend separately or use render.yaml

### **404 errors in frontend**
- ❌ Problem: No `_redirects` file
- ✅ Solution: Add redirect rules for SPA routing

---

## Quick Reference: Commands

| Component | Build Command | Start Command |
|-----------|--------------|----------------|
| **Backend** | `pip install -r requirements.txt && alembic upgrade head` | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Frontend** | `npm install && npm run build` | (Static site, no start needed) |

---

## Recommended Render Plan

- **Free Plan**: Great for development/learning
  - 0.5 CPU, 512 MB RAM
  - 750 hours/month
  - Falls asleep after 15 min inactivity

- **Starter Plan**: For small production apps
  - 0.5 CPU, 512 MB RAM
  - Always on
  - $7/month

- **Growing Plan**: For scaling
  - 1 CPU, 2 GB RAM
  - $19/month

**Recommendation**: Start with Free, upgrade to Starter when app goes live.

---

## Alternative: Deploy Backend Separately

If you want backend on Render and frontend on Netlify:

### **Backend (Render)**
```
Build: pip install -r requirements.txt
Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### **Frontend (Netlify)**
```
Build: cd frontend && npm install && npm run build
Publish: frontend/dist
Environment: VITE_API_BASE=https://your-backend.onrender.com
```

This is often better because:
- Netlify excels at frontend deployment
- Render excels at backend deployment
- Each scales independently
- Easier to update one without affecting the other

---

## Testing Your Deployment

1. **Frontend loads**
   - Visit `https://your-app.onrender.com`
   - Should NOT show 404

2. **Can navigate**
   - Click through pages
   - No 404 errors

3. **API works**
   - Open DevTools → Network
   - Perform action (login, add expense)
   - Check API call succeeds (200 status)

4. **Database works**
   - Try creating an expense
   - Check if it persists after refresh

5. **Authorization works**
   - Logout and try accessing protected pages
   - Should redirect to login

---

## Support Links

- Render Docs: https://render.com/docs
- Render Discord: https://discord.gg/render
- FastAPI on Render: https://render.com/docs/deploy-fastapi
- Static Sites: https://render.com/docs/static-site-deploy
