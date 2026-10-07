import { useCallback, useEffect, useRef, useState } from 'react';
import { cats } from '../data/cats';
import { useGsap, revealChildren } from '../hooks/useGsap';
import { prefersReducedMotion } from '../lib/motion';
import './CatsScene.css';

// Grooming loop for Стёпа: paw up → paw to mouth → lick → lick → wash face.
const GROOM_SEQ = [0, 1, 2, 1, 2, 1, 2, 3, 3, 3, 0];
const GROOM_STEP_MS = 280;

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

export function CatsScene() {
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root);
  const reduced = prefersReducedMotion();

  useGsap(root, () => revealChildren(root.current!));

  /* ---------- Стёпа: sits down and washes ---------- */
  const [groomStep, setGroomStep] = useState<number | null>(null);
  const groom = useCallback(() => {
    if (reduced) return;
    setGroomStep((s) => (s === null ? 0 : s));
  }, [reduced]);

  useEffect(() => {
    if (groomStep === null) return;
    const id = window.setTimeout(
      () => setGroomStep((s) => (s === null || s >= GROOM_SEQ.length - 1 ? null : s + 1)),
      GROOM_STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [groomStep]);

  useEffect(() => {
    if (!inView || reduced) return;
    const first = window.setTimeout(groom, 1600);
    const loop = window.setInterval(groom, 11000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(loop);
    };
  }, [inView, reduced, groom]);

  /* ---------- Сёма: an unhurried stroll ---------- */
  const [walkFrame, setWalkFrame] = useState<number | null>(null);
  const [away, setAway] = useState(false); // false = home spot, true = walked left

  const stroll = useCallback(() => {
    if (reduced || walkFrame !== null) return;
    setWalkFrame(0);
    window.setTimeout(() => setAway((a) => !a), 30);
  }, [reduced, walkFrame]);

  useEffect(() => {
    if (walkFrame === null) return;
    const id = window.setInterval(() => setWalkFrame((f) => (f === null ? f : (f + 1) % 4)), 210);
    const stop = window.setTimeout(() => setWalkFrame(null), 3200);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, [walkFrame === null]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(stroll, 14000);
    return () => window.clearInterval(id);
  }, [inView, reduced, stroll]);

  return (
    <section ref={root} className="cats" id="cats" aria-labelledby="cats-title">
      <span className="cats__bgword script" aria-hidden="true">
        the residents
      </span>

      <header className="cats__head">
        <div className="section-head" data-reveal>
          <span className="section-head__num">06</span>
          <span className="kicker">Co-stars</span>
        </div>
        <h2 id="cats-title" className="cats__title serif" data-reveal>
          Сёма <em>&amp;</em> Стёпа
        </h2>
      </header>

      <div className="cats__stage">
        <span className="cats__floor" aria-hidden="true" />

        <figure className="cats__cat cats__cat--syoma">
          <button
            type="button"
            className={`cats__syoma ${away ? 'is-away' : ''} ${walkFrame !== null ? 'is-walking' : ''}`}
            onClick={stroll}
            aria-label="Сёма — нажми, и он пройдётся"
          >
            <img className="cats__frame cats__frame--idle" src={cats.syoma.standing} alt="Сёма" loading="lazy" />
            {cats.syoma.walk.map((src, i) => (
              <img
                key={src}
                className="cats__frame"
                src={src}
                alt=""
                loading="lazy"
                style={{ opacity: walkFrame === i ? 1 : 0 }}
              />
            ))}
          </button>
          <figcaption className="cats__cap">
            <span className="serif cats__name">{cats.syoma.name}</span>
            <span className="kicker">светлый · пушистый · спокойный</span>
          </figcaption>
        </figure>

        <figure className="cats__cat cats__cat--styopa">
          <button
            type="button"
            className={`cats__styopa ${groomStep !== null ? 'is-grooming' : ''}`}
            onClick={groom}
            onPointerEnter={(e) => e.pointerType === 'mouse' && groom()}
            aria-label="Стёпа — нажми, и он умоется"
          >
            <img className="cats__frame cats__frame--idle" src={cats.styopa.standing} alt="Стёпа" loading="lazy" />
            {cats.styopa.groom.map((src, i) => (
              <img
                key={src}
                className="cats__frame cats__frame--sit"
                src={src}
                alt=""
                loading="lazy"
                style={{ opacity: groomStep !== null && GROOM_SEQ[groomStep] === i ? 1 : 0 }}
              />
            ))}
          </button>
          <figcaption className="cats__cap">
            <span className="serif cats__name">{cats.styopa.name}</span>
            <span className="kicker">рыжий · худой · большие уши</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
