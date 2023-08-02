"use strict";
/*
    Lo scopo di questo script è quello di gestire le routes per le richieste relative ai sensori in arrivo al server
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sensoreSchema_1 = __importDefault(require("../schemas/sensoreSchema"));
const areaSchema_1 = __importDefault(require("../schemas/areaSchema"));
const sensRouter = (0, express_1.Router)();
sensRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sensori = yield sensoreSchema_1.default.find();
        res.status(200).json(sensori);
    }
    catch (error) {
        console.error("Errore durante il recupero dei sensori dal database:", error);
        res.status(500).send("Errore durante il recupero dei sensori dal database");
    }
}));
sensRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const sensore = yield sensoreSchema_1.default.findOne({ id: parseInt(id, 10) });
        if (sensore) {
            res.status(200).json(sensore);
        }
        else {
            res.status(404).json({ error: "Sensore non trovato." });
        }
    }
    catch (error) {
        console.error("Errore durante il recupero del sensore dal database:", error);
        res.status(500).send("Errore durante il recupero del sensore dal database");
    }
}));
sensRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iter, IP, luogo, raggio, area } = req.body;
    try {
        const id = yield generateIdSensori();
        const newSensore = new sensoreSchema_1.default({
            id,
            iter,
            IP,
            luogo,
            raggio: parseInt(raggio, 10),
            area: parseInt(area, 10),
        });
        const savedSensore = yield newSensore.save();
        try {
            const designedArea = yield areaSchema_1.default.findOne({ id: parseInt(area, 10) });
            if (!designedArea) {
                res.status(404).json({ error: "Area illuminata per l'inserimento del sensore non trovata" });
            }
            else {
                console.log("Area Trovata!");
                designedArea.sensori.push(newSensore.id);
                designedArea.save();
                console.log(designedArea);
            }
        }
        catch (error) {
            console.error("Errore durante il recupero dell'area illuminata dal database:", error);
            res.status(500).send("Errore durante il recupero dell'area illuminata dal database");
        }
        res.status(200).json(savedSensore);
    }
    catch (error) {
        console.error("Errore durante l'inserimento del sensore nel database:", error);
        res.status(500).send("Errore durante l'inserimento del sensore nel database");
    }
}));
function generateIdSensori() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const maxId = yield sensoreSchema_1.default
                .findOne()
                .sort({ id: -1 })
                .select("id")
                .exec();
            return maxId ? maxId.id + 1 : 1;
        }
        catch (error) {
            console.error("Errore durante il recupero dell'ultimo ID:", error);
            throw new Error("Errore durante la generazione dell'ID incrementale");
        }
    });
}
sensRouter.put("/edit/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const sensoreToUpdate = yield sensoreSchema_1.default.findOne({ id });
        console.log(`Ricevuta richiesta PUT su /api/sensori/edit -> ID: ${id}`);
        console.log("Richiesta aggiornamento di un sensore esistente");
        if (!sensoreToUpdate) {
            res.status(404).send(`Sensore con id = ${id} non trovato`);
            return;
        }
        if (req.body.iter !== undefined) {
            sensoreToUpdate.iter = req.body.iter;
        }
        if (req.body.IP !== undefined) {
            sensoreToUpdate.IP = req.body.IP;
        }
        if (req.body.luogo !== undefined) {
            sensoreToUpdate.luogo = req.body.luogo;
        }
        if (req.body.raggio !== undefined) {
            sensoreToUpdate.raggio = parseInt(req.body.raggio, 10);
        }
        yield sensoreToUpdate.save();
        res.status(200).send(`Sensore con id = ${id} aggiornato con successo`);
    }
    catch (error) {
        console.error("Errore durante l'aggiornamento del sensore:", error);
        res.status(500).send("Errore durante l'aggiornamento del sensore");
    }
}));
sensRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const result = yield sensoreSchema_1.default.deleteOne({ id });
        if (result.deletedCount === 0) {
            res.status(404).send(`Sensore con id = ${id} non trovato`);
            return;
        }
        res.status(200).send(`Sensore con id = ${id} eliminato con successo`);
    }
    catch (error) {
        console.error("Errore durante l'eliminazione del sensore:", error);
        res.status(500).send("Errore durante l'eliminazione del sensore");
    }
}));
exports.default = sensRouter;
