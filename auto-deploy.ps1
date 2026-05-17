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

$lastWrite  = (Get-ChildItem $watchFolder -File | Measure-Object -Property LastWriteTime -Maximum).Maximum
$lastDeploy = [DateTime]::MinValue

try {
    while ($true) {
        try {
            Start-Sleep -Seconds 5

            $currentWrite = (Get-ChildItem $watchFolder -File | Measure-Object -Property LastWriteTime -Maximum).Maximum

            # Check for file timestamp changes
            $hasFileChange = $currentWrite -ne $lastWrite
            if ($hasFileChange) { $lastWrite = $currentWrite }

            Push-Location $watchFolder

            # Check for unstaged changes (catches edits that don't update LastWriteTime)
            $gitStatus = git status --porcelain 2>$null
            $hasUnstaged = ($gitStatus -ne $null -and $gitStatus -ne '')

            # Check for unpushed commits
            $unpushed = git log origin/main..HEAD --oneline 2>$null
            $hasUnpushed = ($unpushed -ne $null -and $unpushed -ne '')

            Pop-Location

            $needsDeploy = $hasFileChange -or $hasUnstaged -or $hasUnpushed

            if ($needsDeploy) {
                $now = [DateTime]::Now

                if (($now - $lastDeploy).TotalSeconds -gt 15) {
                    $lastDeploy = $now
                    $reason = if ($hasFileChange) { "File timestamp change" } elseif ($hasUnstaged) { "Unstaged changes detected" } else { "Unpushed commits detected" }
                    Log "$reason. Pushing to GitHub..."

                    Push-Location $watchFolder
                    if ($hasFileChange -or $hasUnstaged) {
                        # New file changes — regenerate ICS, commit, then push
                        try {
                            python generate_ics.py 2>&1 | Out-Null
                            Log "ICS regenerated."
                        } catch {
                            Log "ICS generation failed (continuing): $_"
                        }
                        git add -A 2>&1 | Out-Null
                        git commit -m "refresh $(Get-Date -Format 'yyyy-MM-dd HH:mm')" 2>&1 | Out-Null
                    }
                    # Always push (handles both new commits and pre-existing unpushed commits)
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
