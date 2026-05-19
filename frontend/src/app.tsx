import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast'; // 1. Импорт Toaster
import { AppDispatch } from './store';
import { fetchFavorites } from './store/favoritesSlice';

import { Header } from './features/header';
import { LandingPage } from './pages/landing_page/landing_page';
import { AuthPage } from './pages/auth_page/auth_page';
import { ProfilePage } from './pages/profile_page/profile_page';
import { ResultsPage } from './pages/results_page/results_page';
import { DetailPage } from './pages/details_page/detail_page';
import { DashboardPage } from './pages/dashboard_page/dashboard_page';
import { AddCoursePage } from './pages/add_course_page/add_course_page';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const globalStyles = css`
  :root {
    --primary: #4338ca;
    --accent: #10b981;
    --foreground: #0f172a;
    --muted-foreground: #64748b;
    --border: #e2e8f0;
    --background: #ffffff;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; color: var(--foreground); background: var(--background); }
  html { scroll-behavior: smooth; }
`;

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      dispatch(fetchFavorites(userId));
    }
  }, [dispatch]);

  const hideHeaderPaths = ['/auth'];

  return (
    <>
      <Global styles={globalStyles} />
      <ScrollToTop />
      
      {/* 2. Добавляем Toaster в дерево компонентов */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />
      
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/results" element={<ResultsPage/>} />
          <Route path="/details/:id" element={<DetailPage />} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/add-course" element={<AddCoursePage />} />
          
          <Route path="*" element={<div style={{paddingTop: '100px', textAlign: 'center'}}><h2>404</h2><p>Страница не найдена</p></div>} />
        </Routes>
      </main>
    </>
  );
};

export default App;