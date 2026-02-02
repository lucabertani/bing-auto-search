// Variabili globali per gestire il ciclo di ricerca
let searchTimeout = null;
let closeTimeout = null;
let currentTabId = null;
let currentParams = null; // Salva i parametri correnti per l'alarm

/**
 * Genera un numero casuale tra min e max (inclusi)
 */
function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Crea un alarm per la prossima ricerca (per delay > 30 secondi)
 */
function scheduleNextSearchWithAlarm(delaySeconds, iteration, params) {
  console.log(`Usando alarm per delay di ${delaySeconds}s (> 30s)`);

  // Salva i parametri nello storage per l'alarm
  chrome.storage.local.set(
    {
      nextSearchIteration: iteration,
      nextSearchParams: params,
      nextSearchScheduled: Date.now() + delaySeconds * 1000,
    },
    () => {
      // Crea un alarm che scatterà tra delaySeconds
      chrome.alarms.create("nextSearch", { delayInMinutes: delaySeconds / 60 });
    },
  );
}

/**
 * Crea un timeout normale per la prossima ricerca (per delay <= 30 secondi)
 */
function scheduleNextSearchWithTimeout(delaySeconds, iteration, params) {
  console.log(`Usando setTimeout per delay di ${delaySeconds}s (<= 30s)`);
  searchTimeout = setTimeout(() => {
    performSearch(iteration, params);
  }, delaySeconds * 1000);
}

// Listener per gli alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "nextSearch") {
    console.log("Alarm nextSearch scattato, riprendo ricerca...");

    // Recupera i parametri salvati
    chrome.storage.local.get(
      ["nextSearchIteration", "nextSearchParams", "isRunning"],
      (result) => {
        if (
          result.isRunning &&
          result.nextSearchIteration &&
          result.nextSearchParams
        ) {
          console.log(
            `Ripresa ricerca ${result.nextSearchIteration}/${result.nextSearchParams.totalSearches}`,
          );
          performSearch(result.nextSearchIteration, result.nextSearchParams);

          // Pulisci i dati dell'alarm
          chrome.storage.local.remove([
            "nextSearchIteration",
            "nextSearchParams",
            "nextSearchScheduled",
          ]);
        } else {
          console.log("Alarm scartato: ricerca non più attiva o dati mancanti");
        }
      },
    );
  }
});

/**
 * Funzione che viene eseguita nella tab di Bing
 * Trova la barra di ricerca, inserisce il testo e invia il form
 * @param {string} query - La query di ricerca da inserire
 */
