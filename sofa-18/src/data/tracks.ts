/**
 * Soundtrack data. Order is fixed (1 → 5) and must not be changed.
 *
 * TEMP: the screenshot with exact titles/artists and the source videos
 * (Yandex Disk) were not reachable while building. Every field marked
 * `confirmed: false` is a temporary value — replace it with the exact data
 * from the screenshot. Nothing here is invented beyond what the brief named.
 *
 * Files:
 *   audioSrc     — extracted audio (npm run extract-audio), /media/music/NN.m4a
 *   fallbackSrc  — the original MP4; played through a hidden <audio> if the
 *                  .m4a is missing (the video itself is never shown)
 *   cover        — square cover, /media/covers/NN.jpg
 *
 * Colors: the values below are provisional. When `cover` exists, the palette
 * is extracted from the cover itself at runtime (see useCoverPalette) and
 * overrides these, so the theme always follows the real artwork.
 */
export type Track = {
  id: string;
  title: string;
  artist: string;
  audioSrc: string;
  fallbackSrc: string;
  cover: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  secondaryColor: string;
  confirmed: boolean;
};

export const tracks: Track[] = [
  {
    id: '01',
    title: 'Fall By Void',
    artist: 'The Weeknd',
    audioSrc: '/media/music/01.m4a',
    fallbackSrc: '/media/videos/music-src/01.mp4',
    cover: '/media/covers/01.jpg',
    accentColor: '#d4142a',
    backgroundColor: '#140607',
    textColor: '#f4ece4',
    secondaryColor: '#5a1016',
    confirmed: false, // title/spelling to verify against the screenshot
  },
  {
    id: '02',
    title: 'Русская кукла',
    artist: 'Исполнитель — уточнить',
    audioSrc: '/media/music/02.m4a',
    fallbackSrc: '/media/videos/music-src/02.mp4',
    cover: '/media/covers/02.jpg',
    accentColor: '#e8c9b0',
    backgroundColor: '#1b1513',
    textColor: '#f6eee6',
    secondaryColor: '#7b4b3e',
    confirmed: false, // artist unknown — take it from the screenshot
  },
  {
    id: '03',
    title: 'Dirty Diana',
    artist: 'Michael Jackson',
    audioSrc: '/media/music/03.m4a',
    fallbackSrc: '/media/videos/music-src/03.mp4',
    cover: '/media/covers/03.jpg',
    accentColor: '#c9a46a',
    backgroundColor: '#0d0d10',
    textColor: '#f3efe8',
    secondaryColor: '#3a3428',
    confirmed: true,
  },
  {
    id: '04',
    title: 'Название — уточнить',
    artist: 'Монеточка',
    audioSrc: '/media/music/04.m4a',
    fallbackSrc: '/media/videos/music-src/04.mp4',
    cover: '/media/covers/04.jpg',
    accentColor: '#9fb7d8',
    backgroundColor: '#10141c',
    textColor: '#eef2f8',
    secondaryColor: '#33415a',
    confirmed: false, // title unknown — take it from the screenshot
  },
  {
    id: '05',
    title: 'Название — уточнить',
    artist: 'The Neighbourhood',
    audioSrc: '/media/music/05.m4a',
    fallbackSrc: '/media/videos/music-src/05.mp4',
    cover: '/media/covers/05.jpg',
    accentColor: '#d9d9d6',
    backgroundColor: '#0e0e0e',
    textColor: '#f2f2f0',
    secondaryColor: '#3c3c3a',
    confirmed: false, // title unknown — take it from the screenshot
  },
];

/** Theme before any track is chosen. */
export const defaultTheme = {
  accentColor: '#c8102e',
  backgroundColor: '#0b0b0c',
  textColor: '#f3ede4',
  secondaryColor: '#2a2a2c',
};
