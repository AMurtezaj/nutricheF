# 🍽️ NutriChef AI - Intelligent Meal Recommendation & Nutrition Analyzer

<div align="center">

![NutriChef AI](https://img.shields.io/badge/NutriChef-AI-FF6B35?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNSAyIDIgNi41IDIgMTJzNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMFMxNy41IDIgMTIgMnoiLz48L3N2Zz4=)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)

**An AI-powered meal recommendation system with personalized nutrition tracking**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Docs](#-api-documentation) • [Architecture](#-architecture)

</div>

---

## 📋 Project Overview

**NutriChef AI** is an intelligent meal recommendation and nutrition analysis platform that helps users discover personalized meals based on their dietary preferences, health goals, and available ingredients. The system combines **content-based filtering** with **machine learning** to provide accurate, personalized recommendations.

### 👥 Team Members

| Role | Name | Email |
|------|------|-------|
| Team Leader | Altin Murtezaj | am51230@ubt-uni.net |
| Team Member | Vjollca Baxhaku | vb69325@ubt-uni.net |
| Team Member | Blerta Xheladini | bx68051@ubt-uni.net |

---

## ✨ Features

### 🎯 Core Features

- **🔍 AI-Powered Meal Search** - Find meals by selecting available ingredients
- **🤖 Smart Recommendations** - Get personalized meal suggestions based on your preferences
- **📊 Nutrition Tracking** - Log meals and track daily nutritional intake
- **📈 Interactive Charts** - Visualize nutrition data with beautiful charts
- **⭐ Recipe Ratings** - Rate and review recipes
- **❤️ Save Favorites** - Save meals to your personal collection
- **👤 User Profiles** - Customize dietary preferences and health goals

### 🧠 Intelligent Features

- **Content-Based Filtering** - Matches meals to your dietary preferences
- **Collaborative Filtering** - Learns from similar users' preferences
- **Hybrid Recommendations** - Combines multiple algorithms for best results
- **TDEE Calculator** - Calculates daily calorie needs based on activity level
- **Macro Targets** - Personalized protein, carb, and fat goals

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.9+** | Core programming language |
| **FastAPI** | Modern, fast web framework |
| **SQLAlchemy** | ORM for database operations |
| **SQLite** | Database (development) |
| **Scikit-learn** | Machine learning algorithms |
| **NumPy/Pandas** | Data processing |
| **Uvicorn** | ASGI server |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **React Router** | Client-side routing |
| **Recharts** | Interactive charts |
| **Framer Motion** | Animations |
| **React Bootstrap** | UI components |
| **Axios** | HTTP client |
| **React Icons** | Icon library |

---

## 🚀 Installation

### Prerequisites

- Python 3.9 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database (optional - runs automatically)
python -c "from app.repositories.database import init_db; init_db()"
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

---

## 🎮 Usage

### Start the Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at: `http://localhost:8000`  
Swagger docs at: `http://localhost:8000/docs`

### Start the Frontend Development Server

```bash
cd frontend
npm start
```

The application will open at: `http://localhost:3000`

---

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/{id}` | Get user by ID |
| `POST` | `/api/users` | Create new user |
| `GET` | `/api/meals` | Get all meals |
| `POST` | `/api/meals/search` | Search meals by ingredients |
| `GET` | `/api/recommendations/{user_id}` | Get personalized recommendations |
| `GET` | `/api/nutrition/{user_id}/daily` | Get daily nutrition summary |
| `POST` | `/api/user-meals` | Log a meal |

---

## 🏗️ Architecture

### Layered Architecture (4-Tier)

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│              UI Components, State Management                 │
├─────────────────────────────────────────────────────────────┤
│                 Presentation Layer                           │
│              Controllers (FastAPI Routes)                    │
├─────────────────────────────────────────────────────────────┤
│                 Business Logic Layer                         │
│           Services (Recommendation, Nutrition)               │
├─────────────────────────────────────────────────────────────┤
│                  Data Access Layer                           │
│                    Repositories                              │
├─────────────────────────────────────────────────────────────┤
│                     Data Layer                               │
│              Models (SQLAlchemy + SQLite)                    │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns Implemented

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Repository** | `app/repositories/` | Data access abstraction |
| **Factory** | `app/factories/` | DTO creation |
| **Singleton** | `app/core/singleton.py` | Session management |
| **Observer** | `app/core/observer.py` | Event handling |
| **Strategy** | `app/services/` | Interchangeable algorithms |

---

## 📁 Project Structure

```
InteligentMealRecommendation/
├── backend/
│   └── app/
│       ├── controllers/      # API endpoints
│       ├── services/         # Business logic
│       ├── repositories/     # Data access
│       ├── models/           # Database models
│       ├── core/             # Interfaces & patterns
│       │   ├── interfaces/   # Abstract classes
│       │   ├── singleton.py  # Singleton pattern
│       │   └── observer.py   # Observer pattern
│       ├── dtos/             # Data Transfer Objects
│       ├── factories/        # Factory pattern
│       ├── enums.py          # Enumerations
│       ├── exceptions.py     # Custom exceptions
│       └── main.py           # Application entry
│
├── frontend/
│   └── src/
│       ├── components/       # React components
│       │   ├── layout/       # Layout components
│       │   └── common/       # Reusable components
│       ├── context/          # React Context (UserContext)
│       ├── services/         # API services
│       └── styles/           # CSS files
│
└── docs/                     # Documentation
```

---

## 🎓 Academic Requirements

This project was developed as part of a university course and fulfills the following requirements:

### OOP Implementation (30%)
- ✅ **10 Interfaces/Abstract Classes** (5 required)
- ✅ **50+ Classes** (15 required)
- ✅ **3-Level Inheritance** hierarchies
- ✅ **Polymorphism** demonstrated throughout
- ✅ **7 Custom Exceptions** (1 required)
- ✅ **5 Enumerations** (1 required)

### Design Patterns & Architecture (20%)
- ✅ **5 Design Patterns**: Repository, Factory, Singleton, Observer, Strategy
- ✅ **Layered Architecture**: 4-tier separation
- ✅ **Best Practices**: Encapsulation, exception handling, SOLID principles

📄 See [PROFESSOR_REQUIREMENTS_README.md](./PROFESSOR_REQUIREMENTS_README.md) for detailed documentation.

---

## 🧪 Testing

```bash
# Backend tests
cd backend
python -m pytest

# Test patterns work correctly
python -c "from app.factories import DTOFactory; print('✅ Factory works')"
python -c "from app.core.singleton import DatabaseSessionManager; m1=DatabaseSessionManager(); m2=DatabaseSessionManager(); print(f'✅ Singleton: {m1 is m2}')"
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for educational purposes at UBT - Higher Education Institution.

---

## 📞 Contact

For questions or support, please contact the team members listed above.

---

<div align="center">

**Built with ❤️ by NutriChef AI Team**

*Intelligent Meal Recommendations for a Healthier You*

</div>
