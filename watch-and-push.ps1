# Auto-push watcher for Watchlist v4
# Watches the folder and runs push.bat ~5 seconds after any file change

$folder = Split-Path -Parent $MyInvocation.MyCommand.Path
$debounceMs = 5000
$lastPush = [datetime]::MinValue

Write-Host "Watching $folder" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $folder
$watcher.IncludeSubdirectories = $false
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite
$watcher.Filter = "*.html"
$watcher.EnableRaisingEvents = $true

$action = {
    $global:pendingChange = $true
}

Register-ObjectEvent $watcher Changed -Action $action | Out-Null
Register-ObjectEvent $watcher Created -Action $action | Out-Null

try {
    while ($true) {
        Start-Sleep -Milliseconds 1000
        if ($global:pendingChange) {
            $now = [datetime]::Now
            if (($now - $lastPush).TotalMilliseconds -gt $debounceMs) {
                $global:pendingChange = $false
                $lastPush = $now
                Write-Host "$($now.ToString('HH:mm:ss')) — Change detected, pushing..." -ForegroundColor Yellow
                Push-Location $folder
                & "$folder\push.bat"
                Pop-Location
                Write-Host "Done." -ForegroundColor Green
            }
        }
    }
} finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
}
