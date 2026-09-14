$ErrorActionPreference = 'Stop'
$url = 'https://runjiezhu.github.io/yuelaogame/'
$r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
Write-Host "=== HTML ==="
Write-Host $r.Content
