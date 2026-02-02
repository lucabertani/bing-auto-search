# 🐛 Debug Guide - Bing Auto Search

## How to View Errors

### 1. Service Worker Console

The service worker handles all searches. To see its logs:

1. Go to `edge://extensions/`
2. Find **Bing Auto Search**
3. Click on **"Inspect views: service worker"** (blue link)
4. Service worker console will open

**What to look for:**

- `Service Worker active and ready!` - Service worker is loaded
- `Bing Auto Search: 200 queries generated` - Queries were created
- `Message received: {action: "start"}` - Message from popup arrived
- `Starting search cycle with parameters:` - Parameters were loaded
- `Search 1/10: "query..."` - Searches are starting

### 2. Popup Console

To see popup errors:

1. Right-click on the extension icon
2. Select **"Inspect"**
3. DevTools will open with popup console

### 3. Automatic Alerts

Now the extension shows **automatic alerts** for all errors:

- ❌ Input validation errors
- ❌ Service worker communication errors
- ❌ Tab opening errors
- ❌ Storage errors

## Common Problems and Solutions

### ❌ Problem: "Service worker communication error"

**Cause:** Service worker is not active

**Solution:**

1. Go to `edge://extensions/`
2. Click the reload button (⟳) on the extension
3. Click on "Inspect views: service worker"
4. Verify you see "Service Worker active and ready!" in console
5. Try starting again

### ❌ Problem: Goes to running but immediately returns to "Ready"

**Possible causes:**

1. Service worker deactivated
2. Permissions not granted
3. Problem with chrome.tabs API

**Solution:**

1. Open service worker console (see above)
2. Check if there are red errors
3. Extension now saves errors and shows them in alerts
4. If you see "Tab not created correctly", reload extension

### ❌ Problem: "Permissions error" or "Cannot read properties"

**Cause:** Missing permissions

**Solution:**

1. Verify that manifest.json contains:
   - `"permissions": ["storage", "tabs", "scripting", "alarms"]`
   - `"host_permissions": ["https://www.bing.com/*"]`
2. Reload extension

### ❌ Problem: Icons not showing

**Cause:** Missing PNG files

**Solution:**

1. Open `icons/generate-icons.html` in browser
2. Download the 3 icons (icon16.png, icon48.png, icon128.png)
3. Save them in `icons/` folder
4. Reload extension

## Step-by-Step Testing

### Complete Test

1. **Open service worker console** (edge://extensions/ → Inspect service worker)
2. **Click extension icon** to open popup
3. **Set low values** for quick test:
   - X = 2-3 (seconds before closing)
   - Y = 1-2 (seconds between searches)
   - Z = 3 (total searches)
4. **Click "Start"**
5. **Verify in service worker console:**
   ```
   Message received: {action: "start"}
   Start command processed successfully
   startSearchCycle called
   Parameters retrieved: {closeDelayMin: 2, closeDelayMax: 3, ...}
   Starting search cycle with parameters: {closeDelayMin: 2, ...}
   Search 1/3: "what's the weather today?"
   ```
6. **Verify that 3 Bing tabs open**
7. **Verify they close automatically**

### If Nothing Works

1. Uninstall extension
2. Restart Edge
3. Reinstall extension
4. Open service worker console first
5. THEN click icon and try starting
6. Read ALL errors in console

## Detailed Logs

### Service Worker (background.js)

- ✅ `Service Worker active and ready!`
- ✅ `Bing Auto Search: 200 queries generated`
- ✅ `Message received: {...}`
- ✅ `Start command processed successfully`
- ✅ `startSearchCycle called`
- ✅ `Parameters retrieved: {...}`
- ✅ `Starting search cycle with parameters: {...}`
- ✅ `Search N/Z: "query"`
- ✅ `All searches completed!`

### Common Errors

- ❌ `Storage error: ...` - Problem with chrome.storage
- ❌ `Tab opening error: ...` - Problem with chrome.tabs
- ❌ `Tab not created correctly` - chrome.tabs.create failed
- ❌ `Invalid parameters: ...` - Incorrect values

## Alarm-Related Issues

### ❌ Problem: Second search never happens (delays > 30s)

**Cause:** Service worker goes to sleep, clearing setTimeout

**Solution:** Already implemented! Extension uses chrome.alarms API for delays > 30 seconds

**Verify it's working:**

1. Set searchDelayMin=50, searchDelayMax=80
2. Start search cycle
3. In service worker console, look for:
   ```
   Using alarm for delay of 50s (> 30s)
   ```
4. After delay, should see:
   ```
   Alarm nextSearch fired, resuming search...
   Resuming search 2/10
   ```

## Contact

If problem persists, provide:

1. Service worker console screenshot
2. Popup screenshot with error
3. X, Y, Z values used
4. Edge version (`edge://version/`)
