import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userAPI = {
  create: (userData) => api.post('/api/users', userData),
  get: (userId) => api.get(`/api/users/${userId}`),
  getAll: (skip = 0, limit = 100) => api.get('/api/users', { params: { skip, limit } }),
  update: (userId, userData) => api.put(`/api/users/${userId}`, userData),
  updatePreferences: (userId, preferences) => 
    api.put(`/api/users/${userId}/preferences`, preferences),
  getPreferences: (userId) =>
    api.get(`/api/users/${userId}/preferences`),
};

// Meal API
export const mealAPI = {
  getAll: (skip = 0, limit = 100, category = null) => {
    const params = { skip, limit };
    if (category) params.category = category;
    return api.get('/api/meals', { params });
  },
  get: (mealId) => api.get(`/api/meals/${mealId}`),
  search: (query, skip = 0, limit = 100) => 
    api.get(`/api/meals/search/${query}`, { params: { skip, limit } }),
  addUserMeal: (userId, mealData) => 
    api.post(`/api/meals/users/${userId}/meals`, mealData),
  getUserMeals: (userId, mealDate = null) => {
    const params = mealDate ? { meal_date: mealDate } : {};
    return api.get(`/api/meals/users/${userId}/meals`, { params });
  },
};

// Nutrition API
export const nutritionAPI = {
  analyzeMeal: (mealId, servings = 1.0) => 
    api.post('/api/nutrition/analyze', { meal_id: mealId, servings }),
  getDailyNutrition: (userId, mealDate = null) => {
    const params = mealDate ? { meal_date: mealDate } : {};
    return api.get(`/api/nutrition/users/${userId}/daily`, { params });
  },
};

// Recommendation API
export const recommendationAPI = {
  getRecommendations: (userId, category = null, limit = 10) => {
    const params = { limit };
    if (category) params.category = category;
    return api.get(`/api/recommendations/users/${userId}`, { params });
  },
};

// AI Recipe API
export const aiRecipeAPI = {
  searchByIngredients: (ingredients, limit = 10, minMatch = 1) =>
    api.post('/api/ai-recipes/search', {
      ingredients,
      limit,
      min_ingredients_match: minMatch,
    }),
  createRecipe: (recipeData) =>
    api.post('/api/ai-recipes/create', recipeData),
  rateRecipe: (mealId, userId, rating, comment = null) =>
    api.post(`/api/ai-recipes/meals/${mealId}/rate?user_id=${userId}`, {
      rating,
      comment,
    }),
  getRecipeRatings: (mealId) =>
    api.get(`/api/ai-recipes/meals/${mealId}/ratings`),
  getUserRating: (mealId, userId) =>
    api.get(`/api/ai-recipes/meals/${mealId}/user/${userId}/rating`),
  trainModel: () =>
    api.post('/api/ai-recipes/train'),
  getModelStatus: () =>
    api.get('/api/ai-recipes/model/status'),
};

export default api;




