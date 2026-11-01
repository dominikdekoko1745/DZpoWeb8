import React from 'react';

interface LoaderProps {
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = 'Загрузка...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      gap: '12px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #333',
        borderTop: '4px solid #ff4655',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite'
      }} />
      <span style={{ color: '#aaa', fontSize: '14px' }}>{text}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};