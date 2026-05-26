import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../api/axios'; 
import { toast } from 'react-hot-toast';

import { 
  User as UserIcon, BookMarked, Sparkles, Clock, DollarSign, Video, 
  Target, Lightbulb, Star, TrendingUp, Trash2, Briefcase, Settings, PlusCircle, Award
} from 'lucide-react';

import { RootState, AppDispatch } from '../../store'; 
import { toggleFavoriteLocal, setFavorites } from '../../store/favoritesSlice'; 
import * as S from './dashboard_styles';

interface Course {
  id: number;
  title: string;
  price: string;
  description: string;
  aiAnalysis: string;
  url: string; 
  progress: number; 
  status: string;   
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
  const levelTranslation: Record<string, string> = {
    'beginner': 'Новичок 🎯',
    'intermediate': 'Средний 🚀',
    'advanced': 'Профи 🏆'
  };
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const favoriteIds = useSelector((state: RootState) => state.favorites.items);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [allCourses, setAllCourses] = useState<Course[]>([]); 
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = localStorage.getItem('userId');

  const fetchData = React.useCallback(async (silent = false) => {
    if (!currentUserId) return;

    try {
      if (!silent) setLoading(true);
      
      const profileRes = await api.get(`/users/${currentUserId}`);
      const favCoursesRes = await api.get(`/users/${currentUserId}/favorites`);

      setProfile(profileRes.data);
      
      const normalizedCourses = favCoursesRes.data.map((c: any) => ({
        ...c,
        progress: c.progress ?? 0,
        status: c.status ?? 'NOT_STARTED'
      }));
      
      setAllCourses(normalizedCourses); 
      
      const ids = normalizedCourses.map((c: any) => c.id);
      dispatch(setFavorites(ids)); 
      
      setError(null);
    } catch (err: any) {
      console.error(" Ошибка при загрузке данных дашборда:", err);
      setError("Не удалось загрузить данные личного кабинета.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [currentUserId, dispatch]);

  useEffect(() => {
    if (currentUserId) {
      fetchData();
    } else {
      navigate('/auth');
    }
  }, [currentUserId, fetchData, navigate]);

  const favoriteCourses = useMemo(() => {
    return [...allCourses]
      .filter(course => favoriteIds.includes(course.id))
      .sort((a, b) => a.id - b.id);
  }, [allCourses, favoriteIds]);

  const handleUpdateProgress = async (courseId: number, currentProgress: number) => {
    const newProgress = Math.min(currentProgress + 10, 100);
  
    const newStatus = newProgress === 100 ? 'COMPLETED' : 'IN_PROGRESS';

    setAllCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, progress: newProgress, status: newStatus } : c
    ));

    try {
      await api.put(`/users/${currentUserId}/courses/${courseId}/progress`, {
        progress: newProgress,
        status: newStatus
      });
      
      toast.success("Прогресс обновлен! 📈");
      await fetchData(true); 
    } catch (err) {
      console.error("Ошибка при сохранении прогресса:", err);
      toast.error("Не удалось сохранить прогресс");
      fetchData(true);
    }
  };

  const handleDelete = async (courseId: number) => {
    if (!currentUserId || !window.confirm("Удалить этот курс из избранного?")) return;
    
    try {
      await api.delete(`/users/${currentUserId}/favorites/${courseId}`);
      setAllCourses(prev => prev.filter(c => c.id !== courseId));
      dispatch(toggleFavoriteLocal(courseId));
      toast.success("Курс удален из личного кабинета");
    } catch (err) {
      console.error("Ошибка при удалении курса:", err);
      toast.error("Не удалось удалить курс");
    }
  };

  if (!currentUserId) return null;

  if (loading && !profile) {
    return (
      <S.DashboardContainer>
        <div style={{ textAlign: 'center', padding: '100px', color: '#4338ca', fontWeight: 600 }}>
          <Sparkles className="animate-pulse" style={{ margin: '0 auto 20px', color: '#4338ca' }} size={40} />
          <p>Синхронизация данных профиля EduMatch...</p>
        </div>
      </S.DashboardContainer>
    );
  }

  return (
    <S.DashboardContainer>
      <S.MaxWidthWrapper>
        {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontWeight: 500 }}>⚠️ {error}</div>}
        
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
                  <div className="value">{favoriteCourses.length}</div>
                  <div className="label">Курсов в работе</div>
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
                <div className="icon-wrapper"><Award size={24} /></div>
                <div className="info">
                  <div className="value">
                    {favoriteCourses.filter(c => c.status?.toUpperCase() === 'COMPLETED').length}
                  </div>
                  <div className="label">Завершено курсов</div>
                </div>
              </S.StatCard>
            </S.StatsGrid>

            <S.ContentCard>
              <S.CardHeader>
                <h3>Ваш профиль обучения</h3>
                <S.GhostButton onClick={() => navigate('/profile')} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Settings size={16} /> Изменить цели
                </S.GhostButton>
              </S.CardHeader>
              
              <S.InfoBlock>
                <label>Основная цель</label>
                <S.GoalBox>
                  <div className="goal-icon"><Target size={18} /></div>
                  {profile.goal || "Цель обучения не настроена"}
                </S.GoalBox>
              </S.InfoBlock>
              
