// Global variables to manage the search cycle
let searchTimeout = null;
let closeTimeout = null;
let currentTabId = null;
let currentParams = null; // Save current parameters for alarm

/**
 * Generate a random number between min and max (inclusive)
 */
function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Create an alarm for the next search (for delay > 30 seconds)
 */
function scheduleNextSearchWithAlarm(delaySeconds, iteration, params) {
  console.log(`Using alarm for delay of ${delaySeconds}s (> 30s)`);

  // Save parameters to storage for alarm
  chrome.storage.local.set(
    {
      nextSearchIteration: iteration,
      nextSearchParams: params,
      nextSearchScheduled: Date.now() + delaySeconds * 1000,
    },
    () => {
      // Create an alarm that will fire after delaySeconds
      chrome.alarms.create("nextSearch", { delayInMinutes: delaySeconds / 60 });
    },
  );
}

/**
 * Create a normal timeout for the next search (for delay <= 30 seconds)
 */
function scheduleNextSearchWithTimeout(delaySeconds, iteration, params) {
  console.log(`Using setTimeout for delay of ${delaySeconds}s (<= 30s)`);
  searchTimeout = setTimeout(() => {
    performSearch(iteration, params);
  }, delaySeconds * 1000);
}

// Alarm listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "nextSearch") {
    console.log("Alarm nextSearch fired, resuming search...");

    // Retrieve saved parameters
    chrome.storage.local.get(
      ["nextSearchIteration", "nextSearchParams", "isRunning"],
      (result) => {
        if (
          result.isRunning &&
          result.nextSearchIteration &&
          result.nextSearchParams
        ) {
          console.log(
            `Resuming search ${result.nextSearchIteration}/${result.nextSearchParams.totalSearches}`,
          );
          performSearch(result.nextSearchIteration, result.nextSearchParams);

          // Clean up alarm data
          chrome.storage.local.remove([
            "nextSearchIteration",
            "nextSearchParams",
            "nextSearchScheduled",
          ]);
        } else {
          console.log(
            "Alarm discarded: search no longer active or data missing",
          );
        }
      },
    );
  }
});

/**
 * Function executed in Bing tab
 * Finds the search bar, inserts text and submits the form
 * @param {string} query - The search query to insert
 */
function submitSearchForm(query) {
  try {
    // Try to find Bing's search bar
    let searchInput = document.querySelector("input[name='q']");

    // If not found, try with other selectors
    if (!searchInput) {
      searchInput = document.querySelector("input[type='search']");
    }

    if (!searchInput) {
      searchInput = document.querySelector("#sb_form_q");
    }

    if (!searchInput) {
      throw new Error("Search bar not found");
    }

    // Insert text
    searchInput.value = query;

    // Simulate typing to trigger event listeners
    const event = new Event("input", { bubbles: true });
    searchInput.dispatchEvent(event);

    // Wait a bit to ensure event listeners have been processed
    setTimeout(() => {
      // Find the search form
      let form = searchInput.closest("form");

      if (!form) {
        // If form not found, search for the search button
        const submitBtn = document.querySelector(
          "button[aria-label='Search'], button[type='submit']",
        );
        if (submitBtn) {
          submitBtn.click();
        } else {
          // If button also not found, submit form manually
          const keyEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
          });
          searchInput.dispatchEvent(keyEvent);

          const keyPressEvent = new KeyboardEvent("keypress", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
          });
          searchInput.dispatchEvent(keyPressEvent);

          const keyUpEvent = new KeyboardEvent("keyup", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
          });
          searchInput.dispatchEvent(keyUpEvent);
        }
      } else {
        // Submit the form
        form.submit();
      }
    }, 100);
  } catch (error) {
    console.error("Error filling search form:", error.message);
  }
}

/**
 * Automatically generate 200 generic search queries
 * Uses templates and combinations to create varied phrases
 */
