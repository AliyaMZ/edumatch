import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate, Link, useLocation } from 'react-router-dom';


const NavContainer = styled.header`
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 72px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.nav`
  display: none;
  gap: 2rem;
  @media (min-width: 768px) { display: flex; }
  a {
    text-decoration: none;
    color: var(--muted-foreground);
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
    &:hover { color: var(--primary); }
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--foreground);
  .box {
    width: 32px; height: 32px;
    background: linear-gradient(to bottom right, var(--primary), var(--accent));
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 0.8rem;
  }
`;


export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, [location]);

  const isAuthenticated = !!userId;

  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserId(null);
    navigate('/');
  };

  return (
    <NavContainer>
      <Content>
        <Logo to="/">
          <div className="box">AI</div>
          EduMatch
        </Logo>

        <NavLinks>
          <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')}>Как это работает</a>
          <a href="#about" onClick={(e) => handleScroll(e, 'about')}>О нас</a>
          <a href="/dashboard" onClick={handleDashboardClick}>Личный кабинет</a>
        </NavLinks>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {!isAuthenticated ? (
            <>
              <button 
                onClick={() => navigate('/auth')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}
              >
                Войти
              </button>
              <button 
                onClick={() => navigate('/auth?mode=register')}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
              >
                Начать
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5rem 1.25rem', 
                  borderRadius: '10px', 
                  cursor: 'pointer', 
                  fontWeight: 600 
                }}
              >
                Выйти
              </button>
            </>
          )}
        </div>
      </Content>
    </NavContainer>
  );
}

export default Header;