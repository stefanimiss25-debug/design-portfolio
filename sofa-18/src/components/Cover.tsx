import { useState } from 'react';
import type { Track } from '../data/tracks';
import './Cover.css';

/** Track cover; until the real file exists it shows a typographic stand-in. */
export function Cover({ track, className = '' }: { track: Track; className?: string }) {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div
        className={`cover cover--ph ${className}`}
        style={{ background: `radial-gradient(circle at 30% 25%, ${track.accentColor}, ${track.secondaryColor} 55%, ${track.backgroundColor})` }}
        aria-hidden="true"
      >
        <span className="serif">{track.id}</span>
      </div>
    );
  }
  return (
    <img
      className={`cover ${className}`}
      src={track.cover}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setMissing(true)}
    />
  );
}
