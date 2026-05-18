import axios from 'axios';

const API_URL = 'http://localhost:8080/api/courses';

export const getCourses = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении курсов:", error);
        return [];
    }
};