$out = @()

$task = Get-ScheduledTask -TaskName 'WatchlistAutoDeploy' -ErrorAction SilentlyContinue
if (-not $task) {
    $out += "TASK NOT FOUND"
} else {
    $out += "State: $($task.State)"
    $out += "--- Actions ---"
    $task.Actions | ForEach-Object { $out += "Execute: $($_.Execute)" ; $out += "Arguments: $($_.Arguments)" }
    $out += "--- Triggers ---"
    $task.Triggers | ForEach-Object { $out += "Type: $($_.CimClass.CimClassName) Delay: $($_.Delay)" }
}

$logPath = 'C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\diag-output.txt'
$out | Out-File -FilePath $logPath -Encoding UTF8
Write-Host "Written to diag-output.txt"
Read-Host "Press Enter to close"
