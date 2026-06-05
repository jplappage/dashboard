$taskName  = 'WatchlistAutoDeploy'
$vbsPath   = 'C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\WatchlistAutoDeploy.vbs'

Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

# Use wscript.exe to launch the VBS — this guarantees a hidden window
$action = New-ScheduledTaskAction -Execute 'wscript.exe' -Argument "`"$vbsPath`""

$trigger = New-ScheduledTaskTrigger -AtLogOn
$trigger.Delay = 'PT30S'

$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -RunLevel Limited -Force

Write-Host ''
Write-Host 'Done! WatchlistAutoDeploy task created (truly hidden).' -ForegroundColor Green
Write-Host 'No window will appear after next login.' -ForegroundColor Cyan
Read-Host 'Press Enter to close'
