import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 🔥 ИСПРАВЛЕНО: Для Webpack (CRA) переменные обычно идут с префиксом REACT_APP_
// Если переменная не задана, жестко перенаправляем на порт бэкенда 8080
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});


// 🔹 Интерцептор запроса: добавляем JWT-токен, если он реальный и валидный
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    // 🔥 ИСПРАВЛЕНО: Жесткая проверка. Токен должен существовать и не быть строкой "undefined"/"null"
    if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '' && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers) {
      // Если токена нет или он кривой — удаляем заголовок, чтобы Spring Security читал запрос как публичный
      delete config.headers.Authorization;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Интерцептор ответа: централизованная обработка ошибок
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      
      // Если токен истёк или невалиден
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Чистим id, чтобы почистить сессию полностью
        
        // 🔥 ИСПРАВЛЕНО: Перенаправляем на '/auth', так как в App.tsx прописан именно этот путь!
        window.location.href = '/auth';
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;