import React, { useState } from 'react';

interface AuthFormProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, name?: string) => Promise<void>;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      onRegister(email, password, name);
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div style={{ background: '#1c1c1e', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '360px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {isRegister ? 'Регистрация' : 'Вход в фан-клуб'}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isRegister && (
          <input
            type="text"
            placeholder="Ваше имя / Никнейм"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#2c2c2e', color: '#fff' }}
          />
        )}
        <input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#2c2c2e', color: '#fff' }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#2c2c2e', color: '#fff' }}
        />
        <button
          type="submit"
          style={{ padding: '12px', background: '#ff4655', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
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
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
};