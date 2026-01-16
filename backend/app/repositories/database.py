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
from app.models import User, Meal, UserMeal, Preference, RecipeRating


def init_db():
    """Initialize database tables."""
    # Drop all tables first (with CASCADE to handle dependencies), then recreate them
    # This ensures the schema matches the models exactly
    with engine.connect() as conn:
        # Get all table names
        result = conn.execute(text("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
        """))
        tables = [row[0] for row in result]
        
        # Drop all tables with CASCADE to handle foreign key dependencies
        if tables:
            for table in tables:
                conn.execute(text(f'DROP TABLE IF EXISTS "{table}" CASCADE'))
            conn.commit()
    
    # Create all tables from models
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for getting database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




