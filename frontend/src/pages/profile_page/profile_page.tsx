import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, DollarSign, Video, FileText, Code, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import * as S from './profile_styles';
import { toast } from 'react-hot-toast';

export function ProfilePage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  // Состояния для данных профиля
  const [username, setUsername] = useState(localStorage.getItem('userName') || '');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [hours, setHours] = useState(10);
  const [budget, setBudget] = useState(50000);
  const [formats, setFormats] = useState<string[]>(['video']);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Загрузка текущих данных профиля при монтировании
  useEffect(() => {
    if (!userId) {
      navigate('/auth');
      return;
    }

    const loadCurrentProfile = async () => {
      try {
        setFetching(true);
        const res = await api.get(`/users/${userId}`);
        const data = res.data;
        
        if (data.username) setUsername(data.username);
        if (data.goal) setGoal(data.goal);
        
        // Защита от Java Enum уровня знаний
        if (data.level) {
          setLevel(data.level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced');
        }
        
        if (data.hoursPerWeek) setHours(data.hoursPerWeek);
        if (data.budget !== undefined) setBudget(data.budget);
        
        // 🔥 ИСПРАВЛЕНО: Маппинг форматов из UPPER_CASE (с бэкенда) в lower_case (для UI стейта)
        if (data.preferredFormats && Array.isArray(data.preferredFormats)) {
          setFormats(data.preferredFormats.map((f: string) => f.toLowerCase()));
        }
        
        if (data.interests) setInterests(data.interests);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
        toast.error("Не удалось загрузить данные профиля");
      } finally {
        setFetching(false);
      }
    };

    loadCurrentProfile();
  }, [userId, navigate]);

  // 2. Логика управления форматами и интересами
  const toggleFormat = (format: string) => {
    setFormats(prev => {
      if (prev.includes(format)) {
        // Защита: не позволяем убрать единственный выбранный формат
        if (prev.length === 1) return prev; 
        return prev.filter(f => f !== format);
      }
      return [...prev, format];
    });
  };

  const addInterest = () => {
    const trimmed = newInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setNewInterest('');
    }
  };

  const removeInterest = (item: string) => {
    setInterests(interests.filter(i => i !== item));
  };

  // 3. Сохранение обновлений
  const handleSubmitProfile = async () => {
    if (!username.trim()) {
      toast.error("Пожалуйста, введите ваше имя");
      return;
    }
    if (!goal.trim()) {
      toast.error("Пожалуйста, укажите вашу цель обучения");
      return;
    }
    if (formats.length === 0) {
      toast.error("Пожалуйста, выберите хотя бы один удобный формат обучения");
      return;
    }

    setLoading(true);
    try {
      const formattedToUppercase = formats.map(f => f.toUpperCase());

      const profileData = {
        username: username.trim(),
        goal: goal.trim(),
        level: level.toUpperCase(),
        hoursPerWeek: Number(hours),
        // 🔥 ИСПРАВЛЕНО: Защита от отрицательного бюджета на случай ввода пользователем с клавиатуры
        budget: Math.max(0, Number(budget)),
        preferredFormats: formattedToUppercase,
        interests: interests
      };

      await api.put(`/users/${userId}/profile`, profileData);
      
      localStorage.setItem('userName', username.trim());
      
      toast.success('Профиль успешно обновлен!'); 
      navigate('/dashboard'); 
    } catch (err: any) {
      console.error("Ошибка при сохранении профиля:", err);
      const serverMessage = err.response?.data?.message || err.message;
      toast.error(`Не удалось сохранить изменения: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <S.PageWrapper>
        <S.Container>
          <div style={{ textAlign: 'center', paddingTop: '120px', color: '#64748b' }}>
            <Sparkles className="animate-pulse" size={48} style={{ marginBottom: '20px', color: '#4338ca' }} />
            <p style={{ fontSize: '16px', fontWeight: 500 }}>Загружаем настройки вашего профиля...</p>
          </div>
        </S.Container>
      </S.PageWrapper>
    );
  }

  return (
    <S.Container>
      <S.ContentWrapper>
        <S.Header>
          <h1>Настройка профиля</h1>
          <p>Отредактируйте свои данные, чтобы AI точнее подбирал курсы</p>
        </S.Header>

        {/* --- ОСНОВНАЯ ИНФОРМАЦИЯ --- */}
        <S.Card>
          <h3>Личные данные</h3>
          <div style={{ marginBottom: '24px' }}>
            <S.Label><User size={18} /> Как вас зовут?</S.Label>
            <S.InputField 
              type="text" 
              placeholder="Введите ваше имя" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <S.Label>Чего вы хотите достичь?</S.Label>
            <S.TextArea 
              rows={3} 
              placeholder="Например: Хочу освоить React и найти работу frontend-разработчиком" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <div>
            <S.Label>Ваш текущий уровень знаний</S.Label>
            <S.ButtonGrid>
              <S.OptionButton active={level === 'beginner'} onClick={() => setLevel('beginner')}>
                Новичок
              </S.OptionButton>
              <S.OptionButton active={level === 'intermediate'} onClick={() => setLevel('intermediate')}>
                Средний
              </S.OptionButton>
              <S.OptionButton active={level === 'advanced'} onClick={() => setLevel('advanced')}>
                Профи
              </S.OptionButton>
            </S.ButtonGrid>
          </div>
        </S.Card>

        {/* --- РЕСУРСЫ --- */}
        <S.Card>
          <h3>Ваши возможности</h3>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <S.Label><Clock size={18} /> Часов в неделю на обучение</S.Label>
              <span style={{ fontWeight: 700, color: '#4338ca', fontSize: '18px' }}>{hours} ч</span>
            </div>
            <S.RangeInput 
              type="range" 
              min="1" 
              max="60" 
              value={hours} 
              onChange={(e) => setHours(Number(e.target.value))} 
            />
          </div>
          <div>
            <S.Label><DollarSign size={18} /> Максимальный бюджет на курс (₽)</S.Label>
            <S.InputField 
              type="number" 
              min="0"
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))} 
            />
          </div>
        </S.Card>

        {/* --- ПРЕДПОЧТЕНИЯ --- */}
        <S.Card>
          <h3>Форматы и темы</h3>
          <div style={{ marginBottom: '32px' }}>
            <S.Label>Удобные форматы контента</S.Label>
            <S.ButtonGrid>
              <S.OptionButton active={formats.includes('video')} onClick={() => toggleFormat('video')}>
                <Video size={20} /> <span>Видео</span>
              </S.OptionButton>
              <S.OptionButton active={formats.includes('text')} onClick={() => toggleFormat('text')}>
                <FileText size={20} /> <span>Текст</span>
              </S.OptionButton>
              <S.OptionButton active={formats.includes('practice')} onClick={() => toggleFormat('practice')}>
                <Code size={20} /> <span>Практика</span>
              </S.OptionButton>
            </S.ButtonGrid>
          </div>
          <div>
            <S.Label>Интересующие направления</S.Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {interests.map(item => (
                <S.Tag key={item}>
                  {item}
                  <button type="button" onClick={() => removeInterest(item)}><X size={14} /></button>
                </S.Tag>
              ))}
              {interests.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Темы пока не добавлены</p>}
            </div>
            <S.InputRow>
              <input 
                type="text" 
                placeholder="Напр: Python, React, Spring Boot..." 
                value={newInterest} 
                onChange={(e) => setNewInterest(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); 
                    addInterest();
                  }
                }} 
              />
              <button type="button" onClick={addInterest}>Добавить</button>
            </S.InputRow>
          </div>
        </S.Card>

        <S.SubmitButton onClick={handleSubmitProfile} disabled={loading}>
          <Sparkles size={22} />
          {loading ? 'Сохраняем конфигурацию...' : 'Применить изменения и пересчитать рекомендации'}
        </S.SubmitButton>
      </S.ContentWrapper>
    </S.Container>
  );
}

export default ProfilePage;