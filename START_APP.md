# How to Start Your Application

## Quick Start (Step-by-Step)

### 1. Start the Backend Server

Open a terminal and run:

```bash
cd backend

# Create virtual environment (first time only)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Update .env file with your database credentials
# Edit backend/.env and update DATABASE_URL if needed

# Initialize database (first time only)
python init_db.py

# Start the backend server
uvicorn app.main:app --reload
```

✅ Backend will be running at: **http://localhost:8000**
✅ API Documentation at: **http://localhost:8000/docs**

---

### 2. Start the Frontend Server

Open a **NEW terminal window** (keep backend running) and run:

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start the frontend server
npm start
```

✅ Frontend will open automatically at: **http://localhost:3000**

---

## First Time Setup Checklist

- [ ] Database created: `createdb meal_recommendation`
- [ ] Backend `.env` file configured with database credentials
- [ ] Backend virtual environment created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Database initialized (`python init_db.py`)
- [ ] Frontend dependencies installed (`npm install`)

## Daily Startup (After Initial Setup)

### Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

## Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Troubleshooting

### Backend won't start?
- Check if database is running: `pg_isready`
- Verify `.env` file has correct `DATABASE_URL`
- Make sure virtual environment is activated
- Check if port 8000 is available: `lsof -i :8000`

### Frontend won't start?
- Check if port 3000 is available
- Try: `rm -rf node_modules package-lock.json && npm install`
- Make sure backend is running first

### Database connection error?
- Verify PostgreSQL is running
- Check DATABASE_URL in `backend/.env`
- Ensure database exists: `psql -l | grep meal_recommendation`

## Stop the Application

Press `Ctrl+C` in each terminal window to stop the servers.




