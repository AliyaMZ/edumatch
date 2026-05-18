import styled from '@emotion/styled';

export const Container = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 120px 24px 64px;
`;

export const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
  h1 {
    font-size: 40px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }
  p {
    font-size: 18px;
    color: #64748b;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 24px;
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
  
  svg { color: #4338ca; }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  font-family: inherit;
  font-size: 15px;
  transition: all 0.2s ease;
  resize: none;
  &:focus { 
    border-color: #4338ca; 
    background: white; 
    box-shadow: 0 0 0 4px rgba(67, 56, 202, 0.1); 
  }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  font-family: inherit;
  font-size: 15px;
  transition: all 0.2s ease;
  
  &:focus { 
    border-color: #4338ca; 
    background: white; 
    box-shadow: 0 0 0 4px rgba(67, 56, 202, 0.1); 
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

export const OptionButton = styled.button<{ active: boolean }>`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid ${props => props.active ? '#4338ca' : '#e2e8f0'};
  background: ${props => props.active ? 'rgba(67, 56, 202, 0.05)' : 'white'};
  color: ${props => props.active ? '#4338ca' : '#64748b'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &:hover { border-color: #4338ca; }
`;

export const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 8px;
  appearance: none;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #4338ca;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: transform 0.1s ease;
  }
  
  &:active::-webkit-slider-thumb {
    transform: scale(1.2);
  }
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(67, 56, 202, 0.1);
  color: #4338ca;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #4338ca;
    display: flex;
    opacity: 0.6;
    &:hover { opacity: 1; }
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  
  input {
    flex: 1;
    padding: 12px 16px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    outline: none;
    font-family: inherit;
    &:focus { border-color: #4338ca; background: white; }
  }

  /* ИЗМЕНЕНИЕ: Стили для кнопки добавления интереса */
  button {
    background: rgba(67, 56, 202, 0.1);
    border: none;
    padding: 0 20px;
    border-radius: 12px;
    color: #4338ca;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    &:hover { background: rgba(67, 56, 202, 0.2); }
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 18px;
  background: linear-gradient(90deg, #4338ca 0%, #10b981 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 10px 15px -3px rgba(67, 56, 202, 0.3);
  transition: all 0.3s ease;
  
  /* ИЗМЕНЕНИЕ: Состояние при сохранении (loading) */
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:hover:not(:disabled) { 
    transform: translateY(-2px); 
    box-shadow: 0 12px 20px -3px rgba(67, 56, 202, 0.4);
    opacity: 0.95; 
  }
  &:active:not(:disabled) { transform: translateY(0); }
`;