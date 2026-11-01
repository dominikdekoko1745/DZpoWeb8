import { useState, useEffect } from 'react';
import { Loader } from './components/Loader';
import { AuthForm } from './components/AuthForm';
import { Profile, type UserData, type MusicianProfile } from './components/Profile';
import './App.css';

const API_BASE = 'https://inai-col2.fishrungames.com';

function App() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Получение профиля текущего пользователя
  const checkAuthAndFetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/profile/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data: UserData = await res.json();
        setCurrentUser(data);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  // Вход в систему
  const handleLogin = async (username: string, pass: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password: pass }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || errData.message || 'Неверный логин или пароль');
      }

      await checkAuthAndFetchProfile();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Регистрация
  const handleRegister = async (username: string, pass: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password: pass }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const message = errData.username ? errData.username.join(' ') : 'Ошибка регистрации';
        throw new Error(message);
      }

      // После регистрации сразу входим
      await handleLogin(username, pass);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Редактирование профиля (PATCH)
  const handleUpdateProfile = async (updatedFields: Partial<MusicianProfile>) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/profile/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        throw new Error('Не удалось обновить профиль');
      }

      const updatedUser: UserData = await res.json();
      setCurrentUser(updatedUser);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Выход из системы
  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/api/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Игнорируем сетевые ошибки при логауте
    } finally {
      setCurrentUser(null);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif', color: '#fff' }}>
      <header style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#ff4655', marginBottom: '6px' }}>THE BAND</h1>
        <p style={{ color: '#aaa', margin: 0 }}>Портал музыкантов группы</p>
      </header>

      {error && (
        <div style={{ background: '#451214', border: '1px solid #ff4655', color: '#ffb3b8', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {loading && <Loader text="Связь с сервером..." />}

      {!loading && !currentUser && (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
      )}

      {!loading && currentUser && (
        <Profile user={currentUser} onUpdate={handleUpdateProfile} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;