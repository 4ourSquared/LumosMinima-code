"use strict";
/*
    Lo scopo di questo script è quello di gestire le routes per le richieste relative alle aree illuminate in arrivo al server
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
const AreaSchema_1 = __importDefault(require("../schemas/AreaSchema"));
const areaRouter = (0, express_1.Router)();
areaRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const aree = yield AreaSchema_1.default.find();
        res.status(200).json(aree);
    }
    catch (error) {
        console.error("Errore durante il recupero delle aree illuminate dal database:", error);
        res.status(500).send("Errore durante il recupero delle aree illuminate dal database");
    }
}));
areaRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const area = yield AreaSchema_1.default.findOne({ id: parseInt(id, 10) });
        if (area) {
            res.status(200).json(area);
        }
        else {
            res.status(404).json({ error: "Area illuminata non trovato." });
        }
    }
    catch (error) {
        console.error("Errore durante il recupero dell'area illuminata dal database:", error);
        res.status(500).send("Errore durante il recupero dell'area illuminata dal database");
    }
}));
areaRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, descrizione, latitudine, longitudine, sensori, lampioni } = req.body;
    const id = yield generateIdAree();
    const newArea = new AreaSchema_1.default({
        id,
        nome,
        descrizione,
        latitudine,
        longitudine,
        sensori,
        lampioni,
    });
    try {
        const savedArea = yield newArea.save();
        res.status(200).json(savedArea);
    }
    catch (error) {
        console.error("Errore durante l'inserimento dell'area illuminata nel database:", error);
        res.status(500).send("Errore durante l'inserimento dell'area illuminata nel database");
    }
}));
function generateIdAree() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const maxId = yield AreaSchema_1.default.findOne()
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
areaRouter.put("/edit/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const areaToUpdate = yield AreaSchema_1.default.findOne({ id });
        console.log(`Ricevuta richiesta PUT su /api/aree/edit -> ID: ${id}`);
        console.log("Richiesta aggiornamento di un'area illuminata esistente");
        if (!areaToUpdate) {
            res.status(404).send(`Area con id = ${id} non trovato`);
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
        yield areaToUpdate.save();
        res.status(200).send(`Area illuminata con id = ${id} aggiornato con successo`);
    }
    catch (error) {
        console.error("Errore durante l'aggiornamento dell'area illuminata:", error);
        res.status(500).send("Errore durante l'aggiornamento dell'area illuminata");
    }
}));
areaRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const result = yield AreaSchema_1.default.deleteOne({ id });
        if (result.deletedCount === 0) {
            res.status(404).send(`Area illuminata con id = ${id} non trovato`);
            return;
        }
        res.status(200).send(`Area illuminata con id = ${id} eliminato con successo`);
    }
    catch (error) {
        console.error("Errore durante l'eliminazione dell'area illuminata:", error);
        res.status(500).send("Errore durante l'eliminazione dell'area illuminata");
    }
}));
exports.default = areaRouter;
