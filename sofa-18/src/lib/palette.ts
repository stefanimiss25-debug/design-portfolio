import type { Track } from '../data/tracks';

export type Theme = Pick<Track, 'accentColor' | 'backgroundColor' | 'textColor' | 'secondaryColor'>;

type RGB = [number, number, number];

const toHex = ([r, g, b]: RGB) =>
  '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');

const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const luminance = ([r, g, b]: RGB) => {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const saturation = ([r, g, b]: RGB) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
};

const cache = new Map<string, Promise<Theme | null>>();

/**
 * Reads the cover and derives a theme from its real colors:
 * background = the cover's dominant tone pushed dark (text always stays readable),
 * accent = its most vivid color, secondary = a mid tone between them.
 * Resolves to null when the cover can't be loaded.
 */
export function paletteFromCover(src: string): Promise<Theme | null> {
  const hit = cache.get(src);
  if (hit) return hit;
  const job = new Promise<Theme | null>((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      try {
        const size = 40;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Quantize into buckets to find the dominant tone.
        const buckets = new Map<string, { n: number; sum: RGB }>();
        let vivid: RGB = [200, 16, 46];
        let vividScore = -1;
        for (let i = 0; i < data.length; i += 4) {
          const px: RGB = [data[i], data[i + 1], data[i + 2]];
          const key = px.map((v) => v >> 5).join('-');
          const b = buckets.get(key) ?? { n: 0, sum: [0, 0, 0] as RGB };
          b.n++;
          b.sum = [b.sum[0] + px[0], b.sum[1] + px[1], b.sum[2] + px[2]];
          buckets.set(key, b);
          const l = luminance(px);
          const score = saturation(px) * (l > 0.04 && l < 0.85 ? 1 : 0.3);
          if (score > vividScore) {
            vividScore = score;
            vivid = px;
          }
        }
        const top = [...buckets.values()].sort((a, b) => b.n - a.n)[0];
        const dominant: RGB = [top.sum[0] / top.n, top.sum[1] / top.n, top.sum[2] / top.n];

        // Background: dominant tone, darkened until it sits under ~6% luminance.
        let bg = dominant;
        for (let k = 0; k < 12 && luminance(bg) > 0.06; k++) bg = mix(bg, [6, 6, 8], 0.25);
        bg = mix(bg, [8, 8, 10], 0.35);

        // Accent: if the cover is nearly monochrome, use a light tone instead.
        let accent = vividScore < 0.18 ? mix(dominant, [240, 236, 228], 0.6) : vivid;
        if (luminance(accent) < 0.12) accent = mix(accent, [255, 255, 255], 0.35);

        resolve({
          backgroundColor: toHex(bg),
          accentColor: toHex(accent),
          secondaryColor: toHex(mix(bg, accent, 0.35)),
          textColor: '#f4efe8',
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
  cache.set(src, job);
  return job;
}

/** WCAG relative luminance from hex, used to pick readable text on accent. */
export function readableOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const rgb: RGB = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return luminance(rgb) > 0.35 ? '#0b0b0c' : '#f6f1ea';
}
