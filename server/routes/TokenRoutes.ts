import { Router, Request, Response } from "express";
import TokenSchema from "../schemas/TokenSchema";
import AreaSchema, { IAreaSchema } from "../schemas/AreaSchema";
import { ILampSchema } from "../schemas/LampSchema";

const tokenRoutes = Router();

// Generazione token
tokenRoutes.post("/:idA/sensore/:idS", async (req: Request, res: Response) => {
    const idA = parseInt(req.params.idA, 10);
    const idS = parseInt(req.params.idS, 10);

    console.log(`Richiesta POST ricevuto a api/movimento/token/aree/${idA}`);

    try {
        // Generazione del token
        const tokenId = await generateTokenId();
        const area = await AreaSchema.findOne({ id: idA });

        if (area) {
            const sensoreData = area.sensori.find((sens) => sens.id === idS);

            if (sensoreData) {
                const token = new TokenSchema({
                    id: tokenId,
                    area: idA,
                    expiring: new Date(
                        Date.now() + 1000 * sensoreData?.sig_time
                    ),
                });

                // Salvataggio del token
                await token.save();
            }
        }

        res.status(200).json("Token generato con successo");
    } catch (error) {
        res.status(500).json({ error: "Errore nella generazione del token " });
    }
});

// Ricerca e verifica del token
tokenRoutes.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    console.log(`Richiesta GET ricevuto a api/movimento/token/aree/${id}`);

    try {
        // Ricerca del token
        const token = await TokenSchema.find({ area: id })
            .sort({ id: -1 })
            .findOne()
            .exec();

        // Verifica del token
        if (token) {
            try {
                const areaMod = await AreaSchema.findOne({ id: id });
                const startingLum: number[] = [];
                if (token.expiring > new Date(Date.now())) {
                    if (!areaMod) {
                        res.status(400).json({
                            error: "Errore nel processo: errore nel recupero dell'area",
                        });
                    } else {
                        // Salvataggio informazioni iniziali luminosità lampioni
                        areaMod.lampioni.forEach((lamp: ILampSchema) =>
                            startingLum.push(lamp.lum)
                        );

                        // Accensione lampioni
                        console.log("Inizio accensione lampioni");
                        areaMod.lampioni.forEach((lamp: ILampSchema) => {
                            if (lamp.mode == "manuale") {
                                console.log("Accensione Lampione: ", lamp.id);
                                lamp.lum = 10;
                            }
                        });
                        console.log("Fine accensione lampioni");
                        await areaMod.save();
                        res.status(200).json("Accensione lampioni");
                    }
                } else {
                    if (areaMod) {
                        turnOffLamps(startingLum, areaMod, res);
                        res.status(200).json("Spegnimento lampioni");
                    } else {
                        res.status(400).json({
                            error: "Errore nel processo di spegnimento dei lampioni: errore nel recupero dell'area",
                        });
                    }
                }
            } catch (error) {
                res.status(500).json("Errore");
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Errore nella recupero del token " });
        console.log("Errore nel processo di recupero del token: ", error);
    }
});

// GENERAZIONE ID INCREMENTALE PER TOKEN
async function generateTokenId(): Promise<number> {
    try {
        const tokenId: number =
            (await TokenSchema.countDocuments({}).exec()) + 1;

        if (!tokenId) {
            throw new Error(`Impossibile generare il token`);
        }
        return tokenId;
    } catch (error) {
        console.error("Errore durante la generazione del token:", error);
        throw error;
    }
}

async function turnOffLamps(
    startingLum: number[],
    areaMod: IAreaSchema,
    res: Response
) {
    console.log("Inizio spegnimento lampioni");

    try {
        for (let i = 0; i < areaMod.lampioni.length; i++) {
            console.log("Spegnimento Lampione: ", areaMod.lampioni[i].id);
            areaMod.lampioni[i].lum = startingLum[i];
        }

        await areaMod.save();
        console.log("Fine spegnimento lampioni");
    } catch (error) {
        res.status(400).json({
            error: "Errore nel processo di spegnimento dei lampioni",
        });
    }
}

export default tokenRoutes;
