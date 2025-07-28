@echo off
echo ========================================
echo Invoice Generator - Setup and Run
echo ========================================
echo.

echo Checking prerequisites...
echo.

:: Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed or not in PATH
    echo Please install Java 17 from: https://adoptium.net/
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Java is installed
)

:: Check Maven
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Maven is not installed or not in PATH
    echo.
    echo To install Maven:
    echo 1. Download from: https://maven.apache.org/download.cgi
    echo 2. Extract to C:\Program Files\Apache\maven\
    echo 3. Add MAVEN_HOME environment variable
    echo 4. Add %%MAVEN_HOME%%\bin to PATH
    echo.
    echo OR use Chocolatey: choco install maven
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Maven is installed
)

:: Check Node.js
node -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
)

:: Check npm
npm -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH
    echo npm should come with Node.js installation
    echo.
    pause
    exit /b 1
) else (
    echo [OK] npm is installed
)

echo.
echo All prerequisites are installed!
echo.
echo Choose an option:
echo 1. Start Backend only
echo 2. Start Frontend only  
echo 3. Start both (recommended)
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto frontend
if "%choice%"=="3" goto both
if "%choice%"=="4" goto end

:backend
echo.
echo Starting Backend...
cd backend
mvn spring-boot:run
goto end

:frontend
echo.
echo Installing frontend dependencies (this may take a few minutes)...
cd frontend
npm install
echo.
echo Starting Frontend...
npm start
goto end

:both
echo.
echo Starting both Backend and Frontend...
echo.
echo Starting Backend in a new window...
start "Invoice Backend" cmd /c "cd backend && mvn spring-boot:run && pause"
echo.
echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak
echo.
echo Installing frontend dependencies (this may take a few minutes)...
cd frontend
npm install
echo.
echo Starting Frontend...
npm start
goto end

:end
echo.
echo Done!
pause 