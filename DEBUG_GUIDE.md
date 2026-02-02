# 🐛 Guida al Debug - Bing Auto Search

## Come Visualizzare gli Errori

### 1. Console del Service Worker

Il service worker gestisce tutte le ricerche. Per vedere i suoi log:

1. Vai su `edge://extensions/`
2. Trova **Bing Auto Search**
3. Clicca su **"Ispeziona visualizzazioni: service worker"** (link blu)
4. Si aprirà la console del service worker

**Cosa cercare:**

- `Service Worker attivo e pronto!` - Il service worker è caricato
- `Bing Auto Search: 200 query generate` - Le query sono state create
- `Messaggio ricevuto: {action: "start"}` - Il messaggio dal popup è arrivato
- `Avvio ciclo di ricerca con parametri:` - I parametri sono stati caricati
- `Ricerca 1/10: "query..."` - Le ricerche stanno partendo

### 2. Console del Popup

Per vedere gli errori del popup:

1. Clicca con il tasto destro sull'icona dell'estensione
2. Seleziona **"Ispeziona"**
3. Si aprirà DevTools con la console del popup

### 3. Alert Automatici

Ora l'estensione mostra **alert automatici** per tutti gli errori:

- ❌ Errori di validazione input
- ❌ Errori di comunicazione con il service worker
- ❌ Errori durante l'apertura delle tab
- ❌ Errori di storage

## Problemi Comuni e Soluzioni

### ❌ Problema: "Errore comunicazione con service worker"

**Causa:** Il service worker non è attivo

**Soluzione:**

1. Vai su `edge://extensions/`
2. Clicca sul pulsante di ricarica (⟳) dell'estensione
3. Clicca su "Ispeziona visualizzazioni: service worker"
4. Verifica che vedi "Service Worker attivo e pronto!" nella console
5. Riprova ad avviare

### ❌ Problema: Va in esecuzione ma ritorna subito a "Pronto"

**Possibili cause:**

1. Il service worker si è disattivato
2. I permessi non sono stati concessi
3. Problema con chrome.tabs API

**Soluzione:**

1. Apri la console del service worker (vedi sopra)
2. Guarda se ci sono errori rossi
3. L'estensione ora salverà l'errore e lo mostrerà in un alert
4. Se vedi "Tab non creata correttamente", ricarica l'estensione

### ❌ Problema: "Permissions error" o "Cannot read properties"

**Causa:** Permessi mancanti

**Soluzione:**

1. Verifica che nel manifest.json ci siano:
   - `"permissions": ["storage", "tabs"]`
   - `"host_permissions": ["https://www.bing.com/*"]`
2. Ricarica l'estensione

### ❌ Problema: Le icone non si vedono

**Causa:** File PNG mancanti

**Soluzione:**

1. Apri `icons/generate-icons.html` nel browser
2. Scarica le 3 icone (icon16.png, icon48.png, icon128.png)
3. Salvale nella cartella `icons/`
4. Ricarica l'estensione

## Test Step-by-Step

### Test Completo

1. **Apri la console del service worker** (edge://extensions/ → Ispeziona service worker)
2. **Clicca sull'icona** dell'estensione per aprire il popup
3. **Imposta valori bassi** per test rapido:
   - X = 2 (secondi prima di chiudere)
   - Y = 1 (secondi tra ricerche)
   - Z = 3 (ricerche totali)
4. **Clicca "Avvia"**
5. **Verifica nella console del service worker:**
   ```
   Messaggio ricevuto: {action: "start"}
   Start command processato con successo
   startSearchCycle chiamato
   Parametri recuperati: {closeDelay: 2, searchDelay: 1, ...}
   Avvio ciclo di ricerca con parametri: {closeDelay: 2, ...}
   Ricerca 1/3: "che tempo fa oggi?"
   ```
6. **Verifica che si aprano 3 tab di Bing**
7. **Verifica che si chiudano automaticamente**

### Se Niente Funziona

1. Disinstalla l'estensione
2. Riavvia Edge
3. Reinstalla l'estensione
4. Apri prima la console del service worker
5. POI clicca sull'icona e prova ad avviare
6. Leggi TUTTI gli errori nella console

## Log Dettagliati

### Service Worker (background.js)

- ✅ `Service Worker attivo e pronto!`
- ✅ `Bing Auto Search: 200 query generate`
- ✅ `Messaggio ricevuto: {...}`
- ✅ `Start command processato con successo`
- ✅ `startSearchCycle chiamato`
- ✅ `Parametri recuperati: {...}`
- ✅ `Avvio ciclo di ricerca con parametri: {...}`
- ✅ `Ricerca N/Z: "query"`
- ✅ `Tutte le ricerche completate!`

### Errori Comuni

- ❌ `Storage error: ...` - Problema con chrome.storage
- ❌ `Errore apertura tab: ...` - Problema con chrome.tabs
- ❌ `Tab non creata correttamente` - chrome.tabs.create ha fallito
- ❌ `Parametri non validi: ...` - Valori non corretti

## Contatti

Se il problema persiste, fornisci:

1. Screenshot della console del service worker
2. Screenshot del popup con l'errore
3. Valori di X, Y, Z usati
4. Versione di Edge (`edge://version/`)
