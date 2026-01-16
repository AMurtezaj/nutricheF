"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.controllers import (
    user_router,
    meal_router,
    nutrition_router,
    recommendation_router,
    ai_recipe_router
)
from app.controllers.saved_meal_controller import router as saved_meal_router
from app.controllers.meal_rating_controller import router as rating_router
from app.repositories.database import init_db

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Meal Recommendation & Nutrition Analyzer API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_router)
app.include_router(meal_router)
app.include_router(nutrition_router)
app.include_router(recommendation_router)
app.include_router(saved_meal_router)
app.include_router(rating_router)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Meal Recommendation & Nutrition Analyzer API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

