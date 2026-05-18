import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, ShieldAlert } from 'lucide-react'; // Добавил иконку предупреждения
import * as S from './add_course_styles';

export function AddCoursePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // 1. Проверка прав доступа при загрузке страницы
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'ADMIN') {
      alert('Доступ запрещен! Только администраторы могут добавлять курсы.');
      navigate('/dashboard'); // Отправляем обычного юзера обратно
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
      // 2. Отправляем запрос на бэкенд
      await axios.post('http://localhost:8080/api/courses', formData);
      alert('Курс успешно добавлен в базу данных!');
      navigate('/dashboard'); 
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      alert('Произошла ошибка при сохранении курса. Проверьте соединение с бэкендом.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.PageContainer>
      <S.FormCard>
        <S.FormHeader>
          {/* Добавили визуальную пометку, что это панель управления */}
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