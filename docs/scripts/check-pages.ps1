$ErrorActionPreference = 'Stop'
$base = 'https://runjiezhu.github.io/yuelaogame'
$paths = @(
  '/',
  '/css/style.css',
  '/js/main.js',
  '/js/engine/eventEngine.js',
  '/js/engine/gameState.js',
  '/js/engine/statSystem.js',
  '/data/npcs.js',
  '/data/quests.js',
  '/data/events.js',
  '/data/endings.js'
)
foreach ($p in $paths) {
  $u = $base + $p
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 10
    '{0,-58}  HTTP {1}  {2,8} B' -f $u, $r.StatusCode, $r.RawContentLength
  } catch {
    '{0,-58}  FAIL: {1}' -f $u, $_.Exception.Message
  }
}