function submitSearchForm(query) {
  try {
    // Tenta di trovare la barra di ricerca di Bing
    let searchInput = document.querySelector("input[name='q']");

    // Se non la trova, tenta con altri selettori
    if (!searchInput) {
      searchInput = document.querySelector("input[type='search']");
    }

    if (!searchInput) {
      searchInput = document.querySelector("#sb_form_q");
    }

    if (!searchInput) {
      throw new Error("Barra di ricerca non trovata");
    }

    // Inserisci il testo
    searchInput.value = query;

    // Simula digitazione per attivare event listeners
    const event = new Event("input", { bubbles: true });
    searchInput.dispatchEvent(event);

    // Aspetta un po' per assicurarti che gli event listener siano stati processati
    setTimeout(() => {
      // Trova il form di ricerca
      let form = searchInput.closest("form");

      if (!form) {
        // Se non trovi il form, cerca il pulsante di ricerca
        const submitBtn = document.querySelector(
          "button[aria-label='Ricerca'], button[type='submit']",
        );
        if (submitBtn) {
          submitBtn.click();
        } else {
          // Se non trovi neanche il pulsante, invia il form manualmente
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
        // Invia il form
        form.submit();
      }
    }, 100);
  } catch (error) {
    console.error("Errore nel compilare il form di ricerca:", error.message);
  }
}

/**
 * Genera automaticamente 200 query di ricerca generiche
 * Utilizza template e combinazioni per creare frasi varie
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

// Array di query (generato una volta all'avvio)
const SEARCH_QUERIES = generateQueries();
console.log(`Bing Auto Search: ${SEARCH_QUERIES.length} query generate`);
console.log("Service Worker attivo e pronto!");

/**
 * Ferma tutti i timeout e chiude la tab corrente se aperta
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

  // Cancella eventuali alarm programmati
  chrome.alarms.clear("nextSearch", (wasCleared) => {
    if (wasCleared) {
      console.log("Alarm nextSearch cancellato");
    }
  });

  // Pulisci i dati dell'alarm dallo storage
  chrome.storage.local.remove([
    "nextSearchIteration",
    "nextSearchParams",
    "nextSearchScheduled",
  ]);

  // Chiudi la tab corrente se esiste
  if (currentTabId !== null) {
    chrome.tabs.remove(currentTabId, () => {
      if (chrome.runtime.lastError) {
        console.log("Tab già chiusa o non esistente");
      }
      currentTabId = null;
    });
  }

  // Aggiorna lo stato
  chrome.storage.local.set({ isRunning: false });
}

/**
 * Esegue una singola ricerca su Bing
 */
function performSearch(iteration, params) {
  try {
    // Verifica se dobbiamo continuare
    chrome.storage.local.get(["isRunning"], (result) => {
      try {
        if (chrome.runtime.lastError) {
          throw new Error(`Storage error: ${chrome.runtime.lastError.message}`);
        }

        if (!result.isRunning) {
          console.log("Ricerca interrotta dall'utente");
          return;
        }

        // Seleziona una query casuale dall'array
        const randomIndex = Math.floor(Math.random() * SEARCH_QUERIES.length);
        const query = SEARCH_QUERIES[randomIndex];

        console.log(`Ricerca ${iteration}/${params.totalSearches}: "${query}"`);

        // Apri una nuova tab con Bing home
        chrome.tabs.create(
          { url: "https://www.bing.com", active: false },
          (tab) => {
            try {
              if (chrome.runtime.lastError) {
                throw new Error(
                  `Errore apertura tab: ${chrome.runtime.lastError.message}`,
                );
              }

              if (!tab || !tab.id) {
                throw new Error("Tab non creata correttamente");
              }

              currentTabId = tab.id;

              // Aggiorna il contatore delle iterazioni
              chrome.storage.local.set({ currentIteration: iteration }, () => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Errore aggiornamento iterazione:",
                    chrome.runtime.lastError,
                  );
                }
              });

              // Aspetta che la pagina sia completamente caricata
              let retries = 0;
              const maxRetries = 30; // Max 30 secondi di attesa
              const waitForPageLoad = () => {
                chrome.tabs.get(tab.id, (currentTab) => {
                  if (chrome.runtime.lastError) {
                    console.log(
                      "Tab chiusa o errore:",
                      chrome.runtime.lastError,
                    );
                    return;
                  }

                  if (currentTab.status === "complete") {
                    // Pagina caricata, ora esegui lo script
                    console.log("Pagina Bing caricata, compilo il form...");

                    // Genera un closeDelay casuale tra min e max
                    const actualCloseDelay = getRandomInRange(
                      params.closeDelayMin,
                      params.closeDelayMax,
                    );
                    console.log(
                      `Chiusura tab programmata tra ${params.closeDelayMin}-${params.closeDelayMax}s (casuale: ${actualCloseDelay}s)`,
                    );

                    // Programma la chiusura della tab SUBITO (prima di eseguire lo script)
                    // Questo garantisce che il timeout venga impostato anche se il callback di executeScript non viene chiamato
                    closeTimeout = setTimeout(() => {
                      chrome.tabs.remove(tab.id, () => {
                        if (chrome.runtime.lastError) {
                          console.log(
                            "Tab già chiusa o errore:",
                            chrome.runtime.lastError,
                          );
                        }
                        currentTabId = null;

                        // Se abbiamo completato tutte le ricerche, ferma il ciclo
                        if (iteration >= params.totalSearches) {
                          console.log("Tutte le ricerche completate!");
                          chrome.storage.local.set({
                            isRunning: false,
                            currentIteration: params.totalSearches,
                          });
                          return;
                        }

                        // Genera un searchDelay casuale tra min e max
                        const actualSearchDelay = getRandomInRange(
                          params.searchDelayMin,
                          params.searchDelayMax,
                        );
                        console.log(
                          `Prossima ricerca tra ${params.searchDelayMin}-${params.searchDelayMax}s (casuale: ${actualSearchDelay}s)`,
                        );

                        // Usa alarm se delay > 30 secondi (per evitare sleep del service worker)
                        // Altrimenti usa setTimeout normale
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

                    // Ora esegui lo script (il timeout è già programmato)
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
                        } else {
                          console.log("Ricerca compilata e inviata");
                        }
                      },
                    );
                  } else if (retries < maxRetries) {
                    // Ancora in caricamento, riprova fra 1 secondo
                    retries++;
                    setTimeout(waitForPageLoad, 1000);
                  } else {
                    // Timeout, procedi comunque
                    console.log("Timeout caricamento pagina, procedo comunque");

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

              // Inizia l'attesa del caricamento
              waitForPageLoad();
            } catch (error) {
              console.error("Errore nella callback di tabs.create:", error);
              chrome.storage.local.set({
                isRunning: false,
                lastError: `Errore creazione tab: ${error.message}`,
              });
            }
          },
        );
      } catch (error) {
        console.error("Errore in performSearch callback:", error);
        chrome.storage.local.set({
          isRunning: false,
          lastError: error.message,
        });
      }
    });
  } catch (error) {
    console.error("Errore critico in performSearch:", error);
    chrome.storage.local.set({
      isRunning: false,
      lastError: `Errore critico: ${error.message}`,
    });
  }
}

/**
 * Avvia il ciclo di ricerche
 * @param {Object} params - Parametri passati direttamente dal popup
 */
function startSearchCycle(params) {
  try {
    console.log("startSearchCycle chiamato con parametri:", params);

    // Verifica che i parametri siano validi
    if (!params || typeof params !== "object") {
      throw new Error("Parametri mancanti o non validi");
    }

    if (
      params.closeDelayMin < 1 ||
      params.closeDelayMax < 1 ||
      params.searchDelayMin < 1 ||
      params.searchDelayMax < 1 ||
      params.totalSearches < 1
    ) {
      throw new Error(
        `Parametri non validi: closeDelayMin=${params.closeDelayMin}, closeDelayMax=${params.closeDelayMax}, searchDelayMin=${params.searchDelayMin}, searchDelayMax=${params.searchDelayMax}, totalSearches=${params.totalSearches}`,
      );
    }

    // Imposta isRunning = true nel service worker
    chrome.storage.local.set({ isRunning: true }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Errore impostazione isRunning:",
          chrome.runtime.lastError,
        );
      }
    });

    console.log("Avvio ciclo di ricerca");

    // Avvia la prima ricerca
    performSearch(1, params);
  } catch (error) {
    console.error("Errore critico in startSearchCycle:", error);
    chrome.storage.local.set({
      isRunning: false,
      lastError: `Errore critico avvio: ${error.message}`,
    });
  }
}

