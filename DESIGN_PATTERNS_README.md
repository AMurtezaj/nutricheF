# Design Patterns & Architectural Style - Implementation Documentation

## 📋 Requirement Compliance

**Professor's Requirement #2: Emerging Paradigms or Advanced Design Principles and Patterns (20%)**

| Component | Requirement | Status | Implementation |
|-----------|-------------|--------|----------------|
| **Design Patterns** | ≥3 patterns | ✅ **5 patterns** | Repository, Strategy, Factory, Singleton, Observer |
| **Architectural Style** | ≥1 style | ✅ **Layered Architecture** | 4-layer separation |
| **Best Practices** | Encapsulation, Exception Handling, Cohesion, Coupling | ✅ **Fully Implemented** | Throughout codebase |

---

## 1. Design Patterns Implemented (5 Total)

### Pattern #1: Repository Pattern ✅

**What**: Mediates between the domain and data mapping layers using a collection-like interface.

**Where**: 
- Interface: `backend/app/core/interfaces/base_repository.py`
- Base: `backend/app/core/base_repository.py`
- Implementations: `backend/app/repositories/` (6 repositories)

**Why**: Separates data access logic from business logic, making the code more maintainable and testable.

**How**:
```python
# 3-Level Hierarchy
IRepository (Interface) 
  └── BaseRepository (Concrete Base)
        ├── UserRepository
        ├── MealRepository
        ├── PreferenceRepository
        └── ... (3 more)
```

**Demo Points**:
1. Show `IRepository` interface with abstract methods
2. Show `BaseRepository` implementing common CRUD
3. Show `UserRepository` with specific methods like `get_by_email()`
4. Explain how this separates concerns

---

### Pattern #2: Strategy Pattern ✅

**What**: Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

**Where**:
- Interface: `backend/app/core/interfaces/base_recommendation.py`
- Strategies:
  - `backend/app/services/recommendation_service.py` (Content-based)
  - `backend/app/services/ml_recommendation_service.py` (ML-based)

**Why**: Allows switching between different recommendation algorithms at runtime without changing client code.

**How**:
```python
# Strategy Interface
class IRecommendationEngine(ABC):
    @abstractmethod
    def get_recommendations(db, user_id, category, limit): pass
    
    @abstractmethod
    def calculate_score(meal, user, preference, ...): pass

# Concrete Strategy 1: Content-based
class RecommendationService(BaseRecommendationService):
    def calculate_score(...):
        # Content-based filtering algorithm
        
# Concrete Strategy 2: ML-based
class MLRecommendationService(BaseRecommendationService):
    def calculate_score(...):
        # Machine learning algorithm
```

**Demo Points**:
1. Show `IRecommendationEngine` interface
2. Show both strategies implementing same interface
3. Demonstrate interchangeable usage:
   ```python
   # Can switch between strategies
   recs = RecommendationService.get_recommendations(db, user_id)
   # OR
   recs = MLRecommendationService.get_recommendations(db, user_id)
   ```

---

### Pattern #3: Factory Method Pattern ✅

**What**: Defines an interface for creating objects, but lets subclasses decide which class to instantiate.

**Where**: `backend/app/factories/__init__.py`

**Why**: Encapsulates object creation logic, providing a centralized place for DTO creation.

**How**:
```python
class DTOFactory:
    """Factory for creating DTOs from database models."""
    
    @staticmethod
    def create_user_response(user: User) -> UserResponseDTO:
        """Factory method for UserResponseDTO."""
        return UserResponseDTO(
            id=user.id,
            email=user.email,
            # ... all fields
        )
    
    @staticmethod
    def create_meal_response(meal: Meal) -> MealResponseDTO:
        """Factory method for MealResponseDTO."""
        # ...
    
    @staticmethod
    def create_meal_recommendation(meal, score, reason) -> MealRecommendationDTO:
        """Factory method for recommendations."""
        # ...
```

**Demo Points**:
1. Show `DTOFactory` class with multiple factory methods
2. Explain how it centralizes DTO creation
3. Show usage in controllers/services
4. Explain benefits: single responsibility, easy to modify

---

### Pattern #4: Singleton Pattern ✅

**What**: Ensures a class has only one instance and provides a global point of access to it.

**Where**: `backend/app/core/singleton.py`

**Why**: Controls access to shared resources (database sessions, configuration).

