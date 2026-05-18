import styled from '@emotion/styled';

export const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  font-family: 'Inter', sans-serif;
`;

export const VisualSide = styled.div`
  display: none;
  width: 50%;
  background: linear-gradient(135deg, #4338ca 0%, #10b981 100%);
  padding: 80px;
  align-items: center;
  justify-content: center;
  position: relative;
  
  @media (min-width: 1024px) {
    display: flex;
  }
`;

export const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 48px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  color: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  .icon-wrap {
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin-bottom: 32px;
  }

  h2 {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 24px;
  }

  p {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 32px;
  }
`;

export const UserAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .circles {
    display: flex;
    margin-right: 8px;
    div {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid white;
      margin-left: -12px;
      &:first-of-type { margin-left: 0; }
    }
  }
  span { font-weight: 500; font-size: 14px; }
`;

export const FormSide = styled.div`
  flex: 1;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 440px;
  text-align: center;

  h1 { font-size: 32px; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
  .subtitle { color: #64748b; margin-bottom: 32px; }
`;

export const TabSwitcher = styled.div`
  background: #e2e8f0;
  padding: 4px;
  border-radius: 12px;
  display: flex;
  margin-bottom: 32px;

  button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
  }
`;

export const InputGroup = styled.div`
  text-align: left;
  margin-bottom: 20px;
  
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .input-wrapper {
    position: relative;
    input {
      width: 100%;
      padding: 14px 14px 14px 44px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      outline: none;
      transition: 0.2s;
      &:focus { border-color: #4338ca; background: white; }
    }
    svg {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 24px;
  
  label { display: flex; align-items: center; gap: 8px; color: #64748b; cursor: pointer; }
  button { background: none; border: none; color: #4338ca; font-weight: 600; cursor: pointer; }
`;

export const MainButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: #3730a3; transform: translateY(-1px); }
`;

export const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 24px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 500;
    transition: 0.2s;
    &:hover { background: #f8fafc; }
  }
`;