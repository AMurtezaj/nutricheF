# 🚀 Setup Guide for New Developers

## Complete Step-by-Step Setup Process

This guide will walk you through setting up the **NutriChef AI** project from scratch on your local machine.

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

### Required Software:
1. **Git** - Version control (usually pre-installed on Mac/Linux)
   - Check: `git --version`
   - Download: https://git-scm.com/downloads

2. **Python 3.11** (recommended) or Python 3.10/3.12
   - Check: `python3 --version` or `python --version`
   - Download: https://www.python.org/downloads/
   - ⚠️ **Important**: Python 3.14 has compatibility issues with some packages

3. **Node.js** (version 16 or higher) and **npm**
   - Check: `node --version` and `npm --version`
   - Download: https://nodejs.org/

4. **PostgreSQL** (version 12 or higher)
   - Check: `psql --version`
   - Download: https://www.postgresql.org/download/
   - ⚠️ **Important**: Make sure PostgreSQL service is running

5. **Code Editor** (optional but recommended)
   - VS Code: https://code.visualstudio.com/
   - PyCharm, Sublime Text, or any editor of your choice

---

## ⚠️ Important Note for Windows Users

**If you're using Windows**, you'll notice different commands throughout this guide. Pay special attention to:

- **Virtual Environment Activation:**
  - ❌ **Don't use:** `source venv/bin/activate` (this is for macOS/Linux)
  - ✅ **Use instead:** `.\venv\Scripts\Activate.ps1` (PowerShell) or `venv\Scripts\activate.bat` (CMD)

- **PowerShell Execution Policy:** If you get an error when activating, run:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

- **Use PowerShell or CMD** for Python virtual environments (Git Bash may have issues)

**Throughout this guide, Windows-specific commands are clearly marked.** Look for **"On Windows"** sections!

---

## 🔄 Step 1: Clone the Repository

1. **Navigate to where you want to store the project:**
   ```bash
   cd ~/Desktop  # or wherever you prefer
   ```

2. **Clone the repository:**
   ```bash
   git clone <repository-url>
   # Replace <repository-url> with the actual GitHub URL
   # Example: git clone https://github.com/yourusername/InteligentMealRecommendation.git
   ```

3. **Navigate into the project directory:**
   ```bash
   cd InteligentMealRecommendation
   ```

4. **Verify you're on the main branch:**
   ```bash
   git branch
   # When you clone, you typically get the default branch (usually 'main')
   # Should show: * main
   ```

   **Note:** The default branch is `main`, which contains the latest stable code. You're good to go with this branch!

---

## 🗄️ Step 2: Set Up PostgreSQL Database

1. **Start PostgreSQL service:**
   
   **On macOS (using Homebrew):**
   ```bash
   brew services start postgresql
   ```
   
   **On Linux:**
   ```bash
   sudo systemctl start postgresql
   # or
   sudo service postgresql start
   ```
   
   **On Windows:**
   - Use PostgreSQL service from Start Menu or Services

