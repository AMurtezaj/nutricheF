"""Diagnostic script to check backend setup."""
import sys
import os

print("=== Backend Setup Diagnostics ===\n")

# Check Python version
print(f"Python version: {sys.version}")
print()

# Check .env file
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    print("[OK] .env file exists")
    with open(env_path, 'r') as f:
        content = f.read()
        if "DATABASE_URL" in content:
            # Mask password in output
            lines = content.split('\n')
            for line in lines:
                if "DATABASE_URL" in line and "postgresql" in line:
                    # Mask password
                    if "@" in line:
                        parts = line.split("@")
                        if ":" in parts[0]:
                            user_pass = parts[0].split(":")
                            if len(user_pass) >= 2:
                                masked = f"{user_pass[0]}:****@{parts[1]}"
                                print(f"  DATABASE_URL: {masked}")
                            else:
                                print(f"  DATABASE_URL: {line}")
                        else:
                            print(f"  DATABASE_URL: {line}")
                    else:
                        print(f"  DATABASE_URL: {line}")
        else:
            print("[ERROR] DATABASE_URL not found in .env")
else:
    print("[ERROR] .env file not found!")

print()

# Check imports
print("Checking imports...")
try:
    import fastapi
    print(f"[OK] fastapi {fastapi.__version__}")
except ImportError as e:
    print(f"[ERROR] fastapi not installed: {e}")

try:
    import uvicorn
    print(f"[OK] uvicorn {uvicorn.__version__}")
except ImportError as e:
    print(f"[ERROR] uvicorn not installed: {e}")

try:
    import sqlalchemy
    print(f"[OK] sqlalchemy {sqlalchemy.__version__}")
except ImportError as e:
    print(f"[ERROR] sqlalchemy not installed: {e}")

try:
    import psycopg2
    print(f"[OK] psycopg2 {psycopg2.__version__}")
except ImportError as e:
    print(f"[ERROR] psycopg2 not installed: {e}")

print()

# Check app imports
print("Checking app imports...")
try:
    from app.config import settings
    print("[OK] app.config imported")
    print(f"  DATABASE_URL configured: {'postgresql' in settings.DATABASE_URL}")
except Exception as e:
    print(f"[ERROR] Failed to import app.config: {e}")

try:
    from app.main import app
    print("[OK] app.main imported")
except Exception as e:
    print(f"[ERROR] Failed to import app.main: {e}")
    import traceback
    traceback.print_exc()

print()

# Check database connection
print("Checking database connection...")
try:
    from app.repositories.database import engine
    conn = engine.connect()
    conn.close()
    print("[OK] Database connection successful")
except Exception as e:
    print(f"[ERROR] Database connection failed: {e}")
    print("   Make sure PostgreSQL is running and DATABASE_URL is correct")

print("\n=== Diagnostics Complete ===")
