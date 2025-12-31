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

export default api;




