import { useState, type CSSProperties } from 'react';
import type { Photo as PhotoData } from '../data/photos';
import './Photo.css';

type Props = {
  photo: PhotoData;
  className?: string;
  eager?: boolean;
  style?: CSSProperties;
  sizes?: string;
};

/**
 * Image with an editorial placeholder: if the file isn't in /public yet,
 * the frame shows which file it expects instead of a broken image.
 */
export function Photo({ photo, className = '', eager = false, style }: Props) {
  const [missing, setMissing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const file = photo.src.split('/').pop();

  return (
    <div
      className={`photo ${photo.tone === 'bw' ? 'photo--bw' : ''} ${loaded ? 'is-loaded' : ''} ${className}`}
      style={style}
    >
      {missing ? (
        <div className="photo__placeholder" role="img" aria-label={photo.alt}>
          <span className="photo__crop photo__crop--tl" />
          <span className="photo__crop photo__crop--br" />
          <span className="photo__ph-title">{photo.caption ?? 'Sofa'}</span>
          <span className="photo__ph-file">media/photos/{file}</span>
        </div>
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          draggable={false}
          style={{ objectPosition: photo.focus }}
          onLoad={() => setLoaded(true)}
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
