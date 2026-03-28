import React, { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useTrendingMusic, usePlaylistItems } from '../hooks/useYouTube';
import { FEATURED_PLAYLISTS, YOUTUBE_API_KEY } from '../config';
import TrackCard from '../components/TrackCard';

const hour = new Date().getHours();
const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

/* ── Horizontal scroll section ───────────────────────────── */
function HSection({ title, children }) {
  return (
    <section style={{ marginBottom: '28px' }}>
      <h2 style={{ margin: '0 16px 12px', fontSize: '20px', fontWeight: 800 }}>{title}</h2>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 16px 4px' }}>
        {children}
      </div>
    </section>
  );
}

/* ── Quick-access playlist pill ──────────────────────────── */
function PlaylistPill({ name, color, onClick }) {
  return (
    <div onClick={onClick} style={{
      flexShrink: 0, display: 'flex', alignItems: 'center',
      gap: '10px', background: '#2a2a2a', borderRadius: '6px',
      padding: '0 16px 0 0', cursor: 'pointer', overflow: 'hidden',
      height: '48px', minWidth: '160px', maxWidth: '180px',
      transition: 'background .15s',
    }}
    onMouseOver={e => e.currentTarget.style.background = '#3a3a3a'}
    onMouseOut={e => e.currentTarget.style.background = '#2a2a2a'}
    >
      <div style={{ width: '48px', height: '48px', background: color, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
        🎵
      </div>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
    </div>
  );
}

/* ── Album card ──────────────────────────────────────────── */
function AlbumCard({ track, queue, onPress }) {
  const { playTrack, currentTrack } = usePlayer();
  const isActive = currentTrack?.id === track.id;
  return (
    <div onClick={() => { playTrack(track, queue); onPress && onPress(); }}
      style={{
        flexShrink: 0, width: '140px', cursor: 'pointer',
      }}>
      <div style={{ position: 'relative', width: '140px', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px',
        boxShadow: isActive ? '0 0 0 2px #1DB954' : 'none', transition: 'box-shadow .2s' }}>
        {track.thumbnail
          ? <img src={track.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div className="thumb-placeholder" style={{ width: '100%', height: '100%' }}>🎵</div>
        }
        {isActive && (
          <div style={{ position: 'absolute', bottom: '8px', right: '8px',
            background: '#1DB954', borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="eq-bars" style={{ transform: 'scale(.7)' }}><span/><span/><span/></div>
          </div>
        )}
      </div>
      <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#fff',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</p>
      <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#b3b3b3',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.artist}</p>
    </div>
  );
}

/* ── Featured playlist card ──────────────────────────────── */
function FeaturedCard({ playlist, onOpen }) {
  return (
    <div onClick={() => onOpen(playlist)} style={{
      flexShrink: 0, width: '140px', cursor: 'pointer',
    }}>
      <div style={{
        width: '140px', height: '140px', borderRadius: '8px', marginBottom: '8px',
        background: `linear-gradient(135deg, ${playlist.color} 0%, #000 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '48px', boxShadow: '0 8px 24px rgba(0,0,0,.5)',
      }}>🎶</div>
      <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#fff',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {playlist.name}
      </p>
    </div>
  );
}

export default function Home({ setView, setViewParams }) {
  const { recentlyPlayed, playTrack } = usePlayer();
  const { tracks: trending, fetch: fetchTrending, loading } = useTrendingMusic('ES');
  const { items: playlistTracks, fetchPlaylist } = usePlaylistItems();
  const [openPlaylist, setOpenPlaylist]   = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && YOUTUBE_API_KEY) {
      hasFetched.current = true;
      fetchTrending();
    }
  }, [fetchTrending]);

  const handleOpenPlaylist = (playlist) => {
    setOpenPlaylist(playlist);
    fetchPlaylist(playlist.id);
  };

  /* ── Playlist overlay ──────────────────────────────────── */
  if (openPlaylist) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#121212' }}>
        {/* Header */}
        <div style={{
          padding: '16px 16px 0',
          background: `linear-gradient(180deg, ${openPlaylist.color}88 0%, #121212 100%)`,
        }}>
          <button className="sp-btn" onClick={() => setOpenPlaylist(null)} style={{ marginBottom: '8px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div style={{ width: '160px', height: '160px', borderRadius: '8px', margin: '0 auto 16px',
            background: `linear-gradient(135deg, ${openPlaylist.color} 0%, #1a1a1a 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>🎶</div>
          <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 800, textAlign: 'center' }}>{openPlaylist.name}</h1>
          <p style={{ margin: '0 0 16px', color: '#b3b3b3', fontSize: '13px', textAlign: 'center' }}>Playlist · YouTube</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 'var(--total-bottom)' }}>
          {playlistTracks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#b3b3b3' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎵</div>
              <p>Cargando canciones...</p>
            </div>
          )}
          {playlistTracks.map((t, i) => (
            <TrackCard key={t.id || i} track={t} queue={playlistTracks} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 'var(--total-bottom)', background: '#121212' }}>
      {/* Greeting header */}
      <div style={{
        background: 'linear-gradient(180deg, #333 0%, #121212 100%)',
        padding: '56px 16px 20px',
      }}>
        <h1 style={{ margin: '0 0 16px', fontSize: '26px', fontWeight: 800 }}>{greeting}</h1>

        {/* Quick access 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {FEATURED_PLAYLISTS.slice(0, 6).map(p => (
            <PlaylistPill key={p.id} name={p.name} color={p.color} onClick={() => handleOpenPlaylist(p)} />
          ))}
        </div>
      </div>

      {/* Recently played */}
      {recentlyPlayed.length > 0 && (
        <HSection title="Escuchado recientemente">
          {recentlyPlayed.slice(0, 10).map((t, i) => (
            <AlbumCard key={i} track={t} queue={recentlyPlayed} />
          ))}
        </HSection>
      )}

      {/* Featured playlists */}
      <HSection title="Listas destacadas">
        {FEATURED_PLAYLISTS.map(p => (
          <FeaturedCard key={p.id} playlist={p} onOpen={handleOpenPlaylist} />
        ))}
      </HSection>

      {/* Trending */}
      {YOUTUBE_API_KEY && (
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ margin: '0 16px 12px', fontSize: '20px', fontWeight: 800 }}>
            🔥 Trending ahora
          </h2>
          {loading
            ? Array.from({ length: 5 }, (_, i) => (
                <div key={i} style={{ height: '64px', margin: '4px 16px', borderRadius: '8px',
                  background: '#282828', animation: 'fadeIn .5s ease' }} />
              ))
            : trending.map((t, i) => (
                <TrackCard key={t.id || i} track={t} queue={trending} />
              ))
          }
        </section>
      )}
    </div>
  );
}
