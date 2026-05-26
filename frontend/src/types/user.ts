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
}

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number | string; 
  url: string;
  format: string;          
  durationWeeks: number;    
  aiAnalysis?: string;      
  matchPercent?: number;   
  progress?: number;        
  status?: string;         
}

export interface RecommendationCourse {
  id: number;
  title: string;
  description: string;
  price: string;
  format: 'VIDEO' | 'TEXT' | 'PRACTICE';
  url: string;
  matchPercent: number; 
  aiAnalysis: string;   
}