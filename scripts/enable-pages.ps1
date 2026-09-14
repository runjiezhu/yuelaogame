#!/usr/bin/env pwsh
param(
  [Parameter(Mandatory=$true)][string]$Token,
  [Parameter(Mandatory=$true)][string]$Repo = 'runjiezhu/yuelaogame',
  [Parameter(Mandatory=$true)][string]$Branch = 'main',
  [Parameter(Mandatory=$true)][string]$Path = '/docs'
)

$api = 'https://api.github.com'
$headers = @{
  Authorization = "Bearer $Token"
  Accept        = 'application/vnd.github+json'
  'X-GitHub-Api-Version' = '2022-11-28'
  'User-Agent'  = 'yuelao-deploy-script'
}

Write-Host "==> Get current Pages site for $Repo"
$site = Invoke-RestMethod -Method Get -Uri "$api/repos/$Repo/pages" -Headers $headers
if ($site) {
  Write-Host ("current: url=" + $site.html_url + " type=" + $site.build_type + " source=" + $site.source.branch + $site.source.path)
}

$body = @{ source = @{ branch = $Branch; path = $Path }; build_type = 'legacy' } | ConvertTo-Json -Depth 5
Write-Host "==> PUT $api/repos/$Repo/pages  body=$body"
try {
  $resp = Invoke-RestMethod -Method Put -Uri "$api/repos/$Repo/pages" -Headers $headers -Body $body -ContentType 'application/json'
  Write-Host ("OK: " + ($resp.html_url))
} catch {
  $err = $_.Exception.Response
  if ($err) {
    $status = [int]$err.StatusCode
    Write-Host "HTTP $status"
    $stream = $err.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    Write-Host $reader.ReadToEnd()
  } else {
    Write-Host $_.Exception.Message
  }
}
