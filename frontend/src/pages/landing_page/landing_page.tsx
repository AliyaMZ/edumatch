import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Target, Zap, Shield, Clock } from 'lucide-react';
import * as S from './landing_page_styles';

export function LandingPage() {
  const navigate = useNavigate();

  // Логика перенаправления: если пользователь залогинен, ведем в кабинет
  // Если нет — на создание профиля или авторизацию
  const handleStartAction = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/dashboard');
    } else {
      navigate('/profile');
    }
  };

  const handleAuthAction = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <S.PageWrapper>
      <S.Container>
        <S.HeroGrid>
          <div className="content">
            <S.Title>
              Умный подбор учебных материалов с <span>AI-рекомендациями</span>
            </S.Title>
            <S.Subtitle>
              Система анализирует ваши персональные ограничения, цели и предпочтения для подбора идеальных курсов и учебных программ
            </S.Subtitle>
            <S.Button onClick={handleStartAction}>
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
                  <div className="text-label">Совпадение</div>
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
          <h2 style={{textAlign: 'center', fontSize: '40px', fontWeight: 800, marginBottom: '60px'}}>Как это работает</h2>
          <S.StepsGrid>
            <S.StepItem>
              <div className="num-circle" style={{background: 'linear-gradient(135deg, #4338ca, #6366f1)'}}>1</div>
              <h3>Введите ваши данные</h3>
              <p>Укажите цели обучения, уровень знаний, бюджет и доступное время</p>
            </S.StepItem>
            <S.StepItem>
              <div className="num-circle" style={{background: 'linear-gradient(135deg, #4338ca, #10b981)'}}>2</div>
              <h3>AI анализирует</h3>
              <p>Искусственный интеллект обрабатывает тысячи курсов и находит подходящие</p>
            </S.StepItem>
            <S.StepItem>
              <div className="num-circle" style={{background: 'linear-gradient(135deg, #10b981, #34d399)'}}>3</div>
              <h3>Выберите курс</h3>
              <p>Получите персонализированные рекомендации с обоснованием выбора</p>
            </S.StepItem>
          </S.StepsGrid>
        </S.Container>
      </S.Section>

      {/* 3. Features */}
      <S.Section id="about">
        <S.Container>
          <h2 style={{textAlign: 'center', fontSize: '40px', fontWeight: 800, marginBottom: '60px'}}>Почему выбирают нас</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px'}}>
            <S.FeatureCard>
              <div className="icon-wrap" style={{background: '#4338ca15', color: '#4338ca'}}><Target size={28}/></div>
              <h3>Глубокая персонализация</h3>
              <p style={{color: '#64748b', lineHeight: 1.6}}>Учитываем ваши уникальные ограничения: время, бюджет, уровень знаний и стиль обучения</p>
            </S.FeatureCard>

            <S.FeatureCard>
              <div className="icon-wrap" style={{background: '#10b98115', color: '#10b981'}}><Shield size={28}/></div>
              <h3>Доказательный выбор AI</h3>
              <p style={{color: '#64748b', lineHeight: 1.6}}>Каждая рекомендация подкреплена детальным обоснованием и анализом совместимости</p>
            </S.FeatureCard>

            <S.FeatureCard>
              <div className="icon-wrap" style={{background: '#4338ca15', color: '#4338ca'}}><Clock size={28}/></div>
              <h3>Экономия времени</h3>
              <p style={{color: '#64748b', lineHeight: 1.6}}>Найдите идеальный курс за минуты вместо часов ручного поиска и сравнения</p>
            </S.FeatureCard>
          </div>
        </S.Container>
      </S.Section>

      {/* 4. CTA Section */}
      <div id="faq" style={{
        background: 'linear-gradient(135deg, #4338ca 0%, #10b981 100%)',
        padding: '100px 0',
        textAlign: 'center',
        color: 'white'
      }}>
        <S.Container>
          <h2 style={{fontSize: '48px', fontWeight: 800, marginBottom: '24px'}}>Готовы найти идеальный курс?</h2>
          <p style={{fontSize: '20px', opacity: 0.9, marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px'}}>
            Присоединяйтесь к тысячам студентов, которые уже используют AI для подбора образования
          </p>
          <S.Button variant="white" onClick={handleAuthAction}>
            <Sparkles size={20}/> Начать бесплатно
          </S.Button>
        </S.Container>
      </div>
    </S.PageWrapper>
  );
}

export default LandingPage;