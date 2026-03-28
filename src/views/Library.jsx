import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import TrackCard from '../components/TrackCard';

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#b3b3b3">
    <line x1="12" y1="5" x2="12" y2="19" stroke="#b3b3b3" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="5" y1="12" x2="19" y2="12" stroke="#b3b3b3" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const HeartFilled = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1DB954">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

function PlaylistRow({ playlist, onOpen }) {
  const trackCount = playlist.tracks?.length || 0;
  const thumb = playlist.tracks?.[0]?.thumbnail;

  return (
    <div onClick={() => onOpen(playlist)} style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 16px', cursor: 'pointer',
      transition: 'background .15s', borderRadius: '8px',
    }}
    onMouseOver={e => e.currentTarget.style.background = '#1a1a1a'}
    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Thumb */}
      <div style={{
        width: '52px', height: '52px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0,
        background: playlist.id === 'liked' ? 'linear-gradient(135deg, #450af5, #c4efd9)' : '#282828',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {playlist.id === 'liked'
          ? <HeartFilled />
          : thumb
            ? <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="#b3b3b3">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#fff' }}>
          {playlist.name}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#b3b3b3' }}>
          Lista · {trackCount} {trackCount === 1 ? 'canción' : 'canciones'}
        </p>
      </div>
    </div>
  );
}

export default function Library() {
  const { playlists, createPlaylist, playTrack, liked } = usePlayer();
  const [openPlaylist, setOpenPlaylist] = useState(null);
  const [showCreate, setShowCreate]     = useState(false);
  const [newName, setNewName]           = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    createPlaylist(newName.trim());
    setNewName('');
    setShowCreate(false);
  };

  /* ── Open playlist view ────────────────────────────────── */
  if (openPlaylist) {
    const isLiked = openPlaylist.id === 'liked';
    const tracks  = openPlaylist.tracks || [];

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#121212' }}>
        <div style={{
          padding: '48px 16px 20px',
          background: isLiked
            ? 'linear-gradient(180deg, #450af5 0%, #121212 100%)'
            : 'linear-gradient(180deg, #333 0%, #121212 100%)',
        }}>
          <button className="sp-btn" onClick={() => setOpenPlaylist(null)} style={{ marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div style={{
            width: '160px', height: '160px', borderRadius: '8px', margin: '0 auto 16px',
            background: isLiked ? 'linear-gradient(135deg, #450af5, #c4efd9)' : '#282828',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 16px 48px rgba(0,0,0,.6)',
          }}>
            {isLiked
              ? <HeartFilled />
              : <svg width="64" height="64" viewBox="0 0 24 24" fill="#b3b3b3">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
            }
          </div>

          <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 800, textAlign: 'center' }}>
            {openPlaylist.name}
          </h1>
          <p style={{ margin: '0 0 12px', color: '#b3b3b3', fontSize: '13px', textAlign: 'center' }}>
            Lista · {tracks.length} canciones
          </p>

          {tracks.length > 0 && (
            <button
              onClick={() => playTrack(tracks[0], tracks)}
              style={{
                background: '#1DB954', color: '#000', fontWeight: 800, fontSize: '15px',
                border: 'none', borderRadius: '999px', padding: '14px 32px',
                cursor: 'pointer', fontFamily: 'inherit', display: 'block', margin: '0 auto',
              }}>
              ▶ Reproducir
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 'var(--total-bottom)' }}>
          {tracks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 32px', color: '#b3b3b3' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>
                {isLiked ? '💚' : '🎵'}
              </p>
              <p style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {isLiked ? 'Canciones que te gustan' : 'Lista vacía'}
              </p>
              <p style={{ fontSize: '13px' }}>
                {isLiked
                  ? 'Pulsa el ❤️ en cualquier canción para añadirla aquí.'
                  : 'Busca canciones y añádelas a esta lista.'}
              </p>
            </div>
          ) : (
            tracks.map((t, i) => <TrackCard key={t.id || i} track={t} queue={tracks} />)
          )}
        </div>
      </div>
    );
  }

  /* ── Main library ──────────────────────────────────────── */
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#121212' }}>
      <div style={{ padding: '56px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Tu biblioteca</h1>
        <button className="sp-btn" onClick={() => setShowCreate(true)}>
          <PlusIcon />
        </button>
      </div>

      {/* Create playlist modal */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '24px',
        }}
        onClick={() => setShowCreate(false)}>
          <div style={{
            background: '#282828', borderRadius: '12px', padding: '24px',
            width: '100%', maxWidth: '340px',
          }}
          onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800 }}>Nueva lista</h2>
            <input
              autoFocus
              type="text"
              placeholder="Nombre de la lista"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              style={{
                width: '100%', padding: '12px', borderRadius: '6px',
                border: '1px solid #535353', background: '#3e3e3e', color: '#fff',
                fontSize: '15px', fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => setShowCreate(false)} style={{
                flex: 1, padding: '12px', borderRadius: '999px',
                border: '1px solid #535353', background: 'transparent', color: '#fff',
                fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer',
              }}>Cancelar</button>
              <button onClick={handleCreate} style={{
                flex: 1, padding: '12px', borderRadius: '999px',
                border: 'none', background: '#1DB954', color: '#000',
                fontFamily: 'inherit', fontWeight: 800, cursor: 'pointer',
              }}>Crear</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 'var(--total-bottom)' }}>
        {/* Pinned: liked songs */}
        <PlaylistRow
          playlist={{ id: 'liked', name: 'Canciones que te gustan', tracks: liked }}
          onOpen={setOpenPlaylist}
        />

        {/* User playlists */}
        {playlists.filter(p => !p.system).map(p => (
          <PlaylistRow key={p.id} playlist={p} onOpen={setOpenPlaylist} />
        ))}

        {playlists.filter(p => !p.system).length === 0 && (
          <div style={{ padding: '24px 16px', background: '#1a1a1a', margin: '8px 16px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '15px' }}>Crea tu primera lista</p>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#b3b3b3' }}>
              Organiza tus canciones favoritas en listas personalizadas.
            </p>
            <button onClick={() => setShowCreate(true)} style={{
              background: '#fff', color: '#000', fontWeight: 800, fontSize: '13px',
              border: 'none', borderRadius: '999px', padding: '8px 20px',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Crear lista
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
