import api from './axios'; 

// Базовые относительные пути, так как baseURL ('http://localhost:8080/api') уже зашит внутри api
const COURSES_ENDPOINT = '/courses';
const USERS_ENDPOINT = '/users';

export const getCourses = async () => {
    try {
        // 🔥 ИСПРАВЛЕНО: Заменяем axios на api
        const response = await api.get(COURSES_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении курсов:", error);
        return [];
    }
};

/**
 * Получение персональных AI-рекомендаций для конкретного пользователя
 * @param userId - ID авторизованного студента
 */
export const getAiRecommendations = async (userId: number) => {
    try {
        // 🔥 ИСПРАВЛЕНО: Заменяем axios на api. Теперь токен прикрепится автоматически!
        const response = await api.get(`/users/${userId}/recommendations`, {
            timeout: 60000 
        });
        return response.data; 
    } catch (error) {
        console.error(`Ошибка при получении AI-рекомендаций для пользователя ${userId}:`, error);
        return []; 
    }
};