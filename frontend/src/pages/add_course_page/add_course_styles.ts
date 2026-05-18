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
`;

export const FormHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;

  h1 {
    font-size: 1.8rem;
    color: #0f172a;
    margin-bottom: 8px;
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

  input, textarea {
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-family: inherit;
    font-size: 1rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #4338ca;
      box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.1);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

export const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 14px;
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    background: #3730a3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CancelButton = styled.button`
  background: transparent;
  color: #64748b;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    text-decoration: underline;
  }
`;