# 🚀 Invoice Generator - Setup Guide

## Prerequisites Installation Guide

### 1. 📦 Install Java 17

#### Option A: Download from Adoptium (Recommended)
1. Go to [https://adoptium.net/](https://adoptium.net/)
2. Select:
   - **Version**: 17 - LTS
   - **Operating System**: Windows
   - **Architecture**: x64
3. Download and run the installer
4. Follow the installation wizard (keep default settings)

#### Option B: Using Chocolatey
```powershell
# Run PowerShell as Administrator
choco install openjdk17
```

#### Verify Java Installation
```cmd
java -version
```
You should see something like: `openjdk version "17.0.x"`

---

### 2. 📦 Install Maven

#### Option A: Manual Installation
1. **Download Maven**:
   - Go to [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)
   - Download the "Binary zip archive" (e.g., `apache-maven-3.9.6-bin.zip`)

2. **Extract Maven**:
   - Create folder: `C:\Program Files\Apache\maven`
   - Extract the zip file there
   - Final path should be: `C:\Program Files\Apache\maven\apache-maven-3.9.6\`

3. **Set Environment Variables**:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Environment Variables"
   - Under "System Variables", click "New":
     - **Variable name**: `MAVEN_HOME`
     - **Variable value**: `C:\Program Files\Apache\maven\apache-maven-3.9.6`
   - Find "Path" in System Variables, click "Edit" → "New" and add:
     - `%MAVEN_HOME%\bin`
   - Click OK on all dialogs

4. **Restart Command Prompt** and verify:
```cmd
mvn -version
```

#### Option B: Using Chocolatey
```powershell
# Run PowerShell as Administrator
choco install maven
```

---

### 3. 📦 Install Node.js and npm

#### Option A: Download from Official Website
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (includes npm)
3. Run the installer and follow the setup wizard
4. **Important**: Check the box "Automatically install the necessary tools"

#### Option B: Using Chocolatey
```powershell
# Run PowerShell as Administrator
choco install nodejs
```

#### Verify Node.js and npm Installation
```cmd
node -version
npm -version
```

---

## 🏃‍♂️ Running the Application

### Method 1: Use the Smart Setup Script
1. Double-click `setup-and-run.bat`
2. The script will:
   - Check if all prerequisites are installed
   - Give you options to start backend, frontend, or both
   - Provide helpful error messages if something is missing

### Method 2: Manual Steps

#### Start Backend (Terminal/Command Prompt 1)
```cmd
cd backend
mvn spring-boot:run
```
Wait for the message: "Started InvoiceGeneratorApplication"

#### Start Frontend (Terminal/Command Prompt 2)
```cmd
cd frontend
npm install
npm start
```

### Method 3: Use Individual Scripts
- **Backend**: Double-click `start-backend.bat`
- **Frontend**: Double-click `start-frontend.bat`

---

## 🌐 Access the Application

Once both services are running:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

## 🔧 Troubleshooting

### "mvn is not recognized"
- Maven is not installed or not in PATH
- Follow the Maven installation steps above
- Restart your command prompt after setting environment variables

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your command prompt

### "java is not recognized"
- Java is not installed or not in PATH
- Install Java 17 from [adoptium.net](https://adoptium.net/)
- Restart your command prompt

### Port Already in Use
If you get port errors:

**Backend (Port 8080)**:
```cmd
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

**Frontend (Port 3000)**:
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Maven Build Issues
If Maven fails to download dependencies:
```cmd
cd backend
mvn clean install -U
```

### npm Install Issues
If npm install fails:
```cmd
cd frontend
npm cache clean --force
npm install
```

---

## 🎯 Quick Start Checklist

- [ ] Java 17 installed (`java -version`)
- [ ] Maven installed (`mvn -version`)
- [ ] Node.js installed (`node -version`)
- [ ] npm installed (`npm -version`)
- [ ] Run `setup-and-run.bat` or start services manually
- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Access app at [http://localhost:3000](http://localhost:3000)

---

## 💡 Alternative: Using IDE

If you prefer using an IDE:

### Backend (IntelliJ IDEA/Eclipse):
1. Import the `backend` folder as a Maven project
2. Run the `InvoiceGeneratorApplication.java` main method

### Frontend (VS Code):
1. Open the `frontend` folder in VS Code
2. Open terminal in VS Code: `npm install && npm start`

---

## 🆘 Need Help?

If you're still having issues:
1. Make sure you've restarted your command prompt after installing software
2. Check that environment variables are set correctly
3. Ensure no antivirus is blocking the installation
4. Try running command prompt as Administrator

The `setup-and-run.bat` script will give you specific error messages and instructions for any missing prerequisites! 