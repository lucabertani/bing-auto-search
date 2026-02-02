@echo off
echo ========================================
echo  BING AUTO SEARCH - Debug Helper
echo ========================================
echo.
echo Questa utility aprira' Edge con la pagina delle estensioni
echo e la console DevTools per il debug.
echo.
echo ISTRUZIONI:
echo 1. Trova "Bing Auto Search" nella lista
echo 2. Clicca su "Ispeziona visualizzazioni: service worker"
echo 3. Verifica che vedi "Service Worker attivo e pronto!"
echo 4. Apri il popup dell'estensione
echo 5. Clicca "Avvia"
echo 6. Guarda la console per errori
echo.
pause
start msedge.exe edge://extensions/
echo.
echo La pagina delle estensioni si sta aprendo...
echo.
pause
