import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Sparkles, Clock, Layers } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios'; 
import * as S from './add_course_styles';

export function AddCoursePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'ADMIN') {
      toast.error('Доступ запрещен! Только для администраторов.');
      navigate('/dashboard'); 
    } else {
      setHasAccess(true);
    }
  }, [navigate]);

  // 🔥 ИСПРАВЛЕНО: Убрали aiAnalysis, добавили durationWeeks и format
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    durationWeeks: '',
    format: 'VIDEO', // Значение по умолчанию
    url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 🔥 ИСПРАВЛЕНО: Формируем объект в строгом соответствии с бэкендом и типами данных
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: formData.price.trim(),
        durationWeeks: parseInt(formData.durationWeeks) || 0, // Приводим к числу (integer в БД)
        format: formData.format, // Строка: VIDEO, TEXT, PRACTICE
        url: formData.url.trim(),
        aiAnalysis: null // Изначально общий курс не имеет персонального анализа
      };

      await api.post('/courses', courseData);
      
      toast.success('Курс успешно добавлен!');
      navigate('/dashboard'); 
    } catch (err: any) {
      console.error("❌ Ошибка при сохранении курса:", err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      toast.error(serverMessage ? `Ошибка: ${serverMessage}` : 'Произошла ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

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
              placeholder="О чем этот курс? Укажите стек технологий, ключевые слова и сложность (Junior/Middle) для ИИ-анализа." 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required 
            />
          </S.InputGroup>

          {/* Двухколоночный ряд для цены и длительности */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <S.InputGroup>
              <label>Стоимость (числом)</label>
              <input 
                type="text" 
                placeholder="Напр: 45000" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
              />
            </S.InputGroup>

            <S.InputGroup>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Длительность (в неделях)</label>
              <input 
                type="number" 
                min="1"
                placeholder="Напр: 12" 
                value={formData.durationWeeks}
                onChange={e => setFormData({...formData, durationWeeks: e.target.value})}
                required
              />
            </S.InputGroup>
          </div>

          {/* Выбор формата курса */}
          <S.InputGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Layers size={14} /> Формат обучения</label>
            <select 
              value={formData.format}
              onChange={e => setFormData({...formData, format: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#white',
                fontSize: '14px'
              }}
            >
              <option value="VIDEO">Видео-лекции</option>
              <option value="TEXT">Текстовые материалы</option>
              <option value="PRACTICE">Интерактивная практика / Кодинг</option>
            </select>
          </S.InputGroup>

          <S.InputGroup>
            <label>Ссылка на курс (URL)</label>
            <input 
              type="url" 
              placeholder="https://example.com/course" 
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
              required
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