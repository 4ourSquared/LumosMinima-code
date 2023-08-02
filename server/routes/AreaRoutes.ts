/*
    Lo scopo di questo script è quello di gestire le routes per le richieste relative alle aree illuminate in arrivo al server
*/

import { Router, Request, Response } from "express";
import AreaSchema from "../schemas/AreaSchema";

const areaRouter = Router();


areaRouter.get("/", async (req: Request, res: Response) => {
    try {
        const aree = await AreaSchema.find();
        res.status(200).json(aree);
    } catch (error) {
        console.error(
            "Errore durante il recupero delle aree illuminate dal database:",
            error
        );
        res.status(500).send(
            "Errore durante il recupero delle aree illuminate dal database"
        );
    }
});

areaRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const area = await AreaSchema.findOne({ id: parseInt(id, 10) });
        if (area) {
            res.status(200).json(area);
        } else {
            res.status(404).json({ error: "Area illuminata non trovato." });
        }
    } catch (error) {
        console.error(
            "Errore durante il recupero dell'area illuminata dal database:",
            error
        );
        res.status(500).send(
            "Errore durante il recupero dell'area illuminata dal database"
        );
    }
});

areaRouter.post("/", async (req: Request, res: Response) => {
    const { nome, descrizione, latitudine, longitudine, sensori, lampioni } =
        req.body;
    const id: number = await generateIdAree();
    const newArea = new AreaSchema({
        id,
        nome,
        descrizione,
        latitudine,
        longitudine,
        sensori,
        lampioni,
    });

    try {
        const savedArea = await newArea.save();
        res.status(200).json(savedArea);
    } catch (error) {
        console.error(
            "Errore durante l'inserimento dell'area illuminata nel database:",
            error
        );
        res.status(500).send(
            "Errore durante l'inserimento dell'area illuminata nel database"
        );
    }
});

async function generateIdAree(): Promise<number> {
    try {
        const maxId = await AreaSchema.findOne()
            .sort({ id: -1 })
            .select("id")
            .exec();
        return maxId ? maxId.id + 1 : 1;
    } catch (error) {
        console.error("Errore durante il recupero dell'ultimo ID:", error);
        throw new Error("Errore durante la generazione dell'ID incrementale");
    }
}

areaRouter.put("/edit/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const areaToUpdate = await AreaSchema.findOne({ id });

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

        await areaToUpdate.save();

        res.status(200).send(
            `Area illuminata con id = ${id} aggiornato con successo`
        );
    } catch (error) {
        console.error(
            "Errore durante l'aggiornamento dell'area illuminata:",
            error
        );
        res.status(500).send(
            "Errore durante l'aggiornamento dell'area illuminata"
        );
    }
});

areaRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const result = await AreaSchema.deleteOne({ id });

        if (result.deletedCount === 0) {
            res.status(404).send(`Area illuminata con id = ${id} non trovato`);
            return;
        }

        res.status(200).send(
            `Area illuminata con id = ${id} eliminato con successo`
        );
    } catch (error) {
        console.error(
            "Errore durante l'eliminazione dell'area illuminata:",
            error
        );
        res.status(500).send(
            "Errore durante l'eliminazione dell'area illuminata"
        );
    }
});

export default areaRouter;
