# Object-Oriented Programming (OOP) Implementation Documentation

This document provides a comprehensive overview of the Object-Oriented Programming (OOP) features implemented in the Intelligent Meal Recommendation & Nutrition Analyzer project.

---

## 📋 Requirements Compliance Summary

| Requirement | Target | Status | Count |
|-------------|--------|--------|-------|
| Interfaces/Abstract Classes | ≥5 | ✅ PASS | **5 interfaces** |
| Classes | ≥15 | ✅ PASS | **50+ classes** |
| Inheritance Levels | ≥3 | ✅ PASS | **3 levels** |
| Polymorphism & Abstraction | Demonstrated | ✅ PASS | Multiple examples |
| Custom Exceptions | ≥1 | ✅ PASS | **6 exceptions** |
| Enumerations | ≥1 | ✅ PASS | **5 enumerations** |

---

## 1. Interfaces/Abstract Classes (5 Implemented)

All abstract classes are located in `backend/app/core/interfaces/` and use Python's `abc` module.

### 1.1 IRepository (`base_repository.py`)
**Purpose:** Defines the contract for all repository classes (data access layer).

```python
from abc import ABC, abstractmethod

class IRepository(ABC, Generic[T]):
    @staticmethod
    @abstractmethod
    def get_by_id(db: Session, id: int) -> Optional[T]: pass
    
    @staticmethod
    @abstractmethod
    def get_all(db: Session, skip: int, limit: int) -> List[T]: pass
    
    @staticmethod
    @abstractmethod
    def create(db: Session, data: Dict) -> T: pass
    
    @staticmethod
    @abstractmethod
    def update(db: Session, id: int, data: Dict) -> Optional[T]: pass
    
    @staticmethod
    @abstractmethod
    def delete(db: Session, id: int) -> bool: pass
```

**Implemented by:** UserRepository, MealRepository, PreferenceRepository, UserMealRepository, SavedMealRepository, MealRatingRepository

### 1.2 IService (`base_service.py`)
**Purpose:** Defines the contract for all service classes (business logic layer).

```python
class IService(ABC, Generic[T]):
    @staticmethod
    @abstractmethod
    def get_by_id(db: Session, id: int) -> Optional[T]: pass
    
    @staticmethod
    @abstractmethod
    def create(db: Session, data: Dict) -> T: pass
    
    @staticmethod
    @abstractmethod
    def update(db: Session, id: int, data: Dict) -> Optional[T]: pass
    
    @staticmethod
    @abstractmethod
    def delete(db: Session, id: int) -> bool: pass
```

**Implemented by:** UserService, MealService

### 1.3 IRecommendationEngine (`base_recommendation.py`)
**Purpose:** Defines the contract for recommendation services.

```python
class IRecommendationEngine(ABC):
    @staticmethod
    @abstractmethod
    def get_recommendations(db: Session, user_id: int, category: str, limit: int) -> List[Dict]: pass
    
    @staticmethod
    @abstractmethod
    def calculate_score(meal, user, preference, user_meals, today_nutrition) -> float: pass
```

**Implemented by:** BaseRecommendationService, RecommendationService, MLRecommendationService

### 1.4 INutritionCalculator (`base_nutrition.py`)
**Purpose:** Defines the contract for nutrition calculation services.

```python
class INutritionCalculator(ABC):
    @staticmethod
    @abstractmethod
    def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float: pass
    
    @staticmethod
    @abstractmethod
    def calculate_tdee(bmr: float, activity_level: str) -> float: pass
    
    @staticmethod
    @abstractmethod
    def calculate_calorie_target(tdee: float, goal: str) -> float: pass
    
    @staticmethod
    @abstractmethod
    def calculate_macro_targets(calories: float, goal: str) -> Dict[str, float]: pass
```

**Implemented by:** NutritionService

### 1.5 IModelSerializer (`base_serializer.py`)
**Purpose:** Defines the contract for model serialization/deserialization.

