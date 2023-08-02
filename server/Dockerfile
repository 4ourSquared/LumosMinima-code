# Usa l'immagine di base Node.js
FROM node:20-alpine
RUN npm install -g npm

# Imposta la directory di lavoro all'interno del container
WORKDIR /server-dir

# Copia il package.json e il package-lock.json nella directory di lavoro
COPY ./package*.json ./

# Esegue l'installazione delle dipendenze
RUN npm install
RUN npm install typescript -g

# Copia il file tsconfig.json nella directory di lavoro
COPY ./tsconfig.json .

# Copia il resto del codice del server nella directory di lavoro
COPY . .

# Compila il codice TypeScript specificando il percorso di tsconfig.json
RUN tsc -p ./tsconfig.json

# Espone la porta 5000 per il server
EXPOSE 5000

# Comando di avvio del server
CMD npx tsc; node dist/server.js