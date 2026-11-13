@echo off
setlocal
where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
  mvn %*
) else (
  "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" %*
)
