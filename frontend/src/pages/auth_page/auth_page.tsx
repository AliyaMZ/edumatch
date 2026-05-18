import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, User } from 'lucide-react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; 
import * as A from './auth_styles';
import vkLogo from '../../assets/vklogo.png';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') setIsLogin(false);
    else if (mode === 'login') setIsLogin(true);
  }, [location]);

  // --- ОБНОВЛЕННЫЙ ОБРАБОТЧИК ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // --- ЛОГИКА ВХОДА ---
        const response = await axios.post(`http://localhost:8080/api/users/login`, {
          email,
          password
        });

        const user = response.data;

        // Сохраняем данные сессии
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.username);

        alert(`С возвращением, ${user.username}!`);
        
        // Вход всегда ведет в Личный кабинет (Dashboard)
        navigate('/dashboard'); 
        
      } else {
        // --- ЛОГИКА РЕГИСТРАЦИИ ---
        const newUser = {
          username: username,
          email: email,
          password: password,
          role: 'USER'
        };

        const response = await axios.post('http://localhost:8080/api/users', newUser);
        const createdUser = response.data;

        // Автоматически "логиним" пользователя после регистрации
        localStorage.setItem('userId', createdUser.id.toString());
        localStorage.setItem('userRole', createdUser.role);
        localStorage.setItem('userName', createdUser.username);

        alert('Аккаунт создан! Давайте настроим ваш профиль.');
        
        // Регистрация ведет на страницу заполнения данных о себе
        navigate('/profile'); 
      }
    } catch (err: any) {
      console.error("Ошибка:", err);
      const errorMessage = err.response?.data || 'Ошибка доступа. Проверьте данные.';
      alert(errorMessage);
    }
  };

  return (
    <A.AuthWrapper>
      <A.VisualSide>
        <A.GlassCard>
          <div className="icon-wrap">🎓</div>
          <h2>"Непрерывное обучение — ключ к успеху в мире AI"</h2>
          <p>
            Персонализированные рекомендации помогают находить курсы, которые
            идеально соответствуют вашим целям и возможностям.
          </p>
          <A.UserAvatars>
            <div className="circles">
              <div style={{ background: '#f59e0b' }} />
              <div style={{ background: '#10b981' }} />
              <div style={{ background: '#ec4899' }} />
            </div>
            <span>Более 10,000+ пользователей</span>
          </A.UserAvatars>
        </A.GlassCard>
      </A.VisualSide>

      <A.FormSide>
        <A.FormContainer>
          <h1>{isLogin ? 'Добро пожаловать' : 'Создать аккаунт'}</h1>
          <p className="subtitle">
            {isLogin ? 'Войдите для доступа к AI-рекомендациям' : 'Начните путь к знаниям сегодня'}
          </p>

          <A.TabSwitcher>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              style={{
                background: isLogin ? 'white' : 'transparent',
                boxShadow: isLogin ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                color: isLogin ? '#1e293b' : '#64748b',
              }}
            >
              Войти
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              style={{
                background: !isLogin ? 'white' : 'transparent',
                boxShadow: !isLogin ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                color: !isLogin ? '#1e293b' : '#64748b',
              }}
            >
              Регистрация
            </button>
          </A.TabSwitcher>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <A.InputGroup>
                <label>Имя пользователя</label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input 
                    type="text" 
                    placeholder="Ivan Ivanov" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                  />
                </div>
              </A.InputGroup>
            )}

            <A.InputGroup>
              <label>Email</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </A.InputGroup>

            <A.InputGroup>
              <label>Пароль</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </A.InputGroup>

            <A.ActionRow>
              <label>
                <input type="checkbox" />
                <span>Запомнить меня</span>
              </label>
              {isLogin && <button type="button">Забыли пароль?</button>}
            </A.ActionRow>

            <A.MainButton type="submit">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
              <ArrowRight size={20} />
            </A.MainButton>
          </form>

          <div style={{ margin: '24px 0', color: '#94a3b8', fontSize: '14px' }}>
            Или продолжить с
          </div>

          <A.SocialGrid>
            <button type="button">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" alt="G" />
              Google
            </button>
            <button type="button">
                <img 
                    src={vkLogo} 
                    alt="VK" 
                    style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                />
                VK
            </button>
          </A.SocialGrid>
        </A.FormContainer>
      </A.FormSide>
    </A.AuthWrapper>
  );
}

export default AuthPage;