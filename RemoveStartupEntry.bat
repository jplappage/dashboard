@echo off
echo Removing WatchlistAutoDeploy startup entries...

:: Remove from HKCU registry Run key
powershell -Command "
$runKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
$props = Get-ItemProperty $runKey -ErrorAction SilentlyContinue
if ($props) {
    $props.PSObject.Properties | Where-Object { $_.Value -like '*WatchlistAutoDeploy*' } | ForEach-Object {
        Remove-ItemProperty -Path $runKey -Name $_.Name
        Write-Host ('Removed registry entry: ' + $_.Name)
    }
}

:: Remove from HKLM registry Run key
$runKeyLM = 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Run'
$propsLM = Get-ItemProperty $runKeyLM -ErrorAction SilentlyContinue
if ($propsLM) {
    $propsLM.PSObject.Properties | Where-Object { $_.Value -like '*WatchlistAutoDeploy*' } | ForEach-Object {
        Remove-ItemProperty -Path $runKeyLM -Name $_.Name -ErrorAction SilentlyContinue
        Write-Host ('Removed HKLM registry entry: ' + $_.Name)
    }
}

:: Remove from startup folder
$startupFolder = [Environment]::GetFolderPath('Startup')
Get-ChildItem $startupFolder | Where-Object { $_.Name -like '*WatchlistAutoDeploy*' -or (Get-Content $_.FullName -ErrorAction SilentlyContinue) -like '*WatchlistAutoDeploy*' } | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Host ('Removed startup file: ' + $_.Name)
}

Write-Host 'Done. No more startup error.'
"
pause
