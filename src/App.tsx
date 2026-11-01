import { useState, useEffect } from 'react';
import type { UserProfile, AuthResponse } from './types';
import { Loader } from './components/Loader';
import { AuthForm } from './components/AuthForm';
import { Profile } from './components/Profile';
import './App.css';

const API_BASE = 'https://inai-col2.fishrungames.com/api';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('band_token'));
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Получение профиля по токену
  const fetchProfile = async (authToken: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Не удалось загрузить профиль или сессия истекла');
      const data: UserProfile = await res.json();
      setProfile(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    }
  }, [token]);

  // Вход
  const handleLogin = async (email: string, pass: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Ошибка входа');
      }
      const data: AuthResponse = await res.json();
      const userToken = data.token || data.accessToken;
      if (userToken) {
        localStorage.setItem('band_token', userToken);
        setToken(userToken);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Регистрация
  const handleRegister = async (email: string, pass: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, name }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Ошибка при регистрации');
      }
      // После успешной регистрации сразу выполняем вход
      await handleLogin(email, pass);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Обновление профиля
  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Не удалось обновить профиль');
      const data: UserProfile = await res.json();
      setProfile(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Выход
  const handleLogout = () => {
    localStorage.removeItem('band_token');
    setToken(null);
    setProfile(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif', color: '#fff' }}>
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#ff4655', marginBottom: '8px' }}>THE ECHOES</h1>
        <p style={{ color: '#aaa' }}>Официальный фан-портал группы</p>
      </header>

      {error && (
        <div style={{ background: '#451214', border: '1px solid #ff4655', color: '#ffb3b8', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {loading && <Loader text="Связь с сервером..." />}

      {!loading && !token && (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
      )}

      {!loading && token && profile && (
        <Profile profile={profile} onUpdate={handleUpdateProfile} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;