2. **Create a new database:**
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE meal_recommendation;
   
   # Create user (optional, you can use default 'postgres' user)
   CREATE USER mealuser WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE meal_recommendation TO mealuser;
   
   # Exit PostgreSQL
   \q
   ```

3. **Verify database was created:**
   ```bash
   psql -l
   # Should see 'meal_recommendation' in the list
   ```

---

## 🐍 Step 3: Set Up Backend (Python)

### 3.1 Navigate to Backend Directory
```bash
cd backend
```

### 3.2 Create Python Virtual Environment

**On macOS/Linux:**
```bash
python3 -m venv venv
```

**On Windows:**
```bash
python -m venv venv
```

### 3.3 Activate Virtual Environment

**⚠️ IMPORTANT: Use the correct command for your operating system!**

**On macOS/Linux (Bash/Zsh):**
```bash
source venv/bin/activate
```

**On Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**On Windows (Command Prompt / CMD):**
```cmd
venv\Scripts\activate.bat
```

**If you get an error in PowerShell about execution policy**, run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then try activating again: `.\venv\Scripts\Activate.ps1`

**Verify activation** (you should see `(venv)` in your terminal prompt):

**On macOS/Linux:**
```bash
which python  # Should show path to venv/bin/python
```

**On Windows:**
```powershell
where python  # Should show path to venv\Scripts\python.exe
```

### 3.4 Install Python Dependencies
```bash
pip install --upgrade pip  # Upgrade pip first
pip install -r requirements.txt
```

**This will install:**
- FastAPI (web framework)
- SQLAlchemy (database ORM)
- PostgreSQL driver (psycopg2)
- Pydantic (data validation)
- And other dependencies...

**Expected time:** 2-3 minutes

### 3.5 Create Environment Variables File

1. **Create `.env` file in the `backend` directory:**
   ```bash
   # If you're in the backend directory
   touch .env
   ```

2. **Edit `.env` file** (using your favorite editor):
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/meal_recommendation
   
   # If you created a custom user, use:
   # DATABASE_URL=postgresql://mealuser:your_password@localhost:5432/meal_recommendation
   
   # CORS Origins (optional - defaults work for local development)
   BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

   **⚠️ Important:** Replace `your_password` with your actual PostgreSQL password!

   **Example:**
   ```env
   DATABASE_URL=postgresql://postgres:mypassword123@localhost:5432/meal_recommendation
   ```

### 3.6 Initialize Database Tables

```bash
# Make sure virtual environment is activated
python init_db.py
```

**This will:**
- Create all database tables (users, meals, preferences, etc.)
- Insert sample data (sample users, meals, preferences)

**Expected output:**
```
Database tables created successfully!
Sample data created successfully!
```

### 3.7 Verify Backend Setup

**Test database connection:**
```bash
python -c "from app.repositories.database import engine; print('Database connection OK!' if engine else 'Connection failed')"
```

---

## ⚛️ Step 4: Set Up Frontend (React)

### 4.1 Navigate to Frontend Directory

**Open a NEW terminal window/tab** (keep backend terminal open) and:
```bash
cd InteligentMealRecommendation/frontend
```

### 4.2 Install Node.js Dependencies
```bash
npm install
```

**This will install:**
- React
- React Router
- Axios (for API calls)
- Bootstrap (for styling)
- React Bootstrap
- And other dependencies...

**Expected time:** 2-5 minutes (depending on internet speed)

---

## 🚀 Step 5: Start the Application

### 5.1 Start Backend Server

**In the backend terminal:**

**First, navigate to backend directory and activate virtual environment:**

**On macOS/Linux:**
```bash
cd backend
source venv/bin/activate  # Make sure you see (venv) in your prompt!
```

**On Windows (PowerShell):**
```powershell
cd backend
.\venv\Scripts\Activate.ps1  # Make sure you see (venv) in your prompt!
```

**On Windows (CMD):**
```cmd
cd backend
venv\Scripts\activate.bat  # Make sure you see (venv) in your prompt!
```

**Then start the server:**
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**✅ Backend is running!**

**Verify backend is working:**
- Open browser: http://localhost:8000/docs
- You should see the Swagger API documentation

### 5.2 Start Frontend Server

**In a NEW terminal window/tab:**
```bash
cd InteligentMealRecommendation/frontend
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view meal-recommendation-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

**✅ Frontend is running!**

**The application should automatically open in your browser at:**
- http://localhost:3000

---

## ✅ Step 6: Verify Everything is Working

### Check Backend API:
1. Open: http://localhost:8000/docs
2. You should see the Swagger API documentation
3. Try the `GET /api/users` endpoint (click "Try it out" → "Execute")

### Check Frontend:
1. Open: http://localhost:3000
2. You should see the landing page
3. Try navigating to different pages

### Common Issues & Solutions:

**❌ "source: command not recognized" or "venv/bin/activate: command not recognized" (Windows PowerShell):**
- **You're using a macOS/Linux command on Windows!**
- Use PowerShell command: `.\venv\Scripts\Activate.ps1`
- If you get "execution policy" error, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Then try activating again
- **Make sure you see `(venv)` in your prompt before running other commands**

**❌ Backend won't start:**
- Check if PostgreSQL is running: `psql -l` (or check Services on Windows)
- Verify `.env` file has correct `DATABASE_URL`
- **Make sure virtual environment is activated** (should see `(venv)` in prompt)
- Check if port 8000 is already in use
- On Windows, make sure you're using PowerShell or CMD (not Git Bash for venv activation)

