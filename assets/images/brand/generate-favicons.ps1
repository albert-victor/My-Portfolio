# Regenerate favicons – normal Syne "A" (weight 700), saturated accent, no stylized path
Add-Type -AssemblyName System.Drawing

$accent = [Drawing.Color]::FromArgb(255, 0, 168, 152) # #00a898
$brandDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $brandDir))
$fontPath = Join-Path $rootDir "assets\fonts\syne\Syne-Variable.ttf"

if (-not (Test-Path $fontPath)) {
  Write-Error "Missing Syne font at $fontPath"
  exit 1
}

$pfc = New-Object System.Drawing.Text.PrivateFontCollection
$pfc.AddFontFile($fontPath)
$family = New-Object System.Drawing.FontFamily($pfc.Families[0].Name, $pfc)

function New-SyneABitmap([int]$size) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [Drawing.Text.TextRenderingHint]::ClearTypeGridFit
  $g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([Drawing.Color]::Transparent)

  $fontSize = [Math]::Round($size * 0.82, 1)
  $font = New-Object System.Drawing.Font($family, $fontSize, [Drawing.FontStyle]::Bold, [Drawing.GraphicsUnit]::Pixel)
  $brush = New-Object System.Drawing.SolidBrush $accent
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [Drawing.StringAlignment]::Center
  $format.LineAlignment = [Drawing.StringAlignment]::Center

  $rect = New-Object System.Drawing.RectangleF(0, ($size * 0.01), $size, $size)
  $g.DrawString("A", $font, $brush, $rect, $format)

  $font.Dispose()
  $brush.Dispose()
  $g.Dispose()
  return $bmp
}

function Save-Png([int]$size, [string]$name) {
  $bmp = New-SyneABitmap $size
  $bmp.Save((Join-Path $brandDir $name), [Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Wrote $name"
}

Save-Png 32 "favicon-32.png"
Save-Png 48 "favicon-48.png"
Save-Png 180 "apple-touch-icon.png"
Save-Png 48 "favicon.png"
Copy-Item (Join-Path $brandDir "favicon-48.png") (Join-Path $rootDir "favicon.ico") -Force
Write-Host "Wrote favicon.ico"

# SVG = embedded PNG so tabs always match (no broken path glyph)
$bytes = [IO.File]::ReadAllBytes((Join-Path $brandDir "favicon-48.png"))
$b64 = [Convert]::ToBase64String($bytes)
$svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Albart V Mwamalumbili">
  <image href="data:image/png;base64,$b64" width="48" height="48" />
</svg>
"@
[IO.File]::WriteAllText((Join-Path $brandDir "favicon.svg"), $svg)
Write-Host "Wrote favicon.svg"
