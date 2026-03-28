import React, { useState } from 'react';

export default function SetupScreen() {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!key.trim()) return;
    // Inject key as env var at runtime via sessionStorage (user can also use .env file)
    sessionStorage.setItem('VITE_YOUTUBE_API_KEY_OVERRIDE', key.trim());
    setSaved(true);
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#121212', padding: '32px',
      paddingTop: 'calc(32px + env(safe-area-inset-top, 0px))',
    }}>
      <div style={{ fontSize: '56px', marginBottom: '24px' }}>🎵</div>
      <h1 style={{ color: '#1DB954', fontSize: '28px', fontWeight: 800, margin: '0 0 8px', textAlign: 'center' }}>
        Spotify Clone
      </h1>
      <p style={{ color: '#b3b3b3', fontSize: '14px', textAlign: 'center', marginBottom: '32px', lineHeight: '1.6' }}>
        Necesitas una clave de YouTube Data API v3 para buscar y reproducir música.
      </p>

      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          placeholder="AIza... (YouTube API Key)"
          value={key}
          onChange={e => setKey(e.target.value)}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: '8px',
            border: '1px solid #333', background: '#282828', color: '#fff',
            fontSize: '14px', fontFamily: 'inherit', outline: 'none',
          }}
        />
        <button
          onClick={handleSave}
          style={{
            background: saved ? '#1aa34a' : '#1DB954',
            color: '#000', fontWeight: 800, fontSize: '15px',
            border: 'none', borderRadius: '999px', padding: '14px',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'background .2s',
          }}>
          {saved ? '✓ Guardado, recargando...' : 'Guardar y continuar'}
        </button>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#1a1a1a', borderRadius: '12px', width: '100%', maxWidth: '360px' }}>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '13px', margin: '0 0 8px' }}>¿Cómo obtener la clave?</p>
        <ol style={{ color: '#b3b3b3', fontSize: '12px', lineHeight: '1.8', margin: 0, paddingLeft: '16px' }}>
          <li>Ve a <strong style={{ color: '#1DB954' }}>console.cloud.google.com</strong></li>
          <li>Crea un proyecto nuevo</li>
          <li>Activa <strong style={{ color: '#fff' }}>YouTube Data API v3</strong></li>
          <li>Crea una clave de API</li>
          <li>O mejor aún: añade <strong style={{ color: '#fff' }}>VITE_YOUTUBE_API_KEY=tuClave</strong> en un archivo <strong style={{ color: '#fff' }}>.env</strong> en la raíz del proyecto</li>
        </ol>
      </div>
    </div>
  );
}
