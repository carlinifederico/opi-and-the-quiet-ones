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
TEASER="$TSB/VENICE VIDEO/MAT/OPI_08_h264.mp4"
DAR="$DRIVE/_MOSAICO/MAT/LOGOP/3DAR Logo_white.png"
AWARDS="$TSB/_REPO/THE SILENCE BETWEEN/MAT/AWARDS"
GIFS="$TSB/_REPO/THE SILENCE BETWEEN/MAT/GIFS"
# generated art, not painted art: the four output worlds on the IP screen
IPSRC="$ART/IP OUTPUTS"
CLOSE="$TSB/_REPO/THE SILENCE BETWEEN/MAT/CLOSE/close-loop-src.mp4"

IMG=assets/img
VID=assets/video
mkdir -p "$IMG/scenes" "$IMG/credits" "$IMG/ip" "$VID"

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

echo "· the four IP outputs (p29)"
# Generated with Seedream against the deck's own art direction and kept in IP OUTPUTS.
# The bottom 200px go: the provider stamps an "AI generated" badge into that corner.
ip () { ffmpeg -y -v error -i "$1" \
  -vf "crop=iw:ih-200:0:0,scale=1600:-2:flags=lanczos" -frames:v 1 -quality 88 -compression_level 6 "$2"; }
ip "$IPSRC/home.jpg"            "$IMG/ip/home.webp"
ip "$IPSRC/installation-v2.jpg" "$IMG/ip/installation.webp"
ip "$IPSRC/vr-v2.jpg"           "$IMG/ip/vr.webp"
ip "$IPSRC/ar.jpg"              "$IMG/ip/ar.webp"

echo "· character sheet loop (status screen) — 1280, the size of the source GIF"
ffmpeg -y -v error -i "$OTHER/art.gif" -an -movflags +faststart \
  -vf "scale=1280:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 28 "$VID/15-art.mp4"

echo "· closing reel (p34)"
# 3dar's own studio reel, taken from fifapitch.com/avatar. It runs 78 seconds full-bleed
# behind a heavy scrim, so it is worth more compression than anything else here.
ffmpeg -y -v error -i "$CLOSE" -an -movflags +faststart \
  -vf "scale=1152:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slower -crf 34 "$VID/34-close.mp4"

