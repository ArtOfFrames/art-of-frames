@echo off
title Push to GitHub - Art Of Frames

:: Ask for commit message
set /p commit_msg=Enter commit message: 

:: Stage everything
echo.
echo [1/3] Staging all changes...
git add .

:: Commit
echo [2/3] Committing...
git commit -m "%commit_msg%"

:: Push to GitHub
echo [3/3] Pushing to GitHub...
git push

:: Done
if %errorlevel%==0 (
    echo.
    echo ✓ Success! Changes pushed to GitHub and deploying on Vercel...
) else (
    echo.
    echo ✗ Something went wrong. Check the error above.
)

pause