              <S.GridTwoCols>
                <S.InfoBlock>
                  <label>Уровень подготовки</label>
                  <S.DataTag>
                    <TrendingUp size={16} />{' '}
                    {profile.level 
                      ? (levelTranslation[profile.level.toLowerCase()] || profile.level) 
                      : "Не указан"
                    }
                  </S.DataTag>
                </S.InfoBlock>
                <S.InfoBlock>
                  <label>Выделенный бюджет</label>
                  <S.DataTag><DollarSign size={16} /> {(profile.budget || 0).toLocaleString()} ₽</S.DataTag>
                </S.InfoBlock>
              </S.GridTwoCols>

              {profile.interests && profile.interests.length > 0 && (
                <S.InfoBlock style={{ marginTop: '20px' }}>
                  <label>Ваши интересы и стек технологий</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {profile.interests.map((interest, idx) => (
                      <span key={idx} style={{ background: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>
                        # {interest}
                      </span>
                    ))}
                  </div>
                </S.InfoBlock>
              )}
            </S.ContentCard>
          </S.FadeIn>
        )}

        {activeTab === 'courses' && (
          <S.FadeIn>
            <S.ContentCard>
              <S.CardHeader>
                <h3>Мои подборки ({favoriteCourses.length})</h3>
                <S.PrimaryButton onClick={() => navigate('/results')}>Открыть рекомендации</S.PrimaryButton>
              </S.CardHeader>

              {favoriteCourses.length === 0 && !loading && (
                <div style={{textAlign: 'center', padding: '60px 20px', color: '#64748b'}}>
                  <BookMarked size={48} style={{marginBottom: '16px', opacity: 0.3, margin: '0 auto'}} />
                  <p>У вас пока нет сохраненных курсов. Перейдите в рекомендации, чтобы добавить первый курс!</p>
                </div>
              )}

              <S.CourseList>
                {favoriteCourses.map(course => (
                  <S.CourseListItem key={course.id}>
                    <S.CourseInfoMain>
                      <div className="title-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                        <h4 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{course.title}</h4>
                        <S.StatusBadge status={course.status?.toLowerCase() || 'not_started'}>
                          {course.status?.toUpperCase() === 'COMPLETED' ? 'Завершен ✨' : 
                           course.status?.toUpperCase() === 'IN_PROGRESS' ? 'В процессе ⏳' : 'Не начат'}
                        </S.StatusBadge>
                      </div>

                      <S.ProgressWrapper>
                        <S.ProgressLabel>
                          <span>Прогресс обучения</span>
                          <span style={{ fontWeight: 600 }}>{course.progress || 0}%</span>
                        </S.ProgressLabel>
                        <S.ProgressBarContainer>
                          <S.ProgressBarFill 
                            progress={course.progress || 0} 
                            status={course.status?.toLowerCase() || 'not_started'} 
                          />
                        </S.ProgressBarContainer>
                      </S.ProgressWrapper>
                      
                      <S.CourseMetaGroup style={{ marginTop: '12px', display: 'flex', gap: '16px', color: '#64748b', fontSize: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={14} /> {parseInt(course.price) ? `${Number(course.price).toLocaleString()} ₽` : course.price}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Video size={14} /> Онлайн-обучение
                        </span>
                      </S.CourseMetaGroup>

                      <S.CardActions style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
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
                          style={{ padding: '0 12px' }}
                        >
                          <PlusCircle size={18} />
                        </S.GhostButton>

                        <S.GhostButton 
                          onClick={() => handleDelete(course.id)} 
                          style={{ color: '#ef4444', border: '1px solid #fee2e2', padding: '0 12px' }}
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
                <div className="ai-circle" style={{ background: '#e0e7ff', color: '#4338ca', padding: '10px', borderRadius: '50%' }}><Sparkles size={20} /></div>
                <div>
                  <h3 style={{ margin: 0 }}>AI Ассистент EduMatch</h3>
                  <p style={{ color: '#64748b', margin: 0 }}>Индивидуальные советы на основе вашего профиля</p>
                </div>
              </S.AiHeader>
              <S.TipsContainer style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <S.DetailedTip>
                  <div className="tip-icon-box blue"><Lightbulb size={20} /></div>
                  <div className="tip-body">
                    <h4>Режим интенсивности обучения</h4>
                    <p>Для вашего графика в <strong>{profile?.hoursPerWeek || 0} ч/нед.</strong> мы рекомендуем заниматься короткими спринтами по 45 минут в день. Это предотвратит выгорание.</p>
                  </div>
                </S.DetailedTip>
                
                <S.DetailedTip>
                  <div className="tip-icon-box purple"><Briefcase size={20} /></div>
                  <div className="tip-body">
                    <h4>Ваш вектор развития</h4>
                    <p>Исходя из вашей цели (<em>{profile?.goal || 'Развитие навыков'}</em>), ИИ рекомендует делать упор на практические блоки курсов. Сначала пишите код, потом читайте теорию.</p>
                  </div>
                </S.DetailedTip>

                {profile?.interests && profile.interests.length > 0 && (
                  <S.DetailedTip>
                    <div className="tip-icon-box green" style={{ background: '#d1fae5', color: '#059669' }}><Sparkles size={20} /></div>
                    <div className="tip-body">
                      <h4>Анализ стека технологий</h4>
                      <p>Вы указали интерес к <strong>{profile.interests.join(', ')}</strong>. Мы уже отранжировали каталог курсов так, чтобы технологии из этого списка находились на первых позициях вашей ленты.</p>
                    </div>
                  </S.DetailedTip>
                )}
              </S.TipsContainer>
            </S.ContentCard>
          </S.FadeIn>
        )}
      </S.MaxWidthWrapper>
    </S.DashboardContainer>
  );
}

export default DashboardPage;