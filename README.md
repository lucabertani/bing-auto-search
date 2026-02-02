# 🔍 Bing Auto Search - Estensione Microsoft Edge

Un'estensione per Microsoft Edge che esegue automaticamente ricerche su Bing con parametri configurabili.

## 📋 Funzionalità

- **Ricerche Automatiche**: Esegue ricerche automatiche su Bing utilizzando 200 query predefinite
- **Parametri Configurabili**:
  - **X**: Tempo (in secondi) prima di chiudere la tab
  - **Y**: Tempo (in secondi) di attesa prima della ricerca successiva
  - **Z**: Numero totale di ricerche da eseguire (max 200)
- **Controllo Completo**: Pulsanti per avviare e interrompere il ciclo di ricerche
- **Stato in Tempo Reale**: Visualizza il progresso delle ricerche (es: 5/10)
- **Query Intelligenti**: 200 query generate automaticamente con temi vari

## 📁 Struttura del Progetto

```
bing-auto-search/
├── manifest.json          # Configurazione dell'estensione (Manifest V3)
├── popup.html            # Interfaccia del popup
├── popup.js              # Logica del popup e gestione UI
├── background.js         # Service worker per gestire le ricerche
├── icons/                # Icone dell'estensione
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # Documentazione
```

## 🚀 Installazione

1. **Scarica o clona questo repository**
2. **Apri Microsoft Edge**
3. **Vai a**: `edge://extensions/`
4. **Abilita** la modalità sviluppatore (interruttore in basso a sinistra)
5. **Clicca** su "Carica estensione decompressa"
6. **Seleziona** la cartella `bing-auto-search`
7. **L'estensione** sarà ora installata e visibile nella barra degli strumenti

## 💡 Utilizzo

1. **Clicca sull'icona** dell'estensione nella barra degli strumenti di Edge
2. **Configura i parametri**:
   - Tempo prima di chiudere tab (X secondi): 1-60
   - Attesa prima della ricerca successiva (Y secondi): 1-60
   - Numero totale di ricerche (Z): 1-200
3. **Clicca su "Avvia"** per iniziare il ciclo di ricerche
4. **Monitora** il progresso nel popup (es: 5/10 ricerche)
5. **Clicca su "Interrompi"** per fermare immediatamente il ciclo

## 🔧 Dettagli Tecnici

### Manifest V3

L'estensione utilizza Manifest V3, l'ultima versione del sistema di estensioni di Chrome/Edge.

### Permessi Richiesti

- **storage**: Per salvare le configurazioni dell'utente
- **tabs**: Per aprire e chiudere le tab di ricerca

### Service Worker (background.js)

- Gestisce il ciclo di ricerche
- Genera automaticamente 200 query uniche
- Controlla i timeout per apertura/chiusura tab
- Gestisce l'interruzione sicura del ciclo

### Generazione Query

Le query sono generate automaticamente combinando:

- Template di domande comuni ("che tempo fa", "come si fa", ecc.)
- Soggetti e contesti ("oggi", "in Italia", "a Roma", ecc.)
- Argomenti vari (frutta, tecnologia, viaggi, animali, ecc.)
- Azioni (comprare, cucinare, installare, ecc.)

Esempi di query generate:

- "che tempo fa oggi?"
- "come cucinare pasta?"
- "dove comprare computer?"
- "quanto costa telefono?"
- "qual è il migliore ristorante?"

## 🎨 Interfaccia

Il popup presenta:

- Design moderno con gradiente viola
- Effetti glassmorphism (sfondo sfocato trasparente)
- Animazioni sui pulsanti
- Feedback visivo dello stato
- Validazione input in tempo reale

## ⚙️ Configurazione Default

- **X** (chiusura tab): 5 secondi
- **Y** (attesa): 3 secondi
- **Z** (ricerche totali): 10

## 🛡️ Sicurezza

- Nessun dato sensibile viene raccolto
- Le configurazioni sono salvate localmente nel browser
- L'estensione accede solo a bing.com
- Tutto il codice è trasparente e verificabile

## 📝 Note

- Le ricerche vengono aperte in tab in background per non disturbare la navigazione
- È possibile interrompere il ciclo in qualsiasi momento
- Le configurazioni vengono salvate automaticamente
- L'estensione si ferma automaticamente al completamento del numero di ricerche impostato

## 🐛 Troubleshooting

**L'estensione non si avvia:**

- Verifica che la modalità sviluppatore sia attiva
- Ricarica l'estensione da edge://extensions/

**Le ricerche non partono:**

- Controlla che i valori siano validi (minimo 1)
- Verifica i permessi dell'estensione

**Le tab non si chiudono:**

- Controlla la console di Edge (F12) per eventuali errori
- Ricarica l'estensione

## 📜 Licenza

Questo progetto è distribuito come codice libero per uso personale ed educativo.

## 👤 Autore

Creato con ❤️ per Microsoft Edge
