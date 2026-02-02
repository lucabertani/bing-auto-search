# 📋 Checklist di Test - Bing Auto Search

## Test Funzionali

### ✅ Installazione

- [ ] L'estensione si installa senza errori in Edge
- [ ] L'icona appare nella barra degli strumenti
- [ ] Il popup si apre correttamente al click

### ✅ Configurazione

- [ ] I campi input accettano valori numerici
- [ ] I valori vengono salvati correttamente
- [ ] I valori salvati vengono caricati alla riapertura del popup
- [ ] La validazione impedisce valori < 1
- [ ] La validazione impedisce Z > 200

### ✅ Funzionalità di Ricerca

- [ ] Il pulsante "Avvia" inizia il ciclo di ricerche
- [ ] Le tab si aprono con query Bing diverse
- [ ] Le tab si chiudono dopo X secondi
- [ ] C'è un'attesa di Y secondi tra le ricerche
- [ ] Il ciclo si ferma dopo Z ricerche
- [ ] Il contatore mostra il progresso corretto (es: 5/10)

### ✅ Funzionalità di Interruzione

- [ ] Il pulsante "Interrompi" ferma il ciclo immediatamente
- [ ] La tab corrente viene chiusa all'interruzione
- [ ] Non ci sono ricerche pendenti dopo l'interruzione
- [ ] Lo stato torna a "Pronto"

### ✅ Interfaccia Utente

- [ ] Il design è gradevole e moderno
- [ ] I pulsanti cambiano stato (abilitati/disabilitati) correttamente
- [ ] Lo stato viene aggiornato in tempo reale
- [ ] I messaggi di errore sono chiari
- [ ] Le animazioni funzionano correttamente

### ✅ Generazione Query

- [ ] Vengono generate esattamente 200 query
- [ ] Le query sono diverse tra loro
- [ ] Le query sono in italiano corretto
- [ ] Le ricerche usano query casuali dall'array

## Test Edge Cases

### ⚠️ Scenari Limite

- [ ] Avviare con valori minimi (X=1, Y=1, Z=1)
- [ ] Avviare con valori massimi (X=60, Y=60, Z=200)
- [ ] Interrompere immediatamente dopo l'avvio
- [ ] Interrompere durante la chiusura di una tab
- [ ] Chiudere il popup durante l'esecuzione
- [ ] Chiudere manualmente una tab di ricerca
- [ ] Avviare un nuovo ciclo mentre uno è in corso

## Test Performance

### 🚀 Prestazioni

- [ ] Le ricerche partono senza ritardi evidenti
- [ ] La memoria non aumenta eccessivamente
- [ ] Non ci sono memory leak dopo molte ricerche
- [ ] Il browser rimane reattivo durante le ricerche

## Test Permessi

### 🔒 Sicurezza

- [ ] L'estensione richiede solo i permessi necessari
- [ ] Non ci sono richieste di permessi aggiuntivi
- [ ] I dati sono salvati solo localmente

## Console Errors

### 🐛 Debug

- [ ] Nessun errore nella console del popup
- [ ] Nessun errore nella console del service worker
- [ ] I log mostrano le informazioni corrette

## Compatibilità

### 🌐 Browser

- [ ] Funziona su Microsoft Edge (Chromium)
- [ ] Funziona su Google Chrome (opzionale)

## Note

Versione testata: ****\_\_\_****
Data test: ****\_\_\_****
Tester: ****\_\_\_****

### Problemi riscontrati:

1. ***
2. ***
3. ***

### Suggerimenti:

1. ***
2. ***
3. ***
