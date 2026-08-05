# build-assets.ps1
# Re-encodes the source concept art (7-25 MB PNGs on the shared drive) into
# web-sized WebP inside assets/img. Safe to re-run; originals are never touched.
#
#   powershell -ExecutionPolicy Bypass -File tools\build-assets.ps1

$src  = "H:\Shared drives\BROTACIONES\THE SILENCE BETWEEN"
$dest = Join-Path $PSScriptRoot "..\assets\img" | Resolve-Path -ErrorAction SilentlyContinue
if (-not $dest) { $dest = New-Item -ItemType Directory -Force -Path (Join-Path $PSScriptRoot "..\assets\img") }

# name -> [ source path (relative to $src), target width ]
$map = [ordered]@{
  'diorama'          = @('DECK\MIRANDO DIORAMA\output\MIRANDO DIORAMA_002.png', 2200)
  'vr-closeup'       = @('DECK\VR CLOSE UP\CLOSEUP1.png', 2000)
  'opi-portrait'     = @('DECK\IM BLU\mat\enhanced_image.png', 2000)
  'opi-progression'  = @('CONCEPT ART\CHARACTERS\BLU\output\BLU_Progression_001 copy.png', 2400)
  'opi-cine'         = @('DECK\BLU CINE\output\BLUCINE copy.png', 2200)
  'puerta'           = @('DECK\PUERTA ABIERTA\output\puertaabierta_001.png', 2000)
  'thanks'           = @('DECK\THANKS\output\THANKS copy.png', 2200)
  'sc-velorio'       = @('CONCEPT ART\SCX_Velorio\output\velorio_001 copy.png', 2200)
  'sc-subte'         = @('CONCEPT ART\SCX_Subte\CONCEPTS\0_Miniatura_PlanoGral\output\TSB_Subte_Miniatura_Comp_001.png', 2200)
  'sc-soltera'       = @('CONCEPT ART\SCX_Soltera\output\Soltera_001 copy.png', 2200)
  'sc-laberinto'     = @('CONCEPT ART\SCX_SolteraLaberinto\output\Solteralaberinto_002 copy.png', 2200)
  'sc-agua'          = @('CONCEPT ART\SCX_SolteraAgua\output\agua copy.png', 2200)
  'sc-limpiavidrio'  = @('CONCEPT ART\SCX_Limpiavidrio\output\limpiavidrio_002 copy.png', 2200)
  'sc-flores'        = @('CONCEPT ART\SCX_SolteroFlores\output\SOLTEROCOMP_07 copy.png', 2200)
  'sc-super'         = @('CONCEPT ART\SCX_Super\mat\output\super.png', 2200)
  'sc-brazo'         = @('CONCEPT ART\SCX_BrazoBlu\output\BRAZOBLU_001 copy.png', 2200)
  'sc-auto'          = @('CONCEPT ART\SCX_Auto2\output\auto2.png', 2200)
  'sc-encuentro'     = @('CONCEPT ART\SCX_Encuentro\output\SCX_Encuentro_003_expanded.png', 2200)
  'sc-cumple'        = @('CONCEPT ART\SCX_ViejaCumple\output\closeup.png', 2200)
  'sc-final'         = @('CONCEPT ART\SCX_Final\output\SCX_Final_002_wstyle.png', 2200)
}

foreach ($name in $map.Keys) {
  $rel, $w = $map[$name]
  $in  = Join-Path $src $rel
  $out = Join-Path $dest "$name.webp"
  if (-not (Test-Path -LiteralPath $in)) { Write-Host "MISS  $rel" -ForegroundColor Red; continue }
  & ffmpeg -y -hide_banner -loglevel error -i $in `
    -vf "scale='min($w,iw)':-2:flags=lanczos" `
    -c:v libwebp -quality 80 -compression_level 6 -preset picture $out
  if (Test-Path -LiteralPath $out) {
    $kb = [int]((Get-Item -LiteralPath $out).Length / 1kb)
    Write-Host ("{0,6} KB  {1}" -f $kb, "$name.webp")
  } else {
    Write-Host "FAIL  $name" -ForegroundColor Red
  }
}
