import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useYouTubeSearch } from '../hooks/useYouTube';
import { CATEGORIES, YOUTUBE_API_KEY } from '../config';
import TrackCard from '../components/TrackCard';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b3b3b3" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7.5"/>
    <line x1="16.5" y1="16.5" x2="22" y2="22"/>
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#b3b3b3">
    <line x1="18" y1="6" x2="6" y2="18" stroke="#b3b3b3" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="#b3b3b3" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

/* ── Category card ───────────────────────────────────────── */
function CategoryCard({ cat, onPress }) {
  return (
    <div onClick={() => onPress(cat)} style={{
      borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
      background: cat.color,
      height: '96px', display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', justifyContent: 'flex-end',
      padding: '10px 12px', position: 'relative',
      boxShadow: '0 4px 16px rgba(0,0,0,.4)',
      transition: 'transform .15s',
    }}
    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <span style={{ position: 'absolute', top: '8px', right: '10px', fontSize: '28px' }}>
        {cat.emoji}
      </span>
      <span style={{ fontWeight: 800, fontSize: '14px', color: '#fff', lineHeight: 1.2 }}>
        {cat.label}
      </span>
    </div>
  );
}

export default function Search() {
  const [query, setQuery]           = useState('');
  const [activeCategory, setActive] = useState(null);
  const [searching, setSearching]   = useState(false);
  const { results, loading, error, search } = useYouTubeSearch();
  const debounceRef = useRef(null);
  const inputRef    = useRef(null);

  /* Debounced search */
  const handleChange = useCallback((val) => {
    setQuery(val);
    setActive(null);
    if (!val.trim()) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearching(true);
      search(val).finally(() => setSearching(false));
    }, 500);
  }, [search]);

  const handleCategory = useCallback((cat) => {
    setActive(cat);
    setQuery(cat.label);
    setSearching(true);
    search(cat.query).finally(() => setSearching(false));
  }, [search]);

  const clear = () => {
    setQuery('');
    setActive(null);
    inputRef.current?.focus();
  };

  const showResults = (query.trim() || activeCategory) && (results.length > 0 || loading || error);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#121212' }}>
      {/* Search bar */}
      <div style={{
        padding: '56px 16px 12px',
        background: '#121212',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#fff', borderRadius: '8px', padding: '10px 14px',
        }}>
          <SearchIcon />
          <input
            ref={inputRef}
            type="search"
            placeholder="¿Qué quieres escuchar?"
            value={query}
            onChange={e => handleChange(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: '15px', fontFamily: 'inherit', color: '#000',
            }}
          />
          {query && (
            <button onClick={clear} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 'var(--total-bottom)' }}>
        {/* Loading skeleton */}
        {(loading || searching) && (
          <div style={{ padding: '8px 0' }}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{ height: '64px', margin: '4px 16px', borderRadius: '8px', background: '#282828' }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#b3b3b3' }}>
            <p style={{ fontSize: '40px' }}>😞</p>
            <p>{error}</p>
          </div>
        )}

        {/* Search results */}
        {!loading && !error && showResults && (
          <div>
            <p style={{ margin: '8px 16px', fontSize: '13px', color: '#b3b3b3', fontWeight: 600 }}>
              {results.length} resultados
            </p>
            {results.map((t, i) => <TrackCard key={t.id || i} track={t} queue={results} />)}
          </div>
        )}

        {/* Browse categories */}
        {!query.trim() && !activeCategory && (
          <div style={{ padding: '0 16px' }}>
            <h2 style={{ margin: '8px 0 16px', fontSize: '20px', fontWeight: 800 }}>Explorar géneros</h2>
            {!YOUTUBE_API_KEY && (
              <div style={{
                background: '#282828', borderRadius: '8px', padding: '14px',
                marginBottom: '16px', color: '#b3b3b3', fontSize: '12px', lineHeight: '1.5',
              }}>
                ⚠️ Sin API Key de YouTube. Las búsquedas no funcionarán. Configura <strong style={{ color: '#1DB954' }}>VITE_YOUTUBE_API_KEY</strong> en tu archivo <strong>.env</strong>.
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {CATEGORIES.map(cat => (
                <CategoryCard key={cat.id} cat={cat} onPress={handleCategory} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state after search */}
        {!loading && !error && query.trim() && results.length === 0 && !searching && (
          <div style={{ textAlign: 'center', padding: '60px 32px', color: '#b3b3b3' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
            <p style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              No se encontró «{query}»
            </p>
            <p style={{ fontSize: '13px' }}>Asegúrate de que las palabras estén escritas correctamente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
