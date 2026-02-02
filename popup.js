// Riferimenti agli elementi del DOM
const closeDelayMinInput = document.getElementById("closeDelayMin");
const closeDelayMaxInput = document.getElementById("closeDelayMax");
const searchDelayMinInput = document.getElementById("searchDelayMin");
const searchDelayMaxInput = document.getElementById("searchDelayMax");
const totalSearchesInput = document.getElementById("totalSearches");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusDiv = document.getElementById("status");

// Carica i valori salvati all'apertura del popup
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

// Aggiorna lo stato del popup
function updateStatus() {
  chrome.storage.local.get(
    ["isRunning", "currentIteration", "totalSearches"],
    (result) => {
      if (result.isRunning) {
        statusDiv.textContent = `In esecuzione: ${result.currentIteration || 0}/${result.totalSearches || 0} ricerche`;
        statusDiv.style.background = "rgba(76, 175, 80, 0.3)";
        startBtn.disabled = true;
        stopBtn.disabled = false;
      } else {
        statusDiv.textContent = "Pronto";
        statusDiv.style.background = "rgba(255, 255, 255, 0.2)";
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    },
  );
}

// Aggiorna lo stato all'apertura e ogni secondo
updateStatus();
setInterval(updateStatus, 1000);

// Monitora errori dal service worker
setInterval(() => {
  chrome.storage.local.get(["lastError"], (result) => {
    if (result.lastError) {
      alert(`❌ Errore rilevato: ${result.lastError}`);
      console.error("Errore dal service worker:", result.lastError);
      // Pulisci l'errore
      chrome.storage.local.set({ lastError: null, isRunning: false });
      updateStatus();
    }
  });
}, 2000);

// Listener per il pulsante "Avvia"
startBtn.addEventListener("click", () => {
  try {
    const closeDelayMin = parseInt(closeDelayMinInput.value);
    const closeDelayMax = parseInt(closeDelayMaxInput.value);
    const searchDelayMin = parseInt(searchDelayMinInput.value);
    const searchDelayMax = parseInt(searchDelayMaxInput.value);
    const totalSearches = parseInt(totalSearchesInput.value);

    // Validazione input
    if (
      isNaN(closeDelayMin) ||
      isNaN(closeDelayMax) ||
      isNaN(searchDelayMin) ||
      isNaN(searchDelayMax) ||
      isNaN(totalSearches)
    ) {
      alert("❌ Errore: Inserisci valori numerici validi");
      statusDiv.textContent = "⚠️ Valori non validi";
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
      alert("❌ Errore: Tutti i valori devono essere almeno 1");
      statusDiv.textContent = "⚠️ Inserisci valori validi (minimo 1)";
      statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      return;
    }

    if (closeDelayMin > closeDelayMax) {
      alert("❌ Errore: Min tempo chiusura tab non può essere > Max");
      statusDiv.textContent = "⚠️ Intervallo chiusura tab non valido";
      statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      return;
    }

    if (searchDelayMin > searchDelayMax) {
      alert("❌ Errore: Min attesa ricerca non può essere > Max");
      statusDiv.textContent = "⚠️ Intervallo attesa ricerca non valido";
      statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      return;
    }

    if (totalSearches > 200) {
      alert("❌ Errore: Massimo 200 ricerche consentite");
      statusDiv.textContent = "⚠️ Massimo 200 ricerche";
      statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      return;
    }

    // Salva i parametri e invia SUBITO al service worker con i parametri nel messaggio
    // Questo evita race condition tra salvataggio e lettura
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
          const error = `Errore storage: ${chrome.runtime.lastError.message}`;
          alert(`❌ ${error}`);
          console.error(error);
          return;
        }

        // Invia messaggio con i parametri inclusi
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
              const error = `Errore comunicazione con service worker: ${chrome.runtime.lastError.message}`;
              alert(
                `❌ ${error}\n\nProva a ricaricare l'estensione da edge://extensions/`,
              );
              console.error(error);
              chrome.storage.local.set({ isRunning: false });
              return;
            }

            if (response && response.error) {
              alert(`❌ Errore: ${response.error}`);
              console.error("Errore dal service worker:", response.error);
              chrome.storage.local.set({ isRunning: false });
              return;
            }

            console.log("Ricerca avviata con successo");
            updateStatus();
          },
        );
      },
    );
  } catch (error) {
    alert(`❌ Errore inaspettato: ${error.message}`);
    console.error("Errore nel click di Avvia:", error);
    chrome.storage.local.set({ isRunning: false });
  }
});

// Listener per il pulsante "Interrompi"
stopBtn.addEventListener("click", () => {
  try {
    chrome.runtime.sendMessage({ action: "stop" }, (response) => {
      if (chrome.runtime.lastError) {
        const error = `Errore comunicazione: ${chrome.runtime.lastError.message}`;
        alert(`⚠️ ${error}`);
        console.error(error);
      }

      chrome.storage.local.set({ isRunning: false }, () => {
        updateStatus();
        statusDiv.textContent = "⏹️ Interrotto";
        statusDiv.style.background = "rgba(244, 67, 54, 0.3)";
      });
    });
  } catch (error) {
    alert(`❌ Errore durante l'interruzione: ${error.message}`);
    console.error("Errore nel click di Interrompi:", error);
  }
});

// Salva automaticamente i valori quando cambiano
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
