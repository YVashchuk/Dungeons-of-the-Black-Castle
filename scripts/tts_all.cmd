@echo off
rem tts_all.cmd - render the narration pack for all four languages with the voices chosen on 2026-09-11 (V-04, group_88).
rem Run from any folder:  scripts\tts_all.cmd      (after:  set OPENAI_API_KEY=sk-...)
rem Each language runs twice: the second pass fills the gaps left by rate-limit errors (HTTP 429) - the script is resumable.
setlocal
if "%OPENAI_API_KEY%"=="" (
  echo Set the key first in this window:   set OPENAI_API_KEY=sk-...
  exit /b 1
)
cd /d "%~dp0\.."
set MODEL=tts-1-hd
set CONC=2

for %%P in (1 2) do (
  echo ===== pass %%P : RU onyx =====
  node scripts\tts_pregenerate.js --lang ru --voice onyx  --model %MODEL% --concurrency %CONC%
  echo ===== pass %%P : EN fable =====
  node scripts\tts_pregenerate.js --lang en --voice fable --model %MODEL% --concurrency %CONC%
  echo ===== pass %%P : FR onyx =====
  node scripts\tts_pregenerate.js --lang fr --voice onyx  --model %MODEL% --concurrency %CONC%
  echo ===== pass %%P : UK onyx =====
  node scripts\tts_pregenerate.js --lang uk --voice onyx  --model %MODEL% --concurrency %CONC%
)

echo.
echo ===== sizes =====
for %%L in (ru en fr uk) do (
  for /f "usebackq" %%S in (`powershell -NoProfile -Command "(Get-ChildItem 'dist\audio\%%L' -File | Measure-Object Length -Sum).Sum / 1MB"`) do echo   %%L: %%S MB
)
echo.
echo Missing files (if any) - just run scripts\tts_all.cmd again:
node scripts\tts_pregenerate.js --lang ru --dry
node scripts\tts_pregenerate.js --lang en --dry
node scripts\tts_pregenerate.js --lang fr --dry
node scripts\tts_pregenerate.js --lang uk --dry
echo.
echo Then:  git add dist\audio ^&^& git commit -m "audio: narration pack" ^&^& git push
endlocal
