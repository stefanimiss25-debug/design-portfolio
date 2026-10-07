import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { tracks, defaultTheme } from '../data/tracks';
import { paletteFromCover, type Theme } from '../lib/palette';

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'blocked' | 'error';

type PlayerApi = {
  index: number | null;
  status: PlayerStatus;
  theme: Theme;
  /** Click/tap: switch to a track, or toggle play/pause on the active one. */
  toggle: (i: number) => void;
  /** Hover intent on desktop: start a track only if the browser allows it. */
  preview: (i: number) => void;
};

const PlayerContext = createContext<PlayerApi | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const triedFallback = useRef(false);
  const indexRef = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [palettes, setPalettes] = useState<Record<string, Theme>>({});

  // One audio element for the whole site.
  if (!audioRef.current && typeof Audio !== 'undefined') {
    const a = new Audio();
    a.preload = 'metadata';
    audioRef.current = a;
  }

  const startPlayback = useCallback((fromHover = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    setStatus('loading');
    audio.play().catch((err: DOMException) => {
      if (err.name === 'AbortError') return; // superseded by another src switch
      if (err.name === 'NotAllowedError') {
        // Autoplay policy: keep the track selected, ask for a click/tap.
        setStatus(fromHover ? 'paused' : 'blocked');
        return;
      }
      // NotSupportedError etc. are handled by the 'error' listener (fallback).
    });
  }, []);

  const load = useCallback((i: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    triedFallback.current = false;
    audio.src = tracks[i].audioSrc;
    indexRef.current = i;
    setIndex(i);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlaying = () => setStatus('playing');
    const onPause = () => setStatus((s) => (s === 'error' ? s : 'paused'));
    const onWaiting = () => setStatus('loading');
    const onEnded = () => {
      const next = ((indexRef.current ?? -1) + 1) % tracks.length;
      load(next);
      startPlayback();
    };
    const onError = () => {
      const i = indexRef.current;
      if (i === null) return;
      if (!triedFallback.current) {
        // No extracted audio yet: play the sound of the original MP4 instead.
        triedFallback.current = true;
        audio.src = tracks[i].fallbackSrc;
        startPlayback();
        return;
      }
      setStatus('error');
    };
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, [load, startPlayback]);

  const toggle = useCallback(
    (i: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (indexRef.current === i && !audio.error) {
        if (!audio.paused) audio.pause();
        else startPlayback();
        return;
      }
      load(i);
      startPlayback();
    },
    [load, startPlayback],
  );

  const preview = useCallback(
    (i: number) => {
      const audio = audioRef.current;
      if (!audio || indexRef.current === i) return;
      const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
      // Without a prior gesture the browser would refuse anyway — don't try.
      if (ua && !ua.hasBeenActive) return;
      load(i);
      startPlayback(true);
    },
    [load, startPlayback],
  );

  // Extract palettes from the real covers (silently skipped if a cover is missing).
  useEffect(() => {
    tracks.forEach((t) =>
      paletteFromCover(t.cover).then((p) => p && setPalettes((prev) => ({ ...prev, [t.id]: p }))),
    );
  }, []);

  const theme: Theme = useMemo(() => {
    if (index === null) return defaultTheme;
    const t = tracks[index];
    return palettes[t.id] ?? t;
  }, [index, palettes]);

  // Push the theme into CSS custom properties; CSS animates them (@property).
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--bg', theme.backgroundColor);
    root.setProperty('--accent', theme.accentColor);
    root.setProperty('--ink', theme.textColor);
    root.setProperty('--muted', theme.secondaryColor);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.backgroundColor);
  }, [theme]);

  const api = useMemo(() => ({ index, status, theme, toggle, preview }), [index, status, theme, toggle, preview]);
  return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
