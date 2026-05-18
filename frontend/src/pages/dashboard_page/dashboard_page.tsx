import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { 
  User as UserIcon, BookMarked, Sparkles, Clock, DollarSign, Video, 
  Target, Lightbulb, Star, TrendingUp, Trash2, Briefcase, Settings, PlusCircle
} from 'lucide-react';

import { RootState, AppDispatch } from '../../store'; 
import { toggleFavoriteLocal } from '../../store/favoritesSlice'; 
import * as S from './dashboard_styles';

interface Course {
  id: number;
  title: string;
  price: string;
  description: string;
  aiAnalysis: string;
  url: string; 
  progress?: number;
  status?: string;
}

interface UserProfile {
  id: number;
  username: string;
  goal: string;
  level: string;
  hoursPerWeek: number;
  budget: number;
  interests: string[];
}

export function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const favoriteIds = useSelector((state: RootState) => state.favorites.items);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [allCourses, setAllCourses] = useState<Course[]>([]); 
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = localStorage.getItem('userId');

  const fetchData = async (silent = false) => {
    if (!currentUserId) {
      navigate('/auth');
      return;
    }

    try {
      if (!silent) setLoading(true);
      const [profileRes, favCoursesRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/users/${currentUserId}`),
        axios.get(`http://localhost:8080/api/users/${currentUserId}/favorites`)
      ]);

      setProfile(profileRes.data);
      setAllCourses(favCoursesRes.data); 
      setError(null);
    } catch (err: any) {
      console.error("Ошибка API:", err);
      if (err.response?.status === 404) {
        localStorage.removeItem('userId');
        navigate('/auth');
      }
      setError("Не удалось загрузить данные.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUserId]);

  // Сортировка по ID гарантирует, что курсы не будут менять порядок при обновлении
  const favoriteCourses = useMemo(() => {
    return [...allCourses]
      .filter(course => favoriteIds.includes(course.id))
      .sort((a, b) => a.id - b.id);
  }, [allCourses, favoriteIds]);

  const handleUpdateProgress = async (courseId: number, currentProgress: number) => {
    const newProgress = Math.min(currentProgress + 10, 100);
    const newStatus = newProgress === 100 ? 'completed' : 'in_progress';

    // 1. Оптимистично обновляем локальный стейт, чтобы UI среагировал мгновенно
    setAllCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, progress: newProgress, status: newStatus } : c
    ));

    try {
      // 2. Отправляем запрос на бэкенд
      await axios.put(`http://localhost:8080/api/users/${currentUserId}/courses/${courseId}/progress`, {
        progress: newProgress,
        status: newStatus
      });
      // 3. Синхронизируем данные в фоне без показа лоадера
      fetchData(true);
    } catch (err) {
      console.error("Ошибка при обновлении прогресса:", err);
      // Если произошла ошибка, откатываем данные к серверным
      fetchData(true);
      alert("Не удалось сохранить прогресс");
    }
  };

  const handleDelete = async (courseId: number) => {
    if (!currentUserId) return;
    if (window.confirm("Удалить этот курс из избранного?")) {
      const originalCourses = [...allCourses];
      
      // Удаляем локально для мгновенного фидбека
      setAllCourses(prev => prev.filter(c => c.id !== courseId));
      dispatch(toggleFavoriteLocal(courseId));

      try {
        await axios.delete(`http://localhost:8080/api/users/${currentUserId}/favorites/${courseId}`);
      } catch (err) {
        console.error("Ошибка при удалении:", err);
        // Откат при ошибке
        setAllCourses(originalCourses);
        dispatch(toggleFavoriteLocal(courseId));
        alert("Не удалось удалить курс");
      }
    }
  };

  if (!currentUserId) return null;

  if (loading && !profile) {
    return (
      <S.DashboardContainer>
        <div style={{ textAlign: 'center', padding: '100px', color: '#4338ca', fontWeight: 600 }}>
          <Sparkles className="animate-pulse" style={{ margin: '0 auto 20px' }} size={40} />
          <p>Синхронизация данных...</p>
        </div>
      </S.DashboardContainer>
    );
  }

  return (
    <S.DashboardContainer>
      <S.MaxWidthWrapper>
        <S.HeaderSection>
          <div className="welcome-tag">С возвращением, {profile?.username || 'Пользователь'}! 👋</div>
          <h1>Личный кабинет</h1>
          <p>Управляйте своими курсами и отслеживайте прогресс обучения</p>
        </S.HeaderSection>

        <S.TabsList>
          <S.TabTrigger active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
            <UserIcon size={18} /> <span>Профиль</span>
          </S.TabTrigger>
          <S.TabTrigger active={activeTab === 'courses'} onClick={() => setActiveTab('courses')}>
            <BookMarked size={18} /> <span>Избранные курсы</span>
          </S.TabTrigger>
          <S.TabTrigger active={activeTab === 'ai-tips'} onClick={() => setActiveTab('ai-tips')}>
            <Sparkles size={18} /> <span>AI советы</span>
          </S.TabTrigger>
        </S.TabsList>

        {activeTab === 'profile' && profile && (
          <S.FadeIn>
            <S.StatsGrid>
              <S.StatCard variant="blue">
                <div className="icon-wrapper"><Target size={24} /></div>
                <div className="info">
                  <div className="value">{favoriteIds.length}</div>
                  <div className="label">Курсов сохранено</div>
                </div>
              </S.StatCard>
              <S.StatCard variant="teal">
                <div className="icon-wrapper"><Clock size={24} /></div>
                <div className="info">
                  <div className="value">{profile.hoursPerWeek || 0}</div>
                  <div className="label">Часов в неделю</div>
                </div>
              </S.StatCard>
              <S.StatCard variant="green">
                <div className="icon-wrapper"><Star size={24} /></div>
                <div className="info">
                  <div className="value">
                    {favoriteCourses.filter(c => c.status === 'completed').length}
                  </div>
                  <div className="label">Завершено</div>
                </div>
              </S.StatCard>
            </S.StatsGrid>

            <S.ContentCard>
              <S.CardHeader>
                <h3>Ваш профиль обучения</h3>
                <S.GhostButton onClick={() => navigate('/profile')} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Settings size={16} /> Редактировать профиль
                </S.GhostButton>
              </S.CardHeader>
              <S.InfoBlock>
                <label>Основная цель</label>
                <S.GoalBox>
                  <div className="goal-icon"><Target size={18} /></div>
                  {profile.goal || "Цель пока не указана"}
                </S.GoalBox>
              </S.InfoBlock>
              <S.GridTwoCols>
                <S.InfoBlock>
                  <label>Уровень подготовки</label>
                  <S.DataTag><TrendingUp size={16} /> {profile.level || "Не указан"}</S.DataTag>
                </S.InfoBlock>
                <S.InfoBlock>
                  <label>Выделенный бюджет</label>
                  <S.DataTag><DollarSign size={16} /> {(profile.budget || 0).toLocaleString()} ₽</S.DataTag>
                </S.InfoBlock>
              </S.GridTwoCols>
            </S.ContentCard>
          </S.FadeIn>
        )}

        {activeTab === 'courses' && (
          <S.FadeIn>
            <S.ContentCard>
              <S.CardHeader>
                <h3>Мои подборки ({favoriteCourses.length})</h3>
                <S.PrimaryButton onClick={() => navigate('/results')}>Найти новые</S.PrimaryButton>
              </S.CardHeader>

              {favoriteCourses.length === 0 && !loading && (
                <div style={{textAlign: 'center', padding: '60px 20px', color: '#64748b'}}>
                  <BookMarked size={48} style={{marginBottom: '16px', opacity: 0.3}} />
                  <p>У вас пока нет сохраненных курсов.</p>
                </div>
              )}

              <S.CourseList>
                {favoriteCourses.map(course => (
                  <S.CourseListItem key={course.id}>
                    <S.CourseInfoMain>
                      <div className="title-row" style={{marginBottom: '12px'}}>
                        <h4>{course.title}</h4>
                        <S.StatusBadge status={course.status || 'not_started'}>
                          {course.status === 'completed' ? 'Завершен' : 
                           course.status === 'in_progress' ? 'В процессе' : 'Не начат'}
                        </S.StatusBadge>
                      </div>

                      <S.ProgressWrapper>
                        <S.ProgressLabel>
                          <span>Прогресс обучения</span>
                          <span>{course.progress || 0}%</span>
                        </S.ProgressLabel>
                        <S.ProgressBarContainer>
                          <S.ProgressBarFill 
                            progress={course.progress || 0} 
                            status={course.status || 'not_started'} 
                          />
                        </S.ProgressBarContainer>
                      </S.ProgressWrapper>
                      
                      <S.CourseMetaGroup>
                        <span><DollarSign size={14} /> {course.price}</span>
                        <span><Video size={14} /> Онлайн-курс</span>
                      </S.CourseMetaGroup>

                      <S.CardActions>
                        <S.PrimaryButton 
                          onClick={() => navigate(`/details/${course.id}`, { state: { id: course.id } })}
                          style={{ flex: 1 }}
                        >
                          Смотреть детали
                        </S.PrimaryButton>
                        
                        <S.GhostButton 
                          onClick={() => handleUpdateProgress(course.id, course.progress || 0)}
                          title="Отметить прогресс +10%"
                          disabled={course.progress === 100}
                        >
                          <PlusCircle size={18} />
                        </S.GhostButton>

                        <S.GhostButton 
                          onClick={() => handleDelete(course.id)} 
                          style={{ color: '#ef4444', border: '1px solid #fee2e2' }}
                        >
                          <Trash2 size={16} />
                        </S.GhostButton>
                      </S.CardActions>
                    </S.CourseInfoMain>
                  </S.CourseListItem>
                ))}
              </S.CourseList>
            </S.ContentCard>
          </S.FadeIn>
        )}

        {activeTab === 'ai-tips' && (
          <S.FadeIn>
            <S.ContentCard>
              <S.AiHeader>
                <div className="ai-circle"><Sparkles size={20} /></div>
                <div>
                  <h3>AI Ассистент</h3>
                  <p>Индивидуальные советы на основе вашего профиля</p>
                </div>
              </S.AiHeader>
              <S.TipsContainer>
                <S.DetailedTip>
                  <div className="tip-icon-box blue"><Lightbulb size={20} /></div>
                  <div className="tip-body">
                    <h4>Режим обучения</h4>
                    <p>Для вашего графика в {profile?.hoursPerWeek || 0} ч/нед. мы рекомендуем фокусироваться на практике.</p>
                  </div>
                </S.DetailedTip>
                <S.DetailedTip>
                  <div className="tip-icon-box purple"><Briefcase size={20} /></div>
                  <div className="tip-body">
                    <h4>Ваш вектор</h4>
                    <p>Исходя из вашего профиля, мы подбираем наиболее релевантные курсы для достижения цели: {profile?.goal || 'обучение'}.</p>
                  </div>
                </S.DetailedTip>
              </S.TipsContainer>
            </S.ContentCard>
          </S.FadeIn>
        )}
      </S.MaxWidthWrapper>
    </S.DashboardContainer>
  );
}

export default DashboardPage;