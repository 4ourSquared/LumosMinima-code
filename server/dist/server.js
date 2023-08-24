"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AreaRoutes_1 = __importDefault(require("./routes/AreaRoutes"));
const LampRoutes_1 = __importDefault(require("./routes/LampRoutes"));
const SensorRoutes_1 = __importDefault(require("./routes/SensorRoutes"));
const MovimentoRoutes_1 = __importDefault(require("./routes/MovimentoRoutes"));
const TokenRoutes_1 = __importDefault(require("./routes/TokenRoutes"));
/*
    SERVER: questo file al momento rappresenta il server in tutto e per tutto. Al suo interno si trovano tutti i metodi attualmente sviluppati per la gestione delle richieste in arrivo
            dal client
*/
/*
------------------------------------------------------------------------------
                        CONFIGURAZIONE DEL SERVER
------------------------------------------------------------------------------
*/
const cors = require("cors"); // Per la configurazione di un certificato valido che permetta lo scambio di informazioni tra due endpoint senza l'utilizzo di proxy
const app = (0, express_1.default)(); // Per il routing e il middleware
const port = 5000;
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
/*
------------------------------------------------------------------------------
                        COLLEGAMENTO AL DATABASE
------------------------------------------------------------------------------
*/
const mongoose_1 = __importDefault(require("mongoose"));
const mongoURI = "mongodb://lumosminima-code-db-1:27017/lumosminima";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose_1.default.connect(mongoURI /*, options*/);
mongoose_1.default.pluralize(null);
const db = mongoose_1.default.connection;
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
app.use("/api/aree", AreaRoutes_1.default);
app.use("/api/aree", LampRoutes_1.default);
app.use("/api/aree", SensorRoutes_1.default);
app.use("/api/movimento/aree", MovimentoRoutes_1.default);
app.use("/api/movimento/token/aree", TokenRoutes_1.default);
// Accesso alla pagina
app.get("/", (req, res) => {
    console.log("Ricevuta richiesta GET su /");
    res.status(200).send();
});
// Porta di ascolto predefinita per il server
app.listen(port, () => {
    console.log("Il server è in ascolto sulla porta 5000");
});
// TODO: bisognerà unire i file MovimentoRoutes e TokenRoutes in un file singolo visto che le routine sono dello stesso tipo e hanno lo stesso obiettivo solo che lo fanno in due modi diversi
