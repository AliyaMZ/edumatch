import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, DollarSign, Video, FileText, Code, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as S from './profile_styles';

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
        const res = await axios.get(`http://localhost:8080/api/users/${userId}`);
        const data = res.data;
        
        // Заполняем поля данными с сервера
        if (data.username) setUsername(data.username);
        if (data.goal) setGoal(data.goal);
        if (data.level) setLevel(data.level);
        if (data.hoursPerWeek) setHours(data.hoursPerWeek);
        if (data.budget) setBudget(data.budget);
        if (data.preferredFormats) setFormats(data.preferredFormats);
        if (data.interests) setInterests(data.interests);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
      } finally {
        setFetching(false);
      }
    };

    loadCurrentProfile();
  }, [userId, navigate]);

  // 2. Логика управления форматами и интересами
  const toggleFormat = (format: string) => {
    setFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
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
    // Базовая валидация
    if (!username.trim()) return alert("Пожалуйста, введите ваше имя");
    if (!goal.trim()) return alert("Пожалуйста, укажите вашу цель обучения");

    setLoading(true);
    try {
      const profileData = {
        username: username.trim(),
        goal: goal.trim(),
        level,
        hoursPerWeek: hours,
        budget,
        preferredFormats: formats,
        interests
      };

      // Отправка на бэкенд
      await axios.put(`http://localhost:8080/api/users/${userId}/profile`, profileData);
      
      // Синхронизация с локальным хранилищем для мгновенного обновления UI в хэдере
      localStorage.setItem('userName', username.trim());
      
      alert('Профиль успешно обновлен!');
      navigate('/dashboard'); 
    } catch (err) {
      console.error("Ошибка при сохранении профиля:", err);
      alert('Не удалось сохранить изменения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <S.Container>
        <div style={{ textAlign: 'center', paddingTop: '100px', color: '#64748b' }}>
          <Sparkles className="animate-pulse" size={48} style={{ marginBottom: '20px', color: '#4338ca' }} />
          <p>Загружаем настройки вашего профиля...</p>
        </div>
      </S.Container>
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
            <S.Label>Ваш текущий уровень</S.Label>
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
            <S.Label><DollarSign size={18} /> Максимальный бюджет (₽)</S.Label>
            <S.InputField 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))} 
            />
          </div>
        </S.Card>

        {/* --- ПРЕДПОЧТЕНИЯ --- */}
        <S.Card>
          <h3>Форматы и темы</h3>
          <div style={{ marginBottom: '32px' }}>
            <S.Label>Удобные форматы</S.Label>
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
                  <button onClick={() => removeInterest(item)}><X size={14} /></button>
                </S.Tag>
              ))}
              {interests.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Темы пока не добавлены</p>}
            </div>
            <S.InputRow>
              <input 
                type="text" 
                placeholder="Напр: Python, Дизайн..." 
                value={newInterest} 
                onChange={(e) => setNewInterest(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && addInterest()} 
              />
              <button type="button" onClick={addInterest}>Добавить</button>
            </S.InputRow>
          </div>
        </S.Card>

        <S.SubmitButton onClick={handleSubmitProfile} disabled={loading}>
          <Sparkles size={22} />
          {loading ? 'Сохраняем...' : 'Применить изменения'}
        </S.SubmitButton>
      </S.ContentWrapper>
    </S.Container>
  );
}

export default ProfilePage;