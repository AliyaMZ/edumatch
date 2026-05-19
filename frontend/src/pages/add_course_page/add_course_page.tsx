import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

// 🔥 ИСПРАВЛЕНО: импортируем наш настроенный инстанс
import api from '../../api/axios'; 
import * as S from './add_course_styles';

export function AddCoursePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'ADMIN') {
      // 2. Заменяем alert на toast.error
      toast.error('Доступ запрещен! Только для администраторов.');
      navigate('/dashboard'); 
    } else {
      setHasAccess(true);
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    aiAnalysis: '',
    url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: formData.price.trim(),
        aiAnalysis: formData.aiAnalysis.trim(),
        url: formData.url.trim()
      };

      await api.post('/courses', courseData);
      
      // 3. Заменяем успех на toast.success
      toast.success('Курс успешно добавлен!');
      navigate('/dashboard'); 
    } catch (err: any) {
      console.error("❌ Ошибка при сохранении курса:", err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      
      // 4. Заменяем ошибку на toast.error
      toast.error(serverMessage ? `Ошибка: ${serverMessage}` : 'Произошла ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ИСПРАВЛЕНО: Пока роль проверяется, показываем заглушку, а не секретную форму
  if (!hasAccess) {
    return (
      <S.PageContainer>
        <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
          <Sparkles className="animate-pulse" size={40} style={{ margin: '0 auto 20px', color: '#e11d48' }} />
          <p>Проверка прав администратора...</p>
        </div>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.FormCard>
        <S.FormHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e11d48' }}>
            <ShieldAlert size={24} />
            <span style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>Панель администратора</span>
          </div>
          <h1>Добавить курс</h1>
          <p>Заполните данные для отображения в каталоге</p>
        </S.FormHeader>

        <S.StyledForm onSubmit={handleSubmit}>
          <S.InputGroup>
            <label>Название курса</label>
            <input 
              type="text" 
              placeholder="Напр: Python для начинающих" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required 
            />
          </S.InputGroup>

          <S.InputGroup>
            <label>Описание</label>
            <textarea 
              placeholder="О чем этот курс?" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required 
            />
          </S.InputGroup>

          <S.InputGroup>
            <label>Стоимость</label>
            <input 
              type="text" 
              placeholder="Напр: 45 000 ₽" 
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </S.InputGroup>

          <S.InputGroup>
            <label>AI Анализ (почему этот курс подходит пользователю?)</label>
            <textarea 
              placeholder="Этот курс подходит вам, потому что..." 
              value={formData.aiAnalysis}
              onChange={e => setFormData({...formData, aiAnalysis: e.target.value})}
            />
          </S.InputGroup>

          <S.InputGroup>
            <label>Ссылка на курс (URL)</label>
            <input 
              type="url" 
              placeholder="https://example.com" 
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
            />
          </S.InputGroup>

          <S.SubmitButton type="submit" disabled={loading}>
            {loading ? 'Сохранение...' : 'Опубликовать курс'}
          </S.SubmitButton>
          
          <S.CancelButton type="button" onClick={() => navigate('/dashboard')}>
            Отмена
          </S.CancelButton>
        </S.StyledForm>
      </S.FormCard>
    </S.PageContainer>
  );
}

export default AddCoursePage;