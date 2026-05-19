import api from '../api/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
  token?: string; // Будет после внедрения JWT
}

export const AuthService = {
  // Регистрация
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users', data);
    return response.data;
  },

  // Логин
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/login', credentials);
    
    // Если бэкенд начнёт возвращать токен — сохраняем его
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },

  // Логаут
  logout: () => {
    localStorage.removeItem('token');
    // Можно добавить вызов эндпоинта /logout, если будет на бэке
  },

  // Проверка: авторизован ли пользователь
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};