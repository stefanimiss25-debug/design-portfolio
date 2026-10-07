import { useRef, useState } from 'react';
import { editorial } from '../data/photos';
import { useGsap, revealChildren } from '../hooks/useGsap';
import { gsap } from '../lib/motion';
import { Photo } from './Photo';
import './FashionEditorial.css';

export function FashionEditorial() {
  const root = useRef<HTMLElement>(null);
  const [hasCutout, setHasCutout] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);

  useGsap(root, () => {
    revealChildren(root.current!);
    gsap.to('.ed__word', {
      xPercent: -22,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
      gsap.to(el, {
        yPercent: Number(el.dataset.speed) * -20,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });

  return (
    <section ref={root} className="ed" id="editorial" aria-labelledby="ed-title">
      <div className="ed__word serif" aria-hidden="true">Sofa Sofa Sofa</div>

      <header className="ed__head">
        <div className="section-head" data-reveal>
          <span className="section-head__num">03</span>
          <span className="kicker">The cover story</span>
        </div>
        <h2 id="ed-title" className="ed__title serif" data-reveal>
          Main <em>character</em>
          <br /> energy
        </h2>
      </header>

      <div className="ed__spread">
        <figure className="ed__main" data-speed="0.4">
          <div data-mask>
            <Photo photo={editorial.main} />
          </div>
          <figcaption className="kicker">Look 01 — black &amp; white</figcaption>
        </figure>

        <figure className="ed__second" data-speed="1.2">
          <div data-mask>
            <Photo photo={editorial.second} />
          </div>
          <figcaption className="kicker">Look 02</figcaption>
        </figure>

        <span className="ed__script script" data-reveal>la fille</span>

        <p className="ed__vertical kicker vertical" aria-hidden="true">
          Sofa — Issue N°18 — 06 October
        </p>

        <figure className="ed__third" data-speed="0.8">
          <div data-mask>
            <Photo photo={editorial.third} />
          </div>
          <figcaption className="kicker">03</figcaption>
        </figure>

        <figure className="ed__fourth" data-speed="0.3">
          <div data-mask>
            {hasVideo ? (
              <video
                className="ed__video"
                src={editorial.video}
                muted
                loop
                autoPlay
                playsInline
                preload="metadata"
                onError={() => setHasVideo(false)}
                aria-label="Софа, видео"
              />
            ) : (
              <Photo photo={editorial.fourth} />
            )}
          </div>
          <figcaption className="kicker">{hasVideo ? 'In motion' : 'Look 04'}</figcaption>
        </figure>

        {hasCutout && (
          <img
            className="ed__cutout"
            src={editorial.cutout.src}
            alt=""
            loading="lazy"
            data-speed="1.6"
            onError={() => setHasCutout(false)}
          />
        )}

        <blockquote className="ed__pull" data-reveal>
          <span className="serif">18</span>
          <span className="kicker">and entirely herself</span>
        </blockquote>
      </div>
    </section>
  );
}
