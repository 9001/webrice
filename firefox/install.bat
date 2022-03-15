@echo off
setlocal

set "params=%*"
cd /d "%~dp0" && ( if exist "%temp%\heis.vbs" del "%temp%\heis.vbs" ) && fsutil dirty query %systemdrive% 1>nul 2>nul || ( echo Set U = CreateObject^("Shell.Application"^) : U.ShellExecute "cmd.exe", "/k cd ""%~sdp0"" && %~s0 %params% & exit", "", "runas", 1 >> "%temp%\heis.vbs" && "%temp%\heis.vbs" && exit /B )

call :binst "%programfiles(x86)%"
call :binst "%programfiles%"

echo(
for /d %%p in (%appdata%\mozilla\firefox\profiles\*.default*) do (
  echo "'' installing into profile %%~p ''"
  xcopy /e /y chrome "%%~p\chrome\" | find /v "File(s) copied"
)

echo(
echo install complete
pause
exit /b %errorlevel%


:binst
set "r=%~1\Mozilla Firefox"
if exist "%r%" (
  echo(
  echo "'' installing into bindir %r% ''"
  for %%f in ( chrome defaults distribution ) do (
    xcopy /e /y "%%~f" "%r%\%%~f\" | find /v "File(s) copied"
  )
  xcopy /e /y custom.cfg "%r%\" | find /v "File(s) copied"
)
