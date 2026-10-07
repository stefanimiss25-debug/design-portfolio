/** Original PNG artwork of Sofa's cats, cropped and split into frames only. */
const base = '/media/cats';

export const cats = {
  syoma: {
    name: 'Сёма',
    standing: `${base}/syoma-standing.webp`,
    walk: [1, 2, 3, 4].map((i) => `${base}/syoma-walk-${i}.webp`),
  },
  styopa: {
    name: 'Стёпа',
    standing: `${base}/styopa-standing.webp`,
    groom: [1, 2, 3, 4].map((i) => `${base}/styopa-groom-${i}.webp`),
  },
  together: `${base}/cats-together.webp`,
};
