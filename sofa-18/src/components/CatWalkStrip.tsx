import { useEffect, useRef, useState } from 'react';
import { cats } from '../data/cats';
import { prefersReducedMotion } from '../lib/motion';
import './CatWalkStrip.css';

/**
 * Thin interlude between sections: Сёма crosses the page once each time the
 * strip scrolls into view. Lives in its own band, so it never covers text.
 */
export function CatWalkStrip() {
  const root = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const [walking, setWalking] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setWalking(true);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!walking) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % 4), 190);
    const done = window.setTimeout(() => setWalking(false), 9000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(done);
    };
  }, [walking]);

  return (
    <div ref={root} className={`walk ${walking ? 'is-walking' : ''}`} aria-hidden="true">
      <span className="walk__line" />
      <div className="walk__cat" onAnimationEnd={() => setWalking(false)}>
        {cats.syoma.walk.map((src, i) => (
          <img key={src} src={src} alt="" loading="lazy" style={{ opacity: i === frame ? 1 : 0 }} />
        ))}
        <span className="walk__name script">{cats.syoma.name}</span>
      </div>
    </div>
  );
}
