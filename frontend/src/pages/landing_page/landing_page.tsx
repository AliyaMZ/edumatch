import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Target, Zap, Shield, Clock } from 'lucide-react';
import * as S from './landing_page_styles';

export function LandingPage() {
  const navigate = useNavigate();

  // 🔥 ОПТИМИЗАЦИЯ: Единый обработчик для всех кнопок призыва к действию (CTA)
  const handleStartNavigation = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Если пользователь авторизован — сразу отправляем в личный кабинет
      navigate('/dashboard');
    } else {
      // Если гость — отправляем на авторизацию/регистрацию
      navigate('/auth');
    }
  };

  return (
    <S.PageWrapper>
      {/* 1. Hero Section */}
      <S.Container>
        <S.HeroGrid>
          <div className="content">
            <S.Title>
              Умный подбор учебных материалов с <span>AI-рекомендациями</span>
            </S.Title>
            <S.Subtitle>
              Система анализирует ваши персональные ограничения, цели и предпочтения для подбора идеальных курсов и учебных программ
            </S.Subtitle>
            <S.Button onClick={handleStartNavigation}>
              <Sparkles size={20} /> Начать подбор
            </S.Button>
          </div>

          <S.AICard>
            <S.AnalysisRow color="#4338ca">
              <div className="left">
                <div className="icon-box"><Brain size={24}/></div>
                <div>
                  <div className="text-label">Анализ профиля</div>
                  <div className="text-value">Python разработчик</div>
                </div>
              </div>
              <div className="percentage">95%</div>
            </S.AnalysisRow>
            
            <S.AnalysisRow color="#10b981">
              <div className="left">
                <div className="icon-box"><Target size={24}/></div>
                <div>
                  <div className="text-label">Релевантность</div>
                  <div className="text-value">Fullstack Development</div>
                </div>
              </div>
              <div className="percentage">92%</div>
            </S.AnalysisRow>

            <S.AnalysisRow color="#4338ca">
              <div className="left">
                <div className="icon-box"><Zap size={24}/></div>
                <div>
                  <div className="text-label">Совпадение стека</div>
                  <div className="text-value">Machine Learning</div>
                </div>
              </div>
              <div className="percentage">88%</div>
            </S.AnalysisRow>
          </S.AICard>
        </S.HeroGrid>
      </S.Container>

      {/* 2. How it Works */}
      <S.Section variant="white" id="how-it-works">
        <S.Container>
          <h2 style={{textAlign: 'center', fontSize: '36px', fontWeight: 800, marginBottom: '60px', color: '#1e293b'}}>
            Как это работает
          </h2>
          <S.StepsGrid>
            <S.StepItem>
              <div className="num-circle" style={{background: 'linear-gradient(135deg, #4338ca, #6366f1)'}}>1</div>
              <h3>Введите ваши данные</h3>
              <p>Укажите цели обучения, уровень знаний, бюджет и доступное время в анкете</p>
            </S.StepItem>
            <S.StepItem>
              <div className="num-circle" style={{background: 'linear-gradient(135deg, #4338ca, #10b981)'}}>2</div>
              <h3>AI анализирует</h3>
              <p>Искусственный интеллект EduMatch обрабатывает тысячи курсов и находит подходящие</p>
            </S.StepItem>
            <S.StepItem>
              <div className="num-circle" style={{background: 'linear-gradient(135deg, #10b981, #34d399)'}}>3</div>
              <h3>Выберите курс</h3>
              <p>Получите персонализированные рекомендации с детальным ИИ-обоснованием выбора</p>
            </S.StepItem>
          </S.StepsGrid>
        </S.Container>
      </S.Section>

      {/* 3. Features */}
      <S.Section id="features">
        <S.Container>
          <h2 style={{textAlign: 'center', fontSize: '36px', fontWeight: 800, marginBottom: '60px', color: '#1e293b'}}>
            Почему выбирают EduMatch
          </h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px'}}>
            <S.FeatureCard>
              <div className="icon-wrap" style={{background: '#4338ca15', color: '#4338ca'}}><Target size={28}/></div>
              <h3>Глубокая персонализация</h3>
              <p style={{color: '#64748b', lineHeight: 1.6}}>Учитываем ваши уникальные ограничения: свободное время, бюджет, текущий уровень знаний и желаемый стек</p>
            </S.FeatureCard>

            <S.FeatureCard>
              <div className="icon-wrap" style={{background: '#10b98115', color: '#10b981'}}><Shield size={28}/></div>
              <h3>Доказательный выбор AI</h3>
              <p style={{color: '#64748b', lineHeight: 1.6}}>Каждая рекомендация подкреплена прозрачным автоматическим анализом совместимости с вашими целями</p>
            </S.FeatureCard>

            <S.FeatureCard>
              <div className="icon-wrap" style={{background: '#4338ca15', color: '#4338ca'}}><Clock size={28}/></div>
              <h3>Экономия времени</h3>
              <p style={{color: '#64748b', lineHeight: 1.6}}>Найдите подходящую образовательную траекторию за минуты вместо часов ручного поиска и сравнения сайтов</p>
            </S.FeatureCard>
          </div>
        </S.Container>
      </S.Section>

      {/* 4. CTA (Call to Action) Section */}
      <div id="cta-start" style={{
        background: 'linear-gradient(135deg, #4338ca 0%, #10b981 100%)',
        padding: '90px 0',
        textAlign: 'center',
        color: 'white'
      }}>
        <S.Container>
          <h2 style={{fontSize: '42px', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.5px'}}>
            Готовы найти идеальный курс?
          </h2>
          <p style={{fontSize: '18px', opacity: 0.9, marginBottom: '40px', maxWidth: '650px', margin: '0 auto 40px', lineHeight: 1.5}}>
            Присоединяйтесь к студентам, которые уже используют аналитические алгоритмы для построения персонального образования
          </p>
          <S.Button variant="white" onClick={handleStartNavigation}>
            <Sparkles size={20}/> Начать бесплатно
          </S.Button>
        </S.Container>
      </div>
    </S.PageWrapper>
  );
}

export default LandingPage;