```python
class IModelSerializer(ABC, Generic[T]):
    @abstractmethod
    def to_dict(self) -> Dict: pass
    
    @classmethod
    @abstractmethod
    def from_dict(cls, data: Dict) -> T: pass
    
    @abstractmethod
    def validate(self) -> bool: pass
```

**Implemented by:** DTOs (Data Transfer Objects)

---

## 2. Classes and Inheritance (50+ Classes, 3 Levels)

### 2.1 Total Class Count

| Category | Count | Examples |
|----------|-------|----------|
| Database Models | 7 | User, Meal, Preference, UserMeal, SavedMeal, MealRating, RecipeRating |
| Repositories | 7 | UserRepository, MealRepository, etc. (+ BaseRepository) |
| Services | 8 | UserService, MealService, NutritionService, etc. (+ BaseService) |
| Interfaces | 5 | IRepository, IService, IRecommendationEngine, etc. |
| Exceptions | 6 | MealRecommendationException + 5 specific |
| DTOs | 15+ | UserCreateDTO, MealResponseDTO, etc. |
| Enums | 5 | Gender, ActivityLevel, Goal, MealCategory, MealType |
| **Total** | **50+** | |

### 2.2 Three-Level Inheritance Hierarchies

#### Repository Hierarchy
```
Level 1: IRepository (Abstract Interface)
    └── Level 2: BaseRepository (Concrete Base Class)
            ├── Level 3: UserRepository
            ├── Level 3: MealRepository
            ├── Level 3: PreferenceRepository
            ├── Level 3: UserMealRepository
            ├── Level 3: SavedMealRepository
            └── Level 3: MealRatingRepository
```

#### Service Hierarchy
```
Level 1: IService (Abstract Interface)
    └── Level 2: BaseService (Concrete Base Class)
            ├── Level 3: UserService
            └── Level 3: MealService
```

#### Recommendation Service Hierarchy
```
Level 1: IRecommendationEngine (Abstract Interface)
    └── Level 2: BaseRecommendationService (Concrete Base Class)
            ├── Level 3: RecommendationService (Content-based)
            └── Level 3: MLRecommendationService (ML-based)
```

### 2.3 Key Files Demonstrating Inheritance

| File | Inherits From | Level |
|------|---------------|-------|
| `core/base_repository.py` | IRepository | 2 |
| `repositories/user_repository.py` | BaseRepository | 3 |
| `repositories/meal_repository.py` | BaseRepository | 3 |
| `core/base_service.py` | IService | 2 |
| `services/user_service.py` | BaseService | 3 |
| `services/recommendation_service.py` | BaseRecommendationService | 3 |
| `services/ml_recommendation_service.py` | BaseRecommendationService | 3 |

---

## 3. Polymorphism and Abstraction

### 3.1 Polymorphism Examples

#### Example 1: Recommendation Engine Polymorphism
Both `RecommendationService` and `MLRecommendationService` implement `IRecommendationEngine`, allowing them to be used interchangeably:

```python
# Content-based recommendations
content_recs = RecommendationService.get_recommendations(db, user_id, limit=10)

# ML-based recommendations (same interface, different algorithm)
ml_recs = MLRecommendationService.get_recommendations(db, user_id, limit=10)

# Both return List[Dict] with meal, score, and reason
```

#### Example 2: Repository Method Overriding
All repositories override `BaseRepository` methods with entity-specific implementations:

```python
# BaseRepository provides default implementation
class BaseRepository(IRepository[T]):
    def get_by_id(cls, db: Session, id: int) -> Optional[T]:
        return db.query(cls.model).filter(cls.model.id == id).first()

# UserRepository overrides with user-specific logic
class UserRepository(BaseRepository[User]):
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()
```

### 3.2 Abstraction Examples

