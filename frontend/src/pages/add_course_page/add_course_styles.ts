import styled from '@emotion/styled';

export const PageContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background-color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const FormCard = styled.div`
  background: white;
  width: 100%;
  max-width: 600px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: max-width 0.3s ease; /* Плавное расширение при переключении на таблицу */
`;

export const FormHeader = styled.div`
  margin-bottom: 30px;

  h1 {
    font-size: 1.8rem;
    color: #0f172a;
    margin-bottom: 8px;
    margin-top: 12px;
  }

  p {
    color: #64748b;
    font-size: 0.95rem;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #334155;
  }

  input, textarea, select {
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-family: inherit;
    font-size: 1rem;
    transition: all 0.2s;
    background-color: white;

    &:focus {
      outline: none;
      border-color: #e11d48; /* Изменено на административный красный акцент */
      box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

export const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 14px;
  background: #e11d48; /* Изменено под единый стиль панели администратора */
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    background: #be123c;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #fda4af;
    cursor: not-allowed;
    transform: none;
  }
`;

export const CancelButton = styled.button`
  background: transparent;
  color: #64748b;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 5px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f1f5f9;
    color: #334155;
  }
`;


/** Контейнер для обеспечения горизонтального скролла на мобильных устройствах */
export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 16px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

/** Стилизованная таблица реестра */
export const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;

  thead {
    background-color: #f8fafc;
    color: #64748b;
    border-bottom: 2px solid #f1f5f9;
  }

  th {
    padding: 14px 16px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }

  tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #fafafa;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 16px;
    color: #334155;
    vertical-align: middle;
  }
`;

/** Ограничение ширины для ячейки с названием/описанием курса */
export const TextEllipsisCell = styled.div`
  max-width: 240px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  whiteSpace: nowrap;
  color: #0f172a;
`;

/** Контейнер для кнопок действий (Редактировать / Удалить) */
export const ActionButtonsGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

/** Кнопки иконок действий */
export const ActionButton = styled.button<{ variant: 'edit' | 'delete' }>`
  background: transparent;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: ${props => props.variant === 'edit' ? '#0284c7' : '#ef4444'};

  &:hover {
    background-color: ${props => props.variant === 'edit' ? '#e0f2fe' : '#fee2e2'};
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.95);
  }
`;

/** Бейджи для визуального разделения формата курса (VIDEO, TEXT, PRACTICE) */
export const FormatBadge = styled.span<{ formatType: string }>`
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  
  background-color: ${props => {
    if (props.formatType === 'VIDEO') return '#dbeafe';
    if (props.formatType === 'TEXT') return '#fef08a';
    return '#dcfce7'; // PRACTICE
  }};

  color: ${props => {
    if (props.formatType === 'VIDEO') return '#1e40af';
    if (props.formatType === 'TEXT') return '#854d0e';
    return '#166534'; // PRACTICE
  }};
`;

/** Кастомная большая кнопка создания на главной панели реестра */
export const CreateCourseButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #e11d48;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #be123c;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(225, 29, 72, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;