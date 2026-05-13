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

$lastWrite  = (Get-Item $watchFile).LastWriteTime
$lastDeploy = [DateTime]::MinValue

try {
    while ($true) {
        Start-Sleep -Seconds 5

        $currentWrite = (Get-Item $watchFile).LastWriteTime

        if ($currentWrite -ne $lastWrite) {
            $lastWrite = $currentWrite
            $now = [DateTime]::Now

            if (($now - $lastDeploy).TotalSeconds -gt 15) {
                $lastDeploy = $now
                Log "Change detected ($currentWrite). Pushing to GitHub..."

                # Prevent GCM from opening browser/GUI prompts in headless mode
                $env:GIT_TERMINAL_PROMPT = '0'
                $env:GCM_INTERACTIVE     = 'never'

                Push-Location $watchFolder
                $result = git add -A 2>&1
                $result += git commit -m "refresh $(Get-Date -Format 'yyyy-MM-dd HH:mm')" 2>&1
                $result += git push --no-progress 2>&1
                Pop-Location

                if ($LASTEXITCODE -eq 0) {
                    Log "Push succeeded."
                } else {
                    Log "Push FAILED: $result"
                }
            }
        }
    }
} finally {
    Remove-Item $lockFile -ErrorAction SilentlyContinue
}
