#!/bin/bash
#Start MongoDB server
mongod --bind_ip_all --port 27017

#Attendi che il server sia pronto
until mongo --eval "print(\"Waiting for MongoDB to initialize...\")" >/dev/null 2>&1; do
    sleep 1
done

#Comandi aggiuntivi se necessari vanno qui
#...

#Mantiene il container funzionante
tail -f /dev/null