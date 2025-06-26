@echo off
set "MUSIC_DIR=assets\media\audio\music"

echo const songs = [
for %%f in ("%MUSIC_DIR%\*.mp3") do (
    echo     "%%~nxf",
)
echo ];