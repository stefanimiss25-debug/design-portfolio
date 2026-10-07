import { PlayerProvider } from './hooks/usePlayer';
import { Hero } from './components/Hero';
import { MusicPlayer } from './components/MusicPlayer';
import { FashionEditorial } from './components/FashionEditorial';
import { CatWalkStrip } from './components/CatWalkStrip';
import { ChildhoodArchive } from './components/ChildhoodArchive';
import { DigitalCamera } from './components/DigitalCamera';
import { CatsScene } from './components/CatsScene';
import { SocialLinks } from './components/SocialLinks';

export default function App() {
  return (
    <PlayerProvider>
      <div className="grain" aria-hidden="true" />
      <main>
        <Hero />
        <MusicPlayer />
        <FashionEditorial />
        <CatWalkStrip />
        <ChildhoodArchive />
        <DigitalCamera />
        <CatsScene />
        <SocialLinks />
      </main>
    </PlayerProvider>
  );
}