echo "· project loops (p3, p4, p5) — one GIF per project, lifted out of the Venice deck"
# The three GIFs live inside 'Venice Pitch Deck STRUCTURE.pptx' as ppt/media/image19|30|37.gif.
# They were extracted once into MAT/GIFS rather than re-read here: the pptx is 209 MB.
# 70 MB of GIF becomes ~2.3 MB of H.264 with no visible loss at these sizes.
loop () { ffmpeg -y -v error -i "$1" -an -movflags +faststart \
  -vf "scale=$3:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf "$4" "$2"; }
loop "$GIFS/gloomy.gif"   "$VID/03-gloomy-loop.mp4"   600 27
loop "$GIFS/birds.gif"    "$VID/04-birds-loop.mp4"    600 27
# eggscape is the longest and the noisiest of the three; denoise pays for itself here
ffmpeg -y -v error -i "$GIFS/eggscape.gif" -an -movflags +faststart \
  -vf "scale=800:-2:flags=lanczos,hqdn3d=3:3:5:5,format=yuv420p" \
  -c:v libx264 -preset slow -crf 29 "$VID/05-eggscape-loop.mp4"

echo "· laurels"
# Three sources, three ways of getting a white mark onto transparency:
#
#   KNOCK  the mark is white baked onto a solid black box -> alpha is just the luminance.
#   WHITE  the mark is grey ink on a white sheet          -> alpha is the ink density. The
#          Eggscape sheet never goes darker than 181/255, so the divisor is small (40) or the
#          whole row comes out grey instead of white.
#   ART    the mark sits on top of artwork                -> alpha is the MIN channel, which
#          is high only where a pixel is both bright and neutral, so the coloured art keys
#          out and the white laurel survives.
KNOCK="format=gbrap,geq=r='255':g='255':b='255':a='clip((0.299*r(X,Y)+0.587*g(X,Y)+0.114*b(X,Y))*255/245-6,0,255)',format=rgba"
WHITE="format=gbrap,geq=r='255':g='255':b='255':a='clip(((255-(0.299*r(X,Y)+0.587*g(X,Y)+0.114*b(X,Y)))*255/40)-6,0,255)',format=rgba"
ART="format=gbrap,geq=r='255':g='255':b='255':a='clip((min(min(r(X,Y),g(X,Y)),b(X,Y))-135)*255/120,0,255)',format=rgba"

# laurel: <src> <crop w:h:x:y> <key filter> <out name>
laurel () { ffmpeg -y -v error -i "$1" -vf "crop=$2,$3" \
  -frames:v 1 -c:v libwebp -pix_fmt yuva420p -quality 94 "$IMG/credits/$4.webp"; }

# Gloomy Eyes — read off the release poster; the four marks it carries are the four it won.
GLOOMY_POSTER="$AWARDS/gloomy-eyes-poster.png"
laurel "$GLOOMY_POSTER" "196:132:427:810"  "$ART" aw-sxsw-2019
laurel "$GLOOMY_POSTER" "195:128:687:813"  "$ART" aw-venice-76
laurel "$GLOOMY_POSTER" "274:111:947:820"  "$ART" aw-annecy-2019
# Sundance sits over the glowing gem, and two specks of artwork survive the key inside its
# bounding box — one above the wordmark, one past the right branch. Punch them out by hand.
ffmpeg -y -v error -i "$GLOOMY_POSTER" -vf \
  "crop=278:126:1283:815,format=gbrap,geq=r='255':g='255':b='255':a='if(gt(X\,200)*lt(X\,232)*lt(Y\,18)+gt(X\,256)*gt(Y\,112),0,clip((min(min(r(X\,Y)\,g(X\,Y))\,b(X\,Y))-135)*255/120,0,255))',format=rgba" \
  -frames:v 1 -c:v libwebp -pix_fmt yuva420p -quality 94 "$IMG/credits/aw-sundance-2019.webp"

# Paper Birds — 3dar's own strip off the project page, 10 marks wide. We show the 5 the poster
# shows; Tribeca, Red Sea and SXSW come with a black box baked in, the other two are already cut.
BIRDS_STRIP="$AWARDS/fD52zu8joBrqf6dSgkFCahJ72IyACg8xxX3EC7Tj.webp"
laurel "$BIRDS_STRIP" "243:131:413:106"  "$KNOCK" aw-tribeca-2021
laurel "$BIRDS_STRIP" "271:153:686:95"   "$KNOCK" aw-redsea-2021
laurel "$BIRDS_STRIP" "251:119:984:111"  "null"   aw-raindance-2020
laurel "$BIRDS_STRIP" "191:130:1293:107" "$KNOCK" aw-sxsw-2021
laurel "$BIRDS_STRIP" "201:136:1535:104" "null"   aw-venice-77

# Eggscape — the flat grey-on-white sheet. NewImages is not built here: a clean 460px copy of
# it already lived in the repo (it had been mis-filed on the Gloomy row) and beats this source.
EGG_SHEET="$AWARDS/image.jpg"
laurel "$EGG_SHEET" "189:92:48:54"  "$WHITE" aw-venice-79
laurel "$EGG_SHEET" "177:75:357:65" "$WHITE" aw-sxsw-2023

echo "· teaser (p7)"
ffmpeg -y -v error -i "$TEASER" -movflags +faststart \
  -vf "scale=1920:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 24 -c:a aac -b:a 128k "$VID/07-teaser.mp4"

echo "· poster frame for the teaser"
ffmpeg -y -v error -ss 2 -i "$VID/07-teaser.mp4" -frames:v 1 -quality 78 "$IMG/07-teaser-poster.webp"

echo "done"
du -sh "$IMG" "$VID"
