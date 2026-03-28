// ──────────────────────────────────────────────────────────────────
// CONFIGURE YOUR YOUTUBE DATA API v3 KEY:
//   1. Go to https://console.cloud.google.com
//   2. Enable "YouTube Data API v3"
//   3. Create an API Key
//   4. Create a .env file at the project root with:
//      VITE_YOUTUBE_API_KEY=your_key_here
// ──────────────────────────────────────────────────────────────────
export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
export const YT_API = 'https://www.googleapis.com/youtube/v3';

// Featured playlist IDs (real YouTube music playlists)
export const FEATURED_PLAYLISTS = [
  { id: 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI', name: 'Top Hits 2025', color: '#E13300' },
  { id: 'PLDIoUOhQQPlXr63I_vwF06Dq7giiMCEa9', name: 'Reggaeton Mix',  color: '#509BF5' },
  { id: 'PL4fGSI1pDJn5kI81J1fYWK5T6rlCiEmCh', name: 'Chill Vibes',    color: '#1ED760' },
  { id: 'PLH9pM1UMGbuGkCjqjuqKLd4khLBnQ3Yly', name: 'Hip-Hop',        color: '#F59B23' },
  { id: 'PLw-VjHDlEOgs658kAHR_LAaILBXb-s6Q5', name: 'Pop Español',    color: '#BC5900' },
  { id: 'PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx', name: 'Workout',        color: '#AF2896' },
];

// Browse categories with search queries
export const CATEGORIES = [
  { id: 'pop',        label: 'Pop',         query: 'pop music 2025',           color: '#E13300', emoji: '🎤' },
  { id: 'reggaeton',  label: 'Reggaeton',   query: 'reggaeton 2025',           color: '#509BF5', emoji: '🔥' },
  { id: 'hiphop',     label: 'Hip-Hop',     query: 'hip hop rap 2025',         color: '#F59B23', emoji: '🎧' },
  { id: 'rock',       label: 'Rock',         query: 'rock music hits',          color: '#AF2896', emoji: '🎸' },
  { id: 'electronic', label: 'Electrónica', query: 'electronic dance music',   color: '#1ED760', emoji: '🎛️' },
  { id: 'chill',      label: 'Chill',        query: 'chill lofi music',         color: '#BC5900', emoji: '☁️' },
  { id: 'latin',      label: 'Latino',       query: 'musica latina 2025',       color: '#E13300', emoji: '💃' },
  { id: 'workout',    label: 'Workout',      query: 'workout gym music',        color: '#AF2896', emoji: '💪' },
];
