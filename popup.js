// DOM element references
const closeDelayMinInput = document.getElementById("closeDelayMin");
const closeDelayMaxInput = document.getElementById("closeDelayMax");
const searchDelayMinInput = document.getElementById("searchDelayMin");
const searchDelayMaxInput = document.getElementById("searchDelayMax");
const totalSearchesInput = document.getElementById("totalSearches");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusDiv = document.getElementById("status");

// Load saved values when popup opens
chrome.storage.local.get(
  [
    "closeDelayMin",
    "closeDelayMax",
    "searchDelayMin",
    "searchDelayMax",
    "totalSearches",
  ],
  (result) => {
    if (result.closeDelayMin) closeDelayMinInput.value = result.closeDelayMin;
    if (result.closeDelayMax) closeDelayMaxInput.value = result.closeDelayMax;
    if (result.searchDelayMin)
      searchDelayMinInput.value = result.searchDelayMin;
    if (result.searchDelayMax)
      searchDelayMaxInput.value = result.searchDelayMax;
    if (result.totalSearches) totalSearchesInput.value = result.totalSearches;
  },
);

// Update popup status
function updateStatus() {
  chrome.storage.local.get(
    ["isRunning", "currentIteration", "totalSearches"],
    (result) => {
      if (result.isRunning) {
        statusDiv.textContent = `Running: ${result.currentIteration || 0}/${result.totalSearches || 0} searches`;
        statusDiv.style.background = "rgba(76, 175, 80, 0.3)";
        startBtn.disabled = true;
        stopBtn.disabled = false;
      } else {
        statusDiv.textContent = "Ready";
        statusDiv.style.background = "rgba(255, 255, 255, 0.2)";
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    },
  );
}

// Update status on open and every second
updateStatus();
setInterval(updateStatus, 1000);

// Monitor errors from service worker
setInterval(() => {
  chrome.storage.local.get(["lastError"], (result) => {
    if (result.lastError) {
      alert(`❌ Error detected: ${result.lastError}`);
      console.error("Error from service worker:", result.lastError);
      // Clear the error
      chrome.storage.local.set({ lastError: null, isRunning: false });
      updateStatus();
    }
  });
}, 2000);

// Start button listener
startBtn.addEventListener("click", () => {
  try {
    const closeDelayMin = parseInt(closeDelayMinInput.value);
    const closeDelayMax = parseInt(closeDelayMaxInput.value);
    const searchDelayMin = parseInt(searchDelayMinInput.value);
    const searchDelayMax = parseInt(searchDelayMaxInput.value);
    const totalSearches = parseInt(totalSearchesInput.value);

    // Input validation
    if (
      isNaN(closeDelayMin) ||
      isNaN(closeDelayMax) ||
      isNaN(searchDelayMin) ||
      isNaN(searchDelayMax) ||
      isNaN(totalSearches)
    ) {
      alert("❌ Error: Enter valid numeric values");
      statusDiv.textContent = "⚠️ Invalid values";
      statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      return;
    }

    if (
      closeDelayMin < 1 ||
      closeDelayMax < 1 ||
      searchDelayMin < 1 ||
      searchDelayMax < 1 ||
      totalSearches < 1
    ) {
      alert("❌ Error: All values must be at least 1");
      statusDiv.textContent = "⚠️ Enter valid values (minimum 1)";
      statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      return;
    }

    if (closeDelayMin > closeDelayMax) {
      alert("❌ Error: Min close tab time cannot be > Max");
      statusDiv.textContent = "⚠️ Invalid tab close interval";
      statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      return;
    }

    if (searchDelayMin > searchDelayMax) {
      alert("❌ Error: Min search wait cannot be > Max");
      statusDiv.textContent = "⚠️ Invalid search wait interval";
      statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      return;
    }

    if (totalSearches > 200) {
      alert("❌ Error: Maximum 200 searches allowed");
      statusDiv.textContent = "⚠️ Maximum 200 searches";
      statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      return;
    }

    // Save parameters and send IMMEDIATELY to service worker with parameters in message
    // This avoids race condition between save and read
    chrome.storage.local.set(
      {
        closeDelayMin,
        closeDelayMax,
        searchDelayMin,
        searchDelayMax,
        totalSearches,
        isRunning: true,
        currentIteration: 0,
        lastError: null,
      },
      () => {
        if (chrome.runtime.lastError) {
          const error = `Storage error: ${chrome.runtime.lastError.message}`;
          alert(`❌ ${error}`);
          console.error(error);
          return;
        }

        // Send message with parameters included
        chrome.runtime.sendMessage(
          {
            action: "start",
            params: {
              closeDelayMin,
              closeDelayMax,
              searchDelayMin,
              searchDelayMax,
              totalSearches,
            },
          },
          (response) => {
            if (chrome.runtime.lastError) {
              const error = `Service worker communication error: ${chrome.runtime.lastError.message}`;
              alert(
                `❌ ${error}\n\nTry reloading the extension from edge://extensions/`,
              );
              console.error(error);
              chrome.storage.local.set({ isRunning: false });
              return;
            }

            if (response && response.error) {
              alert(`❌ Error: ${response.error}`);
              console.error("Error from service worker:", response.error);
              chrome.storage.local.set({ isRunning: false });
              return;
            }

            console.log("Search started successfully");
            updateStatus();
          },
        );
      },
    );
  } catch (error) {
    alert(`❌ Unexpected error: ${error.message}`);
    console.error("Error in Start click:", error);
    chrome.storage.local.set({ isRunning: false });
  }
});

// Stop button listener
stopBtn.addEventListener("click", () => {
  try {
    chrome.runtime.sendMessage({ action: "stop" }, (response) => {
      if (chrome.runtime.lastError) {
        const error = `Communication error: ${chrome.runtime.lastError.message}`;
        alert(`⚠️ ${error}`);
        console.error(error);
      }

      chrome.storage.local.set({ isRunning: false }, () => {
        updateStatus();
        statusDiv.textContent = "⏹️ Stopped";
        statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      });
    });
  } catch (error) {
    alert(`❌ Error during stop: ${error.message}`);
    console.error("Error in Stop click:", error);
  }
});

// Automatically save values when they change
closeDelayMinInput.addEventListener("change", () => {
  chrome.storage.local.set({
    closeDelayMin: parseInt(closeDelayMinInput.value),
  });
});

closeDelayMaxInput.addEventListener("change", () => {
  chrome.storage.local.set({
    closeDelayMax: parseInt(closeDelayMaxInput.value),
  });
});

searchDelayMinInput.addEventListener("change", () => {
  chrome.storage.local.set({
    searchDelayMin: parseInt(searchDelayMinInput.value),
  });
});

searchDelayMaxInput.addEventListener("change", () => {
  chrome.storage.local.set({
    searchDelayMax: parseInt(searchDelayMaxInput.value),
  });
});

totalSearchesInput.addEventListener("change", () => {
  chrome.storage.local.set({
    totalSearches: parseInt(totalSearchesInput.value),
  });
});
