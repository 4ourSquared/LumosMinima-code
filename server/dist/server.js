"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const AccountRoutes_1 = __importDefault(require("./routes/AccountRoutes"));
const AreaRoutes_1 = __importDefault(require("./routes/AreaRoutes"));
const LampRoutes_1 = __importDefault(require("./routes/LampRoutes"));
const SensorRoutes_1 = __importDefault(require("./routes/SensorRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser")); //per estrarre i cookie dalle richieste HTTP
const cors_1 = __importDefault(require("cors")); // Per la configurazione di un certificato valido che permetta lo scambio di informazioni tra due endpoint senza l'utilizzo di proxy
const SignalRoutes_1 = __importDefault(require("./routes/SignalRoutes"));
/*
    SERVER: questo file al momento rappresenta il server in tutto e per tutto. Al suo interno si trovano tutti i metodi attualmente sviluppati per la gestione delle richieste in arrivo
            dal client
*/
/*
------------------------------------------------------------------------------
                        CONFIGURAZIONE DEL SERVER
------------------------------------------------------------------------------
*/
exports.app = (0, express_1.default)(); // Per il routing e il middleware
const port = 5000;
exports.app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: false }));
/*
------------------------------------------------------------------------------
                        COLLEGAMENTO AL DATABASE
------------------------------------------------------------------------------
*/
const mongoURI = "mongodb://lumosminima-code-db-1:27017/lumosminima";
mongoose_1.default.connect(mongoURI);
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
exports.app.use("/accounting", AccountRoutes_1.default);
exports.app.use("/api/aree", AreaRoutes_1.default);
exports.app.use("/api/aree", LampRoutes_1.default);
exports.app.use("/api/aree", SensorRoutes_1.default);
exports.app.use("/api/segnale", SignalRoutes_1.default);
// Accesso alla pagina
exports.app.get("/", (req, res) => {
    console.log("Ricevuta richiesta GET su /");
    res.status(200).send();
});
// Porta di ascolto predefinita per il server
exports.app.listen(port, () => {
    console.log("Il server è in ascolto sulla porta 5000");
});
