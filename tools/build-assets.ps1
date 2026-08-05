# build-assets.ps1
#
# The deck's imagery comes straight out of the Google Slides
# "OPI AND THE QUIET ONES | Venice Pitch Deck STRUCTURE", exported as .pptx and
# unzipped — ppt/media holds the original files. The web names below are the
# ORIGINAL PAGE NUMBERS in that deck, so every image traces back to its slide.
#
#   1. File > Download > Microsoft PowerPoint (.pptx) from the Slides
#   2. unzip it, then set OPI_PPTX_MEDIA to the extracted ppt\media folder
#   3. powershell -ExecutionPolicy Bypass -File tools\build-assets.ps1
#
# Deck: https://docs.google.com/presentation/d/1mwgtz6ICPVdQ9cslkzLoaliqTfGHmQmKZ9qU8iwr4BI/

$src = $env:OPI_PPTX_MEDIA
if (-not $src) {
  $src = "C:\Users\FEDERI~1\AppData\Local\Temp\claude\H--Shared-drives-BROTACIONES-THE-SILENCE-BETWEEN--REPO-THE-SILENCE-BETWEEN\9676e487-d33c-4d9d-a176-d304e9f70d27\scratchpad\pptx\ppt\media"
}
$dest = Join-Path $PSScriptRoot "..\assets\img"
if (-not (Test-Path -LiteralPath $dest)) { New-Item -ItemType Directory -Force -Path $dest | Out-Null }

# web name -> [ file in ppt\media, original deck page, what it is ]
$map = [ordered]@{
  'p01-cover'        = @('image12.png', 'p1',  'Key art - Luis crossing, Opi shadow')
  'p07-title'        = @('image30.jpg', 'p7',  'Title card')
  'p09-format'       = @('image34.png', 'p9',  'Headset, looking into a miniature world')
  'p10-opi'          = @('image68.png', 'p10', 'Opi alone in an empty cinema')
  'p12-synopsis'     = @('image73.png', 'p12', 'Doorway of light in the dark')
  'p13-velorio'      = @('image35.png', 'p13', 'In Their Absence - the wake')
  'p14-subte'        = @('image38.png', 'p14', 'Crossing platforms, alone in a crowd')
  'p15-vagon'        = @('image47.png', 'p15', 'Opi in the subway car')
  'p16-zulma'        = @('image40.png', 'p16', 'Zulma on the platform, Opi and the spheres')
  'p17-lucy'         = @('image53.png', 'p17', 'Lucy in the autumn, phone in hand')
  'p18-laberinto'    = @('image79.png', 'p18', 'The maze')
  'p19-limpiavidrio' = @('image64.png', 'p19', 'Window cleaners')
  'p20-casa'         = @('image56.png', 'p20', 'Luis at home with the bouquet')
  'p21-super'        = @('image54.png', 'p21', 'The endless supermarket')
  'p22-baile'        = @('image48.png', 'p22', 'Zulma dancing on Opi hand')
  'p23-auto'         = @('image76.png', 'p23', 'The night drive')
  'p24-auto2'        = @('image57.png', 'p24', 'Opi lifting the car')
  'p25-parada'       = @('image51.png', 'p25', 'The bus stop')
  'p26-encuentro'    = @('image55.png', 'p26', 'Where silences meet - the gas station')
  'p27-encuentro2'   = @('image58.png', 'p27', 'Opi wrapped around the gas station')
  'p29-seraphine'    = @('image59.png', 'p29', 'Seraphine kitchen, Opi at the window')
  'p31-cumple'       = @('image80.png', 'p31', 'Seraphine and Simon, the birthday')
  'p33-escenario'    = @('image69.png', 'p33', 'Opi and the boy mirroring each other')
  'p36-thanks'       = @('image62.png', 'p36', 'The deflated balloon')
}

foreach ($name in $map.Keys) {
  $file, $page, $what = $map[$name]
  $in  = Join-Path $src $file
  $out = Join-Path $dest "$name.webp"
  if (-not (Test-Path -LiteralPath $in)) { Write-Host "MISS  $page  $file" -ForegroundColor Red; continue }
  & ffmpeg -y -hide_banner -loglevel error -i $in `
    -vf "scale='min(2200,iw)':-2:flags=lanczos" `
    -c:v libwebp -quality 80 -compression_level 6 -preset picture $out
  if (Test-Path -LiteralPath $out) {
    Write-Host ("{0,6} KB  {1,-20} {2,-4} {3}" -f [int]((Get-Item -LiteralPath $out).Length / 1kb), "$name.webp", $page, $what)
  } else {
    Write-Host "FAIL  $name" -ForegroundColor Red
  }
}
