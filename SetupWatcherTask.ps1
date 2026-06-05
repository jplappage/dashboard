$taskName = 'WatchlistAutoDeploy'
$scriptPath = 'C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\watch-and-push.ps1'

Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

# Run PowerShell hidden — no window appears
$action = New-ScheduledTaskAction `
    -Execute 'powershell.exe' `
    -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -NonInteractive -File `"$scriptPath`""

# Trigger: at logon, with 30s delay
$trigger = New-ScheduledTaskTrigger -AtLogOn
$trigger.Delay = 'PT30S'

$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -RunLevel Limited -Force

Write-Host ''
Write-Host 'Done! WatchlistAutoDeploy task created (hidden window).' -ForegroundColor Green
Write-Host 'The watcher will run silently 30 seconds after each login.' -ForegroundColor Cyan
Read-Host 'Press Enter to close'
