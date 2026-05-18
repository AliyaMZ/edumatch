import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 100px 24px 60px;
  font-family: 'Inter', sans-serif;
`;

export const MaxWidthWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

export const FadeIn = styled.div`
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

// --- HEADER ---
export const HeaderSection = styled.div`
  margin-bottom: 32px;
  .welcome-tag {
    font-size: 14px;
    color: #4338ca;
    font-weight: 600;
    margin-bottom: 8px;
  }
  h1 { font-size: 32px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
  p { color: #64748b; font-size: 16px; margin: 0; }
`;

// --- TABS ---
export const TabsList = styled.div`
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 6px;
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
  gap: 8px;
`;

export const TabTrigger = styled.button<{ active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  background: ${props => props.active ? '#4338ca' : 'transparent'};
  color: ${props => props.active ? 'white' : '#64748b'};
`;

// --- STATS ---
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div<{ variant: string }>`
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
  .icon-wrapper {
    width: 48px; height: 48px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: ${props => props.variant === 'blue' ? '#eef2ff' : props.variant === 'teal' ? '#f0fdfa' : '#f0fdf4'};
    color: ${props => props.variant === 'blue' ? '#4338ca' : props.variant === 'teal' ? '#0d9488' : '#16a34a'};
  }
  .value { font-size: 24px; font-weight: 700; color: #1e293b; }
  .label { font-size: 13px; color: #64748b; }
`;

// --- CONTENT CARD ---
export const ContentCard = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 32px;
  margin-bottom: 24px;
  h3 { font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #1e293b; }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  h3 { margin: 0; font-size: 18px; }
  button {
    background: #eef2ff;
    border: none;
    color: #4338ca;
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    &:hover { background: #e0e7ff; }
  }
`;

// --- INFO ELEMENTS ---
export const GoalBox = styled.div`
  background: #f8faff;
  border: 1px solid #e0e7ff;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  .goal-icon { color: #4338ca; }
`;

export const InfoBlock = styled.div`
  margin-bottom: 24px;
  label { display: block; font-size: 13px; font-weight: 600; color: #94a3b8; margin-bottom: 8px; }
`;

export const GridTwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

export const DataTag = styled.div`
  background: #f1f5f9;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BadgeGroup = styled.div` display: flex; flex-wrap: wrap; gap: 8px; `;

export const Badge = styled.div<{ active?: boolean }>`
  background: #eef2ff; color: #4338ca; padding: 8px 16px; border-radius: 8px;
  font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px;
`;

export const TopicBadge = styled.div`
  background: #f0fdfa; color: #0d9488; padding: 6px 14px; border-radius: 8px;
  font-size: 14px; font-weight: 600;
`;


export const ProgressBar = styled.div`
  height: 8px; width: 100%; background: #f1f5f9; border-radius: 10px; overflow: hidden;
`;

export const ProgressFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background: linear-gradient(90deg, #4338ca 0%, #10b981 100%);
  border-radius: 10px;
  transition: width 1s ease-in-out;
`;

// --- COURSE ITEMS ---
export const CourseList = styled.div` display: flex; flex-direction: column; gap: 16px; `;

export const CourseListItem = styled.div`
  border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;
`;

export const CourseInfoMain = styled.div`
  .title-row {
    display: flex; justify-content: space-between; align-items: center;
    h4 { margin: 0; font-size: 18px; display: flex; align-items: center; gap: 8px; }
  }
  .provider-name { color: #94a3b8; font-size: 14px; margin: 4px 0 16px 0; }
`;

export const CourseMetaGroup = styled.div`
  display: flex; gap: 20px; color: #64748b; font-size: 14px; margin-bottom: 20px;
  span { display: flex; align-items: center; gap: 6px; }
`;

export const MatchBadge = styled.div`
  background: #f0fdfa; color: #0d9488; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700;
`;

export const CardActions = styled.div` display: flex; gap: 12px; `;

export const PrimaryButton = styled.button<{ fullWidth?: boolean }>`
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  background: #4338ca; color: white; border: none; padding: 12px 24px; border-radius: 10px;
  font-weight: 600; cursor: pointer; transition: 0.2s;
  &:hover { background: #3730a3; }
`;

export const GhostButton = styled.button`
  background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 12px 20px;
  border-radius: 10px; font-weight: 600; cursor: pointer;
  &:hover { background: #f8fafc; }
`;

// --- AI SECTION ---
export const AiHeader = styled.div`
  display: flex; align-items: center; gap: 16px; margin-bottom: 32px;
  .ai-circle {
    background: #4338ca; color: white; width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  p { margin: 0; color: #64748b; font-size: 14px; }
`;

export const TipsContainer = styled.div` display: flex; flex-direction: column; gap: 16px; `;

export const DetailedTip = styled.div`
  display: flex; gap: 20px; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9;
  .tip-icon-box {
    width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    &.blue { background: #eff6ff; color: #3b82f6; }
    &.purple { background: #f5f3ff; color: #8b5cf6; }
    &.green { background: #f0fdf4; color: #22c55e; }
  }
  .tip-body {
    flex: 1;
    .tip-header { display: flex; justify-content: space-between; }
    h4 { margin: 0 0 4px 0; font-size: 16px; }
    p { font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 12px; }
    .tip-date { font-size: 12px; color: #cbd5e1; }
  }
`;

export const TipTag = styled.span<{ variant: string }>`
  font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px;
  background: ${props => props.variant === 'blue' ? '#dbeafe' : props.variant === 'purple' ? '#ede9fe' : '#dcfce7'};
  color: ${props => props.variant === 'blue' ? '#1e40af' : props.variant === 'purple' ? '#5b21b6' : '#166534'};
`;

export const AiFooter = styled.div`
  margin-top: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9;
  display: flex; gap: 12px; font-size: 13px; color: #94a3b8;
  strong { color: #64748b; }
`;

// --- ДОПОЛНИТЕЛЬНЫЕ СТИЛИ ДЛЯ ПРОГРЕССА И СТАТУСОВ ---

export const StatusBadge = styled.div<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  background: ${props => {
    if (props.status === 'completed') return '#dcfce7'; // Нежно-зеленый
    if (props.status === 'in_progress') return '#e0e7ff'; // Нежно-синий
    return '#f1f5f9'; // Серый
  }};
  
  color: ${props => {
    if (props.status === 'completed') return '#166534';
    if (props.status === 'in_progress') return '#4338ca';
    return '#64748b';
  }};
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  span {
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
  }
  
  span:last-child {
    color: #1e293b;
    font-weight: 700;
  }
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 16px;
`;

export const ProgressBarFill = styled.div<{ progress: number; status: string }>`
  width: ${props => props.progress}%;
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  background: ${props => {
    if (props.status === 'completed') return '#10b981'; // Чистый зеленый
    return '#4338ca'; // Твой основной индиго
  }};
  
  /* Эффект свечения для активного курса */
  box-shadow: ${props => props.status === 'in_progress' ? '0 0 8px rgba(67, 56, 202, 0.3)' : 'none'};
`;

// Стили для обертки меток прогресса (если захочешь расширить)
export const ProgressWrapper = styled.div`
  margin: 20px 0;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
`;