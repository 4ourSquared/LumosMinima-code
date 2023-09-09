/*
    Lo scopo di questo script è quello di gestire le routes per le richieste relative alle aree illuminate in arrivo al server
*/

import { Router, Request, Response } from "express";
import AreaSchema from "../schemas/AreaSchema";
import { updateSchedule } from "../utils/Schedule";
import verifyToken from "../middleware/VerifyToken"
import authByRole, {Role} from "../middleware/AuthByRole"

const areaRouter = Router();

// Recupero della lista di aree illuminate
areaRouter.get("/", [verifyToken, authByRole([Role.Any])], async (req: Request, res: Response) => {
    console.log(
        `Ricevuta richiesta GET su /api/aree/`
    );
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

// Recupero delle informazioni di una singola area
areaRouter.get("/:id", [verifyToken, authByRole([Role.Any])], async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(
        `Ricevuta richiesta GET su /api/aree/${id}/`
    );
    try {
        const area = await AreaSchema.findOne({ id: parseInt(id, 10) });
        if (area) {
            res.status(200).json(area);
        } else {
            res.status(404).json({ error: "Errore nel recupero di una singola area illuminata: area illuminata non trovata." });
        }
    } catch (error) {
        console.error(
            "Errore nel recupero di una singola area illuminata:",
            error
        );
        res.status(500).send(
            "Errore nel recupero di una singola area illuminata"
        );
    }
});

// Creazione di una nuova area
areaRouter.post("/", [verifyToken, authByRole([Role.Amministratore])], async (req: Request, res: Response) => {
    console.log(
        `Ricevuta richiesta POST su /api/aree/`
    );
    const { nome, descrizione, latitudine, longitudine, polling, sensori, lampioni } = req.body;
    parseInt(polling, 10);

    const id: number = await generateIdAree();
    const newArea = new AreaSchema({
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
        updateSchedule(savedArea._id);
        res.status(200).json(savedArea);
    } catch (error) {
        console.error(
            "Errore durante la creazione dell'area illuminata nel database:",
            error
        );
        res.status(500).send(
            "Errore durante la creazione dell'area illuminata nel database"
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

// Modifica di una area
areaRouter.put("/edit/:id", [verifyToken, authByRole([Role.Amministratore])], async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const areaToUpdate = await AreaSchema.findOne({ id });

        console.log(`Ricevuta richiesta PUT su /api/aree/edit -> ID: ${id}`);

        if (!areaToUpdate) {
            res.status(404).send(`Errore nel processo di modifica di un'area: area con id = ${id} non trovato`);
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

        if(req.body.polling !== undefined){
            areaToUpdate.polling = parseInt(req.body.polling, 10);
        }

        await areaToUpdate.save();
        updateSchedule(areaToUpdate._id);

        res.status(200).send(
            `Area illuminata con id = ${id} aggiornato con successo`
        );
    } catch (error) {
        console.error(
            "Errore nel processo di modifica di un'area:",
            error
        );
        res.status(500).send(
            "Errore nel processo di modifica di un'area"
        );
    }
});

// Eliminazione di una area
areaRouter.delete("/:id", [verifyToken, authByRole([Role.Amministratore])], async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    console.log(
        `Ricevuta richiesta DELETE su /api/aree/${id}/`
    );
    try {
        const deletedArea = await AreaSchema.findOne({ id });
        const result = await AreaSchema.deleteOne({ id });

        if (result.deletedCount === 0) {
            res.status(404).send(`Errore nel processo di eliminazione di un'area: area illuminata con id = ${id} non trovata`);
            return;
        }

        if(deletedArea)
            updateSchedule(deletedArea._id);
        
        res.status(200).send(
            `Area illuminata con id = ${id} eliminato con successo`
        );
    } catch (error) {
        console.error(
            "Errore nel processo di eliminazione di un'area:",
            error
        );
        res.status(500).send(
            "Errore nel processo di eliminazione di un'area"
        );
    }
});


export default areaRouter;
