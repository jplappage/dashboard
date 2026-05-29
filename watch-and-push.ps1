# Auto-push watcher for Watchlist v4
# Pushes on file change OR whenever unpushed commits are detected

$folder = Split-Path -Parent $MyInvocation.MyCommand.Path
$debounceMs = 5000
$lastPush = [datetime]::MinValue
$checkIntervalMs = 10000  # check for unpushed commits every 10s

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

function Invoke-Push {
    param($reason)
    $now = [datetime]::Now
    if (($now - $lastPush).TotalMilliseconds -gt $debounceMs) {
        $script:lastPush = $now
        Write-Host "$($now.ToString('HH:mm:ss')) - $reason, pushing..." -ForegroundColor Yellow
        Push-Location $folder
        & "$folder\push.bat"
        Pop-Location
        Write-Host "Done." -ForegroundColor Green
    }
}

$lastCheck = [datetime]::MinValue

try {
    while ($true) {
        Start-Sleep -Milliseconds 1000

        # Trigger on file change
        if ($global:pendingChange) {
            $global:pendingChange = $false
            Invoke-Push "Change detected"
        }

        # Also check for uncommitted/unpushed changes every 10s
        $now = [datetime]::Now
        if (($now - $lastCheck).TotalMilliseconds -gt $checkIntervalMs) {
            $lastCheck = $now
            Push-Location $folder
            $uncommitted = git status --porcelain 2>$null
            $unpushed = git log origin/main..HEAD --oneline 2>$null
            Pop-Location
            if ($uncommitted -or $unpushed) {
                Invoke-Push "Pending changes detected"
            }
        }
    }
} finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
}