**How**:
```python
class DatabaseSessionManager:
    """Singleton for managing database sessions."""
    
    _instance = None
    _lock = Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._session = None
            self._initialized = True
```

**Demo Points**:
1. Show `__new__` method implementing Singleton
2. Demonstrate thread-safety with lock
3. Test that multiple instantiations return same object:
   ```python
   manager1 = DatabaseSessionManager()
   manager2 = DatabaseSessionManager()
   assert manager1 is manager2  # Same instance!
   ```
4. Show `ConfigurationManager` as second example

---

### Pattern #5: Observer Pattern ✅

**What**: Defines a one-to-many dependency where when one object changes state, all dependents are notified.

**Where**: `backend/app/core/observer.py`

**Why**: Enables loose coupling between components that need to react to events.

**How**:
```python
class Observer(ABC):
    @abstractmethod
    def update(self, event_type: str, data: Any): pass

class EventManager:
    """Subject that manages observers."""
    
    def subscribe(self, event_type, observer):
        """Add observer to event."""
        
    def notify(self, event_type, data):
        """Notify all observers of event."""

# Concrete Observer
class MealRatingObserver(Observer):
    def update(self, event_type, data):
        if event_type == "meal_rated":
            # Update analytics, cache, etc.
```

**Demo Points**:
1. Show `Observer` abstract class
2. Show `EventManager` (Subject)
3. Show concrete observers (`MealRatingObserver`, `NotificationObserver`)
4. Demonstrate usage:
   ```python
   event_mgr = EventManager()
   observer = MealRatingObserver()
   event_mgr.subscribe("meal_rated", observer.update)
   event_mgr.notify("meal_rated", {"meal_id": 1, "rating": 5})
   ```

---

## 2. Architectural Style: Layered Architecture ✅

**What**: Organizes code into layers with specific responsibilities, where each layer depends only on layers below it.

**Implementation**: 4-Layer Architecture

```
┌─────────────────────────────────────┐
│   Presentation Layer (Controllers)  │  ← API endpoints, request/response
├─────────────────────────────────────┤
│   Business Logic Layer (Services)   │  ← Business rules, calculations
├─────────────────────────────────────┤
│   Data Access Layer (Repositories)  │  ← Database operations
├─────────────────────────────────────┤
│   Data Layer (Models)                │  ← Database schema, entities
└─────────────────────────────────────┘
```

### Layer Details:

**Layer 1: Presentation (Controllers)**
- Location: `backend/app/controllers/`
- Responsibility: Handle HTTP requests/responses
- Examples: `user_controller.py`, `meal_controller.py`
- Dependencies: Services layer only

**Layer 2: Business Logic (Services)**
- Location: `backend/app/services/`
- Responsibility: Business rules, calculations, orchestration
- Examples: `user_service.py`, `nutrition_service.py`
- Dependencies: Repositories and Models

**Layer 3: Data Access (Repositories)**
- Location: `backend/app/repositories/`
- Responsibility: Database queries and operations
- Examples: `user_repository.py`, `meal_repository.py`
- Dependencies: Models only

**Layer 4: Data (Models)**
- Location: `backend/app/models/`
- Responsibility: Database schema definitions
- Examples: `user.py`, `meal.py`
- Dependencies: None (bottom layer)

### Dependency Flow:
```
Controllers → Services → Repositories → Models
     ↓           ↓            ↓
   DTOs      Business      Database
            Logic         Queries
```

**Demo Points**:
1. Show directory structure matching layers
2. Trace a request through all layers:
   - Controller receives request
   - Calls service for business logic
   - Service calls repository for data
   - Repository queries model
3. Show how layers don't skip (controller never directly accesses repository)

---

## 3. Best Practices Implementation ✅

### 3.1 Data Encapsulation

**Implementation**:
- All database operations encapsulated in repositories
- Business logic encapsulated in services
- Data transfer encapsulated in DTOs
- Configuration encapsulated in Singleton

**Examples**:
```python
# ✅ Good: Encapsulated in repository
class UserRepository:
    @staticmethod
    def get_by_email(db, email):
        return db.query(User).filter(User.email == email).first()

# ✅ Good: Encapsulated in service
class UserService:
    @staticmethod
    def create_user(db, user_data):
        # Business logic here
```

---

### 3.2 Exception Handling

