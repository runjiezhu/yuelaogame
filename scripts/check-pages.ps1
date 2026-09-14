$ErrorActionPreference = 'Stop'
$base = 'https://runjiezhu.github.io/yuelaogame/'
$paths = @(
  '',
  'docs/css/style.css',
  'docs/js/main.js',
  'docs/js/engine/eventEngine.js',
  'docs/js/engine/gameState.js',
  'docs/data/npcs.js',
  'docs/data/quests.js',
  'docs/data/events.js',
  'docs/data/endings.js'
)
foreach ($p in $paths) {
  $u = $base + $p
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 10
    '{0,-42}  HTTP {1}  {2,8} B' -f $u, $r.StatusCode, $r.RawContentLength
  } catch {
    '{0,-42}  FAIL: {1}' -f $u, $_.Exception.Message
  }
}
