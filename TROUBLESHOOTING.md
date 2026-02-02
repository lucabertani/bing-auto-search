# 🚨 RISOLUZIONE PROBLEMA: "Va in esecuzione ma ritorna a Pronto"

## ⚠️ PROBLEMA COMUNE: ICONE MANCANTI

L'estensione potrebbe non funzionare se le **icone PNG non sono presenti**!

### ✅ SOLUZIONE IMMEDIATA

1. **Apri questo file nel browser**: `icons/generate-icons.html`
2. **Clicca sui 3 pulsanti** per scaricare:
   - icon16.png
   - icon48.png
   - icon128.png
3. **Salva i file** nella cartella `icons/`
4. **Vai su**: `edge://extensions/`
5. **Ricarica l'estensione** (pulsante ⟳)
6. **Riprova ad avviare**

## 🐛 COME VEDERE GLI ERRORI VERI

### Opzione 1: Usa il batch helper (WINDOWS)

1. Doppio click su `debug-helper.bat`
2. Segui le istruzioni

### Opzione 2: Manualmente

1. **Apri**: `edge://extensions/`
2. **Trova**: "Bing Auto Search"
3. **Clicca**: sul link blu "Ispeziona visualizzazioni: service worker"
4. **Si aprirà la console** con i log del service worker

### Cosa Dovresti Vedere

```
Bing Auto Search: 200 query generate
Service Worker attivo e pronto!
```

Se NON vedi questi messaggi, il service worker non è attivo!

## 📋 CHECKLIST DI DEBUG

### Step 1: Verifica File

- [ ] `manifest.json` esiste?
- [ ] `popup.html` esiste?
- [ ] `popup.js` esiste?
- [ ] `background.js` esiste?
- [ ] `icons/icon16.png` esiste? ⚠️ **IMPORTANTE**
- [ ] `icons/icon48.png` esiste? ⚠️ **IMPORTANTE**
- [ ] `icons/icon128.png` esiste? ⚠️ **IMPORTANTE**

### Step 2: Apri la Console del Service Worker

1. Vai su `edge://extensions/`
2. Abilita "Modalità sviluppatore" (in basso a sinistra)
3. Trova "Bing Auto Search"
4. Clicca su "Ispeziona visualizzazioni: service worker"

### Step 3: Verifica i Log

Dovresti vedere:

```
✅ Bing Auto Search: 200 query generate
✅ Service Worker attivo e pronto!
```

### Step 4: Testa l'Avvio

1. Clicca sull'icona dell'estensione
2. Imposta: X=2, Y=1, Z=3
3. Clicca "Avvia"

Nella console del service worker dovresti vedere:

```
✅ Messaggio ricevuto: {action: "start"}
✅ Start command processato con successo
✅ startSearchCycle chiamato
✅ Parametri recuperati: {closeDelay: 2, ...}
✅ Avvio ciclo di ricerca con parametri: {...}
✅ Ricerca 1/3: "che tempo fa oggi?"
```

### Step 5: Se Vedi Errori

Ora l'estensione mostra **ALERT** per ogni errore:

- ❌ Se vedi un alert → Leggi il messaggio e segnalalo
- ❌ Se nella console vedi errori rossi → Copia tutto il testo

## 🔧 SOLUZIONI RAPIDE

### Se il Service Worker non si avvia

```
1. Ricarica l'estensione (⟳)
2. Chiudi e riapri Edge
3. Disinstalla e reinstalla l'estensione
```

### Se vedi "Errore comunicazione con service worker"

```
1. Il service worker è morto
2. Vai su edge://extensions/
3. Clicca "Ispeziona visualizzazioni: service worker" per riattivarlo
4. Riprova
```

### Se le tab non si aprono

```
1. Verifica i permessi nel manifest.json:
   - "permissions": ["storage", "tabs"]
   - "host_permissions": ["https://www.bing.com/*"]
2. Ricarica l'estensione
```

### Se continua a non funzionare

```
1. Apri la console del service worker
2. Copia TUTTO il contenuto della console
3. Apri la console del popup (click destro su icona → Ispeziona)
4. Copia TUTTO il contenuto
5. Segnala entrambi
```

## 💡 TEST VELOCE

Apri la console del service worker e digita:

```javascript
chrome.storage.local.get(null, (data) => console.log(data));
```

Dovresti vedere:

```javascript
{
  closeDelay: 5,
  searchDelay: 3,
  totalSearches: 10,
  isRunning: false,
  currentIteration: 0
}
```

Se NON vedi nulla, c'è un problema con chrome.storage!

## 📞 SUPPORTO

Hai ancora problemi? Fornisci:

1. ✅ Screenshot della console del service worker
2. ✅ Screenshot del popup con alert dell'errore
3. ✅ Versione di Edge (`edge://version/`)
4. ✅ File manifest.json completo
