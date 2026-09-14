$ErrorActionPreference = 'Stop'
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8765/' -UseBasicParsing -TimeoutSec 3
    Write-Host ("HTTP " + $r.StatusCode + "  length=" + $r.RawContentLength)
} catch {
    Write-Host ("FAIL: " + $_.Exception.Message)
}

Write-Host "---- node processes ----"
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
    $c = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $_.Id)
    $cmd = if ($c) { $c.CommandLine } else { '' }
    if ($cmd.Length -gt 120) { $cmd = $cmd.Substring(0,120) + '...' }
    '{0,6}  started {1}  cmd={2}' -f $_.Id, $_.StartTime.ToString('HH:mm:ss'), $cmd
}
