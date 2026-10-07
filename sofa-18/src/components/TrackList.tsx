import { useRef } from 'react';
import { tracks } from '../data/tracks';
import { usePlayer } from '../hooks/usePlayer';
import { Cover } from './Cover';
import './TrackList.css';

const HOVER_INTENT_MS = 650;

export function TrackList() {
  const { index, status, toggle, preview } = usePlayer();
  const hoverTimer = useRef<number | undefined>(undefined);

  const onEnter = (i: number, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    // Hover-to-play only once something is already playing, so a casual
    // mouse pass never starts music on its own.
    if (status !== 'playing') return;
    hoverTimer.current = window.setTimeout(() => preview(i), HOVER_INTENT_MS);
  };
  const onLeave = () => window.clearTimeout(hoverTimer.current);

  return (
    <ol className="tracks" aria-label="Soundtrack">
      {tracks.map((t, i) => {
        const active = index === i;
        const playing = active && status === 'playing';
        const state = !active
          ? 'play'
          : status === 'playing'
            ? 'pause'
            : status === 'loading'
              ? 'loading…'
              : status === 'blocked'
                ? 'tap to play'
                : status === 'error'
                  ? 'file missing'
                  : 'play';
        return (
          <li key={t.id} className={`track ${active ? 'is-active' : ''} ${playing ? 'is-playing' : ''}`}>
            <button
              type="button"
              className="track__btn"
              aria-pressed={playing}
              aria-label={`${playing ? 'Пауза' : 'Включить'}: ${t.artist} — ${t.title}`}
              onClick={() => toggle(i)}
              onPointerEnter={(e) => onEnter(i, e)}
              onPointerLeave={onLeave}
            >
              <span className="track__num serif">{t.id}</span>
              <span className="track__cover">
                <Cover track={t} />
                <span className="track__icon" aria-hidden="true">
                  {playing ? <i className="track__pause" /> : <i className="track__play" />}
                </span>
              </span>
              <span className="track__meta">
                <span className="track__title">{t.title}</span>
                <span className="track__artist">{t.artist}</span>
              </span>
              <span className="track__state kicker" aria-hidden="true">
                {playing ? (
                  <span className="eq">
                    <i /><i /><i /><i />
                  </span>
                ) : (
                  state
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
