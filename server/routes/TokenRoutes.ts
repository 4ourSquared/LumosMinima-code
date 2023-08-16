import { Router, Request, Response } from "express";
import TokenSchema from "../schemas/TokenSchema";
import AreaSchema, { IAreaSchema } from "../schemas/AreaSchema";
import { ILampSchema } from "../schemas/LampSchema";

const tokenRoutes = Router();

tokenRoutes.post("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    console.log(`Richiesta POST ricevuto a api/movimento/token/aree/${id}`);

    try {
        // Generazione del token
        const tokenId = await generateTokenId();
        const token = new TokenSchema({
            id: tokenId,
            area: id,
            // Durata del token: 20 secondi
            expiring: new Date(Date.now() + 1000 * 20),
        });

        // Salvataggio del token
        await token.save();

        res.status(200).json("Token generato con successo");
    } catch (error) {
        res.status(500).json({ error: "Errore nella generazione del token " });
    }
});

tokenRoutes.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    console.log(`Richiesta POST ricevuto a api/movimento/token/aree/${id}`);

    try {
        // Ricerca del token
        const token = await TokenSchema.find({ area: id })
            .sort({ id: -1 })
            .findOne()
            .exec();

        // Verifica del token
        if (token) {
            if (token.expiring > new Date(Date.now())) {
                try {
                    const areaMod = await AreaSchema.findOne({ id: id });

                    if (!areaMod) {
                        res.status(400).json({
                            error: "Errore nel processo: errore nel recupero dell'area",
                        });
                    } else {
                        const startingLum: number[] = [];

                        // Salvataggio informazioni iniziali luminosità lampioni
                        areaMod.lampioni.forEach((lamp: ILampSchema) =>
                            startingLum.push(lamp.lum)
                        );

                        // Accensione lampioni
                        console.log("Inizio accensione lampioni");
                        areaMod.lampioni.forEach(
                            (lamp: ILampSchema) => (lamp.lum = 10)
                        );
                        console.log("Fine accensione lampioni");
                        await areaMod.save();

                        setTimeout(() => {
                            turnOffLamps(startingLum, areaMod, res);
                        }, 10000);

                        res.status(200).json("Successo");
                    }
                } catch (error) {
                    res.status(500).json("Errore");
                }
            } else {
                res.status(401).json({ error: "Token scaduto" });
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
