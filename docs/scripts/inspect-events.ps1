$path = 'C:\Users\zhuru\yuelaogame\data\events.js'
$text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
$lines = $text -split "`n"
$line377 = $lines[376]
Write-Host "Length: $($line377.Length)"
Write-Host "All codepoints:"
foreach ($c in $line377.ToCharArray()) {
  if ([int]$c -gt 127) {
    Write-Host ("  U+{0:X4}  '{1}'" -f [int]$c, $c)
  }
}
Write-Host "---"
Write-Host "Full line:"
Write-Host $line377
