import React, { useState } from 'react';

export interface MusicianProfile {
  first_name?: string;
  specialization?: string;
  specialization_display?: string;
  bio?: string;
  fee?: string;
}

export interface UserData {
  id: number;
  username: string;
  profile: MusicianProfile;
}

interface ProfileProps {
  user: UserData;
  onUpdate: (updatedProfile: Partial<MusicianProfile>) => Promise<void>;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.profile?.first_name || '');
  const [specialization, setSpecialization] = useState(user.profile?.specialization || 'vocals');
  const [bio, setBio] = useState(user.profile?.bio || '');
  const [fee, setFee] = useState(user.profile?.fee || '');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      await onUpdate({
        first_name: firstName,
        specialization,
        bio,
        fee,
      });
      setIsEditing(false);
    } catch (err) {
      setError('Не удалось сохранить профиль. Попробуйте ещё раз.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ background: '#1c1c1e', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '460px', margin: '0 auto', boxSizing: 'border-box', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Анкета музыканта</h2>
        <button
          onClick={onLogout}
          style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}
        >
          Выйти
        </button>
      </div>

      {!isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div><strong>Username:</strong> {user.username}</div>
          <div><strong>Имя:</strong> {user.profile?.first_name || 'Не указано'}</div>
          <div>
            <strong>Специализация:</strong>{' '}
            {user.profile?.specialization_display || user.profile?.specialization || 'Не выбрана'}
          </div>
          <div><strong>Гонорар:</strong> {user.profile?.fee || '0'} $</div>
          <div><strong>О себе:</strong> {user.profile?.bio || 'Информация отсутствует'}</div>

          <button
            onClick={() => setIsEditing(true)}
            style={{ padding: '10px', background: '#ff4655', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px', fontWeight: 'bold' }}
          >
            Редактировать анкету
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#aaa' }}>Имя:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#aaa' }}>Специализация:</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              style={inputStyle}
            >
              <option value="vocals">Вокал</option>
              <option value="guitar">Гитара</option>
              <option value="bass">Бас-гитара</option>
              <option value="drums">Ударные</option>
              <option value="keys">Клавишные</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#aaa' }}>Гонорар:</label>
            <input
              type="number"
              min="0"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#aaa' }}>О себе / Биография:</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && <p style={{ color: '#ff4655', margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{ flex: 1, padding: '10px', background: '#ff4655', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsEditing(false)}
              style={{ flex: 1, padding: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  borderRadius: '6px',
  border: '1px solid #333',
  background: '#2c2c2e',
  color: '#fff',
  boxSizing: 'border-box',
};