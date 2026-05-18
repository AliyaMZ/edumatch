import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { 
  Clock, DollarSign, Video, Heart, ExternalLink, 
  ChevronDown, Brain, Sparkles, FileText, Code, Globe,
  PlusCircle, CheckCircle2
} from 'lucide-react';

import { RootState, AppDispatch } from '../../store';
import { toggleFavoriteLocal } from '../../store/favoritesSlice';
import * as S from './detail_styles';

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  url: string;
  aiAnalysis: string;
  durationWeeks: number;
  format: string;
  progress?: number;
  status?: string;
}

export function DetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  const courseId = location.state?.id;
  const currentUserId = localStorage.getItem('userId');

  const favoriteIds = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favoriteIds.includes(Number(courseId));

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  const fetchData = async () => {
    if (!courseId) {
      navigate('/results');
      return;
    }
    try {
      setLoading(true);
      // Сначала получаем данные курса, затем проверяем статус прогресса, если он в избранном
      const courseRes = await axios.get(`http://localhost:8080/api/courses`);
      const found = courseRes.data.find((c: Course) => c.id === Number(courseId));
      
      if (found && currentUserId) {
        try {
          // Пытаемся получить актуальный прогресс именно для этого пользователя
          const favRes = await axios.get(`http://localhost:8080/api/users/${currentUserId}/favorites`);
          const userCourseData = favRes.data.find((c: any) => c.id === Number(courseId));
          if (userCourseData) {
            found.progress = userCourseData.progress;
            found.status = userCourseData.status;
          }
        } catch (e) {
          console.log("Прогресс не найден или курс не в избранном");
        }
      }
      
      setCourse(found);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId, navigate]);

  const toggleFavorite = async () => {
    if (!currentUserId || !courseId) return;

    dispatch(toggleFavoriteLocal(Number(courseId)));

    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:8080/api/users/${currentUserId}/favorites/${courseId}`);
      } else {
        await axios.post(`http://localhost:8080/api/users/${currentUserId}/favorites/${courseId}`);
        fetchData(); // Обновляем, чтобы подтянуть дефолтный прогресс
      }
    } catch (err) {
      console.error("Ошибка обновления избранного:", err);
      dispatch(toggleFavoriteLocal(Number(courseId)));
    }
  };

  const handleUpdateProgress = async () => {
    if (!course || !currentUserId) return;
    
    const currentProgress = course.progress || 0;
    const newProgress = Math.min(currentProgress + 10, 100);
    const newStatus = newProgress === 100 ? 'completed' : 'in_progress';

    // Оптимистичное обновление
    setCourse({ ...course, progress: newProgress, status: newStatus });

    try {
      await axios.put(`http://localhost:8080/api/users/${currentUserId}/courses/${course.id}/progress`, {
        progress: newProgress,
        status: newStatus
      });
    } catch (err) {
      console.error("Ошибка обновления прогресса:", err);
      fetchData(); // Откат к данным сервера
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Видео': return <Video size={20} />;
      case 'Текст': return <FileText size={20} />;
      case 'Практика': return <Code size={20} />;
      default: return <Globe size={20} />;
    }
  };

  const modules = [
    { title: 'Модуль 1: Основы и концепции', lessons: ['Введение в архитектуру', 'Настройка окружения', 'Первый проект'] },
    { title: 'Модуль 2: Глубокое погружение', lessons: ['Продвинутые паттерны', 'Оптимизация производительности', 'Тестирование'] }
  ];

  if (loading) return <S.PageWrapper><div style={{ textAlign: 'center', padding: '100px' }}>Загрузка...</div></S.PageWrapper>;
  if (!course) return <S.PageWrapper><div style={{ textAlign: 'center', padding: '100px' }}>Курс не найден</div></S.PageWrapper>;

  return (
    <S.PageWrapper>
      <S.Container>
        <S.BackButton onClick={() => navigate(-1)}>
          ← Назад
        </S.BackButton>

        <S.Layout>
          <div className="main-column">
            <S.Card>
              <S.RelevanceBadge>
                <span /> 
                <Sparkles size={14} /> 95% Соответствия
              </S.RelevanceBadge>
              
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>
                {course.title}
              </h1>

              <S.CharacteristicGrid>
                <S.CharItem>
                  <Clock size={20} color="#4338ca" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Длительность</div>
                    <div style={{ fontWeight: 600 }}>{course.durationWeeks} недель</div>
                  </div>
                </S.CharItem>
                <S.CharItem>
                  {getFormatIcon(course.format)}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Формат</div>
                    <div style={{ fontWeight: 600 }}>{course.format || 'Смешанный'}</div>
                  </div>
                </S.CharItem>
              </S.CharacteristicGrid>
            </S.Card>

            <S.Card>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>О курсе</h2>
              <p style={{ color: '#475569', lineHeight: 1.8 }}>{course.description}</p>
            </S.Card>

            <S.Card>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Программа обучения</h2>
              {modules.map((module, index) => (
                <S.ModuleItem key={index}>
                  <S.ModuleHeader onClick={() => setExpandedModule(expandedModule === index ? null : index)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: '#4338ca', fontWeight: 800 }}>0{index + 1}</span>
                      <span style={{ fontWeight: 600 }}>{module.title}</span>
                    </div>
                    <ChevronDown size={20} style={{ transform: expandedModule === index ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </S.ModuleHeader>
                  {expandedModule === index && (
                    <div style={{ padding: '1rem 1rem 1.5rem 3.5rem', background: '#f8fafc' }}>
                      {module.lessons.map((lesson, i) => (
                        <div key={i} style={{ padding: '0.5rem 0', color: '#64748b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }} />
                          {lesson}
                        </div>
                      ))}
                    </div>
                  )}
                </S.ModuleItem>
              ))}
            </S.Card>
          </div>

          <S.Sidebar>
            <S.PriceCard>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>{course.price}</div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Полный доступ к материалам</p>
              
              {isFavorite && (
                <S.ProgressSection>
                  <div className="progress-info">
                    <span>Ваш прогресс</span>
                    <span>{course.progress || 0}%</span>
                  </div>
                  <S.ProgressBarContainer>
                    <S.ProgressBarFill progress={course.progress || 0} />
                  </S.ProgressBarContainer>
                  <S.UpdateProgressBtn 
                    onClick={handleUpdateProgress}
                    disabled={course.progress === 100}
                  >
                    {course.progress === 100 ? (
                      <><CheckCircle2 size={16} /> Курс пройден</>
                    ) : (
                      <><PlusCircle size={16} /> Добавить +10%</>
                    )}
                  </S.UpdateProgressBtn>
                </S.ProgressSection>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <S.PrimaryButton onClick={() => window.open(course.url, '_blank')}>
                  Начать обучение <ExternalLink size={18} />
                </S.PrimaryButton>
                
                <S.FavoriteButton isFavorite={isFavorite} onClick={toggleFavorite}>
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? 'В избранном' : 'В избранное'}
                </S.FavoriteButton>
              </div>
            </S.PriceCard>

            <S.AIAnalysisCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Brain size={24} color="#4338ca" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Анализ</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.6, opacity: 0.9 }}>
                {course.aiAnalysis}
              </p>
            </S.AIAnalysisCard>
          </S.Sidebar>
        </S.Layout>
      </S.Container>
    </S.PageWrapper>
  );
}

export default DetailPage;