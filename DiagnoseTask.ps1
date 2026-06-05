$out = @()

# Check if task exists
$task = Get-ScheduledTask -TaskName 'WatchlistAutoDeploy' -ErrorAction SilentlyContinue
if (-not $task) {
    $out += "TASK NOT FOUND - WatchlistAutoDeploy does not exist in Task Scheduler"
} else {
    $out += "Task found: $($task.TaskName)"
    $out += "State: $($task.State)"

    $info = Get-ScheduledTaskInfo -TaskName 'WatchlistAutoDeploy' -ErrorAction SilentlyContinue
    if ($info) {
        $out += "Last Run Time: $($info.LastRunTime)"
        $out += "Last Result: $($info.LastTaskResult) (0 = success, other = error code)"
        $out += "Next Run Time: $($info.NextRunTime)"
    }

    $out += "--- Action ---"
    $task.Actions | ForEach-Object { $out += "Execute: $($_.Execute) Args: $($_.Arguments)" }

    $out += "--- Trigger ---"
    $task.Triggers | ForEach-Object { $out += "Type: $($_.CimClass.CimClassName) Delay: $($_.Delay) Enabled: $($_.Enabled)" }
}

$out += ""
$out += "--- start-watcher.bat exists? ---"
$out += (Test-Path 'C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\start-watcher.bat').ToString()

$out += ""
$out += "--- watch-and-push.ps1 running? ---"
$procs = Get-WmiObject Win32_Process | Where-Object { $_.CommandLine -like '*watch-and-push*' }
if ($procs) { $procs | ForEach-Object { $out += "PID $($_.ProcessId): $($_.CommandLine)" } }
else { $out += "Not running" }

$logPath = 'C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\diag-output.txt'
$out | Out-File -FilePath $logPath -Encoding UTF8
Write-Host "Diagnostics written to diag-output.txt"
Read-Host "Press Enter to close"
