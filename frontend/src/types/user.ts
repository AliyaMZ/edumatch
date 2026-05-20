export interface User {
  id: number;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  goal?: string;
  level?: string;
  hoursPerWeek?: number;
  budget?: number;
  favoriteCourses?: Course[];
  // ... другие поля из вашей модели
}

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number | string; // Позволяет принимать и числа, и строки (например, "Договорная")
  url: string;
  format: string;           // Добавлено для корректного отображения иконки
  durationWeeks: number;    // Добавлено для отображения длительности
  aiAnalysis?: string;      // Опционально, так как может быть null
  matchPercent?: number;    // Опционально
  progress?: number;        // Для прогресса в ЛК
  status?: string;          // Для статуса в ЛК
}

export interface RecommendationCourse {
  id: number;
  title: string;
  description: string;
  price: string;
  format: 'VIDEO' | 'TEXT' | 'PRACTICE';
  url: string;
  matchPercent: number; // 🔥 Процент совпадения от AI
  aiAnalysis: string;   // 🔥 Обоснование от AI
}