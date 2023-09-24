import express, { Request, Response } from "express";
import mongoose from "mongoose";
import accountRoutes from "./routes/AccountRoutes";
import areaRoutes from "./routes/AreaRoutes";
import lampRoutes from "./routes/LampRoutes";
import sensRoutes from "./routes/SensorRoutes";

import cookieParser from "cookie-parser"; //per estrarre i cookie dalle richieste HTTP
import cors from "cors"; // Per la configurazione di un certificato valido che permetta lo scambio di informazioni tra due endpoint senza l'utilizzo di proxy

import signalRoutes from "./routes/SignalRoutes";

/*
    SERVER: questo file al momento rappresenta il server in tutto e per tutto. Al suo interno si trovano tutti i metodi attualmente sviluppati per la gestione delle richieste in arrivo
            dal client    
*/

/*
------------------------------------------------------------------------------
                        CONFIGURAZIONE DEL SERVER
------------------------------------------------------------------------------
*/

export const app = express(); // Per il routing e il middleware
const port = 5000;
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
------------------------------------------------------------------------------
                        COLLEGAMENTO AL DATABASE
------------------------------------------------------------------------------
*/

const mongoURI = "mongodb://lumosminima-code-db-1:27017/lumosminima";

mongoose.connect(mongoURI);
mongoose.pluralize(null);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Errore di connessione MongoDB:"));
db.once("open", () => {
  console.log("Connessione a MongoDB avvenuta con successo");
});

/*
------------------------------------------------------------------------------
                              CONFIGURAZIONE API
------------------------------------------------------------------------------
*/

// Collegamento alla route per i sensori
app.use("/accounting", accountRoutes);
app.use("/api/aree", areaRoutes);
app.use("/api/aree", lampRoutes);
app.use("/api/aree", sensRoutes);
app.use("/api/segnale", signalRoutes);

// Accesso alla pagina
app.get("/", (req, res) => {
  console.log("Ricevuta richiesta GET su /");
  res.status(200).send();
});

// Porta di ascolto predefinita per il server
export const server = app.listen(port, () => {
  console.log("Il server è in ascolto sulla porta 5000");
});

server.close(() => {
  db.close()
  console.log("Il server è stato chiuso");
});
