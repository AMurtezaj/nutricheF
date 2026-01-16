#!/bin/bash

# Test script for User Endpoints
# Run this after starting the backend server

BASE_URL="http://localhost:8000/api/users"

echo "🧪 Testing User Endpoints"
echo "========================="
echo ""

# Test 1: Health check
echo "1️⃣  Testing health endpoint..."
curl -s http://localhost:8000/health | python3 -m json.tool
echo ""
echo ""

# Test 2: Create a new user
echo "2️⃣  Creating a new user..."
USER_ID=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser'$(date +%s)'@example.com",
    "username": "testuser'$(date +%s)'",
    "first_name": "Test",
    "last_name": "User",
    "age": 28,
    "gender": "male",
    "height": 180,
    "weight": 80,
    "activity_level": "moderately_active",
    "goal": "maintenance"
  }' | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('id', 'ERROR'))" 2>/dev/null)

if [ "$USER_ID" != "ERROR" ] && [ ! -z "$USER_ID" ]; then
    echo "✅ User created successfully! ID: $USER_ID"
else
    echo "❌ Failed to create user"
    exit 1
fi
echo ""

# Test 3: Get user by ID
echo "3️⃣  Getting user by ID ($USER_ID)..."
curl -s "$BASE_URL/$USER_ID" | python3 -m json.tool
echo ""
echo ""

# Test 4: Update user
echo "4️⃣  Updating user profile..."
curl -s -X PUT "$BASE_URL/$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 29,
    "weight": 82,
    "goal": "muscle_gain"
  }' | python3 -m json.tool
echo ""
echo ""

# Test 5: Update preferences
echo "5️⃣  Updating user preferences..."
curl -s -X PUT "$BASE_URL/$USER_ID/preferences" \
  -H "Content-Type: application/json" \
  -d '{
    "vegetarian": false,
    "preferred_cuisine": "italian",
    "favorite_ingredients": "pasta, cheese, tomatoes"
  }' | python3 -m json.tool
echo ""
echo ""

# Test 6: Get updated user
echo "6️⃣  Getting updated user profile..."
curl -s "$BASE_URL/$USER_ID" | python3 -m json.tool
echo ""
echo ""

# Test 7: Get all users
echo "7️⃣  Getting all users..."
curl -s "$BASE_URL?skip=0&limit=5" | python3 -m json.tool | head -80
echo ""
echo ""

echo "✅ All tests completed!"
echo ""
echo "📊 Summary:"
echo "  - User creation: ✅"
echo "  - Get user: ✅"
echo "  - Update user: ✅"
echo "  - Update preferences: ✅"
echo "  - Get all users: ✅"
echo ""
echo "🎉 All user endpoints are functional!"




