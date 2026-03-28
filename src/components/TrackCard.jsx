import React from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function TrackCard({ track, queue = [], style = {} }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const isActive = currentTrack?.id === track.id;

  return (
    <div
      onClick={() => playTrack(track, queue.length > 0 ? queue : [track])}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '8px 16px', cursor: 'pointer',
        background: isActive ? '#1a1a1a' : 'transparent',
        borderRadius: '8px', transition: 'background .15s',
        ...style,
      }}
      onMouseOver={e => { if (!isActive) e.currentTarget.style.background = '#1a1a1a'; }}
      onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
        {track.thumbnail
          ? <img src={track.thumbnail} alt="" style={{ width: 48, height: 48, borderRadius: '6px', objectFit: 'cover' }} />
          : <div className="thumb-placeholder" style={{ width: 48, height: 48, borderRadius: '6px', fontSize: '1.2rem' }}>🎵</div>
        }
        {isActive && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)',
            borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isPlaying
              ? <div className="eq-bars"><span/><span/><span/></div>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954"><path d="M8 5.14v14l11-7-11-7z"/></svg>
            }
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <p style={{
          margin: 0, fontSize: '14px', fontWeight: 600,
          color: isActive ? '#1DB954' : '#fff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {track.title}
        </p>
        <p style={{
          margin: '2px 0 0', fontSize: '12px', color: '#b3b3b3',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {track.artist}
        </p>
      </div>

      {/* More icon */}
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#b3b3b3' }}
        onClick={e => e.stopPropagation()}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>
    </div>
  );
}
