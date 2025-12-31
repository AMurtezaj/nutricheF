# ⚠️ Python Version Compatibility Issue

## Problem

You're using **Python 3.14** (alpha/pre-release version), which is not yet supported by many packages including:
- `psycopg2-binary`
- `pydantic-core` 

These packages are essential for the backend to work.

## Solution: Use Python 3.11 or 3.12

**Python 3.14 is still in alpha** and most packages don't support it yet. For this project, you should use:

- **Python 3.11** (recommended) - Stable and well-supported
- **Python 3.12** - Also stable and works well

## How to Fix

### Option 1: Install Python 3.11 or 3.12 and recreate venv

1. **Install Python 3.11 or 3.12** (if not already installed):
   ```bash
   # Using Homebrew on macOS:
   brew install python@3.11
   # or
   brew install python@3.12
   ```

2. **Remove the current venv**:
   ```bash
   cd backend
   rm -rf venv
   ```

3. **Create new venv with Python 3.11 or 3.12**:
   ```bash
   # For Python 3.11:
   python3.11 -m venv venv
   # OR for Python 3.12:
   python3.12 -m venv venv
   
   # Activate it
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

### Option 2: Use pyenv (if you have it)

```bash
# Install Python 3.11
pyenv install 3.11.9

# Set it for this project
cd backend
pyenv local 3.11.9

# Recreate venv
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Verify Python Version

After creating the new venv:
```bash
python --version
# Should show: Python 3.11.x or Python 3.12.x (NOT 3.14)
```

## Why This Happens

Python 3.14 is still in development (alpha stage). Many packages need time to update their C extensions and dependencies to work with new Python versions. Python 3.11 and 3.12 are stable and fully supported by all the packages we need.

## After Fixing

Once you've switched to Python 3.11 or 3.12, the installation should work without issues:

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload
```




