import { useRef } from 'react';
import { tracks } from '../data/tracks';
import { usePlayer } from '../hooks/usePlayer';
import { useGsap, revealChildren } from '../hooks/useGsap';
import { gsap } from '../lib/motion';
import { Vinyl } from './Vinyl';
import { TrackList } from './TrackList';
import './MusicPlayer.css';

export function MusicPlayer() {
  const { index, status } = usePlayer();
  const root = useRef<HTMLElement>(null);
  const track = index === null ? null : tracks[index];

  useGsap(root, () => {
    revealChildren(root.current!);
    gsap.from('.music__vinyl', {
      xPercent: -30,
      rotation: -60,
      autoAlpha: 0,
      duration: 1.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.music__stage', start: 'top 75%' },
    });
    gsap.from('.track', {
      x: 60,
      autoAlpha: 0,
      stagger: 0.08,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.tracks', start: 'top 85%' },
    });
  });

  return (
    <section ref={root} className="music" id="music" aria-labelledby="music-title">
      {/* Background: blurred cover + gradient + darkening, crossfaded per track */}
      <div className="music__bg" aria-hidden="true">
        {tracks.map((t, i) => (
          <div
            key={t.id}
            className={`music__bg-cover ${index === i ? 'is-on' : ''}`}
            style={{ backgroundImage: `url(${t.cover}), radial-gradient(circle at 30% 30%, ${t.accentColor}, ${t.backgroundColor})` }}
          />
        ))}
        <div className="music__bg-tint" />
      </div>

      <div className="music__head section-head" data-reveal>
        <span className="section-head__num">02</span>
        <span className="script music__side">Side A</span>
        <h2 id="music-title" className="serif music__title">
          The <em>soundtrack</em>
        </h2>
      </div>

      <div className="music__stage">
        <div className="music__vinyl">
          <Vinyl track={track} spinning={status === 'playing'} />
        </div>

        <div className="music__panel">
          <div className="music__now" aria-live="polite">
            <span className="kicker">{status === 'playing' ? 'Now playing' : track ? 'Paused' : 'Choose a record'}</span>
            <p className="music__now-title serif" key={track?.id ?? 'none'}>
              {track ? track.title : 'Five songs'}
            </p>
            <p className="music__now-artist">{track ? track.artist : 'in this exact order'}</p>
            {status === 'blocked' && <p className="music__hint">Браузер ждёт нажатия — нажми на трек ещё раз.</p>}
            {status === 'error' && <p className="music__hint">Аудиофайл пока не добавлен в проект.</p>}
          </div>
          <TrackList />
        </div>
      </div>

      <p className="music__side-cap kicker vertical" aria-hidden="true">
        33⅓ rpm · stereo · sofa 18
      </p>
    </section>
  );
}
