# 🏗️ Repository-Service-Controller Architecture Explained

## 📚 Table of Contents
1. [Overview](#overview)
2. [The Four Layers](#the-four-layers)
3. [Complete Request Flow](#complete-request-flow)
4. [Real Examples from Your Codebase](#real-examples-from-your-codebase)
5. [Why This Architecture?](#why-this-architecture)

---

## 🎯 Overview

Think of building a house:
- **Model** = The blueprint (what a User looks like)
- **Repository** = The storage room (where you put/get things)
- **Service** = The worker (does the actual work/business logic)
- **Controller** = The receptionist (greets visitors, takes requests, gives responses)

---

## 🏛️ The Four Layers

### 1️⃣ MODEL (Entity) - "What is a User?"

#### What it is:
The **Model** is like a **blueprint** or **template** that defines what a User looks like in your application.

#### In Your Codebase:
```python
# backend/app/models/user.py
class User(Base):
    """User model representing users of the application."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    
    # Health and fitness goals
    age = Column(Integer)
    gender = Column(String(20))
    height = Column(Float)  # in cm
    weight = Column(Float)  # in kg
    activity_level = Column(String(50))
    goal = Column(String(50))
    
    # Daily targets
    daily_calorie_target = Column(Float)
    daily_protein_target = Column(Float)
    # ... etc
```

#### What it represents:
- **A User** in your NutriChef AI application
- A person who can log meals, save recipes, get recommendations

#### What data it contains:
- Personal info: `email`, `username`, `first_name`, `last_name`
- Health data: `age`, `gender`, `height`, `weight`, `activity_level`, `goal`
- Nutrition targets: `daily_calorie_target`, `daily_protein_target`, etc.
- Relationships: links to `preferences`, `user_meals`, `saved_meals`, `meal_ratings`

#### Why it exists:
- **Defines the structure** of data in your database
- **Maps to a database table** (the `users` table)
- **Provides relationships** to other models (like meals, preferences)
- **Acts as a contract** - everyone knows what a User looks like

#### Real-World Analogy:
Like a **form template** at a doctor's office. It has fields for name, age, weight, etc. Every patient fills out the same form structure, but with different values.

---

### 2️⃣ REPOSITORY - "The Storage Room"

#### What it is:
The **Repository** is like a **storage room manager**. It knows exactly where things are stored and how to get them, but it doesn't make decisions about what to do with them.

#### In Your Codebase:
```python
# backend/app/repositories/user_repository.py
class UserRepository:
    """Repository for User model database operations."""
    
    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def create(db: Session, user_data: dict) -> User:
        """Create a new user."""
        user = User(**user_data)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def update(db: Session, user_id: int, user_data: dict) -> Optional[User]:
        """Update user information."""
        user = UserRepository.get_by_id(db, user_id)
        if user:
            for key, value in user_data.items():
                setattr(user, key, value)
            db.commit()
            db.refresh(user)
        return user
```

#### What it does:
- **CRUD operations**: Create, Read, Update, Delete
- **Database queries**: Gets data from the database
- **Simple operations**: No complex business logic

#### Responsibilities:
✅ **SHOULD DO:**
- Get user by ID
- Get user by email
- Create a new user in database
- Update user in database
- Delete user from database
- Simple filtering and searching

❌ **SHOULD NOT DO:**
- Calculate nutrition targets (that's business logic!)
- Validate business rules (e.g., "user must be 18+")
- Send emails
- Make complex decisions
- Call other services

#### How it communicates with database:
- Uses **SQLAlchemy ORM** (Object-Relational Mapping)
- Takes a `db: Session` parameter (database connection)
- Uses `db.query(User)` to query the database
- Uses `db.add()`, `db.commit()`, `db.delete()` to modify data

#### Real-World Analogy:
Like a **librarian** who knows exactly where every book is. You ask "Get me book #123" and they retrieve it. They don't decide if you should read it or what it means - they just get it.

---

### 3️⃣ SERVICE - "The Worker"

#### What it is:
The **Service** is like a **skilled worker** who knows how to do complex tasks. It uses the Repository to get data, then applies business logic to it.

#### In Your Codebase:
```python
# backend/app/services/user_service.py
class UserService:
    """Service for user-related operations."""
    
    @staticmethod
    def create_user(db: Session, user_data: Dict) -> Dict:
        """
        Create a new user and calculate their nutritional targets.
        """
        # Calculate nutritional targets if health data is provided
        if all([user_data.get("weight"), user_data.get("height"), 
                user_data.get("age"), user_data.get("gender")]):
            # Calculate BMR (Basal Metabolic Rate)
            bmr = NutritionService.calculate_bmr(
                user_data["weight"],
                user_data["height"],
                user_data["age"],
                user_data["gender"]
            )
            
            # Calculate TDEE (Total Daily Energy Expenditure)
            activity_level = user_data.get("activity_level", "sedentary")
            tdee = NutritionService.calculate_tdee(bmr, activity_level)
            
            # Calculate calorie target based on goal
            goal = user_data.get("goal", "maintenance")
            calorie_target = NutritionService.calculate_calorie_target(tdee, goal)
            
            # Calculate macro targets
            macro_targets = NutritionService.calculate_macro_targets(calorie_target, goal)
            
            # Add calculated values to user_data
            user_data["daily_calorie_target"] = calorie_target
            user_data["daily_protein_target"] = macro_targets["protein"]
            user_data["daily_carb_target"] = macro_targets["carbohydrates"]
            user_data["daily_fat_target"] = macro_targets["fat"]
        
        # Now use Repository to actually save to database
        user = UserRepository.create(db, user_data)
        return user
```

#### What it does:
- **Business logic**: Complex calculations, validations, decisions
- **Orchestrates**: Uses multiple repositories/services
- **Transforms data**: Calculates derived values (like nutrition targets)
- **Applies rules**: Business rules and validations

#### Responsibilities:
✅ **SHOULD DO:**
- Calculate nutrition targets when user is created
- Validate business rules (e.g., "email must be unique")
- Coordinate multiple operations (e.g., create user + create preferences)
- Call other services (e.g., `NutritionService`)
- Transform data before saving

❌ **SHOULD NOT DO:**
- Handle HTTP requests/responses (that's Controller's job!)
- Directly query database (use Repository instead!)
- Format data for API response (Controller does this)

#### Why Service Layer is Important:
1. **Separation of Concerns**: Business logic is separate from HTTP handling
2. **Reusability**: Can use the same service from different controllers
3. **Testability**: Easy to test business logic without HTTP
4. **Maintainability**: Changes to business rules only affect service

#### Real-World Analogy:
Like a **chef** in a restaurant. The waiter (Controller) takes your order, but the chef (Service) decides how to cook it, what ingredients to use, and applies the recipe. The chef uses ingredients from the pantry (Repository), but adds skill and knowledge.

---

### 4️⃣ CONTROLLER - "The Receptionist"

#### What it is:
The **Controller** is like a **receptionist** at a hotel. They greet visitors (HTTP requests), understand what they want, delegate work to the right people (Service), and give responses back.

#### In Your Codebase:
```python
# backend/app/controllers/user_controller.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.repositories.database import get_db
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user."""
    # Check if user already exists (simple validation)
    if UserRepository.get_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if UserRepository.get_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Convert Pydantic model to dict
    user_data = user.dict(exclude_none=True)
    
    # Delegate to Service for business logic
    new_user = UserService.create_user(db, user_data)
    
    # Return response (FastAPI automatically converts to JSON)
    return new_user

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID."""
    user = UserService.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

#### What it does:
- **Handles HTTP requests**: GET, POST, PUT, DELETE
- **Validates input**: Checks request data format
- **Delegates to Service**: Calls service methods
- **Handles HTTP responses**: Returns JSON, status codes, error messages
- **Error handling**: Converts errors to HTTP status codes

#### How it handles HTTP requests:
- **FastAPI routes**: `@router.post("")`, `@router.get("/{user_id}")`
- **Request validation**: Uses Pydantic models (`UserCreate`, `UserUpdate`)
- **Response formatting**: Uses `response_model=UserResponse`
- **Status codes**: `status_code=201` for created, `404` for not found

#### How it interacts with Service:
1. Receives HTTP request
2. Validates request data (Pydantic)
3. Calls `UserService.create_user(db, user_data)`
4. Handles errors (converts to HTTP exceptions)
5. Returns response

#### Real-World Analogy:
Like a **waiter** at a restaurant:
- Takes your order (HTTP request)
- Checks if it's valid (validation)
- Tells the chef what to make (calls Service)
- Brings you the food (HTTP response)
- Handles complaints (error handling)

---

## 🔄 Complete Request Flow

### Example 1: "Create User" Request

Let's trace what happens when someone sends:
```
POST /api/users
{
  "email": "john@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "age": 25,
  "gender": "male",
  "height": 180,
  "weight": 75,
  "activity_level": "moderately_active",
  "goal": "weight_loss"
}
```

#### Step-by-Step Flow:

**1. HTTP Request Arrives**
```
Client (Frontend/Postman) 
  → Sends POST request to http://localhost:8000/api/users
  → With JSON body containing user data
```

**2. Controller Receives Request** (`user_controller.py`)
```python
@router.post("", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
```
- FastAPI receives the request
- Validates JSON against `UserCreate` Pydantic model
- Creates database session via `get_db()` dependency
- Calls the `create_user` function

**3. Controller Validates** (`user_controller.py`)
```python
# Check if user already exists
if UserRepository.get_by_email(db, user.email):
    raise HTTPException(status_code=400, detail="Email already registered")
```
- Controller does quick checks (email/username uniqueness)
- If duplicate, returns HTTP 400 error immediately

**4. Controller Prepares Data** (`user_controller.py`)
```python
user_data = user.dict(exclude_none=True)
```
- Converts Pydantic model to dictionary
- Removes `None` values

**5. Controller Calls Service** (`user_controller.py`)
```python
new_user = UserService.create_user(db, user_data)
```
- Delegates to Service layer
- Passes database session and user data

**6. Service Applies Business Logic** (`user_service.py`)
```python
def create_user(db: Session, user_data: Dict) -> Dict:
    # Calculate nutritional targets if health data is provided
    if all([user_data.get("weight"), user_data.get("height"), 
            user_data.get("age"), user_data.get("gender")]):
        # Calculate BMR
        bmr = NutritionService.calculate_bmr(...)
        # Calculate TDEE
        tdee = NutritionService.calculate_tdee(bmr, activity_level)
        # Calculate targets
        calorie_target = NutritionService.calculate_calorie_target(tdee, goal)
        macro_targets = NutritionService.calculate_macro_targets(...)
        
        # Add calculated values
        user_data["daily_calorie_target"] = calorie_target
        user_data["daily_protein_target"] = macro_targets["protein"]
        # ... etc
```
- Service checks if health data is provided
- Calculates BMR, TDEE, calorie targets, macro targets
- Adds calculated values to `user_data` dictionary
- May call other services (`NutritionService`)

**7. Service Calls Repository** (`user_service.py`)
```python
user = UserRepository.create(db, user_data)
return user
```
- Service calls Repository to actually save to database
- Passes database session and complete user data

**8. Repository Saves to Database** (`user_repository.py`)
```python
@staticmethod
def create(db: Session, user_data: dict) -> User:
    """Create a new user."""
    user = User(**user_data)  # Create User model instance
    db.add(user)              # Add to session
    db.commit()               # Save to database
    db.refresh(user)          # Refresh to get ID and timestamps
    return user
```
- Creates `User` model instance from dictionary
- Adds to database session
- Commits transaction (saves to PostgreSQL)
- Refreshes to get auto-generated ID and timestamps
- Returns the `User` model object

**9. Data Flows Back Up**
```
Repository → Service → Controller
```
- Repository returns `User` object
- Service returns `User` object (may transform if needed)
- Controller receives `User` object

**10. Controller Returns HTTP Response** (`user_controller.py`)
```python
return new_user
```
- FastAPI automatically converts `User` model to JSON
- Uses `UserResponse` Pydantic model for response format
- Returns HTTP 201 (Created) status code
- Sends JSON response to client

**11. Client Receives Response**
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "age": 25,
  "gender": "male",
  "height": 180.0,
  "weight": 75.0,
  "activity_level": "moderately_active",
  "goal": "weight_loss",
  "daily_calorie_target": 2200.5,
  "daily_protein_target": 165.0,
  "daily_carb_target": 220.0,
  "daily_fat_target": 73.3
}
```

#### Visual Flow Diagram:
```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │ POST /api/users
       │ {email, username, ...}
       ▼
┌─────────────────────────────────┐
│      CONTROLLER                 │
│  (user_controller.py)           │
│  - Validates request             │
│  - Checks email/username exists  │
│  - Converts to dict             │
└──────┬──────────────────────────┘
       │ UserService.create_user(db, user_data)
       ▼
┌─────────────────────────────────┐
│      SERVICE                     │
│  (user_service.py)                │
│  - Calculates BMR                │
│  - Calculates TDEE               │
│  - Calculates nutrition targets   │
│  - Calls NutritionService        │
└──────┬──────────────────────────┘
       │ UserRepository.create(db, user_data)
       ▼
┌─────────────────────────────────┐
│      REPOSITORY                  │
│  (user_repository.py)            │
│  - Creates User model            │
│  - db.add(user)                  │
│  - db.commit()                   │
└──────┬──────────────────────────┘
       │ SQL INSERT INTO users ...
       ▼
┌─────────────────────────────────┐
│      DATABASE                    │
│  (PostgreSQL)                    │
│  - Stores user data              │
│  - Returns saved user            │
└──────┬──────────────────────────┘
       │ User object
       │ (flows back up)
       ▼
┌─────────────────────────────────┐
│      RESPONSE                    │
│  HTTP 201 Created                │
│  {id, email, username, ...}     │
└─────────────────────────────────┘
```

---

### Example 2: "Get User by ID" Request

Request: `GET /api/users/1`

#### Flow:

**1. Controller Receives Request**
```python
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
```

**2. Controller Calls Service**
```python
user = UserService.get_user(db, user_id)
```

**3. Service Calls Repository**
```python
@staticmethod
def get_user(db: Session, user_id: int) -> Optional[Dict]:
    user = UserRepository.get_by_id(db, user_id)
    return user
```

**4. Repository Queries Database**
```python
@staticmethod
def get_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()
```
- Executes SQL: `SELECT * FROM users WHERE id = 1`
- Returns `User` object or `None`

**5. Controller Checks Result**
```python
if not user:
    raise HTTPException(status_code=404, detail="User not found")
return user
```

**6. Response Sent**
- If found: HTTP 200 with user data
- If not found: HTTP 404 with error message

---

## 🎓 Key Concepts Explained

### Why Separate Layers?

#### 1. **Single Responsibility Principle**
Each layer has ONE job:
- **Controller**: Handle HTTP
- **Service**: Business logic
- **Repository**: Database access
- **Model**: Data structure

#### 2. **Separation of Concerns**
- Change HTTP format? → Only change Controller
- Change business rules? → Only change Service
- Change database? → Only change Repository

#### 3. **Testability**
- Test Service without HTTP (no need for FastAPI)
- Test Repository without business logic
- Mock Repository in Service tests

#### 4. **Reusability**
- Same Service can be used by:
  - REST API (Controller)
  - GraphQL API
  - CLI tool
  - Background job

---

## 📊 Comparison Table

| Layer | Responsibility | Example | Can Call |
|-------|---------------|---------|----------|
| **Controller** | HTTP handling | Validate request, return response | Service, Repository (for simple checks) |
| **Service** | Business logic | Calculate nutrition, validate rules | Repository, Other Services |
| **Repository** | Database access | Get user by ID, save user | Database only |
| **Model** | Data structure | Define User fields | None (just a class) |

---

## 🔍 Common Mistakes to Avoid

### ❌ Controller Doing Business Logic
```python
# BAD - Controller calculating nutrition
@router.post("")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    bmr = calculate_bmr(user.weight, user.height, ...)  # ❌ Business logic in controller
    user_data["daily_calorie_target"] = bmr * 1.5
    return UserRepository.create(db, user_data)
```

### ✅ Correct Way
```python
# GOOD - Service handles business logic
@router.post("")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user_data = user.dict(exclude_none=True)
    new_user = UserService.create_user(db, user_data)  # ✅ Service does the work
    return new_user
```

### ❌ Service Directly Querying Database
```python
# BAD - Service querying database directly
@staticmethod
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()  # ❌ Direct query
```

### ✅ Correct Way
```python
# GOOD - Service uses Repository
@staticmethod
def get_user(db: Session, user_id: int):
    return UserRepository.get_by_id(db, user_id)  # ✅ Uses Repository
```

### ❌ Repository Doing Business Logic
```python
# BAD - Repository calculating nutrition
@staticmethod
def create(db: Session, user_data: dict):
    bmr = calculate_bmr(...)  # ❌ Business logic in repository
    user_data["daily_calorie_target"] = bmr * 1.5
    user = User(**user_data)
    db.add(user)
    db.commit()
    return user
```

### ✅ Correct Way
```python
# GOOD - Repository just saves
@staticmethod
def create(db: Session, user_data: dict):
    user = User(**user_data)  # ✅ Just creates and saves
    db.add(user)
    db.commit()
    return user
```

---

## 🎯 Summary for Your Presentation

### The Architecture in 3 Sentences:
1. **Model** defines what data looks like (like a blueprint)
2. **Repository** handles database operations (like a storage manager)
3. **Service** contains business logic (like a skilled worker)
4. **Controller** handles HTTP requests/responses (like a receptionist)

### The Flow in 3 Steps:
1. **Request** → Controller receives HTTP request
2. **Process** → Controller → Service → Repository → Database
3. **Response** → Database → Repository → Service → Controller → HTTP response

### Why It's Good:
- ✅ **Maintainable**: Easy to find and change code
- ✅ **Testable**: Can test each layer independently
- ✅ **Scalable**: Easy to add new features
- ✅ **Reusable**: Service can be used by different controllers

---

## 📝 Quick Reference

### When to Use Each Layer:

**Use Controller when:**
- Handling HTTP requests/responses
- Validating request format
- Converting between HTTP and internal data

**Use Service when:**
- Calculating values (like nutrition targets)
- Validating business rules
- Coordinating multiple operations
- Calling other services

**Use Repository when:**
- Getting data from database
- Saving data to database
- Simple queries and filters

**Use Model when:**
- Defining data structure
- Setting up relationships
- Mapping to database table

---

## 🎓 For Your Professor

This architecture follows the **Layered Architecture Pattern** (also called **N-Tier Architecture**), which is a fundamental software design pattern. It provides:

1. **Separation of Concerns**: Each layer has a distinct responsibility
2. **Dependency Inversion**: Higher layers depend on abstractions, not implementations
3. **Single Responsibility**: Each class/function has one reason to change
4. **Testability**: Layers can be tested in isolation

This is industry-standard practice used by companies like:
- Microsoft (ASP.NET Core)
- Google (Django REST Framework)
- Netflix (Spring Boot)
- Amazon (Laravel)

---

**Good luck with your presentation! 🚀**

*This document uses real examples from your NutriChef AI codebase.*




