@echo off
echo ========================================
echo  BING AUTO SEARCH - Debug Helper
echo ========================================
echo.
echo This utility will open Edge with the extensions page
echo and DevTools console for debugging.
echo.
echo INSTRUCTIONS:
echo 1. Find "Bing Auto Search" in the list
echo 2. Click on "Inspect views: service worker"
echo 3. Verify you see "Service Worker active and ready!"
echo 4. Open the extension popup
echo 5. Click "Start"
echo 6. Check the console for errors
echo.
pause
start msedge.exe edge://extensions/
echo.
echo The extensions page is opening...
echo.
pause
