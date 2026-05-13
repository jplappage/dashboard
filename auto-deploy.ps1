# Watchlist Auto-Deploy — GitHub Pages (polling mode)
$watchFile  = "C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\watchlist-dashboard.html"
$watchFolder = "C:\Users\jplap\Documents\Claude\Projects\Watchlist v4"
$logFile    = "C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\deploy-log.txt"
$lockFile   = "C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\.watcher.lock"

function Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
    Add-Content -Path $logFile -Value $line
}

# Single-instance guard
if (Test-Path $lockFile) {
    $existingPid = Get-Content $lockFile -ErrorAction SilentlyContinue
    if ($existingPid -and (Get-Process -Id $existingPid -ErrorAction SilentlyContinue)) {
        exit
    }
}
Set-Content $lockFile $PID

Log "Watcher started (GitHub Pages mode)."

$env:GIT_TERMINAL_PROMPT = '0'
$env:GCM_INTERACTIVE     = 'never'

$lastWrite  = (Get-Item $watchFile).LastWriteTime
$lastDeploy = [DateTime]::MinValue

try {
    while ($true) {
        try {
            Start-Sleep -Seconds 5

            $currentWrite = (Get-Item $watchFile).LastWriteTime

            if ($currentWrite -ne $lastWrite) {
                $lastWrite = $currentWrite
                $now = [DateTime]::Now

                if (($now - $lastDeploy).TotalSeconds -gt 15) {
                    $lastDeploy = $now
                    Log "Change detected ($currentWrite). Pushing to GitHub..."

                    Push-Location $watchFolder
                    git add -A 2>&1 | Out-Null
                    git commit -m "refresh $(Get-Date -Format 'yyyy-MM-dd HH:mm')" 2>&1 | Out-Null
                    $pushOut = git push --no-progress 2>&1
                    $pushOk  = $LASTEXITCODE
                    Pop-Location

                    if ($pushOk -eq 0) {
                        Log "Push succeeded."
                    } else {
                        Log "Push FAILED: $($pushOut -join ' ')"
                    }
                }
            }
        } catch {
            Log "Loop error (continuing): $_"
        }
    }
} finally {
    Remove-Item $lockFile -ErrorAction SilentlyContinue
}
