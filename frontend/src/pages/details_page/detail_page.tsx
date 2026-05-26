import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../api/axios'; 
import { toast } from 'react-hot-toast';

import { 
  Clock, Video, Heart, ExternalLink, 
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
  matchPercent?: number;
  format: string;
  progress?: number;
  status?: string;
}

export function DetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  const courseId = location.state?.id ? Number(location.state.id) : null;
  const currentUserId = localStorage.getItem('userId');

  const favoriteIds = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = courseId ? favoriteIds.includes(courseId) : false;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  console.log("Запрос к:", `/courses/${courseId}/user/${currentUserId}`);

  const fetchData = useCallback(async () => {
    if (!courseId) {
      navigate('/results');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const endpoint = currentUserId 
        ? `/courses/${courseId}/user/${currentUserId}` 
        : `/courses/${courseId}`;
        
      const courseRes = await api.get(endpoint);
      console.log("Данные курса с сервера:", courseRes.data);
      let found = courseRes.data as Course;
      
      if (currentUserId) {
        try {
          const favRes = await api.get(`/users/${currentUserId}/favorites`);
          const userCourseData = favRes.data.find((c: any) => c.id === courseId);
          if (userCourseData) {
            found.progress = userCourseData.progress ?? 0;
            found.status = userCourseData.status ?? 'NOT_STARTED';
          }
        } catch (e) {
          console.log("Прогресс не найден или курс не в избранном пользователя");
        }
      }
      
      setCourse(found);
    } catch (err: any) {
      console.error("Ошибка загрузки деталей курса:", err);
      setError("Не удалось загрузить информацию о курсе.");
    } finally {
      setLoading(false);
    }
  }, [courseId, currentUserId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleFavorite = async () => {
    if (!currentUserId || !courseId) {
      toast.error("Необходимо авторизоваться");
      return;
    }

   
    dispatch(toggleFavoriteLocal(courseId));

    try {
      if (isFavorite) {
        await api.delete(`/users/${currentUserId}/favorites/${courseId}`);
        toast.success("Курс удален из сохраненных");
        
        if (course) {
          setCourse({ ...course, progress: 0, status: 'NOT_STARTED' });
        }
      } else {
        await api.post(`/users/${currentUserId}/favorites/${courseId}`);
        toast.success("Курс добавлен в личный кабинет! 🎉");
        fetchData(); // Подтягиваем дефолтный прогресс с сервера
      }
    } catch (err) {
      console.error("Ошибка обновления избранного:", err);
      toast.error("Не удалось изменить статус избранного");
      dispatch(toggleFavoriteLocal(courseId)); // Откат изменений при сбое сети
    }
  };

  const handleUpdateProgress = async () => {
    if (!course || !currentUserId || !courseId) return;
    
    const currentProgress = course.progress || 0;
    const newProgress = Math.min(currentProgress + 10, 100);
    
   
    const newStatus = newProgress === 100 ? 'COMPLETED' : 'IN_PROGRESS';

   
    setCourse({ ...course, progress: newProgress, status: newStatus });

    try {
      await api.put(`/users/${currentUserId}/courses/${courseId}/progress`, {
        progress: newProgress,
        status: newStatus
      });
      toast.success("Прогресс сохранен! 📈");
    } catch (err) {
      console.error("Ошибка обновления прогресса:", err);
      toast.error("Сбой синхронизации прогресса");
      fetchData(); 
    }
  };

  const getFormatIcon = (format: string) => {
    const cleanFormat = (format || '').toLowerCase();
    if (cleanFormat.includes('видео')) return <Video size={20} color="#4338ca" />;
    if (cleanFormat.includes('текст')) return <FileText size={20} color="#4338ca" />;
    if (cleanFormat.includes('практика') || cleanFormat.includes('код')) return <Code size={20} color="#4338ca" />;
    return <Globe size={20} color="#4338ca" />;
  };

  
  const modules = [
    { title: 'Модуль 1: Основы и концепции темы', lessons: ['Введение в предметную область', 'Настройка рабочего окружения и инструментов', 'Создание первого базового проекта'] },
    { title: 'Модуль 2: Продвинутое проектирование', lessons: ['Глубокое погружение в паттерны', 'Оптимизация производительности решения', 'Автоматическое тестирование модулей'] }
  ];

  if (loading) return <S.PageWrapper><div style={{ textAlign: 'center', padding: '100px', color: '#4338ca', fontWeight: 500 }}>Загрузка деталей курса...</div></S.PageWrapper>;
  if (error) return <S.PageWrapper><div style={{ textAlign: 'center', padding: '100px', color: '#ef4444', fontWeight: 500 }}>⚠️ {error}</div></S.PageWrapper>;
  if (!course) return <S.PageWrapper><div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>Курс не найден</div></S.PageWrapper>;

  return (
    <S.PageWrapper>
      <S.Container>
        <S.BackButton onClick={() => navigate(-1)}>
          ← Назад к рекомендациям
        </S.BackButton>

        <S.Layout>
          <div className="main-column">
            <S.Card>
              <S.RelevanceBadge>
                <span /> 
                <Sparkles size={14} /> {course.matchPercent || 90}% Соответствия вашим целям
              </S.RelevanceBadge>
              
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', marginTop: '0.5rem', lineHeight: 1.3 }}>
                {course.title}
              </h1>

              <S.CharacteristicGrid>
                <S.CharItem>
                  <Clock size={20} color="#4338ca" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Длительность</div>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{course.durationWeeks || 4} недель</div>
                  </div>
                </S.CharItem>
                <S.CharItem>
                  {getFormatIcon(course.format)}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Формат контента</div>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{course.format || 'Онлайн-платформа'}</div>
                  </div>
                </S.CharItem>
              </S.CharacteristicGrid>
            </S.Card>

            <S.Card>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>О курсе</h2>
              <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '15px' }}>{course.description}</p>
            </S.Card>

            <S.Card>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>Программа обучения</h2>
              {modules.map((module, index) => (
                <S.ModuleItem key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '8px', overflow: 'hidden' }}>
                  <S.ModuleHeader 
                    onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                    style={{ background: '#f8fafc', padding: '1rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: '#4338ca', fontWeight: 800 }}>0{index + 1}</span>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{module.title}</span>
                    </div>
                    <ChevronDown size={20} style={{ transform: expandedModule === index ? 'rotate(180deg)' : 'none', transition: '0.2s', color: '#64748b' }} />
                  </S.ModuleHeader>
                  {expandedModule === index && (
                    <div style={{ padding: '1rem 1rem 1.2rem 3.5rem', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                      {module.lessons.map((lesson, i) => (
                        <div key={i} style={{ padding: '0.6rem 0', color: '#475569', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '5px', height: '5px', background: '#6366f1', borderRadius: '50%' }} />
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
              <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                {parseInt(course.price) ? `${Number(course.price).toLocaleString()} ₽` : course.price}
              </div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', marginTop: '4px' }}>Полный бессрочный доступ</p>
              
              {isFavorite && (
                <S.ProgressSection style={{ marginBottom: '20px', background: '#f8fafc', padding: '14px', borderRadius: '8px' }}>
                  <div className="progress-info" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Ваш прогресс</span>
                    <span style={{ fontWeight: 700, color: '#4338ca' }}>{course.progress || 0}%</span>
                  </div>
                  <S.ProgressBarContainer>
                    <S.ProgressBarFill progress={course.progress || 0} />
                  </S.ProgressBarContainer>
                  <S.UpdateProgressBtn 
                    onClick={handleUpdateProgress}
                    disabled={course.progress === 100}
                    style={{ marginTop: '12px', width: '100%', display: 'flex', justifyContent: 'center', gap: '6px' }}
                  >
                    {course.progress === 100 ? (
                      <><CheckCircle2 size={16} /> Программа пройдена</>
                    ) : (
                      <><PlusCircle size={16} /> Шаг вперед (+10%)</>
                    )}
                  </S.UpdateProgressBtn>
                </S.ProgressSection>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <S.PrimaryButton onClick={() => window.open(course.url, '_blank')} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  Начать обучение <ExternalLink size={16} />
                </S.PrimaryButton>
                
                <S.FavoriteButton isFavorite={isFavorite} onClick={toggleFavorite} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? 'В избранном' : 'Сохранить в ЛК'}
                </S.FavoriteButton>
              </div>
            </S.PriceCard>

            <S.AIAnalysisCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Brain size={22} color="#4338ca" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>AI Анализ соответствия</h3>
              </div>
              <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
                {course.aiAnalysis || "Нейросеть EduMatch анализирует программу курса под ваши требования. Оценка будет доступна в ближайшее время."}
              </p>
            </S.AIAnalysisCard>
          </S.Sidebar>
        </S.Layout>
      </S.Container>
    </S.PageWrapper>
  );
}

export default DetailPage;