function generateQueries() {
  const queries = [];

  // Template di domande comuni
  const questionTemplates = [
    "che tempo fa",
    "che ore sono",
    "quando tramonta il sole",
    "quando sorge il sole",
    "quanti giorni mancano",
    "come si fa",
    "dove si trova",
    "perché",
    "quanto costa",
    "qual è il migliore",
  ];

  const subjects = [
    "oggi",
    "domani",
    "questa settimana",
    "questo mese",
    "quest'anno",
    "in Italia",
    "a Roma",
    "a Milano",
    "a Napoli",
    "a Torino",
    "al mare",
    "in montagna",
    "in città",
    "in campagna",
  ];

  const topics = [
    "frutta",
    "verdura",
    "pane",
    "pasta",
    "carne",
    "pesce",
    "computer",
    "telefono",
    "tablet",
    "smartwatch",
    "cuffie",
    "libro",
    "film",
    "serie tv",
    "musica",
    "gioco",
    "auto",
    "moto",
    "bicicletta",
    "monopattino",
    "hotel",
    "ristorante",
    "pizzeria",
    "bar",
    "caffè",
    "scarpe",
    "giacca",
    "pantaloni",
    "camicia",
    "maglietta",
    "orologio",
    "borsa",
    "zaino",
    "valigia",
    "cane",
    "gatto",
    "pesce",
    "uccello",
    "criceto",
  ];

  const actions = [
    "comprare",
    "vendere",
    "cucinare",
    "preparare",
    "fare",
    "usare",
    "installare",
    "configurare",
    "riparare",
    "pulire",
    "lavare",
    "scegliere",
    "trovare",
    "cercare",
    "acquistare",
    "noleggiare",
  ];

  // Genera domande combinando template e soggetti
  for (let q of questionTemplates) {
    for (let s of subjects) {
      queries.push(`${q} ${s}?`);
      if (queries.length >= 200) return queries;
    }
  }

  // Genera domande con azioni e argomenti
  for (let action of actions) {
    for (let topic of topics) {
      queries.push(`come ${action} ${topic}?`);
      if (queries.length >= 200) return queries;
    }
  }

  // Genera domande "qual è il migliore"
  for (let topic of topics) {
    queries.push(`qual è il migliore ${topic}?`);
    if (queries.length >= 200) return queries;
  }

  // Genera domande "quanto costa"
  for (let topic of topics) {
    queries.push(`quanto costa ${topic}?`);
    if (queries.length >= 200) return queries;
  }

  // Genera domande "dove comprare"
  for (let topic of topics) {
    queries.push(`dove comprare ${topic}?`);
    if (queries.length >= 200) return queries;
  }

  // Riempi eventuali spazi rimanenti con variazioni
  const fillers = [
    "ricetta facile e veloce",
    "migliori offerte online",
    "come risparmiare soldi",
    "consigli utili",
    "guida completa",
    "tutorial passo passo",
    "recensioni prodotti",
    "confronto prezzi",
    "migliori marche",
    "dove trovare sconti",
  ];

  let fillerIndex = 0;
  while (queries.length < 200) {
    queries.push(fillers[fillerIndex % fillers.length]);
    fillerIndex++;
  }

  return queries.slice(0, 200);
}

// Query array (generated once at startup)
const SEARCH_QUERIES = generateQueries();
console.log(`Bing Auto Search: ${SEARCH_QUERIES.length} queries generated`);
console.log("Service Worker active and ready!");

/**
 * Stop all timeouts and close current tab if open
 */
function stopSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }

  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }

  // Cancel any scheduled alarms
  chrome.alarms.clear("nextSearch", (wasCleared) => {
    if (wasCleared) {
      console.log("Alarm nextSearch cancelled");
    }
  });

  // Clean up alarm data from storage
  chrome.storage.local.remove([
    "nextSearchIteration",
    "nextSearchParams",
    "nextSearchScheduled",
  ]);

  // Close current tab if it exists
  if (currentTabId !== null) {
    chrome.tabs.remove(currentTabId, () => {
      if (chrome.runtime.lastError) {
        console.log("Tab already closed or doesn't exist");
      }
      currentTabId = null;
    });
  }

  // Update status
  chrome.storage.local.set({ isRunning: false });
}

/**
 * Perform a single search on Bing
 */
