FROM mongo:7.0.0-rc6-jammy

USER root

WORKDIR /db-dir

COPY entrypoint.sh ./entrypoint.sh
COPY testFiles/lamps.json ./lamps.json
COPY testFiles/sensori.json ./sensori.json
COPY testFiles/demo.json ./demo.json
COPY testFiles/script.js ./script.js

EXPOSE 27017

ENTRYPOINT ["/bin/bash", "./entrypoint.sh"]
CMD mongoimport --db lumosminima --collection lampioni --jsonArray --file ./lamps.json; mongoimport --db lumosminima --collection sensori --jsonArray --file ./sensori.json;mongoimport --db lumosminima --collection aree --jsonArray --file ./demo.json
