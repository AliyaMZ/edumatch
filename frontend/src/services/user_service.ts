import api from '../api/axios';
import { User } from '../types/user';

export const UserService = {
  // Получить профиль текущего пользователя
  getProfile: async (userId: number) => {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },

  // Обновить профиль
  updateProfile: async (userId: number, data: Partial<User>) => {
    const response = await api.put<User>(`/users/${userId}/profile`, data);
    return response.data;
  },

  // Получить избранное с прогрессом
  getFavorites: async (userId: number) => {
    const response = await api.get(`/users/${userId}/favorites`);
    return response.data;
  },

  // Добавить курс в избранное
  addToFavorites: async (userId: number, courseId: number) => {
    const response = await api.post(`/users/${userId}/favorites/${courseId}`);
    return response.data;
  },

  // Удалить из избранного
  removeFromFavorites: async (userId: number, courseId: number) => {
    const response = await api.delete(`/users/${userId}/favorites/${courseId}`);
    return response.data;
  },

  // Обновить прогресс по курсу
  updateProgress: async (userId: number, courseId: number, progress: number, status: string) => {
    const response = await api.put(`/users/${userId}/courses/${courseId}/progress`, {
      progress,
      status,
    });
    return response.data;
  },
};