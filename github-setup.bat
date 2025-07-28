@echo off
echo ==========================================
echo GitHub Setup for Invoice Generator
echo ==========================================
echo.

echo This script will help you push your code to GitHub.
echo.
echo Prerequisites:
echo - Git must be installed on your system
echo - You must have a GitHub account
echo - You should have created a repository on GitHub
echo.

:: Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Git is installed
)

echo.
echo Please provide your GitHub repository information:
echo.

set /p username="Enter your GitHub username: "
set /p repository="Enter your repository name: "

echo.
echo You entered:
echo GitHub Username: %username%
echo Repository Name: %repository%
echo.

set /p confirm="Is this correct? (y/n): "
if /i not "%confirm%"=="y" (
    echo Setup cancelled.
    pause
    exit /b 0
)

echo.
echo Setting up Git repository...
echo.

:: Initialize git if not already done
if not exist ".git" (
    echo Initializing Git repository...
    git init
) else (
    echo Git repository already exists.
)

:: Add .gitignore if not committed yet
git add .gitignore

:: Add all files
echo Adding all files to Git...
git add .

:: Check if there are changes to commit
git diff-index --quiet HEAD -- 2>nul
if %errorlevel% neq 0 (
    echo Creating initial commit...
    git commit -m "Initial commit: Invoice Generator App with React and Spring Boot"
) else (
    echo No changes to commit.
)

:: Add remote origin
echo Adding GitHub remote...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%username%/%repository%.git

:: Set main branch
echo Setting up main branch...
git branch -M main

:: Push to GitHub
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo SUCCESS! Your code has been pushed to GitHub
    echo ==========================================
    echo.
    echo Your repository is now available at:
    echo https://github.com/%username%/%repository%
    echo.
    echo Next steps:
    echo 1. Visit your GitHub repository
    echo 2. Add a description and topics
    echo 3. Consider adding GitHub Pages for documentation
    echo 4. Set up branch protection rules if needed
    echo.
) else (
    echo.
    echo ==========================================
    echo ERROR: Failed to push to GitHub
    echo ==========================================
    echo.
    echo Common solutions:
    echo 1. Make sure the repository exists on GitHub
    echo 2. Check your GitHub credentials
    echo 3. Ensure you have push access to the repository
    echo 4. Try running: git push -u origin main
    echo.
    echo If you're still having issues, you may need to:
    echo - Set up SSH keys or personal access token
    echo - Configure Git credentials: git config --global user.name "Your Name"
    echo - Configure Git email: git config --global user.email "your.email@example.com"
    echo.
)

echo.
echo Additional GitHub Features Setup:
echo.
echo To enable GitHub Actions (CI/CD):
echo - The workflow file is already included in .github/workflows/ci.yml
echo - It will automatically run tests when you push code
echo.
echo To set up GitHub Pages:
echo 1. Go to your repository Settings
echo 2. Scroll to "Pages" section
echo 3. Select source branch (usually main)
echo 4. Your documentation will be available at: https://%username%.github.io/%repository%
echo.

pause 