function performSearch(iteration, params) {
  try {
    // Check if we should continue
    chrome.storage.local.get(["isRunning"], (result) => {
      try {
        if (chrome.runtime.lastError) {
          throw new Error(`Storage error: ${chrome.runtime.lastError.message}`);
        }

        if (!result.isRunning) {
          console.log("Search stopped by user");
          return;
        }

        // Select a random query from the array
        const randomIndex = Math.floor(Math.random() * SEARCH_QUERIES.length);
        const query = SEARCH_QUERIES[randomIndex];

        console.log(`Search ${iteration}/${params.totalSearches}: "${query}"`);

        // Open a new tab with Bing home
        chrome.tabs.create(
          { url: "https://www.bing.com", active: false },
          (tab) => {
            try {
              if (chrome.runtime.lastError) {
                throw new Error(
                  `Tab opening error: ${chrome.runtime.lastError.message}`,
                );
              }

              if (!tab || !tab.id) {
                throw new Error("Tab not created correctly");
              }

              currentTabId = tab.id;

              // Update iteration counter
              chrome.storage.local.set({ currentIteration: iteration }, () => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Iteration update error:",
                    chrome.runtime.lastError,
                  );
                }
              });

              // Wait for page to fully load
              let retries = 0;
              const maxRetries = 30; // Max 30 seconds wait
              const waitForPageLoad = () => {
                chrome.tabs.get(tab.id, (currentTab) => {
                  if (chrome.runtime.lastError) {
                    console.log(
                      "Tab closed or error:",
                      chrome.runtime.lastError,
                    );
                    return;
                  }

                  if (currentTab.status === "complete") {
                    // Page loaded, now execute script
                    console.log("Bing page loaded, filling form...");

                    // Generate a random closeDelay between min and max
                    const actualCloseDelay = getRandomInRange(
                      params.closeDelayMin,
                      params.closeDelayMax,
                    );
                    console.log(
                      `Tab close scheduled in ${params.closeDelayMin}-${params.closeDelayMax}s (random: ${actualCloseDelay}s)`,
                    );

                    // Schedule tab close IMMEDIATELY (before executing script)
                    // This ensures timeout is set even if executeScript callback isn't called
                    closeTimeout = setTimeout(() => {
                      chrome.tabs.remove(tab.id, () => {
                        if (chrome.runtime.lastError) {
                          console.log(
                            "Tab already closed or error:",
                            chrome.runtime.lastError,
                          );
                        }
                        currentTabId = null;

                        // If we've completed all searches, stop the cycle
                        if (iteration >= params.totalSearches) {
                          console.log("All searches completed!");
                          chrome.storage.local.set({
                            isRunning: false,
                            currentIteration: params.totalSearches,
                          });
                          return;
                        }

                        // Generate a random searchDelay between min and max
                        const actualSearchDelay = getRandomInRange(
                          params.searchDelayMin,
                          params.searchDelayMax,
                        );
                        console.log(
                          `Next search in ${params.searchDelayMin}-${params.searchDelayMax}s (random: ${actualSearchDelay}s)`,
                        );

                        // Use alarm if delay > 30 seconds (to avoid service worker sleep)
                        // Otherwise use normal setTimeout
                        if (actualSearchDelay > 30) {
                          scheduleNextSearchWithAlarm(
                            actualSearchDelay,
                            iteration + 1,
                            params,
                          );
                        } else {
                          scheduleNextSearchWithTimeout(
                            actualSearchDelay,
                            iteration + 1,
                            params,
                          );
                        }
                      });
                    }, actualCloseDelay * 1000);

                    // Now execute the script (timeout is already scheduled)
                    chrome.scripting.executeScript(
                      {
                        target: { tabId: tab.id },
                        function: submitSearchForm,
                        args: [query],
                      },
                      (results) => {
                        if (chrome.runtime.lastError) {
                          console.error(
                            "Script execution error:",
                            chrome.runtime.lastError,
                          );
                        } else {
                          console.log("Search filled and submitted");
                        }
                      },
                    );
                  } else if (retries < maxRetries) {
                    // Still loading, retry in 1 second
                    retries++;
                    setTimeout(waitForPageLoad, 1000);
                  } else {
                    // Timeout, proceed anyway
                    console.log("Page load timeout, proceeding anyway");

                    chrome.scripting.executeScript(
                      {
                        target: { tabId: tab.id },
                        function: submitSearchForm,
                        args: [query],
                      },
                      (results) => {
                        if (chrome.runtime.lastError) {
                          console.error(
                            "Errore esecuzione script:",
                            chrome.runtime.lastError,
                          );
                        }
                      },
                    );
                  }
                });
              };

              // Start waiting for load
              waitForPageLoad();
            } catch (error) {
              console.error("Error in tabs.create callback:", error);
              chrome.storage.local.set({
                isRunning: false,
                lastError: `Tab creation error: ${error.message}`,
              });
            }
          },
        );
      } catch (error) {
        console.error("Error in performSearch callback:", error);
        chrome.storage.local.set({
          isRunning: false,
          lastError: error.message,
        });
      }
    });
  } catch (error) {
    console.error("Critical error in performSearch:", error);
    chrome.storage.local.set({
      isRunning: false,
      lastError: `Critical error: ${error.message}`,
    });
  }
}

