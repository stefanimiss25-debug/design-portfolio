#!/usr/bin/env bash
# Extracts the audio track from every MP4 in public/media/videos/music-src
# into public/media/music without re-encoding (stream copy => no quality loss).
# Source videos are kept untouched.
#
# Usage: npm run extract-audio
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="public/media/videos/music-src"
OUT="public/media/music"
mkdir -p "$OUT"
shopt -s nullglob nocaseglob
for f in "$SRC"/*.mp4 "$SRC"/*.mov; do
  name="$(basename "${f%.*}")"
  codec="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "$f")"
  if [[ "$codec" == "aac" || "$codec" == "alac" ]]; then
    ffmpeg -y -v error -i "$f" -vn -map 0:a:0 -c:a copy -movflags +faststart "$OUT/$name.m4a"
    echo "copied   $f -> $OUT/$name.m4a ($codec, no re-encode)"
  elif [[ "$codec" == "mp3" ]]; then
    ffmpeg -y -v error -i "$f" -vn -map 0:a:0 -c:a copy "$OUT/$name.mp3"
    echo "copied   $f -> $OUT/$name.mp3"
  else
    ffmpeg -y -v error -i "$f" -vn -map 0:a:0 -c:a aac -b:a 256k -movflags +faststart "$OUT/$name.m4a"
    echo "encoded  $f -> $OUT/$name.m4a ($codec -> aac 256k)"
  fi
done
