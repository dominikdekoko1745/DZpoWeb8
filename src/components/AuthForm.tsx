import React, { useState } from 'react';

interface AuthFormProps {
  onLogin: (username: string, pass: string) => Promise<void>;
  onRegister: (username: string, pass: string) => Promise<void>;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      onRegister(username, password);
    } else {
      onLogin(username, password);
    }
  };

  return (
    <div style={{ background: '#1c1c1e', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '380px', margin: '0 auto', boxSizing: 'border-box' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isRegister ? 'Регистрация музыканта' : 'Вход в аккаунт'}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Имя пользователя (username):</label>
          <input
            type="text"
            placeholder="Введите username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#2c2c2e', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Пароль:</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#2c2c2e', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          style={{ padding: '12px', background: '#ff4655', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}
        >
          {isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isRegister ? 'Уже зарегистрированы? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
};