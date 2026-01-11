# Environment Variables Setup

## Frontend `.env.local` file

Create a file named `.env.local` in the `frontend/` directory with the following:

```env
# Backend Server URL (required)
# This is where your Express backend server runs
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Frontend URL (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- `NEXT_PUBLIC_BACKEND_URL` must start with `NEXT_PUBLIC_` to be accessible in the browser
- Default backend URL is `http://localhost:3001` if not set
- Make sure your backend server is running on port 3001

## Backend `.env` file

Create a file named `.env` in the `backend/` directory with the following:

```env
# MongoDB Connection
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/sydney_events

# MongoDB Atlas (Cloud) - Alternative
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sydney_events?retryWrites=true&w=majority

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=DEBUG

# Cron Secret (for securing cron endpoints)
CRON_SECRET=your-secret-key-here-change-in-production
```

## Quick Setup

1. **Frontend**: Copy the frontend variables above into `frontend/.env.local`
2. **Backend**: Copy the backend variables above into `backend/.env`
3. Update the MongoDB URI if using MongoDB Atlas
4. Change `CRON_SECRET` to a secure random string in production

