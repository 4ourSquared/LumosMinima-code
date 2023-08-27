import { Router, Request, Response } from "express";
import TokenSchema from "../schemas/TokenSchema";
import AreaSchema, { IAreaSchema } from "../schemas/AreaSchema";
import { ILampSchema } from "../schemas/LampSchema";
import { generateSchedule } from "../utils/Schedule";

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
                        Date.now() + 1000 * sensoreData.sig_time
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
    console.log(`Richiesta GET ricevuta a api/movimento/token/aree/${id}`);

    try {
        const token = await TokenSchema.findOne({ area: id })
            .sort({ id: -1 })
            .exec();

        if (!token) {
            res.status(498).json({ error: "Errore nel recupero del token" });
            return;
        }

        const areaMod = await AreaSchema.findOne({ id });

        if (!areaMod) {
            res.status(400).json({ error: "Errore nel recupero dell'area" });
            return;
        }

        const startingLum = areaMod.lampioni.map((lamp) => lamp.lum);

        if (token.expiring > new Date()) {
            console.log("Inizio accensione lampioni");
            areaMod.lampioni.forEach((lamp) => {
                if (lamp.mode === "manuale") {
                    console.log("Accensione Lampione:", lamp.id);
                    lamp.lum = 10;
                }
            });
            console.log("Fine accensione lampioni");
            await areaMod.save();
            res.status(200).json("Accensione lampioni");
        } else {
            turnOffLamps(startingLum, areaMod, res);
            res.status(200).json("Spegnimento lampioni");
        }
    } catch (error) {
        console.log("Errore:", error);
        res.status(500).json({ error: "Errore nell'esecuzione del processo" });
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
            if (areaMod.lampioni[i].mode === "manuale") {
                console.log("Spegnimento Lampione: ", areaMod.lampioni[i].id);
                areaMod.lampioni[i].lum = startingLum[i];
            }
        }

        await areaMod.save();
        console.log("Fine spegnimento lampioni");
    } catch (error) {
        res.status(400).json({
            error: "Errore nel processo di spegnimento dei lampioni",
        });
    }
}

generateSchedule();

export default tokenRoutes;
