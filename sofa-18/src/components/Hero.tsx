import { useRef } from 'react';
import { heroPhoto } from '../data/photos';
import { useGsap } from '../hooks/useGsap';
import { gsap } from '../lib/motion';
import { Photo } from './Photo';
import './Hero.css';

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.hero__photo', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.8 })
      .from('.hero__photo .photo', { scale: 1.25, duration: 2.2 }, 0)
      .from('.hero__eighteen', { autoAlpha: 0, xPercent: -8, duration: 2 }, 0.2)
      .from('.hero__name span', { yPercent: 60, autoAlpha: 0, rotate: -4, stagger: 0.06, duration: 1.6 }, 0.45)
      .from('[data-hero-fade]', { autoAlpha: 0, y: 14, stagger: 0.08, duration: 1.2 }, 0.8);

    // Scroll parallax
    gsap.to('.hero__photo .photo', {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero__eighteen', {
      xPercent: 10,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero__name', {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });

    // Pointer drift on desktop only
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const xTo = gsap.quickTo('.hero__photo', 'x', { duration: 1.2, ease: 'power3' });
      const yTo = gsap.quickTo('.hero__photo', 'y', { duration: 1.2, ease: 'power3' });
      const onMove = (e: PointerEvent) => {
        xTo((e.clientX / window.innerWidth - 0.5) * -18);
        yTo((e.clientY / window.innerHeight - 0.5) * -12);
      };
      window.addEventListener('pointermove', onMove);
      return () => window.removeEventListener('pointermove', onMove);
    }
  });

  return (
    <header ref={root} className="hero" id="top">
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__top">
        <span className="kicker" data-hero-fade>Sofa 18</span>
        <span className="kicker hero__top-mid" data-hero-fade>Personal issue — N°18</span>
        <span className="kicker" data-hero-fade>06.10</span>
      </div>

      <div className="hero__eighteen serif" aria-hidden="true">18</div>

      <figure className="hero__photo">
        <Photo photo={heroPhoto} eager />
        <figcaption className="hero__photo-cap kicker" data-hero-fade>Cover story</figcaption>
      </figure>

      <h1 className="hero__name script" aria-label="Sofa 18">
        <span>S</span><span>o</span><span>f</span><span>a</span>
      </h1>

      <span className="hero__hand script" data-hero-fade aria-hidden="true">eighteen</span>

      <p className="hero__side kicker vertical" data-hero-fade>a personal digital issue · vol. 18</p>

      <div className="hero__date" data-hero-fade>
        <span className="kicker">The birthday issue</span>
        <span className="serif hero__date-main">
          06 <em>October</em>
        </span>
      </div>

      <a className="hero__scroll kicker" href="#music" data-hero-fade>
        <span>Scroll</span>
        <i aria-hidden="true" />
      </a>
    </header>
  );
}
