# Prerequisiti

Sul vostro sistema dovete avere installato Docker e Docker-compose, seguendo le istruzioni ai link di riferimento:
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/)

**ATTENZIONE**: su Windows, i comandi di Docker e Docker-compose funzioneranno solo qualora Docker Desktop sia avviato e il motore di virtualizzazione funzionante

# Comandi disponibili
I vari comandi che si possono eseguire al momento sono:
## `docker-compose build`
Il comando va utilizzato alla radice del progetto, nella directory PoC (detta anche `./`). Questo comando serve a costruire l'immagine del _Dockerfile_ e il suo contesto.

## `docker-compose up`
Il comando, come il precedente, va utilizzato in `./` e serve a costruire, creare, avviare  e attaccare i container per fornire il servizio.

## `docker-compose run <container> <istruzione>`
Questo tipo di comando, serve per avviare il container `<container>` ed eseguire la / le istruzione/i bash riportate in `<istruzione>`. 

# Info Generali
Qualora ci fosse da modificare la configurazione dei file `Dockerfile` o il `docker-compose.yaml`, di seguito vengono riportate alcune informazioni essenziali riguardanti quanto sopra citato.

## `Dockerfile`
Esistono due di questi file, uno situato in `./server` e uno situato in `./client`. Ovviamente, il loro scopo è quello di generare le immagini e i container rispettivamente del server (back-end) e del client(front-end).
Il `Dockerfile` relativo al DB non è presente in quanto al momento non necessario per la gestione del progetto.

### Dockerfile Server
All'interno di `./server/Dockerfile` troviamo, nel dettaglio:
- Importazione di `node 20`, ossia la versione più recente 
- Aggiornamento di `npm` alla versione più recente
- Creazione di una directory di lavoro dedicata, denominata `/server-dir`
- Importazione dei file contenenti l'indicazione dei pacchetti necessari per il funzionamento del server
- Installazione dei pacchetti recuperati nel punto precedente e aggiornamento di _Typescript_ e del suo compilatore alla versione più recente
- Importazione del file di configurazione di _Typescript_ e del suo compilatore
- Importazione del resto dei file necessari per il funzionamento del progetto (codice sorgente)
- Compilazione del progetto
- Apertura della porta [:5000](http://localhost:5000)
- Avvio del server

### Dockerfile Client
All'interno di `./client/Dockerfile` troviamo, nel dettaglio:
- Importazione di `node 20`, ossia la versione più recente 
- Aggiornamento di `npm` alla versione più recente
- Creazione di una directory di lavoro dedicata, denominata `/client-dir`
- Importazione dei file contenenti l'indicazione dei pacchetti necessari per il funzionamento del client
- Installazione dei pacchetti recuperati nel punto precedente
- Importazione del resto dei file necessari per il funzionamento del progetto (codice sorgente)
- Apertura della porta [:3000](http://localhost:3000)
- Avvio del server

## `docker-compose.yaml`
Questo particolare file situato in `./` ha il compito di unificare i tre container essenziali del progetto e di eseguirli nel corretto ordine e tramite un'unica istruzione. Nel dettaglio questo file:
- Utilizza la versione di _3.8_ di `docker-compose`
- Definisce il database utilizzando l'immagine ufficiale di MongoDB che sia la più recente, esponendo la porta [:27017](http://localhost:27017)
- Definisce il server costruendo l'immagine dal `Dockerfile` situato in `./server` ed esponendo la porta [:5000](http://localhost:5000), definendo il database come dipendenza
- Definisce il client costruendo l'immagine dal `Dockerfile` situato in `./client` ed esponendo la porta [:3000](http://localhost:3000), definendo il server come dipendenza (e quindi il database come dipendenza indiretta)