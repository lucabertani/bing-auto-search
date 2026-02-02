# 🚨 TROUBLESHOOTING: "Goes to Running but Returns to Ready"

## ⚠️ COMMON PROBLEM: MISSING ICONS

The extension might not work if **PNG icons are not present**!

### ✅ IMMEDIATE SOLUTION

1. **Open this file in browser**: `icons/generate-icons.html`
2. **Click the 3 buttons** to download:
   - icon16.png
   - icon48.png
   - icon128.png
3. **Save the files** in the `icons/` folder
4. **Go to**: `edge://extensions/`
5. **Reload the extension** (⟳ button)
6. **Try starting again**

## 🐛 HOW TO SEE REAL ERRORS

### Option 1: Use the batch helper (WINDOWS)

1. Double click on `debug-helper.bat`
2. Follow the instructions

### Option 2: Manually

1. **Open**: `edge://extensions/`
2. **Find**: "Bing Auto Search"
3. **Click**: on the blue link "Inspect views: service worker"
4. **Console will open** with service worker logs

### What You Should See

```
Bing Auto Search: 200 queries generated
Service Worker active and ready!
```

If you DON'T see these messages, the service worker is not active!

## 📋 DEBUG CHECKLIST

### Step 1: Verify Files

- [ ] `manifest.json` exists?
- [ ] `popup.html` exists?
- [ ] `popup.js` exists?
- [ ] `background.js` exists?
- [ ] `icons/icon16.png` exists? ⚠️ **IMPORTANT**
- [ ] `icons/icon48.png` exists? ⚠️ **IMPORTANT**
- [ ] `icons/icon128.png` exists? ⚠️ **IMPORTANT**

### Step 2: Open Service Worker Console

1. Go to `edge://extensions/`
2. Enable "Developer mode" (bottom left)
3. Find "Bing Auto Search"
4. Click on "Inspect views: service worker"

### Step 3: Verify Logs

You should see:

```
✅ Bing Auto Search: 200 queries generated
✅ Service Worker active and ready!
```

### Step 4: Test Startup

1. Click on the extension icon
2. Set: X=2, Y=1, Z=3
3. Click "Start"

In the service worker console you should see:

```
✅ Message received: {action: "start"}
✅ Start command processed successfully
✅ startSearchCycle called
✅ Parameters retrieved: {closeDelay: 2, ...}
✅ Starting search cycle with parameters: {...}
✅ Search 1/3: "what's the weather today?"
```

### Step 5: If You See Errors

Now the extension shows **ALERTS** for every error:

- ❌ If you see an alert → Read the message and report it
- ❌ If you see red errors in console → Copy all the text

## 🔧 QUICK SOLUTIONS

### If Service Worker won't start

```
1. Reload the extension (⟳)
2. Close and reopen Edge
3. Uninstall and reinstall the extension
```

### If you see "Service worker communication error"

```
1. The service worker is dead
2. Go to edge://extensions/
3. Click "Inspect views: service worker" to reactivate it
4. Try again
```

### If tabs don't open

```
1. Verify permissions in manifest.json:
   - "permissions": ["storage", "tabs", "scripting", "alarms"]
   - "host_permissions": ["https://www.bing.com/*"]
2. Reload the extension
```

### If it still doesn't work

```
1. Open service worker console
2. Copy ALL console content
3. Open popup console (right-click icon → Inspect)
4. Copy ALL content
5. Report both
```

## 💡 QUICK TEST

Open the service worker console and type:

```javascript
chrome.storage.local.get(null, (data) => console.log(data));
```

You should see:

```javascript
{
  closeDelayMin: 10,
  closeDelayMax: 20,
  searchDelayMin: 50,
  searchDelayMax: 80,
  totalSearches: 10,
  isRunning: false,
  currentIteration: 0
}
```

If you see NOTHING, there's a problem with chrome.storage!

## 📞 SUPPORT

Still having problems? Provide:

1. ✅ Service worker console screenshot
2. ✅ Popup screenshot with error alert
3. ✅ Edge version (`edge://version/`)
4. ✅ Complete manifest.json file
