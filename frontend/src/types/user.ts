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
  price: number;
  url: string;
  aiAnalysis?: string;
}