// Listener per i messaggi dal popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    console.log("Messaggio ricevuto:", message);

    if (message.action === "start") {
      try {
        // Verifica che i parametri siano presenti
        if (!message.params) {
          throw new Error("Parametri mancanti nel messaggio");
        }

        stopSearch(); // Ferma eventuali ricerche in corso
        startSearchCycle(message.params); // Passa i parametri direttamente
        sendResponse({ success: true });
        console.log("Start command processato con successo");
      } catch (error) {
        console.error("Errore durante start:", error);
        chrome.storage.local.set({
          isRunning: false,
          lastError: `Errore start: ${error.message}`,
        });
        sendResponse({ success: false, error: error.message });
      }
    } else if (message.action === "stop") {
      try {
        stopSearch();
        sendResponse({ success: true });
        console.log("Stop command processato con successo");
      } catch (error) {
        console.error("Errore durante stop:", error);
        sendResponse({ success: false, error: error.message });
      }
    } else {
      sendResponse({ success: false, error: "Azione non riconosciuta" });
    }
  } catch (error) {
    console.error("Errore critico nel message listener:", error);
    sendResponse({ success: false, error: `Errore critico: ${error.message}` });
  }
  return true;
});

// Listener per quando l'estensione viene installata o aggiornata
chrome.runtime.onInstalled.addListener(() => {
  console.log("Bing Auto Search installata");
  // Inizializza i valori di default se non esistono
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

// Gestisci la chiusura improvvisa dell'estensione
chrome.runtime.onSuspend.addListener(() => {
  stopSearch();
});
