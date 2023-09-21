"use strict";
/*
    Lo scopo di questo script è quello di gestire le routes per le richieste relative alle aree illuminate in arrivo al server
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthByRole_1 = __importStar(require("../middleware/AuthByRole"));
const VerifyToken_1 = __importDefault(require("../middleware/VerifyToken"));
const AreaSchema_1 = __importDefault(require("../schemas/AreaSchema"));
const Schedule_1 = require("../utils/Schedule");
const areaRouter = (0, express_1.Router)();
// Recupero della lista di aree illuminate
areaRouter.get("/", [VerifyToken_1.default, (0, AuthByRole_1.default)([AuthByRole_1.Role.Any])], async (req, res) => {
    console.log(`Ricevuta richiesta GET su /api/aree/`);
    try {
        const aree = await AreaSchema_1.default.find();
        res.status(200).json(aree);
    }
    catch (error) {
        console.error("Errore durante il recupero delle aree illuminate dal database:", error);
        res
            .status(500)
            .send("Errore durante il recupero delle aree illuminate dal database");
    }
});
// Recupero delle informazioni di una singola area
areaRouter.get("/:id", [VerifyToken_1.default, (0, AuthByRole_1.default)([AuthByRole_1.Role.Any])], async (req, res) => {
    const { id } = req.params;
    console.log(`Ricevuta richiesta GET su /api/aree/${id}/`);
    try {
        const area = await AreaSchema_1.default.findOne({ id: parseInt(id, 10) });
        if (area) {
            res.status(200).json(area);
        }
        else {
            res
                .status(404)
                .json({
                error: "Errore nel recupero di una singola area illuminata: area illuminata non trovata.",
            });
        }
    }
    catch (error) {
        console.error("Errore nel recupero di una singola area illuminata:", error);
        res
            .status(500)
            .send("Errore nel recupero di una singola area illuminata");
    }
});
// Creazione di una nuova area
areaRouter.post("/", [VerifyToken_1.default, (0, AuthByRole_1.default)([AuthByRole_1.Role.Amministratore])], async (req, res) => {
    console.log(`Ricevuta richiesta POST su /api/aree/`);
    const { nome, descrizione, latitudine, longitudine, polling, sensori, lampioni, } = req.body;
    parseInt(polling, 10);
    const id = await generateIdAree();
    const newArea = new AreaSchema_1.default({
        id,
        nome,
        descrizione,
        latitudine,
        longitudine,
        polling,
        sensori,
        lampioni,
    });
    try {
        const savedArea = await newArea.save();
        (0, Schedule_1.updateSchedule)(savedArea._id);
        res.status(200).json(savedArea);
    }
    catch (error) {
        console.error("Errore durante la creazione dell'area illuminata nel database:", error);
        res
            .status(500)
            .send("Errore durante la creazione dell'area illuminata nel database");
    }
});
async function generateIdAree() {
    try {
        const maxId = await AreaSchema_1.default.findOne()
            .sort({ id: -1 })
            .select("id")
            .exec();
        return maxId ? maxId.id + 1 : 1;
    }
    catch (error) {
        console.error("Errore durante il recupero dell'ultimo ID:", error);
        throw new Error("Errore durante la generazione dell'ID incrementale");
    }
}
// Modifica di una area
areaRouter.put("/edit/:id", [VerifyToken_1.default, (0, AuthByRole_1.default)([AuthByRole_1.Role.Amministratore])], async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const areaToUpdate = await AreaSchema_1.default.findOne({ id });
        console.log(`Ricevuta richiesta PUT su /api/aree/edit -> ID: ${id}`);
        if (!areaToUpdate) {
            res
                .status(404)
                .send(`Errore nel processo di modifica di un'area: area con id = ${id} non trovato`);
            return;
        }
        if (req.body.nome !== undefined) {
            areaToUpdate.nome = req.body.nome;
        }
        if (req.body.descrizione !== undefined) {
            areaToUpdate.descrizione = req.body.descrizione;
        }
        if (req.body.latitudine !== undefined) {
            areaToUpdate.latitudine = req.body.latitudine;
        }
        if (req.body.longitudine !== undefined) {
            areaToUpdate.longitudine = req.body.longitudine;
        }
        if (req.body.polling !== undefined) {
            areaToUpdate.polling = parseInt(req.body.polling, 10);
        }
        await areaToUpdate.save();
        (0, Schedule_1.updateSchedule)(areaToUpdate._id);
        res
            .status(200)
            .send(`Area illuminata con id = ${id} aggiornato con successo`);
    }
    catch (error) {
        console.error("Errore nel processo di modifica di un'area:", error);
        res.status(500).send("Errore nel processo di modifica di un'area");
    }
});
// Eliminazione di una area
areaRouter.delete("/:id", [VerifyToken_1.default, (0, AuthByRole_1.default)([AuthByRole_1.Role.Amministratore])], async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`Ricevuta richiesta DELETE su /api/aree/${id}/`);
    try {
        const deletedArea = await AreaSchema_1.default.findOne({ id });
        const result = await AreaSchema_1.default.deleteOne({ id });
        if (result.deletedCount === 0) {
            res
                .status(404)
                .send(`Errore nel processo di eliminazione di un'area: area illuminata con id = ${id} non trovata`);
            return;
        }
        if (deletedArea)
            (0, Schedule_1.updateSchedule)(deletedArea._id);
        res
            .status(200)
            .send(`Area illuminata con id = ${id} eliminato con successo`);
    }
    catch (error) {
        console.error("Errore nel processo di eliminazione di un'area:", error);
        res.status(500).send("Errore nel processo di eliminazione di un'area");
    }
});
exports.default = areaRouter;
