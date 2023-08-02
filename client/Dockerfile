# Usa l'immagine di base Node.js
FROM node:20-alpine
RUN npm install -g npm

# Imposta la directory di lavoro nell'app client
WORKDIR /client-dir

# Copia il package.json e il package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze del client
RUN npm install

# Copia tutto il codice sorgente nella directory di lavoro
COPY . .

EXPOSE 3000

# Avvia l'app client
CMD ["npm", "start"]