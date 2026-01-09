# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Backend deployed (Railway/Heroku/etc.)

---

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
cd /home/jerytom33/Downloads/shopify-whatsapp-bridge
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Production ready"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/shopify-whatsapp-bridge.git

# Push
git push -u origin main
```

### 2. Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/new
   - Sign in with GitHub

2. **Import Repository**
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
   
   Replace `your-backend.railway.app` with your actual backend URL.

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-app.vercel.app`

---

## 3. Deploy Backend to Railway

### Option 1: Railway (Recommended)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend Service**
   - Click "Add Service"
   - Select "GitHub Repo"
   - Root Directory: `backend`
   - Start Command: `npm start`

4. **Add PostgreSQL Database**
   - Click "New"
   - Select "Database"
   - Choose "PostgreSQL"
   - Railway auto-sets `DATABASE_URL`

5. **Add Environment Variables**
   
   Go to your service → Variables → Add:
   
   ```bash
   PORT=3000
   NODE_ENV=production
   LOG_LEVEL=info
   FRONTEND_URL=https://your-app.vercel.app
   ENABLE_CORS=true
   
   # Generate these securely!
   ENCRYPTION_KEY=<run: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))">
   JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   ```

6. **Run Database Migration**
   - In Railway dashboard → Service → Settings
   - Add custom start command:
     ```
     npx prisma migrate deploy && npm start
     ```
   - Or use Railway CLI:
     ```bash
     railway run npx prisma migrate deploy
     ```

7. **Get Your Backend URL**
   - Railway provides: `https://your-service.railway.app`
   - Copy this URL

8. **Update Vercel Environment Variable**
   - Go back to Vercel
   - Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` with your Railway URL
   - Redeploy

---

## 4. Verify Deployment

### Check Frontend
1. Visit your Vercel URL
2. Navigate through pages:
   - Home → Should load
   - Documentation → Should display
   - Help → Should work
   - Dashboard → Should show placeholders
   - Settings → Should display forms

### Check Backend
1. Visit `https://your-backend.railway.app/health`
2. Should return:
   ```json
   {
     "status": "healthy",
     "uptime": 123,
     "timestamp": "...",
     "version": "1.0.0",
     "environment": "production"
   }
   ```

### Check Database
```bash
# Using Railway CLI
railway connect postgres
# Or use Prisma Studio
npx prisma studio
```

---

## 5. Post-Deployment Setup

### Create First User
Option 1: Build auth pages (recommended)
Option 2: Use Prisma Studio to insert manually
Option 3: Create seed script

### Test Webhook Flow
1. Go to Settings page
2. Configure your credentials
3. Copy webhook URL
4. Add to Shopify
5. Test with real order

---

## 🔒 Security Checklist

- [ ] Generated new `ENCRYPTION_KEY` (32 characters)
- [ ] Generated new `JWT_SECRET` (64 characters)
- [ ] Set `NODE_ENV=production`
- [ ] Enabled CORS with correct frontend URL
- [ ] Database has SSL enabled
- [ ] Shopify webhook secret configured
- [ ] AOC API key is valid and active
- [ ] All `.env` files in `.gitignore`

---

## 🐛 Common Issues

### "This site can't be reached"
- Check backend is deployed and running
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Ensure CORS is enabled with correct origin

### "Database connection failed"
- Check `DATABASE_URL` in Railway
- Run migrations: `npx prisma migrate deploy`
- Ensure database is running

### "404 on API routes"
- Verify backend URL is correct
- Check Railway logs for errors
- Ensure backend is listening on correct port

### Build Failed on Vercel
- Check build logs
- Verify all dependencies in `package.json`
- Ensure TypeScript has no errors
- Try `npm run build` locally first

---

## 📊 Monitoring

### Vercel Dashboard
- View deployment logs
- Monitor build times
- Check error rates
- View analytics

### Railway Dashboard
- View service logs
- Monitor CPU/memory usage
- Check database metrics
- Set up alerts

### Application Logs
- Backend logs via Railway
- Frontend logs via Vercel
- Database logs via Railway/Neon

---

## 🔄 CI/CD

Every push to `main` branch triggers:
1. Vercel rebuilds frontend
2. Railway redeploys backend
3. Automatic migrations (if configured)

### Manual Deployment
```bash
# Frontend
vercel --prod

# Backend (Railway CLI)
railway up
```

---

## 💰 Cost Estimates

### Free Tier Limits
- **Vercel:** Unlimited deployments, 100GB bandwidth
- **Railway:** $5 credit/month (~500 hours)
- **Neon:** 10GB storage, 100 hours compute/month

### Estimated Monthly Cost (100 users)
- Frontend (Vercel): $0
- Backend (Railway): $10-15
- Database (Neon): $10-20
- **Total:** $20-35/month

---

## 🎉 You're Live!

Your production URLs:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-service.railway.app`
- Health Check: `https://your-service.railway.app/health`

Share your webhook URL with users:
```
https://your-service.railway.app/webhooks/{userId}/orders/create
```

---

## Need Help?

- Check built-in Documentation (`/docs`)
- Visit Help page (`/help`)
- Review Railway/Vercel docs
- Check GitHub issues

**Happy deploying! 🚀**
