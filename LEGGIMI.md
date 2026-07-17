# Forma personale

Questa è una prima versione funzionante e gratuita dell’app personale. Include:

- valutazione giornaliera del recupero;
- settimana adattiva con massimo tre sedute in palestra;
- piano alimentare iniziale per ricomposizione corporea;
- sostituzione degli alimenti con alternative della stessa funzione nel pasto;
- apprendimento locale di gusti, rifiuti e sostituzioni;
- sincronizzazione automatica dei dati sanitari tramite Comandi Rapidi e Cloudflare;
- inserimento manuale o importazione JSON come alternative;
- funzionamento offline dopo il primo caricamento.

## Come provarla

Apri la cartella con un piccolo server web locale oppure pubblicala su GitHub Pages. Non aprire semplicemente `index.html` come file se vuoi verificare anche installazione e funzionamento offline.

Una volta pubblicata:

1. apri l’indirizzo con Safari sull’iPhone;
2. tocca **Condividi**;
3. scegli **Aggiungi alla schermata Home**;
4. apri **Forma** dalla nuova icona.

Profilo, preferenze e storico vengono conservati nel browser dell’iPhone. Non sono presenti account, pubblicità o analytics. Per la sincronizzazione, soltanto l’ultimo pacchetto transita cifrato tramite Cloudflare, protetto da una chiave privata e cancellato dopo l’importazione o entro sette giorni.

## Alimentazione

Il piano mostrato è un punto di partenza, non una prescrizione clinica. Il target proteico iniziale è calcolato a partire dal peso e il piano energetico viene indicato come provvisorio. Dopo 14 giorni di peso e attività, l’app può valutare se l’andamento è troppo rapido, fermo o compatibile con una ricomposizione graduale.

La parte dedicata a frutta e verdura usa un’esposizione graduale: una piccola prova, nel formato più tollerabile, poi una valutazione. L’app non considera integratori o alimenti non vegetali come sostituti perfetti di frutta e verdura.

## Dati Apple Health

La PWA non può leggere direttamente HealthKit. La sezione **Dati** accetta:

- sincronizzazione automatica dal Comando Rapido;
- inserimento manuale;
- un file JSON con lo schema di `forma-health-esempio.json` creato da Comandi Rapidi.

Consulta [GUIDA-COMANDO-RAPIDO.md](GUIDA-COMANDO-RAPIDO.md) per la configurazione.

## Fonti principali

- [OMS — Healthy diet](https://www.who.int/en/news-room/fact-sheets/detail/healthy-diet)
- [CREA — Linee guida per una sana alimentazione](https://www.crea.gov.it/en/web/alimenti-e-nutrizione/-/linee-guida-per-una-sana-alimentazione-2018)
- [Australian Institute of Sport — Protein](https://www.ausport.gov.au/ais/nutrition/supplements/group_a/sports-foods2/isolated-protein-supplement2/what-is-it)
