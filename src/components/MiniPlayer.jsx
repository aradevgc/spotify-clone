import React from 'react';
import { usePlayer } from '../context/PlayerContext';

const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
    <path d="M8 5.14v14l11-7-11-7z"/>
  </svg>
);
const PauseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
);
const NextIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
    <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2V6z"/>
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? '#1DB954' : 'none'}
    stroke={filled ? '#1DB954' : '#727272'}
    strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export default function MiniPlayer({ onExpand }) {
  const { currentTrack, isPlaying, togglePlay, nextTrack, isLiked, toggleLike, progress, duration } = usePlayer();

  if (!currentTrack) return null;

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(58px + env(safe-area-inset-bottom, 0px))',
        left: '8px',
        right: '8px',
        height: '64px',
        background: '#282828',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: '10px',
        zIndex: 49,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0,0,0,.7)',
      }}
      onClick={onExpand}
    >
      {/* Progress underline */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: '2px', background: '#1DB954',
        width: `${pct}%`, transition: 'width .5s linear',
        borderRadius: '0 0 12px 12px',
      }} />

      {/* Thumb */}
      <img
        src={currentTrack.thumbnail}
        alt=""
        style={{ width: 44, height: 44, borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
        onError={e => { e.target.style.display = 'none'; }}
      />

      {/* Track info */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#fff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentTrack.title}
        </p>
        <p style={{ margin: 0, fontSize: '11px', color: '#b3b3b3', marginTop: '1px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentTrack.artist}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
           onClick={e => e.stopPropagation()}>
        <button className="sp-btn" onClick={e => { e.stopPropagation(); toggleLike(currentTrack); }}>
          <HeartIcon filled={isLiked(currentTrack.id)} />
        </button>
        <button className="sp-btn" onClick={e => { e.stopPropagation(); togglePlay(); }}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className="sp-btn" onClick={e => { e.stopPropagation(); nextTrack(); }}>
          <NextIcon />
        </button>
      </div>
    </div>
  );
}
