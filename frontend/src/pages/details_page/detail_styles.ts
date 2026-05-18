import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.5; }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding-top: 6rem;
  padding-bottom: 4rem;
`;

export const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: color 0.2s;
  font-size: 1rem;
  &:hover { color: #1e293b; }
`;

export const Layout = styled.div`
  display: grid;
  gap: 2rem;
  /* Добавляем align-items: flex-start, чтобы липкий элемент работал корректно */
  align-items: flex-start; 
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 380px;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

export const RelevanceBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(to right, #4338ca, #10b981);
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  span {
    width: 0.5rem;
    height: 0.5rem;
    background: white;
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
`;

export const ModuleItem = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
`;

export const ModuleHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  &:hover { background-color: #f1f5f9; }
`;

export const CharacteristicGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }
`;

export const CharItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
`;

/* ИЗМЕНЕНИЯ ТУТ: Весь сайдбар становится липким */
export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: 1024px) {
    position: sticky;
    top: 6.5rem; /* Отступ сверху при скролле */
    align-self: flex-start; /* Предотвращает растягивание колонки по высоте */
  }
`;

/* Убираем sticky отсюда, чтобы карточка не "липла" отдельно от анализа */
export const PriceCard = styled(Card)`
  margin-bottom: 0;
`;

export const AIAnalysisCard = styled.div`
  background: linear-gradient(to bottom right, rgba(67, 56, 202, 0.05), rgba(16, 185, 129, 0.05));
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(67, 56, 202, 0.2);
`;

export const PrimaryButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #4338ca;
  color: white;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  &:hover { opacity: 0.9; }
`;

export const FavoriteButton = styled.button<{ isFavorite: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${props => props.isFavorite ? '#ef4444' : '#e2e8f0'};
  background-color: ${props => props.isFavorite ? '#fef2f2' : 'transparent'};
  color: ${props => props.isFavorite ? '#dc2626' : '#1e293b'};
`;

// Добавь эти компоненты к существующим экспортам

export const ProgressSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;

  .progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

export const ProgressBarFill = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: linear-gradient(to right, #4338ca, #6366f1);
  transition: width 0.4s ease-out;
`;

export const UpdateProgressBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #4338ca;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }

  &:disabled {
    color: #10b981;
    cursor: default;
    border-color: #d1fae5;
    background-color: #f0fdf4;
  }
`;