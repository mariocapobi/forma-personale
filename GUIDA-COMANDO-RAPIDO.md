# Collegare i dati Salute con Comandi Rapidi

La prima versione usa un passaggio semplice e privato: Comandi Rapidi prepara un file JSON in iCloud Drive e Forma lo importa. Il file resta sotto il tuo controllo.

## Prima prova

Per verificare subito il funzionamento:

1. apri Forma e vai in **Dati**;
2. seleziona **Importa JSON**;
3. scegli `forma-health-esempio.json`;
4. controlla che il punteggio di recupero e l’allenamento cambino.

## Dizionario richiesto

Il Comando Rapido deve produrre un dizionario con questi nomi esatti:

```json
{
  "date": "2026-07-17",
  "sleepHours": 7.2,
  "sleepBaseline": 7.5,
  "hrv": 54,
  "hrvBaseline": 52,
  "restingHR": 58,
  "restingHRBaseline": 59,
  "energy": 7,
  "soreness": 3,
  "activeEnergy": 680,
  "weight": 82
}
```

Le medie di sonno, HRV e frequenza a riposo dovrebbero riferirsi indicativamente agli ultimi 21–28 giorni. All’inizio puoi copiarle dall’app Salute e aggiornarle ogni settimana.

## Struttura del Comando Rapido

1. Crea un nuovo comando chiamato **Esporta dati Forma**.
2. Aggiungi le azioni **Trova campioni sanitari** per recuperare l’ultimo valore disponibile di:
   - variabilità della frequenza cardiaca;
   - frequenza cardiaca a riposo;
   - peso;
   - energia attiva della giornata.
3. Per il sonno usa il totale della notte appena conclusa mostrato in Salute. La gestione automatica delle diverse fasi del sonno richiede attenzione per evitare di sommare campioni sovrapposti; nella prima versione è più affidabile inserirlo manualmente.
4. Aggiungi due richieste numeriche rapide per **energia percepita** e **indolenzimento**, entrambe da 1 a 10.
5. Crea un’azione **Dizionario** usando i nomi dello schema precedente.
6. Converti il dizionario in JSON e salvalo come `forma-health.json` in una cartella di iCloud Drive, sostituendo il file precedente.
7. In Forma, apri **Dati → Importa JSON** e scegli il file.

I nomi delle azioni possono cambiare leggermente in base alla versione e alla lingua di iOS. Comandi Rapidi chiederà l’autorizzazione prima di leggere dati sanitari.

## Limite della soluzione gratuita

Safari non consente a una PWA di interrogare direttamente HealthKit. Per questo l’importazione richiede un gesto dell’utente. La lettura completamente automatica in background richiederebbe una vera app iOS firmata.
