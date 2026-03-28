import React, {
  createContext, useContext, useState, useRef,
  useCallback, useEffect
} from 'react';

const PlayerCtx = createContext(null);
export const usePlayer = () => useContext(PlayerCtx);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack]     = useState(null);
  const [isPlaying, setIsPlaying]           = useState(false);
  const [queue, setQueue]                   = useState([]);
  const [queueIndex, setQueueIndex]         = useState(0);
  const [progress, setProgress]             = useState(0);   // seconds
  const [duration, setDuration]             = useState(0);   // seconds
  const [volume, setVolume]                 = useState(80);  // 0-100
  const [playerReady, setPlayerReady]       = useState(false);
  const [shuffle, setShuffle]               = useState(false);
  const [repeat, setRepeat]                 = useState('off'); // off | one | all
  const [liked, setLiked]                   = useState(() =>
    JSON.parse(localStorage.getItem('sp_liked') || '[]')
  );
  const [recentlyPlayed, setRecentlyPlayed] = useState(() =>
    JSON.parse(localStorage.getItem('sp_recent') || '[]')
  );
  const [playlists, setPlaylists]           = useState(() =>
    JSON.parse(localStorage.getItem('sp_playlists') || JSON.stringify([
      { id: 'liked', name: 'Canciones que te gustan', tracks: [], system: true }
    ]))
  );

  const ytPlayer      = useRef(null);
  const progressTimer = useRef(null);
  const containerRef  = useRef(null); // set by YouTubePlayer component

  /* ── Init YouTube IFrame API ─────────────────────────── */
  useEffect(() => {
    const onAPIReady = () => {
      if (!containerRef.current) return;
      ytPlayer.current = new window.YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        playerVars: { autoplay: 0, controls: 0, playsinline: 1, rel: 0 },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: handleStateChange,
          onError: () => { setIsPlaying(false); autoNext(); },
        },
      });
    };

    if (window.YT?.Player) {
      onAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = onAPIReady;
      if (!document.getElementById('yt-api-script')) {
        const s = document.createElement('script');
        s.id = 'yt-api-script';
        s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── State change handler ────────────────────────────── */
  const handleStateChange = useCallback((e) => {
    const YT = window.YT;
    if (!YT) return;
    if (e.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTimer();
    } else if (e.data === YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      stopProgressTimer();
    } else if (e.data === YT.PlayerState.ENDED) {
      setIsPlaying(false);
      stopProgressTimer();
      autoNext();
    } else if (e.data === YT.PlayerState.BUFFERING) {
      // keep isPlaying = true while buffering
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeat, queue, queueIndex, shuffle]);

  /* ── Progress timer ──────────────────────────────────── */
  const startProgressTimer = () => {
    stopProgressTimer();
    progressTimer.current = setInterval(() => {
      const p = ytPlayer.current;
      if (!p?.getCurrentTime) return;
      setProgress(p.getCurrentTime() || 0);
      setDuration(p.getDuration()   || 0);
    }, 500);
  };
  const stopProgressTimer = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
  };

  /* ── Add to recently played ──────────────────────────── */
  const addRecent = useCallback((track) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      const next = [track, ...filtered].slice(0, 20);
      localStorage.setItem('sp_recent', JSON.stringify(next));
      return next;
    });
  }, []);

  /* ── Play a track ────────────────────────────────────── */
  const playTrack = useCallback((track, contextQueue = []) => {
    if (!playerReady || !ytPlayer.current) return;
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    if (contextQueue.length > 0) {
      setQueue(contextQueue);
      setQueueIndex(contextQueue.findIndex(t => t.id === track.id));
    } else {
      setQueue([track]);
      setQueueIndex(0);
    }
    ytPlayer.current.loadVideoById(track.id);
    addRecent(track);
  }, [playerReady, addRecent]);

  /* ── Toggle play / pause ─────────────────────────────── */
  const togglePlay = useCallback(() => {
    if (!ytPlayer.current) return;
    if (isPlaying) {
      ytPlayer.current.pauseVideo();
    } else {
      ytPlayer.current.playVideo();
    }
  }, [isPlaying]);

  /* ── Auto-next (called on ended / error) ─────────────── */
  const autoNext = useCallback(() => {
    setQueue(q => {
      setQueueIndex(idx => {
        if (repeat === 'one') {
          ytPlayer.current?.seekTo(0);
          ytPlayer.current?.playVideo();
          return idx;
        }
        let next;
        if (shuffle) {
          next = Math.floor(Math.random() * q.length);
        } else {
          next = idx + 1;
        }
        if (next >= q.length) {
          if (repeat === 'all') next = 0;
          else return idx;
        }
        const t = q[next];
        setCurrentTrack(t);
        setProgress(0);
        ytPlayer.current?.loadVideoById(t.id);
        addRecent(t);
        return next;
      });
      return q;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeat, shuffle, addRecent]);

  /* ── Next / Prev ─────────────────────────────────────── */
  const nextTrack = useCallback(() => {
    if (progress > 3) { seekTo(0); return; }
    autoNext();
  }, [progress, autoNext]);

  const prevTrack = useCallback(() => {
    if (progress > 3) { seekTo(0); return; }
    setQueueIndex(idx => {
      const next = Math.max(0, idx - 1);
      const t = queue[next];
      if (t) {
        setCurrentTrack(t);
        setProgress(0);
        ytPlayer.current?.loadVideoById(t.id);
        addRecent(t);
      }
      return next;
    });
  }, [progress, queue, addRecent]);

  /* ── Seek ────────────────────────────────────────────── */
  const seekTo = useCallback((seconds) => {
    ytPlayer.current?.seekTo(seconds, true);
    setProgress(seconds);
  }, []);

  /* ── Volume ──────────────────────────────────────────── */
  const setVol = useCallback((v) => {
    setVolume(v);
    ytPlayer.current?.setVolume(v);
  }, []);

  /* ── Like ────────────────────────────────────────────── */
  const toggleLike = useCallback((track) => {
    setLiked(prev => {
      const exists = prev.some(t => t.id === track.id);
      const next = exists ? prev.filter(t => t.id !== track.id) : [track, ...prev];
      localStorage.setItem('sp_liked', JSON.stringify(next));
      // Sync with liked playlist
      setPlaylists(ps => ps.map(p =>
        p.id === 'liked' ? { ...p, tracks: next } : p
      ));
      return next;
    });
  }, []);

  const isLiked = useCallback((id) => liked.some(t => t.id === id), [liked]);

  /* ── Playlist management ─────────────────────────────── */
  const createPlaylist = useCallback((name) => {
    const p = { id: Date.now().toString(), name, tracks: [] };
    setPlaylists(prev => {
      const next = [...prev, p];
      localStorage.setItem('sp_playlists', JSON.stringify(next));
      return next;
    });
    return p;
  }, []);

  const addToPlaylist = useCallback((playlistId, track) => {
    setPlaylists(prev => {
      const next = prev.map(p =>
        p.id === playlistId && !p.tracks.some(t => t.id === track.id)
          ? { ...p, tracks: [track, ...p.tracks] }
          : p
      );
      localStorage.setItem('sp_playlists', JSON.stringify(next));
      return next;
    });
  }, []);

  /* ── Volume sync on player ready ─────────────────────── */
  useEffect(() => {
    if (playerReady) ytPlayer.current?.setVolume(volume);
  }, [playerReady, volume]);

  const value = {
    currentTrack, isPlaying, queue, queueIndex,
    progress, duration, volume, playerReady,
    shuffle, setShuffle,
    repeat, setRepeat,
    liked, isLiked, toggleLike,
    recentlyPlayed, playlists,
    playTrack, togglePlay, nextTrack, prevTrack,
    seekTo, setVolume: setVol,
    createPlaylist, addToPlaylist,
    containerRef, // passed to YouTubePlayer
  };

  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}
