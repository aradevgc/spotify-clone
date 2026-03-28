import React, { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import YouTubePlayer from './components/YouTubePlayer';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/MiniPlayer';
import FullPlayer from './components/FullPlayer';
import SetupScreen from './components/SetupScreen';
import Home from './views/Home';
import Search from './views/Search';
import Library from './views/Library';
import { YOUTUBE_API_KEY } from './config';

// Allow runtime override from SetupScreen
const runtimeKey = sessionStorage.getItem('VITE_YOUTUBE_API_KEY_OVERRIDE');
const hasKey = !!(YOUTUBE_API_KEY || runtimeKey);

export default function App() {
  const [view, setView]           = useState('home');
  const [viewParams, setViewParams] = useState({});
  const [playerOpen, setPlayerOpen] = useState(false);

  /* ── Render current view ─────────────────────────────── */
  const renderView = () => {
    switch (view) {
      case 'home':    return <Home setView={setView} setViewParams={setViewParams} />;
      case 'search':  return <Search />;
      case 'library': return <Library />;
      default:        return <Home setView={setView} setViewParams={setViewParams} />;
    }
  };

  if (!hasKey) return <SetupScreen />;

  return (
    <PlayerProvider>
      {/* Hidden YouTube IFrame player */}
      <YouTubePlayer />

      {/* Full-screen player overlay */}
      {playerOpen && (
        <FullPlayer onClose={() => setPlayerOpen(false)} />
      )}

      {/* Main layout */}
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#000',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}>
        {/* View content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {renderView()}
        </div>

        {/* Mini player (above nav) */}
        <MiniPlayer onExpand={() => setPlayerOpen(true)} />

        {/* Bottom navigation */}
        <BottomNav view={view} setView={setView} />
      </div>
    </PlayerProvider>
  );
}
