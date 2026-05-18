import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Добавлено
import axios from 'axios';
import { 
  Clock, DollarSign, Video, FileText, Code, 
  ArrowRight, Heart, Star, Brain, ChevronDown, Sparkles 
} from 'lucide-react';

import { RootState, AppDispatch } from '../../store'; // Проверь путь к стору
import { toggleFavoriteLocal } from '../../store/favoritesSlice'; // Проверь путь к слайсу
import * as S from './results_styles';

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  aiAnalysis: string;
  durationWeeks: number; 
  format: string;
}

export function ResultsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); // Инициализация dispatch

  const currentUserId = localStorage.getItem('userId');
  
  // ИЗМЕНЕНИЕ: Получаем избранное из глобального стейта Redux
  const favoriteIds = useSelector((state: RootState) => state.favorites.items);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState(true);

  const [maxBudget, setMaxBudget] = useState(100000);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUserId) {
      navigate('/auth');
      return;
    }

    const fetchCoursesData = async () => {
      try {
        // Загружаем только список курсов, так как избранное уже грузится в App.tsx
        const response = await axios.get('http://localhost:8080/api/courses');
        setCourses(response.data);
      } catch (err) {
        console.error("Ошибка загрузки курсов", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesData();
  }, [currentUserId, navigate]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const numericPrice = parseInt(course.price.replace(/\D/g, '')) || 0;
      const matchesBudget = numericPrice <= maxBudget;
      const matchesFormat = selectedFormats.length === 0 || selectedFormats.includes(course.format);

      let matchesDuration = true;
      if (selectedDurations.length > 0) {
        matchesDuration = selectedDurations.some(range => {
          if (range === 'short') return course.durationWeeks <= 4;
          if (range === 'medium') return course.durationWeeks > 4 && course.durationWeeks <= 12;
          if (range === 'long') return course.durationWeeks > 12;
          return false;
        });
      }
      return matchesBudget && matchesFormat && matchesDuration;
    });
  }, [courses, maxBudget, selectedFormats, selectedDurations]);

  const toggleFilter = (value: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    setState(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  // ИЗМЕНЕНИЕ: Синхронное обновление через Redux + фоновый запрос к БД
  const toggleFavorite = async (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation();
    if (!currentUserId) return;

    // 1. Сразу обновляем UI в Redux
    dispatch(toggleFavoriteLocal(courseId));

    try {
      // 2. Отправляем запрос в БД
      if (favoriteIds.includes(courseId)) {
        await axios.delete(`http://localhost:8080/api/users/${currentUserId}/favorites/${courseId}`);
      } else {
        await axios.post(`http://localhost:8080/api/users/${currentUserId}/favorites/${courseId}`);
      }
    } catch (err) { 
      console.error("Ошибка при обновлении БД", err);
      // Если запрос не удался, возвращаем состояние обратно
      dispatch(toggleFavoriteLocal(courseId));
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Загрузка рекомендаций...</div>;
  }

  return (
    <S.PageWrapper>
      <S.Container>
        <S.Sidebar>
          <S.FilterSection>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ margin: 0 }}>Фильтры</h4>
              <button onClick={() => setShowFilters(!showFilters)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <ChevronDown size={20} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
              </button>
            </div>

            {showFilters && (
              <>
                <S.FilterSection>
                  <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>Бюджет (₽)</label>
                  <input type="range" min="0" max="100000" step="5000" value={maxBudget} onChange={(e) => setMaxBudget(Number(e.target.value))} style={{ width: '100%', accentColor: '#4338ca' }} />
                  <div style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>До {maxBudget.toLocaleString()} ₽</div>
                </S.FilterSection>

                <S.FilterSection>
                  <h4 style={{ fontSize: '14px' }}>Длительность</h4>
                  <S.CheckboxGroup>
                    <S.CheckboxLabel>
                      <input type="checkbox" checked={selectedDurations.includes('short')} onChange={() => toggleFilter('short', selectedDurations, setSelectedDurations)} />
                      До 4 недель
                    </S.CheckboxLabel>
                    <S.CheckboxLabel>
                      <input type="checkbox" checked={selectedDurations.includes('medium')} onChange={() => toggleFilter('medium', selectedDurations, setSelectedDurations)} />
                      4-12 недель
                    </S.CheckboxLabel>
                    <S.CheckboxLabel>
                      <input type="checkbox" checked={selectedDurations.includes('long')} onChange={() => toggleFilter('long', selectedDurations, setSelectedDurations)} />
                      Более 12 недель
                    </S.CheckboxLabel>
                  </S.CheckboxGroup>
                </S.FilterSection>

                <S.FilterSection>
                  <h4 style={{ fontSize: '14px' }}>Формат</h4>
                  <S.CheckboxGroup>
                    <S.CheckboxLabel>
                      <input type="checkbox" checked={selectedFormats.includes('Видео')} onChange={() => toggleFilter('Видео', selectedFormats, setSelectedFormats)} />
                      <Video size={16}/> Видео
                    </S.CheckboxLabel>
                    <S.CheckboxLabel>
                      <input type="checkbox" checked={selectedFormats.includes('Текст')} onChange={() => toggleFilter('Текст', selectedFormats, setSelectedFormats)} />
                      <FileText size={16}/> Текст
                    </S.CheckboxLabel>
                    <S.CheckboxLabel>
                      <input type="checkbox" checked={selectedFormats.includes('Практика')} onChange={() => toggleFilter('Практика', selectedFormats, setSelectedFormats)} />
                      <Code size={16}/> Практика
                    </S.CheckboxLabel>
                  </S.CheckboxGroup>
                </S.FilterSection>
              </>
            )}
          </S.FilterSection>
        </S.Sidebar>

        <main style={{ flex: 1 }}>
          <header style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>Ваши рекомендации</h1>
            <p style={{ color: '#64748b' }}>Найдено: {filteredCourses.length}</p>
          </header>

          {filteredCourses.map(course => (
            <S.Card 
              key={course.id} 
              onClick={() => navigate(`/details/${course.id}`, { state: { id: course.id } })}
            >
              <S.MatchBadge><Sparkles size={14} /> 95% Релевантности</S.MatchBadge>
              <S.CourseTitle>{course.title}</S.CourseTitle>
              <S.AIReasonBox>
                <S.AIIcon>AI</S.AIIcon>
                <p>{course.aiAnalysis}</p>
              </S.AIReasonBox>
              <S.MetaGrid>
                <div><Clock size={16} /> {course.durationWeeks} недель</div>
                <div><DollarSign size={16} /> {course.price}</div>
                <div className="rating"><Star size={16} fill="#f59e0b" /> 4.8</div>
              </S.MetaGrid>
              <S.ActionRow>
                <S.PrimaryButton 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    navigate(`/details/${course.id}`, { state: { id: course.id } }); 
                  }}
                >
                  Подробнее
                </S.PrimaryButton>
                <S.IconButton 
                  isFavorite={favoriteIds.includes(course.id)} 
                  onClick={(e) => toggleFavorite(e, course.id)}
                >
                  <Heart size={20} fill={favoriteIds.includes(course.id) ? "currentColor" : "none"} />
                </S.IconButton>
              </S.ActionRow>
            </S.Card>
          ))}
        </main>
      </S.Container>
    </S.PageWrapper>
  );
}

export default ResultsPage;