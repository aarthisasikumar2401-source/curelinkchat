# CureLink Production Deployment Guide

This guide explains how to deploy the CureLink application using the following architecture:
- **Frontend:** React + Vite on Vercel
- **Backend:** FastAPI on Render Web Service
- **Database:** Supabase PostgreSQL
- **AI:** Google Gemini (Optional)

## 1. Supabase Setup (Database)
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. In your project dashboard, go to **Project Settings > Database**.
3. Under **Connection string**, select **URI**.
4. Copy the connection string. It will look something like this:
   `postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
5. Replace `[YOUR-PASSWORD]` with your actual database password. This is your `DATABASE_URL`.

## 2. Render Deployment (Backend)
1. Push this entire project repository to GitHub.
2. Log in to [Render](https://render.com/) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` configuration and `Dockerfile`.
5. In the Render dashboard for your new service, go to **Environment** and add the following variables:
   - `DATABASE_URL` = (Your Supabase PostgreSQL connection string from step 1)
   - `FRONTEND_ORIGIN` = (Leave blank for now, we will update this after deploying the frontend)
   - `GEMINI_API_KEY` = (Optional: Your Google Gemini API key. If omitted, the symptom checker uses a safe deterministic fallback)
   - `GEMINI_MODEL` = `gemini-3.8-flash`
6. Deploy the service. Once deployed, copy your Render backend URL (e.g., `https://curelink-backend.onrender.com`).
7. Test the backend by visiting `https://curelink-backend.onrender.com/api/health`.

## 3. Vercel Deployment (Frontend)
1. Log in to [Vercel](https://vercel.com/) and click **Add New... > Project**.
2. Connect your GitHub repository.
3. In the "Configure Project" screen, ensure the **Framework Preset** is set to **Vite**.
4. **Important**: Change the **Root Directory** to `frontend`.
5. In the **Environment Variables** section, add:
   - `VITE_API_URL` = `https://YOUR-RENDER-URL.onrender.com/api` (Replace with your actual Render URL from step 2)
6. Click **Deploy**.
7. Once deployed, copy your Vercel frontend URL (e.g., `https://curelink.vercel.app`).

## 4. Final Configuration
1. Go back to your Render dashboard for the backend service.
2. Update the `FRONTEND_ORIGIN` environment variable to your Vercel URL (e.g., `https://curelink.vercel.app`).
3. If you want to support both production and local development, you can set it to `https://curelink.vercel.app,http://localhost:5173`.
4. Manually trigger a deployment in Render to apply the new environment variable.

## Local Development
To run this project locally:

**Backend:**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate # On Windows
pip install -r requirements.txt

# Create a .env file in the backend directory with:
# DATABASE_URL=postgresql+psycopg://... (or sqlite:///./curelink.db for testing)
# FRONTEND_ORIGIN=http://localhost:5173
# GEMINI_API_KEY=your-api-key (optional)

uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install

# Create a .env file in the frontend directory with:
# VITE_API_URL=http://localhost:8000/api

npm run dev
```
