import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Track } from '../data/tracks';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { Cover } from './Cover';
import './Vinyl.css';

type Props = { track: Track | null; spinning: boolean };

export function Vinyl({ track, spinning }: Props) {
  const disc = useRef<HTMLDivElement>(null);
  const spin = useRef<gsap.core.Tween | null>(null);

  // One endless clockwise tween; play/pause only changes its speed,
  // so the record stops where it is and resumes from the same angle.
  useLayoutEffect(() => {
    if (!disc.current) return;
    spin.current = gsap.to(disc.current, { rotation: '+=360', duration: 1.8, ease: 'none', repeat: -1, paused: true });
    spin.current.timeScale(0);
    return () => {
      spin.current?.kill();
    };
  }, []);

  useEffect(() => {
    const tween = spin.current;
    if (!tween || prefersReducedMotion()) return;
    if (spinning) {
      tween.play();
      gsap.to(tween, { timeScale: 1, duration: 1.1, ease: 'power2.inOut', overwrite: true });
    } else {
      gsap.to(tween, {
        timeScale: 0,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: true,
        onComplete: () => {
          tween.pause();
        },
      });
    }
  }, [spinning]);

  return (
    <div className={`vinyl ${spinning ? 'is-spinning' : ''}`}>
      <div className="vinyl__shadow" aria-hidden="true" />
      <div ref={disc} className="vinyl__disc">
        <div className="vinyl__grooves" />
        <div className="vinyl__label" key={track?.id ?? 'none'}>
          {track ? (
            <Cover track={track} />
          ) : (
            <div className="vinyl__label-default">
              <span className="script">Sofa</span>
              <span className="kicker">side A · 18</span>
            </div>
          )}
          <span className="vinyl__label-ring" />
        </div>
        <span className="vinyl__hole" />
      </div>
      {/* Light reflections stay still while the disc turns underneath. */}
      <div className="vinyl__sheen" aria-hidden="true" />
      <svg className="vinyl__arm" viewBox="0 0 120 420" aria-hidden="true">
        <circle cx="60" cy="40" r="30" fill="#2a2a2c" stroke="#555" strokeWidth="2" />
        <circle cx="60" cy="40" r="12" fill="#888" />
        <path d="M60 40 L60 300 L36 360" fill="none" stroke="#c9c9c9" strokeWidth="7" strokeLinecap="round" />
        <rect x="18" y="352" width="34" height="48" rx="4" fill="#1d1d1f" stroke="#666" transform="rotate(22 35 376)" />
      </svg>
    </div>
  );
}