#### NutritionService implementing INutritionCalculator
```python
class NutritionService(INutritionCalculator):
    @staticmethod
    def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
        # Mifflin-St Jeor Equation implementation
        if gender.lower() == "male":
            return 10 * weight + 6.25 * height - 5 * age + 5
        elif gender.lower() == "female":
            return 10 * weight + 6.25 * height - 5 * age - 161
        # ...
```

---

## 4. Custom Exception Classes (6 Implemented)

Location: `backend/app/exceptions.py`

### Exception Hierarchy
```
MealRecommendationException (Base Exception)
    ├── UserNotFoundException
    ├── MealNotFoundException
    ├── PreferenceNotFoundException
    ├── InvalidNutritionDataException
    ├── RatingValidationException
    └── ModelTrainingException
```

### Exception Definitions

```python
class MealRecommendationException(Exception):
    """Base exception for the Meal Recommendation System."""
    def __init__(self, message: str, details: dict = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)
    
    def to_dict(self) -> dict:
        return {
            "error": self.__class__.__name__,
            "message": self.message,
            "details": self.details
        }

class UserNotFoundException(MealRecommendationException):
    def __init__(self, user_id: int = None, email: str = None):
        message = f"User not found: {user_id or email}"
        super().__init__(message, {"user_id": user_id, "email": email})

class RatingValidationException(MealRecommendationException):
    def __init__(self, rating_value: float, min_value: float = 1.0, max_value: float = 5.0):
        message = f"Rating must be between {min_value} and {max_value}, got {rating_value}"
        super().__init__(message, {"rating_value": rating_value})
```

### Usage Examples

```python
# In NutritionService
if not user:
    raise UserNotFoundException(user_id=user_id)

# In MealRatingRepository
if rating < 1 or rating > 5:
    raise RatingValidationException(rating_value=rating)

# In MealService
if not meal:
    raise MealNotFoundException(meal_id)
```

---

## 5. Enumerations (5 Implemented)

Location: `backend/app/enums.py`

### 5.1 Gender Enum
```python
class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
```

### 5.2 ActivityLevel Enum
```python
class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"
    LIGHTLY_ACTIVE = "lightly_active"
    MODERATELY_ACTIVE = "moderately_active"
    VERY_ACTIVE = "very_active"
    EXTREMELY_ACTIVE = "extremely_active"
```

### 5.3 Goal Enum
```python
class Goal(str, Enum):
    WEIGHT_LOSS = "weight_loss"
    WEIGHT_GAIN = "weight_gain"
    MAINTENANCE = "maintenance"
    MUSCLE_GAIN = "muscle_gain"
```

### 5.4 MealCategory Enum
```python
class MealCategory(str, Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"
```

### 5.5 MealType Enum
```python
class MealType(str, Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"
```

### Usage in DTOs
```python
from app.enums import Gender, ActivityLevel, Goal

class UserCreateDTO(BaseModel):
    gender: Optional[Gender] = None
    activity_level: Optional[ActivityLevel] = None
    goal: Optional[Goal] = None
    
    class Config:
        use_enum_values = True
```

---

## 6. Data Transfer Objects (DTOs)

Location: `backend/app/dtos/`

### 6.1 User DTOs (`user_dto.py`)
- `UserCreateDTO` - Input for creating users
- `UserUpdateDTO` - Input for updating users
- `UserResponseDTO` - Output for user responses

### 6.2 Meal DTOs (`meal_dto.py`)
- `MealCreateDTO` - Input for creating meals
- `MealUpdateDTO` - Input for updating meals
- `MealResponseDTO` - Output for meal responses
- `MealRecommendationDTO` - Output for recommendations

### 6.3 Preference DTOs (`preference_dto.py`)
- `PreferenceCreateDTO` - Input for creating preferences
- `PreferenceUpdateDTO` - Input for updating preferences
- `PreferenceResponseDTO` - Output for preference responses

### 6.4 Nutrition DTOs (`nutrition_dto.py`)
- `NutritionSummaryDTO` - Daily nutrition summary
- `MacroTargetsDTO` - Macro nutrient targets
- `BMRCalculationDTO` - BMR calculation input/output

