Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -NonInteractive -File ""C:\Users\jplap\Documents\Claude\Projects\Watchlist v4\watch-and-push.ps1""", 0, False
