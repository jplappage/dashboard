Set WshShell = CreateObject("WScript.Shell")

' Kill any existing watcher processes
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -NonInteractive -Command ""Get-WmiObject Win32_Process | Where-Object { $_.CommandLine -like '*watch-and-push*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }""", 0, True

' Wait a moment then restart hidden
WScript.Sleep 2000
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -NonInteractive -File ""C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\watch-and-push.ps1""", 0, False
