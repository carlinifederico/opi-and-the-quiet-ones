#!/usr/bin/env bash
# Rebuilds every web asset from the originals on the shared drive.
# Run from the repo root:  bash tools/build-assets.sh
set -euo pipefail

DRIVE="H:/Shared drives/BROTACIONES"
TSB="$DRIVE/THE SILENCE BETWEEN"
ART="$TSB/_REPO/THE SILENCE BETWEEN/MAT/ALL CONCEPTS"
OTHER="$ART/OTHER"
SCENES="$ART/SCENES"
LOGO="$TSB/MAT/LOGO/output"
GIF="$TSB/_REPO/THE SILENCE BETWEEN/MAT/EDIT_About3dar_001.gif"
TEASER="$TSB/VENICE VIDEO/MAT/OPI_08_h264.mp4"
DAR="$DRIVE/_MOSAICO/MAT/LOGOP/3DAR Logo_white.png"

IMG=assets/img
VID=assets/video
mkdir -p "$IMG/scenes" "$VID"

# still: <src> <out> <maxwidth> <quality>
still () { ffmpeg -y -v error -i "$1" \
  -vf "scale='min($3,iw)':-2:flags=lanczos" -frames:v 1 -quality "$4" -compression_level 6 "$2"; }

echo "· stills"
still "$OTHER/cover_002_w logo.png"  "$IMG/01-cover.webp"      2400 84
still "$OTHER/pt.png"                "$IMG/06-pt.webp"         2048 82
still "$OTHER/imblu copy.png"        "$IMG/29-spotlight.webp"  2048 82
still "$OTHER/BLU_Progression_002.png" "$IMG/30-opis.webp"     2048 82
still "$OTHER/ART_DIR_PARADABONDI copy2.png" "$IMG/32-stop.webp" 2048 82
still "$OTHER/ARTDIR_001 copy.png"   "$IMG/08-artdir.webp"     2400 82
still "$OTHER/puertaabierta_001.png" "$IMG/09-door.webp"       2048 84
still "$OTHER/experience.png"        "$IMG/10-experience.webp" 2048 82
still "$OTHER/opi.jpg"               "$IMG/11-opi.webp"        1817 82
still "$OTHER/cover4_clean.png"      "$IMG/30-roses.webp"      1842 82
still "$OTHER/thanks.jpg"            "$IMG/33-thanks.webp"     1344 84

echo "· scenes (story slideshow, chronological by filename)"
i=1
for f in "$SCENES"/*; do
  printf -v n "%02d" "$i"
  still "$f" "$IMG/scenes/$n.webp" 1920 80
  i=$((i+1))
done

echo "· logos"
# Opi wordmark: alpha lifted from the ink density of the flat PSD export, painted gold.
# -pix_fmt yuva420p is what keeps the alpha channel: plain webp output drops it.
ffmpeg -y -v error -i "$LOGO/Logo_001 copy.png" -vf \
  "format=gbrap,geq=r='245':g='183':b='34':a='clip((255*(234-(0.299*r(X,Y)+0.587*g(X,Y)+0.114*b(X,Y)))/234 - 2)*255/253,0,255)',format=rgba,crop=1702:953:640:343,scale=1400:-2:flags=lanczos" \
  -frames:v 1 -c:v libwebp -pix_fmt yuva420p -quality 92 "$IMG/logo-opi.webp"
ffmpeg -y -v error -i "$DAR" -vf "scale=900:-2:flags=lanczos" \
  -frames:v 1 -c:v libwebp -pix_fmt yuva420p -quality 92 "$IMG/logo-3dar.webp"

echo "· 3dar studio loop (p2 background)"
# hqdn3d first: the source is a dithered GIF and the noise alone triples the bitrate.
ffmpeg -y -v error -i "$GIF" -an -movflags +faststart \
  -vf "scale=1120:-2:flags=lanczos,hqdn3d=4:4:6:6,format=yuv420p" \
  -c:v libx264 -preset slow -crf 30 "$VID/02-about3dar.mp4"

echo "· character sheet loop (status screen)"
ffmpeg -y -v error -i "$OTHER/art.gif" -an -movflags +faststart \
  -vf "scale=900:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 27 "$VID/15-art.mp4"

echo "· laurels — white marks keyed off the white sheet they were scanned on"
ffmpeg -y -v error -i "$TSB/_REPO/THE SILENCE BETWEEN/MAT/DESGIN/Laureles pag2.jpg" -vf \
  "format=gbrap,geq=r='255':g='255':b='255':a='clip(((255-(0.299*r(X,Y)+0.587*g(X,Y)+0.114*b(X,Y)))*255/75)-6,0,255)',format=rgba" \
  -frames:v 1 -c:v libwebp -pix_fmt yuva420p -quality 94 "$IMG/laurels.webp"

echo "· teaser (p7)"
ffmpeg -y -v error -i "$TEASER" -movflags +faststart \
  -vf "scale=1920:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 24 -c:a aac -b:a 128k "$VID/07-teaser.mp4"

echo "· poster frame for the teaser"
ffmpeg -y -v error -ss 2 -i "$VID/07-teaser.mp4" -frames:v 1 -quality 78 "$IMG/07-teaser-poster.webp"

echo "done"
du -sh "$IMG" "$VID"