**❌ Frontend won't start:**
- Check if port 3000 is already in use
- Make sure `npm install` completed successfully
- Try deleting `node_modules` and `package-lock.json`, then `npm install` again

**❌ Database connection error:**
- Verify PostgreSQL is running
- Check database credentials in `.env` file
- Make sure database `meal_recommendation` exists
- Test connection: `psql -U postgres -d meal_recommendation`

**❌ CORS errors in browser:**
- Make sure backend is running on port 8000
- Check `BACKEND_CORS_ORIGINS` in `.env` file includes `http://localhost:3000`

---

## 📚 Optional: Load Dataset (Optional)

If you want to work with the full dataset:

1. **Download dataset** (if needed):
   - The dataset files should be in the `data/` folder
   - If not, contact the team lead for dataset access

2. **Process dataset:**
   
   **On macOS/Linux:**
   ```bash
   cd backend
   source venv/bin/activate
   python scripts/auto_setup_dataset.py
   ```
   
   **On Windows (PowerShell):**
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   python scripts/auto_setup_dataset.py
   ```

   **Note:** This is optional and may take time. The app works with sample data without it.

---

## 🎯 Quick Start Summary

For experienced developers, here's the quick version:

```bash
# 1. Clone and navigate
git clone <repo-url>
cd InteligentMealRecommendation
# You'll be on 'main' branch by default (this is correct!)

# 2. Create PostgreSQL database
psql postgres -c "CREATE DATABASE meal_recommendation;"

# 3. Backend setup
cd backend
python3 -m venv venv  # Windows: python -m venv venv
# Activate venv:
#   macOS/Linux: source venv/bin/activate
#   Windows PowerShell: .\venv\Scripts\Activate.ps1
#   Windows CMD: venv\Scripts\activate.bat
pip install -r requirements.txt
# Create .env file with DATABASE_URL
python init_db.py
uvicorn app.main:app --reload

# 4. Frontend setup (new terminal)
cd frontend
npm install
npm start
```

---

## 🔧 Development Workflow

### Daily Workflow:

1. **Pull latest changes from main:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Activate virtual environment (backend):**
   ```bash
   cd backend
   source venv/bin/activate
   ```

3. **Start backend:**
   ```bash
   uvicorn app.main:app --reload
   ```

4. **Start frontend (new terminal):**
   ```bash
   cd frontend
   npm start
   ```

### Making Changes:

1. **Make sure you're on the main branch and up to date:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a new branch for your feature:**
   ```bash
   git checkout -b feature/your-feature-name
   # Or: git checkout -b your-name/feature-name
   ```

3. **Make your changes**

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: Your commit message"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request to merge into `main` on GitHub**

**Workflow Summary:**
- Each team member works on their own branch
- When finished, create a Pull Request to merge into `main`
- `main` branch contains the latest stable code

---

## 📖 Additional Resources

- **API Documentation**: http://localhost:8000/docs (when backend is running)
- **Architecture Explanation**: See `ARCHITECTURE_EXPLANATION.md`
- **Project Summary**: See `PROJECT_DETAILED_SUMMARY.md`
- **Features List**: See `FEATURES_FOR_COLLEAGUE.md` (if it exists)

---

## 🆘 Need Help?

1. **Check the documentation files in the project root**
2. **Review the code comments**
3. **Check the Swagger API docs** at http://localhost:8000/docs
4. **Contact the team lead** (Altin Murtezaj: am51230@ubt-uni.net)

---

## ✅ Checklist

Use this checklist to verify your setup:

- [ ] Git is installed and working
- [ ] Python 3.11 is installed
- [ ] Node.js and npm are installed
- [ ] PostgreSQL is installed and running
- [ ] Repository is cloned
- [ ] On `main` branch (default branch)
- [ ] Backend virtual environment is created and activated
- [ ] Backend dependencies are installed
- [ ] `.env` file is created with correct `DATABASE_URL`
- [ ] Database `meal_recommendation` is created
- [ ] `init_db.py` ran successfully
- [ ] Backend server starts without errors (http://localhost:8000)
- [ ] Frontend dependencies are installed
- [ ] Frontend server starts without errors (http://localhost:3000)
- [ ] Can access Swagger docs at http://localhost:8000/docs
- [ ] Can access frontend at http://localhost:3000

---

**🎉 Congratulations! You're all set up and ready to develop!**

*Last updated: 2024*

