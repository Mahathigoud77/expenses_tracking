# Smart Expense Tracker - Deployment Guide

## Frontend Deployment (Netlify)

### 1. Environment Variables
Set these in Netlify dashboard under **Build & Deploy > Environment**:

```
VITE_API_BASE=https://your-backend-api.com
```

If your backend and frontend are hosted on the same domain, you can skip this.

### 2. Build Configuration (Already Set)
- **Build command**: `cd frontend && npm install && npm run build`
- **Publish directory**: `frontend/dist`

### 3. Files Required
- ✅ `netlify.toml` - Configured for SPA routing
- ✅ `frontend/_redirects` - Backup SPA redirect rule

### 4. Testing Build Locally

Before deploying:

```bash
cd frontend
npm run build
npm run preview
```

Visit `http://localhost:4173` and verify all routes work.

---

## Backend Deployment (Recommended: Railway, Render, or Heroku)

### 1. Environment Variables to Set
```
DATABASE_URL=your_postgresql_url
SECRET_KEY=your_secret_key
CORS_ORIGINS=https://your-frontend-url.netlify.app
```

### 2. Deployment Steps
```bash
git push to your repository
# Your hosting provider auto-deploys
```

### 3. Database Setup
Run migrations on your hosted database:
```bash
alembic upgrade head
```

---

## Common Deployment Issues & Fixes

### Issue: 404 "Page not found"
- ✅ Fixed with `netlify.toml` and `_redirects`
- ✅ Ensures all routes redirect to `index.html`

### Issue: CORS Errors
- Check `CORS_ORIGINS` in backend matches your deployed URL
- Backend should include frontend URL

### Issue: "Cannot POST /api/..."
- Verify `VITE_API_BASE` points to correct backend URL
- Check backend is running and accessible
- Verify API routes are correctly prefixed with `/api/v1`

### Issue: Blank Page / 500 Error
- Check browser console for errors
- Check network tab for failed API calls
- Verify environment variables are set in Netlify

---

## Recommended Hosting

### Frontend (Netlify)
- Free tier available
- Automatic SSL
- Easy environment variables
- Good for React SPAs

### Backend (Railway or Render)
- Railway: $5/month minimum, great PostgreSQL integration
- Render: Free tier available, easy deployment
- Heroku: Classic option, requires credit card

---

## Quick Checklist Before Deploying

- [ ] `npm run build` works locally without errors
- [ ] Build preview works: `npm run preview`
- [ ] All routes work in preview (no 404s)
- [ ] API calls point to correct backend URL
- [ ] Database is set up and migrated on production
- [ ] Backend CORS includes frontend URL
- [ ] Environment variables are set in Netlify
