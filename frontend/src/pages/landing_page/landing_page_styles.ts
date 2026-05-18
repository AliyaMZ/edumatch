import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1e293b;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const Section = styled.section<{ variant?: 'white' | 'gray' }>`
  padding: 100px 0;
  background-color: ${props => (props.variant === 'white' ? '#ffffff' : 'transparent')};
`;

// --- Hero Section ---
export const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 120px 0 80px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

export const Title = styled.h1`
  font-size: 56px;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 24px;
  
  span {
    background: linear-gradient(90deg, #4338ca, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const Subtitle = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 32px;
  max-width: 540px;
`;

// --- AI Visualization (Card) ---
export const AICard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const AnalysisRow = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: ${props => props.color}08; // 8% прозрачности цвета
  border-radius: 16px;
  border: 1px solid ${props => props.color}20;

  .left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .icon-box {
    width: 48px;
    height: 48px;
    background: ${props => props.color}20;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.color};
  }

  .text-label { font-size: 13px; color: #64748b; }
  .text-value { font-weight: 600; color: #1e293b; }
  .percentage { font-size: 18px; font-weight: 800; color: #10b981; }
`;

// --- How it Works (Steps with Lines) ---
export const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  position: relative;
  margin-top: 60px;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

export const StepItem = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;

  .num-circle {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 24px;
    font-weight: 800;
    color: white;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  /* Линия между шагами */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 32px;
    left: 60%;
    width: 80%;
    height: 2px;
    background: linear-gradient(90deg, #4338ca, #10b981);
    z-index: -1;
    @media (max-width: 768px) { display: none; }
  }

  h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
  p { font-size: 15px; color: #64748b; line-height: 1.5; }
`;

// --- Features Card ---
export const FeatureCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  }

  .icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }
`;

// --- Buttons ---
export const Button = styled.button<{ variant?: 'primary' | 'white' }>`
  padding: 16px 32px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: 0.2s;
  
  background: ${props => props.variant === 'white' ? 'white' : '#4338ca'};
  color: ${props => props.variant === 'white' ? '#4338ca' : 'white'};
  box-shadow: 0 10px 15px -3px rgba(67, 56, 202, 0.3);

  &:hover { transform: translateY(-2px); opacity: 0.95; }
`;

export const FAQGrid = styled.div`
  display: grid;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
`;

export const FAQItem = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  
  h4 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #1e293b;
  }
  
  p {
    color: #64748b;
    line-height: 1.6;
  }
`;

export const NavList = styled.nav`
  display: flex;
  gap: 32px;
  align-items: center;

  button {
    background: none;
    border: none;
    color: #64748b;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #4338ca;
    }
  }
`;