#!/bin/bash

# Start MongoDB server
mongod --bind_ip_all --port 27017 

# Wait for the server to be ready
until mongo --eval "print(\"Waiting for MongoDB to initialize...\")" >/dev/null 2>&1; do
    sleep 1
done

# Run additional setup commands if needed
# ...

# Keep the container running
tail -f /dev/null
