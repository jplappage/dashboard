$batFile = "C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\start-watcher.bat"

$action = New-ScheduledTaskAction `
    -Execute $batFile

$trigger = New-ScheduledTaskTrigger -AtLogOn

$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit 0

Register-ScheduledTask `
    -TaskName "WatchlistAutoDeploy" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Force

Write-Host "Task registered. Starting now..." -ForegroundColor Green

Start-ScheduledTask -TaskName "WatchlistAutoDeploy"

Start-Sleep -Seconds 2

$state = (Get-ScheduledTask -TaskName "WatchlistAutoDeploy").State
Write-Host "Task state: $state" -ForegroundColor Cyan
