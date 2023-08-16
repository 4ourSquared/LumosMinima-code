/*
    Lo scopo di questo script è quello di gestire le routes per le richieste relative ai lampioni in arrivo al server
*/

import { Router, Request, Response } from "express";
import LampioneSchema, { ILampSchema } from "../schemas/LampSchema";
import AreaSchema from "../schemas/AreaSchema";

const lampRouter = Router();

// Segnalazione guasto lampione
lampRouter.put(
    "/:idA/lampioni/guasti/:idL",
    async (req: Request, res: Response) => {
        const idA = req.params.idA;
        const idL = req.params.idL;

        console.log(
            `Ricevuta richiesta PUT su /api/aree/${idA}/lampioni/guasti/${idL}`
        );

        parseInt(idA, 10);
        parseInt(idL, 10);

        try {
            const area = await AreaSchema.findOne({ id: idA });

            if (area) {
                const lampione = area.lampioni.find(
                    (lamp: ILampSchema) => lamp.id === parseInt(idL)
                );

                if (lampione) {
                    if (!lampione.guasto) {
                        lampione.guasto = true;
                    } else {
                        res.status(409).send(
                            `Lampione già presente nella lista guasti!`
                        );
                        return;
                    }
                    await area.save();
                    res.status(200).send(
                        `Lampione con id = ${idL} segnalato come guasto`
                    );
                    return;
                } else {
                    res.status(404).send(
                        `Errore nel processo di segnalazione dei guasti di un lampione: lampione non trovato`
                    );
                }
            }
        } catch (error) {
            console.error(
                "Errore nel processo di segnalazione dei guasti di un lampione:",
                error
            );
            res.status(500).send(
                "Errore nel processo di segnalazione dei guasti di un lampione"
            );
        }
    }
);

// Rimozione guasto lampione
lampRouter.put(
    "/:idA/lampioni/guasti/remove/:idL",
    async (req: Request, res: Response) => {
        const idA = req.params.idA;
        const idL = req.params.idL;

        console.log(
            `Ricevuta richiesta PUT su /api/aree/${idA}/lampioni/guasti/remove/${idL}`
        );

        parseInt(idA, 10);
        parseInt(idL, 10);

        try {
            const area = await AreaSchema.findOne({ id: idA });

            if (area) {
                const lampione = area.lampioni.find(
                    (lamp: ILampSchema) => lamp.id === parseInt(idL)
                );

                if (lampione) {
                    if (lampione.guasto) {
                        lampione.guasto = false;
                    } else {
                        res.status(409).send(
                            `Il lampione non era presente nella lista guasti!`
                        );
                        return;
                    }
                    await area.save();
                    res.status(200).send(
                        `Lampione rimosso dalla lista guasti!`
                    );
                    return;
                }
            }
        } catch (error) {
            console.error(
                "Errore nel processo di segnalazione dei guasti di un lampione:",
                error
            );
            res.status(500).send(
                "Errore nel processo di segnalazione dei guasti di un lampione"
            );
        }
    }
);

// Recupero lista lampioni guasti
lampRouter.get(
    "/:idA/lampioni/guasti/",
    async (req: Request, res: Response) => {
        const idA = req.params.idA;
        parseInt(idA, 10);

        console.log(
            `Ricevuta richiesta GET su /api/aree/${idA}/lampioni/guasti/`
        );

        try {
            const area = await AreaSchema.findOne({ id: idA });

            if (area) {
                const lampioni: ILampSchema[] = area.lampioni.filter(
                    (lamp: ILampSchema) => lamp.guasto === true
                );

                if (lampioni) {
                    res.status(200).json(lampioni);
                } else {
                    res.status(404).json({ error: "Nessun lampione trovato" });
                }
            } else {
                res.status(404).json({ error: "Area non trovata" });
            }
        } catch (error) {
            console.error(
                "Errore durante il recupero dei lampioni guasti",
                error
            );
            res.status(500).send(
                "Errore durante il recupero dei lampioni guasti"
            );
        }
    }
);

// RICHIESTA INFORMAZIONI SINGOLO LAMPIONE
lampRouter.get("/:idA/lampioni/:idL", async (req: Request, res: Response) => {
    const idA = req.params.idA;
    const idL = req.params.idL;
    parseInt(idA, 10);
    parseInt(idL, 10);

    console.log(`Ricevuta richiesta GET su /api/aree/${idA}/lampioni/${idL}`);

    try {
        const area = await AreaSchema.findOne({ id: idA });
        if (area) {
            const lampione = area.lampioni.find(
                (lamp: any) => lamp.id === parseInt(idL)
            );
            if (lampione) {
                res.status(200).json(lampione);
            } else {
                res.status(404).json({
                    error: "Errore nel recupero delle informazioni di un lampione: lampione non trovato",
                });
            }
        } else {
            res.status(404).json({
                error: "Errore nel recupero delle informazioni di un lampione: area non trovata",
            });
        }
    } catch (error) {
        console.error(
            "Errore nel recupero delle informazioni di un lampione:",
            error
        );
        res.status(500).send(
            "Errore nel recupero delle informazioni di un lampione"
        );
    }
});
// RICHIESTA INFORMAZIONI DI TUTTI I LAMPIONI DELL'AREA
lampRouter.get("/:id/lampioni", async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`Ricevuta richiesta GET su /api/aree/${id}/`);
    try {
        const area = await AreaSchema.findOne({ id: parseInt(id, 10) });
        if (area) {
            console.log("Area trovata");
            res.status(200).json(area.lampioni);
        } else {
            res.status(404).json({
                error: "Errore nel recupero delle informazioni di tutti i lampioni dell'area: area non trovata.",
            });
        }
    } catch (error) {
        console.error(
            "Errore nel recupero delle informazioni di tutti i lampioni dell'area:",
            error
        );
        res.status(500).send(
            "Errore nel recupero delle informazioni di tutti i lampioni dell'area"
        );
    }
});

