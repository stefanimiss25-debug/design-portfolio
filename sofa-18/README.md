# Sofa 18

Персональный digital-журнал к 18-летию Софы. React + TypeScript + Vite + GSAP.

```bash
npm install
npm run dev        # локально
npm run build      # сборка в dist/
```

**Vercel:** импортировать репозиторий и указать **Root Directory = `sofa-18`**. Остальное возьмётся из `vercel.json`.

## Структура

```
src/
  data/        tracks.ts · photos.ts · cats.ts · links.ts   ← все данные здесь
  hooks/       usePlayer.tsx (единый аудиоплеер + тема), useGsap.ts
  lib/         palette.ts (палитра из обложки), motion.ts
  components/  Hero · MusicPlayer · Vinyl · TrackList · Cover · FashionEditorial ·
               CatWalkStrip · ChildhoodArchive · DigitalCamera · CatsScene · SocialLinks · Photo
public/media/
  cats/        PNG котов (уже на месте, порезаны на кадры)
  photos/      фотографии Софы          ← добавить
  covers/      обложки треков 01–05.jpg ← добавить
  music/       аудио 01–05.m4a          ← добавить (или извлечь из видео, см. ниже)
  videos/music-src/  исходные MP4 с песнями 01–05.mp4
```

Пока файла нет, компонент показывает аккуратную заглушку с ожидаемым именем файла. После добавления файла код менять не нужно.

## Какие файлы добавить

| Файл | Где используется |
|---|---|
| `photos/hero.jpg` | первый экран, вертикальный портрет |
| `photos/editorial-01…04.jpg` | fashion-разворот (01 и 03 будут в Ч/Б) |
| `photos/editorial-cutout.png` | необязательно: вырезанная фигура на прозрачном фоне |
| `videos/editorial.mp4` | необязательно: короткое видео (без звука, по кругу) вместо editorial-04 |
| `photos/childhood-01…05.jpg` | детский архив |
| `photos/now.jpg` | переход «тогда → 18 → сейчас» |
| `photos/camera-01…06.jpg` | экран фотоаппарата |
| `covers/01…05.jpg` | обложки треков, квадратные |
| `videos/music-src/01…05.mp4` | исходные видео с песнями в порядке плейлиста |

Кадрирование лица настраивается полем `focus` в `src/data/photos.ts` (CSS `object-position`).

## Музыка

```bash
npm run extract-audio
```

Скрипт берёт `public/media/videos/music-src/NN.mp4` и кладёт аудио в `public/media/music/NN.m4a`. Если в видео дорожка AAC, она копируется без перекодирования, то есть без потери качества. Исходные видео остаются на месте. Если `.m4a` нет, плеер проигрывает звук прямо из MP4 через скрытый аудиоэлемент, видео при этом не показывается.

Палитра каждого трека автоматически считается по его обложке из `covers/`. Цвета в `tracks.ts` используются, только пока обложки нет.