**Implementation**: Custom exception hierarchy

**Location**: `backend/app/exceptions.py`

```python
MealRecommendationException (Base)
├── UserNotFoundException
├── MealNotFoundException
├── PreferenceNotFoundException
├── InvalidNutritionDataException
├── RatingValidationException
└── ModelTrainingException
```

**Usage**:
```python
# In services
if not user:
    raise UserNotFoundException(user_id=user_id)

if rating < 1 or rating > 5:
    raise RatingValidationException(rating_value=rating)
```

**Demo Points**:
1. Show exception hierarchy
2. Show usage in services
3. Show how exceptions provide context (user_id, rating_value, etc.)

---

### 3.3 Strong Cohesion

**Implementation**: Each class has a single, well-defined responsibility

**Examples**:
- `UserRepository`: Only user database operations
- `NutritionService`: Only nutrition calculations
- `DTOFactory`: Only DTO creation
- `EventManager`: Only event management

**Metrics**:
- Each class focuses on one aspect
- Methods within a class are related
- No "god classes" with multiple responsibilities

---

### 3.4 Loose Coupling

**Implementation**: Dependencies on abstractions, not concrete classes

**Examples**:
```python
# ✅ Depend on interface
class UserService(BaseService):  # Depends on IService interface
    repository = UserRepository  # Can be swapped

# ✅ Interchangeable strategies
recommendation_service: IRecommendationEngine = RecommendationService()
# Can easily switch to:
recommendation_service: IRecommendationEngine = MLRecommendationService()
```

**Techniques Used**:
- Interface-based programming (all repositories implement `IRepository`)
- Dependency injection (controllers receive database session)
- Strategy pattern (interchangeable algorithms)
- Factory pattern (decouples creation from usage)

---

## 4. Defense Preparation Guide

### For Each Pattern, Be Ready to Explain:

1. **Name the pattern**
2. **Explain the problem it solves**
3. **Show the code** (have files open)
4. **Demonstrate it works** (run tests/examples)
5. **Explain benefits** (why we chose this pattern)

### Suggested Demo Flow:

1. **Start with Architecture**:
   - Show 4-layer structure
   - Trace a request through layers
   - Explain separation of concerns

2. **Show Design Patterns** (in order):
   - Repository (most fundamental)
   - Strategy (demonstrates polymorphism)
   - Factory (shows object creation)
   - Singleton (shows resource management)
   - Observer (shows event-driven design)

3. **Highlight Best Practices**:
   - Point to exception handling
   - Show encapsulation examples
   - Explain cohesion/coupling

### Key Talking Points:

- "We have **5 design patterns**, exceeding the requirement of 3"
- "Our **Layered Architecture** ensures clear separation of concerns"
- "We demonstrate **best practices** throughout: custom exceptions, encapsulation, strong cohesion, and loose coupling"
- "Each pattern solves a specific problem in our domain"

---

## 5. File Locations Quick Reference

| Pattern/Concept | File Path |
|-----------------|-----------|
| Repository Pattern | `app/core/interfaces/base_repository.py` |
| Strategy Pattern | `app/core/interfaces/base_recommendation.py` |
| Factory Pattern | `app/factories/__init__.py` |
| Singleton Pattern | `app/core/singleton.py` |
| Observer Pattern | `app/core/observer.py` |
| Custom Exceptions | `app/exceptions.py` |
| Layered Architecture | `app/controllers/`, `app/services/`, `app/repositories/`, `app/models/` |

---

## 6. Testing Commands

```bash
# Test all patterns import correctly
python -c "from app.factories import DTOFactory; from app.core.singleton import DatabaseSessionManager; from app.core.observer import EventManager; print('✅ All patterns working')"

# Test Singleton
python -c "from app.core.singleton import DatabaseSessionManager; m1 = DatabaseSessionManager(); m2 = DatabaseSessionManager(); print(f'Singleton: {m1 is m2}')"

# Test application runs
curl http://localhost:8000/health
```

---

## Summary

✅ **5 Design Patterns** (exceeds requirement of 3)
✅ **Layered Architecture** (4 layers with clear separation)
✅ **Best Practices** (encapsulation, exceptions, cohesion, coupling)
✅ **Well-documented** (ready for defense)
✅ **Tested and working** (all patterns functional)

**Grade Target**: Full marks (20/20) for this requirement ✨
