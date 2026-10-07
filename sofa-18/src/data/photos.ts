/**
 * Photo slots. Drop the real files into public/media/photos with these names.
 * Until a file exists, the slot renders a neutral editorial placeholder that
 * shows the expected filename, so nothing in the components has to change.
 *
 * `focus` is the CSS object-position — set it so faces are never cropped.
 * `tone`  'bw' renders the photo black & white, 'color' keeps it as is.
 */
export type Photo = {
  src: string;
  alt: string;
  focus?: string;
  tone?: 'bw' | 'color';
  caption?: string;
};

const p = (name: string, alt: string, extra: Partial<Photo> = {}): Photo => ({
  src: `/media/photos/${name}`,
  alt,
  focus: '50% 30%',
  tone: 'color',
  ...extra,
});

export const heroPhoto = p('hero.jpg', 'Софа', { focus: '50% 25%' });

export const editorial = {
  main: p('editorial-01.jpg', 'Софа, портрет', { tone: 'bw', caption: 'Look 01' }),
  second: p('editorial-02.jpg', 'Софа, портрет', { caption: 'Look 02' }),
  third: p('editorial-03.jpg', 'Софа', { tone: 'bw', caption: 'Look 03' }),
  fourth: p('editorial-04.jpg', 'Софа', { caption: 'Look 04' }),
  cutout: p('editorial-cutout.png', 'Софа', { caption: 'Cut' }), // PNG with transparent background, optional
  video: '/media/videos/editorial.mp4', // optional, muted loop
};

export const childhood: Photo[] = [
  p('childhood-01.jpg', 'Софа в детстве', { caption: 'самое начало' }),
  p('childhood-02.jpg', 'Софа в детстве', { caption: 'лето' }),
  p('childhood-03.jpg', 'Софа в детстве', { caption: 'та самая улыбка' }),
  p('childhood-04.jpg', 'Софа в детстве', { caption: 'уже с характером' }),
  p('childhood-05.jpg', 'Софа в детстве', { caption: 'архив' }),
];

/** Picture for the "now" side of the 18 transition. */
export const nowPhoto = p('now.jpg', 'Софа сейчас', { focus: '50% 25%' });

export const cameraRoll: Photo[] = [
  p('camera-01.jpg', 'Кадр с камеры'),
  p('camera-02.jpg', 'Кадр с камеры'),
  p('camera-03.jpg', 'Кадр с камеры'),
  p('camera-04.jpg', 'Кадр с камеры'),
  p('camera-05.jpg', 'Кадр с камеры'),
  p('camera-06.jpg', 'Кадр с камеры'),
];