---

## 7. Project Structure

```
backend/app/
├── core/                           # OOP Core Infrastructure
│   ├── __init__.py
│   ├── base_repository.py          # Level 2: Concrete BaseRepository
│   ├── base_service.py             # Level 2: Concrete BaseService
│   └── interfaces/                 # Level 1: Abstract Interfaces
│       ├── __init__.py
│       ├── base_repository.py      # IRepository ABC
│       ├── base_service.py         # IService ABC
│       ├── base_recommendation.py  # IRecommendationEngine ABC
│       ├── base_nutrition.py       # INutritionCalculator ABC
│       └── base_serializer.py      # IModelSerializer ABC
│
├── dtos/                           # Data Transfer Objects
│   ├── __init__.py
│   ├── user_dto.py
│   ├── meal_dto.py
│   ├── preference_dto.py
│   └── nutrition_dto.py
│
├── enums.py                        # 5 Enumerations
├── exceptions.py                   # 6 Custom Exceptions
│
├── models/                         # Database Models (7 classes)
│   ├── user.py
│   ├── meal.py
│   ├── preference.py
│   ├── user_meal.py
│   ├── saved_meal.py
│   ├── meal_rating.py
│   └── recipe_rating.py
│
├── repositories/                   # Level 3: Repository Classes
│   ├── user_repository.py          # Inherits BaseRepository
│   ├── meal_repository.py          # Inherits BaseRepository
│   ├── preference_repository.py    # Inherits BaseRepository
│   ├── user_meal_repository.py     # Inherits BaseRepository
│   ├── saved_meal_repository.py    # Inherits BaseRepository
│   └── meal_rating_repository.py   # Inherits BaseRepository
│
├── services/                       # Level 3: Service Classes
│   ├── user_service.py             # Inherits BaseService
│   ├── meal_service.py             # Inherits BaseService
│   ├── nutrition_service.py        # Implements INutritionCalculator
│   ├── recommendation_service.py   # Inherits BaseRecommendationService
│   └── ml_recommendation_service.py # Inherits BaseRecommendationService
│
└── controllers/                    # API Controllers
    ├── user_controller.py
    ├── meal_controller.py
    └── ...
```

---

## 8. OOP Principles Demonstrated

### 8.1 Encapsulation
- All database operations are encapsulated in Repository classes
- Business logic is encapsulated in Service classes
- Data validation is encapsulated in DTOs

### 8.2 Abstraction
- Abstract interfaces define contracts without implementation details
- Clients code against interfaces, not concrete implementations

### 8.3 Inheritance
- 3-level inheritance hierarchies for repositories and services
- Code reuse through base classes

### 8.4 Polymorphism
- Multiple recommendation implementations (content-based vs ML-based)
- Method overriding in concrete classes
- Interface-based programming

### 8.5 Cohesion
- Each class has a single responsibility
- Related functionality grouped together

### 8.6 Loose Coupling
- Dependencies on abstractions (interfaces) not concrete classes
- Easy to swap implementations

---

## 9. How to Verify

### Test Imports
```bash
cd backend
python -c "from app.core import IRepository, IService; from app.enums import Gender; from app.exceptions import UserNotFoundException; print('OK')"
```

### Test API
```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/users
curl http://localhost:8000/api/meals
```

---

## 10. Conclusion

This implementation fully satisfies all OOP requirements:

- ✅ **5 Abstract Classes/Interfaces** with meaningful implementations
- ✅ **50+ Classes** with logical organization
- ✅ **3-Level Inheritance** hierarchies for repositories and services
- ✅ **Polymorphism** demonstrated through recommendation services
- ✅ **6 Custom Exceptions** with proper hierarchy
- ✅ **5 Enumerations** integrated throughout the application
- ✅ **DTOs** following best practices for data transfer
