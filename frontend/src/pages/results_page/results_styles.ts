import styled from '@emotion/styled';

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding-top: 100px;
  padding-bottom: 64px;
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// Sidebar / Filters (Обновлено под 2.png)
export const Sidebar = styled.aside`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  height: fit-content;
  position: sticky;
  top: 100px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

export const FilterSection = styled.div`
  margin-bottom: 24px;
  h4 {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 16px;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;

  input {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 2px solid #cbd5e1;
    accent-color: #4338ca;
  }

  svg {
    color: #94a3b8;
  }

  &:hover { color: #1e293b; }
`;

// Course Card (Обновлено под 4.png)
export const Card = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

// Бейдж релевантности (цвет как на макете)
export const MatchBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #10b981; // Ярко-зеленый из 4.png
  color: white;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
`;

// AI-обоснование (светло-фиолетовый фон как на фото)
export const AIReasonBox = styled.div`
  background: #f5f3ff; // Цвет фона из 4.png
  border: 1px solid #ddd6fe;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  display: flex;
  gap: 16px;
  
  p {
    color: #4338ca; // Фиолетовый текст для AI-описания
    font-size: 14px;
    line-height: 1.5;
  }
`;

export const AIIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #ddd6fe;
  color: #4338ca;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12px;
  flex-shrink: 0;
`;

export const CourseTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

export const ProviderText = styled.p`
  color: #94a3b8; // Более приглушенный серый
  font-size: 14px;
  margin-bottom: 16px;
`;

export const MetaGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 24px;

  div {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .rating {
    display: flex;
    align-items: center;
    color: #f59e0b;
    font-weight: 600;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const PrimaryButton = styled.button`
  flex: 1;
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover { background: #3730a3; }
`;

// Кнопка избранного (с поддержкой активного состояния)
export const IconButton = styled.button<{ isFavorite?: boolean }>`
  padding: 14px;
  border: 1px solid ${props => props.isFavorite ? '#fecaca' : '#e2e8f0'};
  background: ${props => props.isFavorite ? '#fef2f2' : 'white'};
  border-radius: 12px;
  color: ${props => props.isFavorite ? '#ef4444' : '#64748b'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.isFavorite ? '#fee2e2' : '#f1f5f9'};
    color: ${props => props.isFavorite ? '#dc2626' : '#1e293b'};
  }
`;