// RICHIESTA AGGIUNTA LAMPIONE
lampRouter.post("/:id/lampioni", async (req: Request, res: Response) => {
    try {
        // Recupero ID area
        const { id } = req.params;
        console.log(`Ricevuta richiesta POST su /api/aree/${id}/lampioni/`);

        // Recupero Area
        const areaMod = await AreaSchema.findOne({ id: id });

        if (!areaMod) {
            res.status(400).json({
                error: "Errore nel processo di inserimento di un lampione in un'area: errore nel recupero dell'area",
            });
        } else {
            // Recupero nuovo lampione dalla richiesta
            const { stato, lum, luogo, area, iter } = req.body;
            const id = await generateLampId(area);
            const newLamp = new LampioneSchema({
                id,
                area: parseInt(area, 10),
                stato,
                lum: parseInt(lum, 10),
                luogo,
                guasto: false,
                iter
            });

            // Aggiunta del lampione all'array dell'area
            areaMod.lampioni.push(newLamp.toObject());
            const savedLampione = areaMod.save();
            res.status(200).json(savedLampione);
        }
    } catch (error) {
        console.error(
            "Errore nel processo di inserimento di un lampione in un'area:",
            error
        );
        res.status(500).send(
            "Errore nel processo di inserimento di un lampione in un'area"
        );
    }
});

// RICHIESTA MODIFICA LAMPIONE
lampRouter.put(
    "/:idA/lampioni/edit/:idL",
    async (req: Request, res: Response) => {
        const idA = req.params.idA;
        const idL = req.params.idL;
        parseInt(idA, 10);
        parseInt(idL, 10);
        console.log(
            `Ricevuta richiesta PUT su /api/aree/${idA}/lampioni/${idL}/edit -> ID: ${idL}`
        );

        try {
            const area = await AreaSchema.findOne({ id: idA });
            if (area) {
                const lampione = area.lampioni.find(
                    (lamp: ILampSchema) => lamp.id === parseInt(idL)
                );
                if (lampione) {
                    if (req.body.stato !== undefined) {
                        lampione.stato = req.body.stato;
                    }
                    if (req.body.lum !== undefined) {
                        lampione.lum = parseInt(req.body.lum, 10);
                    }
                    if (req.body.luogo !== undefined) {
                        lampione.luogo = req.body.luogo;
                    }
                    if (req.body.iter !== undefined) {
                        lampione.iter = req.body.iter;
                    }
                    await area.save();
                    res.status(200).send(
                        `Lampione con id = ${idL} modificato con successo`
                    );
                } else {
                    res.status(404).send(
                        `Errore nel processo di modifica di un lampione: lampione con id = ${idL} non trovato`
                    );
                }
            }
        } catch (error) {
            console.error(
                "Errore nel processo di modifica di un lampione:",
                error
            );
            res.status(500).send(
                "Errore nel processo di modifica di un lampione"
            );
        }
    }
);

// RICHIESTA ELIMINAZIONE LAMPIONE
lampRouter.delete(
    "/:idA/lampioni/:idL",
    async (req: Request, res: Response) => {
        const { idA, idL } = req.params;
        parseInt(idA, 10);
        parseInt(idL, 10);

        console.log(
            `Ricevuta richiesta DELETE su /api/aree/${idA}/lampioni/${idL}/`
        );

        try {
            const area = await AreaSchema.findOne({ id: idA });

            if (!area) {
                res.status(404).send(
                    "Errore nel processo di eliminazione di un lampione: area non trovata"
                );
                return;
            } else {
                area.lampioni = area.lampioni.filter(
                    (lamp: ILampSchema) => lamp.id !== parseInt(idL)
                );
                await area.save();

                res.status(200).send("Lampione eliminato con successo");
            }
        } catch (error) {
            console.error(
                "Errore nel processo di eliminazione di un lampione:",
                error
            );
            res.status(500).send(
                "Errore nel processo di eliminazione di un lampione"
            );
        }
    }
);

// GENERAZIONE ID INCREMENTALE PER LAMPIONI
async function generateLampId(areaId: number): Promise<number> {
    try {
        const area = await AreaSchema.findOne({ id: areaId }).exec();

        if (!area) {
            throw new Error(`Area con ID ${areaId} non trovata.`);
        }

        const newLampId = area.lampioni.length + 1;

        return newLampId;
    } catch (error) {
        console.error(
            "Errore durante la generazione dell'ID del lampione:",
            error
        );
        throw error;
    }
}

export default lampRouter;
