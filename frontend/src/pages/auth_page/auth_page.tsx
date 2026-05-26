import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User } from 'lucide-react'; 
import { toast } from 'react-hot-toast';

import api from '../../api/axios'; 
import * as A from './auth_styles';
import vkLogo from '../../assets/vklogo.png';


interface AuthResponse {
  token?: string;
  userId?: number;
  role?: string;
  username?: string; 
}

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false); 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    
    const safeEmail = (email || '').trim().toLowerCase();
    const safePassword = password || '';
    const safeUsername = (username || '').trim();

    try {

      ['token', 'userId', 'userRole', 'userName'].forEach(key => localStorage.removeItem(key));

      if (isLogin) {
  
        const response = await api.post('/auth/login', {
          email: safeEmail,
          password: safePassword
        });

        const data = response.data as AuthResponse;

        localStorage.setItem('token', data.token || '');
        localStorage.setItem('userId', data.userId?.toString() || '');
        localStorage.setItem('userRole', data.role || 'USER');
        localStorage.setItem('userName', data.username || safeEmail.split('@')[0] || 'User');

        toast.success('Успешный вход!');
        
        if (data.role === 'ADMIN') {
          navigate('/add-course');
        } else {
          navigate('/dashboard'); 
        }
      } else {
        const registerData = {
          username: safeUsername,
          email: safeEmail,
          password: safePassword
        };

        const response = await api.post('/auth/register', registerData);
        
        const data = response.data as AuthResponse;

        localStorage.setItem('token', data.token || '');
        localStorage.setItem('userId', data.userId?.toString() || '');
        localStorage.setItem('userRole', data.role || 'USER');
        localStorage.setItem('userName', safeUsername || 'User');

        toast.success('Аккаунт создан! Давайте настроим ваш профиль.');
        
        navigate('/profile'); 
      }
    } catch (err: any) {
      console.error(" Ошибка аутентификации:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Ошибка доступа. Проверьте введенные данные.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); 
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#4338ca' }} />
                <span>Запомнить меня</span>
              </label>
              {isLogin && <button type="button" style={{ background: 'none', border: 'none', color: '#4338ca', cursor: 'pointer', fontSize: '13px' }}>Забыли пароль?</button>}
            </A.ActionRow>

            <A.MainButton type="submit" disabled={isLoading}>
              {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
              {!isLoading && <ArrowRight size={20} />}
            </A.MainButton>
          </form>

          <div style={{ margin: '24px 0', color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
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