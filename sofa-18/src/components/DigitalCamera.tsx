import { useCallback, useEffect, useRef, useState } from 'react';
import { cameraRoll } from '../data/photos';
import { useGsap, revealChildren } from '../hooks/useGsap';
import { prefersReducedMotion } from '../lib/motion';
import { Photo } from './Photo';
import './DigitalCamera.css';

const AUTO_MS = 3400;

export function DigitalCamera() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [shutter, setShutter] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const n = cameraRoll.length;

  useGsap(root, () => revealChildren(root.current!));

  const go = useCallback(
    (dir: 1 | -1) => {
      setShutter((s) => s + 1); // retrigger the shutter animation
      setI((v) => (v + dir + n) % n);
    },
    [n],
  );

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || prefersReducedMotion()) return;
    const id = window.setTimeout(() => go(1), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [i, inView, paused, go]);

  const counter = `${String(i + 1).padStart(3, '0')}/${String(n).padStart(3, '0')}`;

  return (
    <section ref={root} className="cam" id="camera" aria-labelledby="cam-title">
      <header className="cam__head">
        <div className="section-head" data-reveal>
          <span className="section-head__num">05</span>
          <span className="kicker">Point &amp; shoot</span>
        </div>
        <h2 id="cam-title" className="cam__title serif" data-reveal>
          From the <em>memory card</em>
        </h2>
      </header>

      <div className="cam__wrap" data-reveal>
        <span className="cam__note script" aria-hidden="true">
          press
        </span>
        <div className="camera" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="camera__top">
            <span className="camera__brand">SOFA·SHOT</span>
            <button type="button" className="camera__shutter" onClick={() => go(1)} aria-label="Следующий кадр" />
          </div>
          <div className="camera__body">
            <div className="camera__screen-bezel">
              <button
                type="button"
                className="camera__screen"
                onClick={() => go(1)}
                aria-label={`Кадр ${i + 1} из ${n}. Нажми для следующего`}
              >
                {cameraRoll.map((ph, k) => (
                  <div key={ph.src} className={`camera__shot ${k === i ? 'is-on' : ''}`} aria-hidden={k !== i}>
                    <Photo photo={ph} />
                  </div>
                ))}
                <span key={shutter} className="camera__blades" aria-hidden="true" />
                <span className="camera__osd camera__osd--tl">▶ {counter}</span>
                <span className="camera__osd camera__osd--tr">
                  <i className="camera__batt" />
                </span>
                <span className="camera__osd camera__osd--bl">06.10 · N°18</span>
                <span className="camera__osd camera__osd--br">7M</span>
              </button>
            </div>
            <div className="camera__controls">
              <span className="camera__label">7.1 MEGA PIXELS</span>
              <div className="camera__pad">
                <button type="button" className="camera__pad-btn camera__pad-btn--l" onClick={() => go(-1)} aria-label="Предыдущий кадр">
                  ‹
                </button>
                <span className="camera__pad-ok" />
                <button type="button" className="camera__pad-btn camera__pad-btn--r" onClick={() => go(1)} aria-label="Следующий кадр">
                  ›
                </button>
              </div>
              <div className="camera__mini">
                <span>MENU</span>
                <span>DISP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
