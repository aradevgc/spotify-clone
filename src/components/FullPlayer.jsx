import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useLyrics } from '../hooks/useYouTube';

/* ── Icons ───────────────────────────────────────────────── */
const ChevronDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#000">
    <path d="M8 5.14v14l11-7-11-7z"/>
  </svg>
);
const PauseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#000">
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
);
const PrevIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
  </svg>
);
const NextIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
    <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2V6z"/>
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24"
    fill={filled ? '#1DB954' : 'none'}
    stroke={filled ? '#1DB954' : '#b3b3b3'}
    strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const ShuffleIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#1DB954' : '#b3b3b3'}>
    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
  </svg>
);
const RepeatIcon = ({ mode }) => (
  <svg width="22" height="22" viewBox="0 0 24 24"
    fill={mode !== 'off' ? '#1DB954' : '#b3b3b3'}>
    {mode === 'one'
      ? <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
      : <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>}
  </svg>
);
const VolumeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#b3b3b3">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

/* ── Helpers ─────────────────────────────────────────────── */
const fmt = (s) => {
  const m = Math.floor((s || 0) / 60);
  const sec = Math.floor((s || 0) % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

export default function FullPlayer({ onClose }) {
  const {
    currentTrack, isPlaying, togglePlay,
    nextTrack, prevTrack, progress, duration,
    seekTo, volume, setVolume,
    shuffle, setShuffle, repeat, setRepeat,
    isLiked, toggleLike,
  } = usePlayer();

  const [tab, setTab]             = useState('player'); // player | lyrics
  const { lyrics, loading: lLoading, error: lError, fetchLyrics } = useLyrics();
  const lyricsRef = useRef(null);
  const isDragging = useRef(false);

  /* Fetch lyrics when track changes */
  useEffect(() => {
    if (currentTrack && tab === 'lyrics') {
      fetchLyrics(currentTrack.artist, currentTrack.title);
    }
  }, [currentTrack, tab, fetchLyrics]);

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  const cycleRepeat = () => {
    setRepeat(r => r === 'off' ? 'all' : r === 'all' ? 'one' : 'off');
  };

  /* ── Dynamic background from thumbnail ──────────────────── */
  const thumbUrl = currentTrack?.thumbnail || '';

  return (
    <div className="full-player-overlay animate-slide-up">
      {/* Blurred background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        backgroundImage: `url(${thumbUrl})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(80px) brightness(.35)',
        transform: 'scale(1.15)',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'rgba(0,0,0,.5)' }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px 4px',
      }}>
        <button className="sp-btn" onClick={onClose}><ChevronDown /></button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#b3b3b3', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Reproduciendo
          </p>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', padding: '8px 0' }}>
        {['player','lyrics'].map(t => (
          <button key={t}
            onClick={() => {
              setTab(t);
              if (t === 'lyrics' && currentTrack) fetchLyrics(currentTrack.artist, currentTrack.title);
            }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 700, fontSize: '13px',
              color: tab === t ? '#fff' : '#727272',
              padding: '4px 0',
              borderBottom: tab === t ? '2px solid #1DB954' : '2px solid transparent',
              transition: 'all .2s',
            }}>
            {t === 'player' ? '♫ Reproductor' : '📝 Letra'}
          </button>
        ))}
      </div>

      {/* ── PLAYER TAB ──────────────────────────────────────── */}
      {tab === 'player' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 28px', gap: '20px', overflow: 'hidden' }}>
          {/* Album art */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '340px' }}>
            <div style={{
              width: '100%', maxWidth: '300px', aspectRatio: '1',
              borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,.8)',
              transform: isPlaying ? 'scale(1)' : 'scale(.94)',
              transition: 'transform .4s cubic-bezier(.32,.72,0,1)',
            }}>
              {thumbUrl
                ? <img src={thumbUrl} alt={currentTrack?.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div className="thumb-placeholder" style={{ width: '100%', height: '100%' }}>🎵</div>
              }
            </div>
          </div>

          {/* Track info + like */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, overflow: 'hidden', marginRight: '16px' }}>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#fff',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentTrack?.title || '—'}
              </p>
              <p style={{ margin: '3px 0 0', fontSize: '15px', color: '#b3b3b3',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentTrack?.artist || '—'}
              </p>
            </div>
            <button className="sp-btn" onClick={() => currentTrack && toggleLike(currentTrack)}>
              <HeartIcon filled={currentTrack && isLiked(currentTrack.id)} />
            </button>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ position: 'relative', height: '4px', borderRadius: '4px', background: '#535353', cursor: 'pointer' }}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                seekTo(ratio * duration);
              }}>
              <div style={{
                height: '100%', borderRadius: '4px', background: '#fff',
                width: `${pct}%`, transition: isDragging.current ? 'none' : 'width .5s linear',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#b3b3b3' }}>{fmt(progress)}</span>
              <span style={{ fontSize: '11px', color: '#b3b3b3' }}>{fmt(duration)}</span>
            </div>
          </div>

          {/* Main controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button className="sp-btn" onClick={() => setShuffle(s => !s)}>
              <ShuffleIcon active={shuffle} />
            </button>
            <button className="sp-btn" onClick={prevTrack}>
              <PrevIcon />
            </button>
            <button className="sp-btn-green" onClick={togglePlay}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="sp-btn" onClick={nextTrack}>
              <NextIcon />
            </button>
            <button className="sp-btn" onClick={cycleRepeat}>
              <RepeatIcon mode={repeat} />
            </button>
          </div>

          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '8px' }}>
            <VolumeIcon />
            <input type="range" min="0" max="100" value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              style={{
                flex: 1, accentColor: '#fff',
                background: `linear-gradient(to right, #fff ${volume}%, #535353 ${volume}%)`,
              }}
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#b3b3b3">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </div>
        </div>
      )}

      {/* ── LYRICS TAB ──────────────────────────────────────── */}
      {tab === 'lyrics' && (
        <div ref={lyricsRef} style={{
          flex: 1, overflow: 'auto', padding: '16px 28px 24px',
        }}>
          {lLoading && (
            <div style={{ textAlign: 'center', paddingTop: '60px', color: '#b3b3b3' }}>
              <div style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #1DB954', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .8s linear infinite', marginBottom: '12px' }} />
              <p>Buscando letra...</p>
            </div>
          )}
          {lError && !lLoading && (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>🎵</p>
              <p style={{ color: '#b3b3b3', fontSize: '15px' }}>{lError}</p>
            </div>
          )}
          {lyrics && !lLoading && (
            <pre style={{
              fontFamily: 'inherit', fontSize: '17px', lineHeight: '2',
              color: '#fff', whiteSpace: 'pre-wrap', margin: 0,
              fontWeight: 500,
            }}>
              {lyrics}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
