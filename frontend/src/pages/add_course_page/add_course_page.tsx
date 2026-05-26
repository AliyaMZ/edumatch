import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Sparkles, Clock, Layers, Trash2, Edit3, PlusCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios'; 
import * as S from './add_course_styles';

interface Course {
  id?: number;
  title: string;
  description: string;
  price: string;
  durationWeeks: number;
  format: string;
  url: string;
  aiAnalysis: string | null;
}

export function AddCoursePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  

  const [courses, setCourses] = useState<Course[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    durationWeeks: '',
    format: 'VIDEO',
    url: ''
  });

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'ADMIN') {
      toast.error('Доступ запрещен! Только для администраторов.');
      navigate('/dashboard'); 
    } else {
      setHasAccess(true);
      fetchCourses();
    }
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      const data = response.data.content || response.data;
      setCourses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Ошибка при получении списка курсов:", err);
      toast.error('Не удалось загрузить каталог ресурсов');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (course: Course) => {
    if (!course.id) return;
    setEditingCourseId(course.id);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price.toString(),
      durationWeeks: course.durationWeeks.toString(),
      format: course.format,
      url: course.url
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingCourseId(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      durationWeeks: '',
      format: 'VIDEO',
      url: ''
    });
    setIsFormOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы действительно хотите удалить этот учебный материал из каталога?')) {
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/courses/${id}`);
      toast.success('Курс успешно удален из системы');
      setCourses(courses.filter(course => course.id !== id));
    } catch (err: any) {
      console.error(" Ошибка при удалении записи:", err);
      const errMsg = err.response?.data?.message || 'Не удалось удалить курс';
      toast.error(`Ошибка: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const courseData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: formData.price.trim(),
      durationWeeks: parseInt(formData.durationWeeks) || 0,
      format: formData.format,
      url: formData.url.trim(),
      aiAnalysis: null 
    };

    try {
      if (editingCourseId) {
        await api.put(`/courses/${editingCourseId}`, courseData);
        toast.success('Параметры курса успешно изменены!');
      } else {
        await api.post('/courses', courseData);
        toast.success('Новый курс успешно добавлен!');
      }
      
      resetForm();
      fetchCourses();
    } catch (err: any) {
      console.error("Ошибка при сохранении формы:", err);
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
      {isFormOpen ? (
        <S.FormCard>
          <S.FormHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e11d48' }}>
              <ShieldAlert size={24} />
              <S.FormatBadge formatType="DELETE">Панель администратора</S.FormatBadge>
            </div>
            <h1>{editingCourseId ? 'Изменить параметры курса' : 'Добавить курс'}</h1>
            <p>Заполните данные для отображения в общем каталоге системы</p>
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> Длительность (в неделях)
                </label>
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

            <S.InputGroup>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={14} /> Формат обучения
              </label>
              <select 
                value={formData.format}
                onChange={e => setFormData({...formData, format: e.target.value})}
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
              {loading ? 'Сохранение...' : editingCourseId ? 'Сохранить изменения' : 'Опубликовать курс'}
            </S.SubmitButton>
            
            <S.CancelButton type="button" onClick={resetForm}>
              Назад к списку
            </S.CancelButton>
          </S.StyledForm>
        </S.FormCard>
      ) : (
        <S.FormCard style={{ maxWidth: '900px', width: '100%' }}>
          <S.FormHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e11d48' }}>
                <ShieldAlert size={24} />
                <S.FormatBadge formatType="DELETE">Управление ресурсами</S.FormatBadge>
              </div>
              <S.CancelButton 
                onClick={() => navigate('/dashboard')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 0 }}
              >
                <ArrowLeft size={16} /> В личный кабинет
              </S.CancelButton>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1>Каталог материалов</h1>
                <p>Просмотр текущей базы данных, изменение параметров и удаление образовательных программ</p>
              </div>
              <S.CreateCourseButton onClick={() => setIsFormOpen(true)}>
                <PlusCircle size={18} /> Добавить курс
              </S.CreateCourseButton>
            </div>
          </S.FormHeader>

          {loading && courses.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Синхронизация с базой данных...</p>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
              <p>В каталоге системы еще нет зарегистрированных курсов.</p>
            </div>
          ) : (
            <S.TableContainer>
              <S.AdminTable>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Формат</th>
                    <th>Длительность</th>
                    <th>Стоимость</th>
                    <th style={{ textAlign: 'right' }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <S.TextEllipsisCell title={course.title}>
                          {course.title}
                        </S.TextEllipsisCell>
                      </td>
                      <td>
                        <S.FormatBadge formatType={course.format}>
                          {course.format === 'VIDEO' ? 'Видео' : course.format === 'TEXT' ? 'Текст' : 'Практика'}
                        </S.FormatBadge>
                      </td>
                      <td style={{ color: '#64748b' }}>{course.durationWeeks} нед.</td>
                      <td style={{ fontWeight: '600', color: '#0f172a' }}>
                        {parseInt(course.price).toLocaleString()} ₽
                      </td>
                      <td>
                        <S.ActionButtonsGroup>
                          <S.ActionButton 
                            variant="edit" 
                            onClick={() => handleEditClick(course)}
                            title="Изменить параметры"
                          >
                            <Edit3 size={18} />
                          </S.ActionButton>
                          <S.ActionButton 
                            variant="delete" 
                            onClick={() => course.id && handleDelete(course.id)}
                            title="Удалить из системы"
                          >
                            <Trash2 size={18} />
                          </S.ActionButton>
                        </S.ActionButtonsGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </S.AdminTable>
            </S.TableContainer>
          )}
        </S.FormCard>
      )}
    </S.PageContainer>
  );
}

export default AddCoursePage;