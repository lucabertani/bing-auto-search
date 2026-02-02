# 📋 Test Checklist - Bing Auto Search

## Functional Tests

### ✅ Installation

- [ ] Extension installs without errors in Edge
- [ ] Icon appears in toolbar
- [ ] Popup opens correctly on click

### ✅ Configuration

- [ ] Input fields accept numeric values
- [ ] Values are saved correctly
- [ ] Saved values load when reopening popup
- [ ] Validation prevents values < 1
- [ ] Validation prevents Z > 200
- [ ] Min values cannot exceed Max values

### ✅ Search Functionality

- [ ] "Start" button begins search cycle
- [ ] Tabs open with different Bing queries
- [ ] Tabs close after random delay (closeDelayMin-closeDelayMax seconds)
- [ ] There's a wait of random delay (searchDelayMin-searchDelayMax seconds) between searches
- [ ] Cycle stops after Z searches
- [ ] Counter shows correct progress (e.g., 5/10)

### ✅ Stop Functionality

- [ ] "Stop" button stops cycle immediately
- [ ] Current tab is closed on interruption
- [ ] No pending searches after interruption
- [ ] Status returns to "Ready"

### ✅ User Interface

- [ ] Design is clean and modern
- [ ] Buttons change state (enabled/disabled) correctly
- [ ] Status updates in real-time
- [ ] Error messages are clear
- [ ] Layout is compact and minimalist

### ✅ Query Generation

- [ ] Exactly 200 queries are generated
- [ ] Queries are different from each other
- [ ] Queries are grammatically correct English
- [ ] Searches use random queries from the array

### ✅ Service Worker Persistence

- [ ] Searches continue with delays > 30 seconds
- [ ] Chrome Alarms API works for long delays
- [ ] Service worker sleep doesn't interrupt search cycle
- [ ] Console shows "Using alarm for delay" for delays > 30s
- [ ] Console shows "Using setTimeout for delay" for delays ≤ 30s

## Edge Case Tests

### ⚠️ Boundary Scenarios

- [ ] Start with minimum values (closeDelayMin=1, closeDelayMax=1, searchDelayMin=1, searchDelayMax=1, Z=1)
- [ ] Start with maximum values (closeDelayMin=60, closeDelayMax=60, searchDelayMin=120, searchDelayMax=120, Z=200)
- [ ] Stop immediately after starting
- [ ] Stop during tab closing
- [ ] Close popup during execution
- [ ] Manually close a search tab
- [ ] Start a new cycle while one is running
- [ ] Test with searchDelay > 30 seconds (alarm functionality)

## Performance Tests

### 🚀 Performance

- [ ] Searches start without noticeable delays
- [ ] Memory doesn't increase excessively
- [ ] No memory leaks after many searches
- [ ] Browser remains responsive during searches

## Permission Tests

### 🔒 Security

- [ ] Extension only requests necessary permissions
- [ ] No requests for additional permissions
- [ ] Data is saved only locally
- [ ] Extension has "alarms" permission

## Console Errors

### 🐛 Debug

- [ ] No errors in popup console
- [ ] No errors in service worker console
- [ ] Logs show correct information
- [ ] "Service Worker active and ready!" appears on load
- [ ] "200 queries generated" appears on load

## Compatibility

### 🌐 Browser

- [ ] Works on Microsoft Edge (Chromium)
- [ ] Works on Google Chrome (optional)

## Notes

Version tested: \***\*\_\_\_\*\***
Test date: \***\*\_\_\_\*\***
Tester: \***\*\_\_\_\*\***

### Issues found:

1. ***
2. ***
3. ***

### Suggestions:

1. ***
2. ***
3. ***
