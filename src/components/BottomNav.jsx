import React from 'react';

const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#fff' : '#727272'}>
    <path d="M12 3L2 12h3v9h5v-6h4v6h5v-9h3L12 3z"/>
  </svg>
);
const SearchIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#727272'} strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7.5"/>
    <line x1="16.5" y1="16.5" x2="22" y2="22"/>
  </svg>
);
const LibraryIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#fff' : '#727272'}>
    <path d="M4 6h2v13H4zm3.5-1h2v14h-2zm4-1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1h-8z"/>
  </svg>
);

export default function BottomNav({ view, setView }) {
  const tabs = [
    { id: 'home',    label: 'Inicio',    Icon: HomeIcon    },
    { id: 'search',  label: 'Buscar',    Icon: SearchIcon  },
    { id: 'library', label: 'Biblioteca',Icon: LibraryIcon },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: 'calc(58px + env(safe-area-inset-bottom, 0px))',
        background: '#121212',
        borderTop: '1px solid #2a2a2a',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        paddingTop: '6px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 50,
      }}
    >
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setView(id)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '3px', background: 'none', border: 'none',
            cursor: 'pointer', padding: '6px 20px',
            color: view === id ? '#fff' : '#727272',
            fontSize: '10px', fontFamily: 'inherit', fontWeight: view === id ? 700 : 400,
            transition: 'color .15s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Icon active={view === id} />
          {label}
        </button>
      ))}
    </nav>
  );
}
