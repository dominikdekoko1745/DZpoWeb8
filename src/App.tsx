import { useState, useEffect, useCallback } from 'react';
import { Loader } from './components/Loader';
import { AuthForm } from './components/AuthForm';
import { Profile, type UserData, type MusicianProfile } from './components/Profile';
import './App.css';

const API_BASE = 'https://inai-col3.fishrungames.com';

interface AuthResponse {
  access: string;
  user: UserData;
}

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('band_access_token'));
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        return null;
      }

      const data: { access: string } = await res.json();
      if (data.access) {
        localStorage.setItem('band_access_token', data.access);
        setAccessToken(data.access);
        return data.access;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}, tokenOverride?: string): Promise<Response> => {
      const activeToken = tokenOverride || accessToken;
      const headers = new Headers(options.headers || {});
      headers.set('Content-Type', 'application/json');
      if (activeToken) {
        headers.set('Authorization', `Bearer ${activeToken}`);
      }

      let res = await fetch(url, {
        ...options,
        headers,
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          headers.set('Authorization', `Bearer ${newToken}`);
          res = await fetch(url, {
            ...options,
            headers,
          });
        }
      }

      return res;
    },
    [accessToken, refreshAccessToken]
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        let tokenToUse = localStorage.getItem('band_access_token');

        if (!tokenToUse) {
          tokenToUse = await refreshAccessToken();
        }

        if (!tokenToUse) {
          setCurrentUser(null);
          return;
        }

        const res = await authFetch(`${API_BASE}/api/profile/`, { method: 'GET' }, tokenToUse);
        if (res.ok) {
          const data: UserData = await res.json();
          setCurrentUser(data);
        } else {
          localStorage.removeItem('band_access_token');
          setAccessToken(null);
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [authFetch, refreshAccessToken]);

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

      const data: AuthResponse = await res.json();
      localStorage.setItem('band_access_token', data.access);
      setAccessToken(data.access);
      setCurrentUser(data.user);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        const message = errData.username
          ? errData.username.join(' ')
          : errData.detail || 'Ошибка при регистрации';
        throw new Error(message);
      }

      const data: AuthResponse = await res.json();
      localStorage.setItem('band_access_token', data.access);
      setAccessToken(data.access);
      setCurrentUser(data.user);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedFields: Partial<MusicianProfile>) => {
    try {
      setError(null);

      const payload: Record<string, string> = {
        first_name: updatedFields.first_name || '',
        specialization: updatedFields.specialization || 'vocals',
        bio: updatedFields.bio || '',
      };

      if (updatedFields.fee !== undefined && updatedFields.fee !== '') {
        payload.fee = String(updatedFields.fee);
      }

      const res = await authFetch(`${API_BASE}/api/profile/`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData ? JSON.stringify(errData) : 'Не удалось обновить профиль');
      }

      const updatedUser: UserData = await res.json();
      setCurrentUser(updatedUser);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/api/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Игнорируем сетевые ошибки
    } finally {
      localStorage.removeItem('band_access_token');
      setAccessToken(null);
      setCurrentUser(null);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif', color: '#fff' }}>
      <header style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#ff4655', marginBottom: '6px' }}>THE BAND</h1>
        <p style={{ color: '#aaa', margin: 0 }}>Портал музыкантов группы (JWT Auth)</p>
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