@echo off
cd /d "%~dp0"
echo Removing stale locks...
del /f /q .git\HEAD.lock 2>nul
del /f /q .git\index.lock 2>nul
echo Committing and pushing...
git add -A
git commit -m "update %date% %time%"
git push
echo Done.
pause
