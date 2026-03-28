import { useState, useCallback } from 'react';
import { YOUTUBE_API_KEY, YT_API } from '../config';

/* ── Map a YouTube API item to our track shape ─────────── */
export const mapVideo = (item) => {
  const id = typeof item.id === 'string' ? item.id : item.id?.videoId;
  const snippet = item.snippet;
  return {
    id,
    title:     snippet.title,
    artist:    snippet.channelTitle,
    thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
    duration:  null,
  };
};

export const mapPlaylistItem = (item) => {
  const id = item.snippet?.resourceId?.videoId;
  const snippet = item.snippet;
  return {
    id,
    title:     snippet.title,
    artist:    snippet.videoOwnerChannelTitle || snippet.channelTitle,
    thumbnail: snippet.thumbnails?.high?.url  || `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
    duration:  null,
  };
};

/* ── useYouTubeSearch ────────────────────────────────────── */
export function useYouTubeSearch() {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const search = useCallback(async (query) => {
    if (!YOUTUBE_API_KEY || !query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const url = `${YT_API}/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(query)}&maxResults=25&key=${YOUTUBE_API_KEY}`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setResults((data.items || []).map(mapVideo).filter(t => t.id));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}

/* ── useTrendingMusic ────────────────────────────────────── */
export function useTrendingMusic(regionCode = 'ES') {
  const [tracks, setTracks]   = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    if (!YOUTUBE_API_KEY) return;
    setLoading(true);
    try {
      const url = `${YT_API}/videos?part=snippet&chart=mostPopular&videoCategoryId=10&regionCode=${regionCode}&maxResults=20&key=${YOUTUBE_API_KEY}`;
      const res  = await fetch(url);
      const data = await res.json();
      setTracks((data.items || []).map(item => ({
        id:        item.id,
        title:     item.snippet.title,
        artist:    item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`,
        duration:  null,
      })).filter(t => t.id));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [regionCode]);

  return { tracks, loading, fetch: fetch_ };
}

/* ── usePlaylistItems ────────────────────────────────────── */
export function usePlaylistItems() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaylist = useCallback(async (playlistId) => {
    if (!YOUTUBE_API_KEY) return;
    setLoading(true);
    try {
      const url = `${YT_API}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`;
      const res  = await fetch(url);
      const data = await res.json();
      setItems((data.items || []).map(mapPlaylistItem).filter(t => t.id));
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, fetchPlaylist };
}

/* ── useLyrics ───────────────────────────────────────────── */
export function useLyrics() {
  const [lyrics, setLyrics]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchLyrics = useCallback(async (artist, title) => {
    setLoading(true);
    setLyrics('');
    setError(null);
    // Clean up YouTube-style titles like "Official Video", "(ft. X)", etc.
    const cleanTitle = title
      .replace(/\(.*?\)/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/official.*$/i, '')
      .replace(/feat\..*$/i, '')
      .replace(/ft\..*$/i, '')
      .replace(/lyrics.*$/i, '')
      .replace(/video.*$/i, '')
      .replace(/audio.*$/i, '')
      .trim();
    const cleanArtist = artist.replace(/VEVO|Official/gi, '').replace(/ - Topic$/, '').trim();
    try {
      const res = await fetch(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`
      );
      const data = await res.json();
      if (data.lyrics) setLyrics(data.lyrics);
      else setError('Letra no disponible');
    } catch {
      setError('No se pudo cargar la letra');
    } finally {
      setLoading(false);
    }
  }, []);

  return { lyrics, loading, error, fetchLyrics };
}
