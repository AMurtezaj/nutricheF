"""Database connection and session management."""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=False  # Set to True for SQL query logging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Import Base for table creation
from app.models.base import Base
# Import all models to ensure they're registered with Base.metadata
from app.models import User, Meal, UserMeal, Preference, RecipeRating, SavedMeal, MealRating


def init_db():
    """Initialize database tables (creates tables if they don't exist)."""
    # Only create tables if they don't exist - DO NOT drop existing tables
    # This preserves all existing data
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for getting database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




