# Collegare Salute a Forma con Comandi Rapidi

Forma non può interrogare direttamente HealthKit perché è una PWA. Il Comando Rapido legge i dati autorizzati sull’iPhone e invia soltanto l’ultimo pacchetto a un piccolo servizio Cloudflare protetto da una chiave privata. Forma lo importa quando viene aperta e lo elimina subito; una copia non letta scade comunque entro sette giorni.

## Dizionario richiesto

Il Comando Rapido già creato può continuare a usare questi nomi:

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
  "weight": 90
}
```

Le medie di sonno, HRV e frequenza a riposo possono riferirsi agli ultimi 21–28 giorni. Energia percepita e indolenzimento rimangono un check-in da 1 a 10.

## Modifica finale del Comando Rapido

1. Dopo l’azione **Dizionario**, mantieni l’azione che lo converte in JSON.
2. Aggiungi **Ottieni contenuto dell’URL**.
3. Usa questo indirizzo: `https://forma-salute-sync.gemini-mario-io.workers.dev/sync`.
4. Imposta il metodo su **POST**.
5. Aggiungi l’intestazione `Authorization` con valore `Bearer CHIAVE_PRIVATA`, sostituendo `CHIAVE_PRIVATA` con la chiave ricevuta.
6. Aggiungi l’intestazione `Content-Type` con valore `application/json`.
7. Come corpo della richiesta scegli **File** e inserisci il risultato JSON del dizionario.
8. Alla prima esecuzione autorizza l’accesso ai dati Salute e alla rete.

I nomi delle azioni possono cambiare leggermente in base alla versione e alla lingua di iOS.

## Esecuzione automatica

1. In **Comandi Rapidi → Automazione**, crea un’automazione personale.
2. Scegli un orario successivo al risveglio, per esempio le 08:30.
3. Fai eseguire **Esporta dati Forma**.
4. Se disponibile, scegli **Esegui immediatamente** e disattiva la richiesta di conferma.

Il Comando Rapido aggiorna il pacchetto anche quando Forma è chiusa; Forma lo legge al successivo avvio o quando torna in primo piano.

## Alternativa senza passaggio online

Il vecchio metodo resta disponibile: salva il JSON in iCloud Drive e usa **Dati → Importa JSON**. In questo caso il trasferimento non è automatico.
