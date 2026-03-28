import React from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function YouTubePlayer() {
  const { containerRef } = usePlayer();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '-10px',
        left: '-10px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {/* The YouTube IFrame API attaches here */}
      <div ref={containerRef} id="yt-player" />
    </div>
  );
}
