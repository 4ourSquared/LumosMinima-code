/*
    Lo scopo di questo script è quello di gestire le routes per le richieste relative ai sensori in arrivo al server
*/

import { Router, Request, Response } from "express";
import SensoreSchema, { ISensorSchema } from "../schemas/SensorSchema";
import AreaSchema from "../schemas/AreaSchema";

const sensRouter = Router();

sensRouter.get("/:id/sensori", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const area = await AreaSchema.findOne({ id: parseInt(id, 10) });
        if (area) {
            res.status(200).json(area.sensori);
        } else {
            res.status(404).json({ error: "Area non trovata." });
        }
    } catch (error) {
        console.error(
            "Errore durante il recupero dei sensori dall'area dal database:",
            error
        );
        res.status(500).send(
            "Errore durante il recupero dei sensori dall'area dal database"
        );
    }
});

sensRouter.get("/:idA/sensori/:idS", async (req: Request, res: Response) => {
    const idA = req.params.idA;
    const idS = req.params.idS;
    parseInt(idA, 10);
    parseInt(idS, 10);

    try {
        const area = await AreaSchema.findOne({ id: idA });
        if (area) {
            const sensore = area.sensori.find(
                (sens: any) => sens.id === parseInt(idS)
            );
            if (sensore) {
                res.status(200).json(sensore);
            } else {
                res.status(404).json({ error: "Sensore non trovato" });
            }
        } else {
            res.status(404).json({ error: "Area non trovata" });
        }
    } catch (error) {
        console.error("Errore durante il recupero del sensore:", error);
        res.status(500).send("Errore durante il recupero del sensore");
    }
});

sensRouter.post("/:id/sensori", async (req: Request, res: Response) => {
    try {
        // Recupero ID area
        const { id } = req.params;

        // Recupero Area
        const areaMod = await AreaSchema.findOne({ id: id });

        if (!areaMod) {
            res.status(400).json({ error: "Errore nel recupero dell'area" });
        } else {
            // Recupero nuovo sensore dalla richiesta
            const { iter, IP, luogo, raggio, area } = req.body;
            const id = await generateSensId(area);
            const newSens = new SensoreSchema({
                id,
                area: parseInt(area, 10),
                iter,
                IP,
                luogo,
                raggio,
            });

            // Aggiunta del sensore all'array dell'area
            areaMod.sensori.push(newSens.toObject());
            const savedSensore = areaMod.save();
            res.status(200).json(savedSensore);
        }
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

async function generateSensId(areaId: number): Promise<number> {
    try {
        const area = await AreaSchema.findOne({ id: areaId }).exec();

        if (!area) {
            throw new Error(`Area con ID ${areaId} non trovata.`);
        }

        const newSensId = area.sensori.length + 1;

        return newSensId;
    } catch (error) {
        console.error(
            "Errore durante la generazione dell'ID del sensore:",
            error
        );
        throw error;
    }
}

sensRouter.put("/:idA/sensori/edit/:idS",
    async (req: Request, res: Response) => {
        const idA = req.params.idA;
        const idS = req.params.idS;

        parseInt(idA, 10);
        parseInt(idS, 10);
        console.log(
            `Ricevuta richiesta PUT su /api/aree/${idA}/sensori/${idS}/edit -> ID: ${idS}`
        );

        try {
            const area = await AreaSchema.findOne({ id: idA });
            if (area) {
                const sensore = area.sensori.find(
                    (sens: ISensorSchema) => sens.id === parseInt(idS)
                );
                if (sensore) {
                    if (req.body.iter !== undefined) {
                        sensore.iter = req.body.iter;
                    }
                    if (req.body.IP !== undefined) {
                        sensore.IP = req.body.IP;
                    }
                    if (req.body.luogo !== undefined) {
                        sensore.luogo = req.body.luogo;
                    }
                    if (req.body.raggio !== undefined){
                        sensore.raggio = req.body.raggio;
                    }
                    await area.save();
                    res.status(200).send(
                        `Sensore con id = ${idS} modificato con successo`
                    );
                } else {
                    res.status(404).send(
                        `Sensore con id = ${idS} non trovato`
                    );
                }
            }
        } catch (error) {
            console.error("Errore durante la modifica del sensore:", error);
            res.status(500).send("Errore durante la modifica del sensore");
        }
    }
);

sensRouter.delete("/:idA/sensori/:idS",
    async (req: Request, res: Response) => {
        const { idA, idS } = req.params;
        parseInt(idA, 10);
        parseInt(idS, 10);

        try {
            const area = await AreaSchema.findOne({ id: idA });

            if (!area) {
                res.status(404).send(
                    "Errore nel recupero dell'area illuminata"
                );
                return;
            } else {
                area.sensori = area.sensori.filter(
                    (sens: ISensorSchema) => sens.id !== parseInt(idS)
                );
                await area.save();

                res.status(200).send("Sensore eliminato con successo");
            }
        } catch (error) {
            console.error("Errore durante l'eliminazione del sensore:", error);
            res.status(500).send("Errore durante l'eliminazione del sensore");
        }
    }
);

export default sensRouter;
