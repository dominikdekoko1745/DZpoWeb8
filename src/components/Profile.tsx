import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (updated: Partial<UserProfile>) => Promise<void>;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name || profile.username || '');
  const [bio, setBio] = useState(profile.bio || '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({ name, bio });
    setIsEditing(false);
  };

  return (
    <div style={{ background: '#1c1c1e', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '420px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Профиль фаната</h2>
        <button
          onClick={onLogout}
          style={{ background: '#333', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
        >
          Выйти
        </button>
      </div>

      {!isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p><strong>Почта:</strong> {profile.email}</p>
          <p><strong>Имя / Ник:</strong> {profile.name || profile.username || 'Не указано'}</p>
          <p><strong>О себе:</strong> {profile.bio || 'Информации пока нет'}</p>
          <button
            onClick={() => setIsEditing(true)}
            style={{ padding: '10px', background: '#ff4655', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px' }}
          >
            Редактировать профиль
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '13px', color: '#aaa' }}>Имя / Никнейм:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#2c2c2e', color: '#fff' }}
          />
          <label style={{ fontSize: '13px', color: '#aaa' }}>О себе (любимый трек / альбом):</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#2c2c2e', color: '#fff' }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="submit"
              style={{ flex: 1, padding: '10px', background: '#ff4655', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{ flex: 1, padding: '10px', background: '#444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
};