/**
 * Start the search cycle
 * @param {Object} params - Parameters passed directly from popup
 */
function startSearchCycle(params) {
  try {
    console.log("startSearchCycle called with parameters:", params);

    // Verify parameters are valid
    if (!params || typeof params !== "object") {
      throw new Error("Missing or invalid parameters");
    }

    if (
      params.closeDelayMin < 1 ||
      params.closeDelayMax < 1 ||
      params.searchDelayMin < 1 ||
      params.searchDelayMax < 1 ||
      params.totalSearches < 1
    ) {
      throw new Error(
        `Invalid parameters: closeDelayMin=${params.closeDelayMin}, closeDelayMax=${params.closeDelayMax}, searchDelayMin=${params.searchDelayMin}, searchDelayMax=${params.searchDelayMax}, totalSearches=${params.totalSearches}`,
      );
    }

    // Set isRunning = true in service worker
    chrome.storage.local.set({ isRunning: true }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting isRunning:", chrome.runtime.lastError);
      }
    });

    console.log("Starting search cycle");

    // Start first search
    performSearch(1, params);
  } catch (error) {
    console.error("Critical error in startSearchCycle:", error);
    chrome.storage.local.set({
      isRunning: false,
      lastError: `Critical startup error: ${error.message}`,
    });
  }
}

// Message listener from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    console.log("Message received:", message);

    if (message.action === "start") {
      try {
        // Verify parameters are present
        if (!message.params) {
          throw new Error("Missing parameters in message");
        }

        stopSearch(); // Stop any ongoing searches
        startSearchCycle(message.params); // Pass parameters directly
        sendResponse({ success: true });
        console.log("Start command processed successfully");
      } catch (error) {
        console.error("Error during start:", error);
        chrome.storage.local.set({
          isRunning: false,
          lastError: `Start error: ${error.message}`,
        });
        sendResponse({ success: false, error: error.message });
      }
    } else if (message.action === "stop") {
      try {
        stopSearch();
        sendResponse({ success: true });
        console.log("Stop command processed successfully");
      } catch (error) {
        console.error("Error during stop:", error);
        sendResponse({ success: false, error: error.message });
      }
    } else {
      sendResponse({ success: false, error: "Unrecognized action" });
    }
  } catch (error) {
    console.error("Critical error in message listener:", error);
    sendResponse({ success: false, error: `Critical error: ${error.message}` });
  }
  return true;
});

// Listener for when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("Bing Auto Search installed");
  // Initialize default values if they don't exist
  chrome.storage.local.get(
    [
      "closeDelayMin",
      "closeDelayMax",
      "searchDelayMin",
      "searchDelayMax",
      "totalSearches",
    ],
    (result) => {
      if (!result.closeDelayMin) {
        chrome.storage.local.set({
          closeDelayMin: 10,
          closeDelayMax: 20,
          searchDelayMin: 50,
          searchDelayMax: 80,
          totalSearches: 10,
          isRunning: false,
          currentIteration: 0,
        });
      }
    },
  );
});

// Handle sudden extension closure
chrome.runtime.onSuspend.addListener(() => {
  stopSearch();
});
