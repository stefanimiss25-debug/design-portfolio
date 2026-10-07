import { useRef } from 'react';
import { childhood, nowPhoto } from '../data/photos';
import { useGsap, revealChildren } from '../hooks/useGsap';
import { gsap } from '../lib/motion';
import { Photo } from './Photo';
import './ChildhoodArchive.css';

const tilt = [-4, 3, -2, 5, -3];

export function ChildhoodArchive() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    revealChildren(root.current!);
    gsap.utils.toArray<HTMLElement>('.arch__card').forEach((card, i) => {
      gsap.from(card, {
        y: 120,
        rotate: tilt[i % tilt.length] * -3,
        autoAlpha: 0,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 92%' },
      });
    });
    // "18" grows from the archive into the present
    gsap.fromTo(
      '.arch__eighteen',
      { scale: 0.45, autoAlpha: 0.2 },
      {
        scale: 1,
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.arch__bridge', start: 'top 85%', end: 'center center', scrub: true },
      },
    );
    gsap.fromTo(
      '.arch__now',
      { clipPath: 'circle(0% at 50% 50%)' },
      {
        clipPath: 'circle(75% at 50% 50%)',
        ease: 'none',
        scrollTrigger: { trigger: '.arch__bridge', start: 'top 40%', end: 'bottom 80%', scrub: true },
      },
    );
  });

  return (
    <section ref={root} className="arch" id="archive" aria-labelledby="arch-title">
      <header className="arch__head">
        <div className="section-head" data-reveal>
          <span className="section-head__num">04</span>
          <span className="kicker">From the family archive</span>
        </div>
        <h2 id="arch-title" className="arch__title serif" data-reveal>
          Before <em>everything</em>
        </h2>
        <span className="arch__hand" data-reveal>
          смотри, какая
          <svg viewBox="0 0 120 40" aria-hidden="true">
            <path d="M4 30 C 30 8, 70 6, 112 18 M98 8 L112 18 L96 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </header>

      <div className="arch__board">
        {childhood.map((ph, i) => (
          <figure
            key={ph.src}
            className={`arch__card arch__card--${i + 1}`}
            style={{ ['--tilt' as string]: `${tilt[i % tilt.length]}deg` }}
          >
            <span className="arch__tape" aria-hidden="true" />
            <Photo photo={ph} className="arch__photo" />
            <figcaption>{ph.caption}</figcaption>
            {i === 2 && (
              <svg className="arch__circle" viewBox="0 0 200 200" aria-hidden="true">
                <path
                  d="M100 14 C 160 12, 192 60, 186 104 C 180 156, 130 190, 86 184 C 36 178, 10 136, 16 92 C 22 46, 64 18, 116 22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </figure>
        ))}
        <span className="arch__stamp kicker" aria-hidden="true">archive · N°18</span>
      </div>

      <div className="arch__bridge">
        <span className="arch__then hand">тогда</span>
        <div className="arch__eighteen serif" aria-hidden="true">18</div>
        <figure className="arch__now">
          <Photo photo={nowPhoto} />
        </figure>
        <span className="arch__now-cap hand">и сейчас</span>
      </div>
    </section>
  );
}
