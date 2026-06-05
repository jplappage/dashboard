$taskName = 'WatchlistAutoDeploy'
$scriptPath = 'C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\start-watcher.bat'

Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

$action = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument ('/c "' + $scriptPath + '"')

$trigger = New-ScheduledTaskTrigger -AtLogOn
$trigger.Delay = 'PT30S'

$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -RunLevel Limited -Force

Write-Host ''
Write-Host 'Done! WatchlistAutoDeploy task created.' -ForegroundColor Green
Write-Host 'The watcher will start automatically 30 seconds after you log in.' -ForegroundColor Cyan
Read-Host 'Press Enter to close'
