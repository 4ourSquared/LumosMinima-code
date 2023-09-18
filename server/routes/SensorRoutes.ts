/*
    Lo scopo di questo script è quello di gestire le routes per le richieste relative ai sensori in arrivo al server
*/

import { Router, Request, Response } from "express";
import SensoreSchema, { ISensorSchema } from "../schemas/SensorSchema";
import AreaSchema from "../schemas/AreaSchema";
import verifyToken from "../middleware/VerifyToken"
import authByRole, {Role} from "../middleware/AuthByRole"

const sensRouter = Router();

// Recupero di tutti i sensori dell'area
sensRouter.get("/:id/sensori", async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(
        `Ricevuta richiesta GET su /api/aree/${id}/`
    );
    try {
        const area = await AreaSchema.findOne({ id: parseInt(id, 10) });
        if (area) {
            res.status(200).json(area.sensori);
        } else {
            res.status(404).json({ error: "Errore nel recupero delle informazioni di tutti i sensori dell'area: area non trovata " });
        }
    } catch (error) {
        console.error(
            "Errore nel recupero delle informazioni di tutti i sensori dell'area:",
            error
        );
        res.status(500).send(
            "Errore nel recupero delle informazioni di tutti i sensori dell'area"
        );
    }
});

// Recupero di un singolo lampione dell'area
sensRouter.get("/:idA/sensori/:idS", async (req: Request, res: Response) => {
    const idA = req.params.idA;
    const idS = req.params.idS;
    parseInt(idA, 10);
    parseInt(idS, 10);
    console.log(
        `Ricevuta richiesta GET su /api/aree/${idA}/sensori/${idS}/ -> ID: ${idS}`
    );

    try {
        const area = await AreaSchema.findOne({ id: idA });
        if (area) {
            const sensore = area.sensori.find(
                (sens: any) => sens.id === parseInt(idS)
            );
            if (sensore) {
                res.status(200).json(sensore);
            } else {
                res.status(404).json({ error: "Errore nel recupero delle informazioni di un sensore: sensore non trovato" });
            }
        } else {
            res.status(404).json({ error: "Errore nel recupero delle informazioni di un sensore: area non trovata" });
        }
    } catch (error) {
        console.error("Errore nel recupero delle informazioni di un sensore:", error);
        res.status(500).send("Errore nel recupero delle informazioni di un sensore");
    }
});

// Aggiunta di un sensore all'area
sensRouter.post("/:id/sensori", async (req: Request, res: Response) => {
    try {
        // Recupero ID area
        const { id } = req.params;
        console.log(
            `Ricevuta richiesta POST su /api/aree/${id}/sensori/`
        );

        // Recupero Area
        const areaMod = await AreaSchema.findOne({ id: id });

        if (!areaMod) {
            res.status(400).json({ error: "Errore nel processo di creazione di un sensore: errore nel recupero dell'area" });
        } else {
            // Recupero nuovo sensore dalla richiesta
            const {IP, luogo, raggio, sig_time ,area } = req.body;
            parseInt(sig_time, 10);
            const id = await generateSensId(area);
            const newSens = new SensoreSchema({
                id,
                area: parseInt(area, 10),
                IP,
                luogo,
                raggio,
                sig_time
            });

            // Aggiunta del sensore all'array dell'area
            areaMod.sensori.push(newSens.toObject());
            const savedSensore = areaMod.save();
            res.status(200).json(savedSensore);
        }
    } catch (error) {
        console.error(
            "Errore nel processo di creazione di un sensore:",
            error
        );
        res.status(500).send(
            "Errore nel processo di creazione di un sensore"
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
                    if (req.body.IP !== undefined) {
                        sensore.IP = req.body.IP;
                    }
                    if (req.body.luogo !== undefined) {
                        sensore.luogo = req.body.luogo;
                    }
                    if (req.body.raggio !== undefined){
                        sensore.raggio = req.body.raggio;
                    }

                    if(req.body.sig_time !== undefined){
                        sensore.sig_time = req.body.sig_time;
                    }

                    await area.save();
                    res.status(200).send(
                        `Sensore con id = ${idS} modificato con successo`
                    );
                } else {
                    res.status(404).send(
                        `Errore nel processo di modifica di un sensore: sensore con id = ${idS} non trovato`
                    );
                }
            }
        } catch (error) {
            console.error("Errore nel processo di modifica di un sensore:", error);
            res.status(500).send("Errore nel processo di modifica di un sensore");
        }
    }
);

sensRouter.delete("/:idA/sensori/:idS",
    async (req: Request, res: Response) => {
        const { idA, idS } = req.params;
        parseInt(idA, 10);
        parseInt(idS, 10);

        console.log(
            `Ricevuta richiesta DELETE su /api/aree/${idA}/sensori/${idS}/`
        );

        try {
            const area = await AreaSchema.findOne({ id: idA });

            if (!area) {
                res.status(404).send(
                    "Errore nel processo di eliminazione di un sensore: errore nel recupero dell'area illuminata"
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
            console.error("Errore nel processo di eliminazione di un sensore:", error);
            res.status(500).send("Errore nel processo di eliminazione di un sensore");
        }
    }
);

export default sensRouter;
