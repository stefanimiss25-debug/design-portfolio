import { useRef } from 'react';
import { socialLinks } from '../data/links';
import { cats } from '../data/cats';
import { useGsap, revealChildren } from '../hooks/useGsap';
import './SocialLinks.css';

export function SocialLinks() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, () => revealChildren(root.current!));

  return (
    <footer ref={root} className="social" id="online" aria-labelledby="social-title">
      <div className="social__head">
        <div className="section-head" data-reveal>
          <span className="section-head__num">07</span>
          <span className="kicker">Her digital space</span>
        </div>
        <h2 id="social-title" className="social__title" data-reveal>
          <span className="script">Sofa,</span> <span className="serif">online</span>
        </h2>
      </div>

      <ul className="social__list">
        {socialLinks.map((l, i) => (
          <li key={l.href} data-reveal data-delay={i * 0.1}>
            <a className="social__link" href={l.href} target="_blank" rel="noopener noreferrer">
              <span className="kicker social__label">{l.label}</span>
              <span className="serif social__handle">{l.handle}</span>
              <span className="social__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="social__end">
        <img className="social__cats" src={cats.together} alt="Сёма и Стёпа вместе" loading="lazy" data-reveal />
        <div className="social__sign">
          <span className="script">Sofa 18</span>
          <span className="kicker">06 October · Issue N°18</span>
        </div>
      </div>
    </footer>
  );
}
