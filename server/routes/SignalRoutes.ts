import { Router, Request, Response } from "express";
import TokenSchema from "../schemas/TokenSchema";
import AreaSchema from "../schemas/AreaSchema";
import { generateSchedule } from "../utils/Schedule";
import { ILampSchema } from "../schemas/LampSchema";
import { turnOffLamps, generateTokenId } from "../utils/LightManagement";
import axios from "axios";

const signalRoutes = Router();

/*
    REDIRECT DELLE RICHIESTE
*/

// Visto che il segnale inviato dal sensore è unico, questo verrà gestito da questa route per inviarlo ai due endpoint corretti, ossia quello per i lampioni push e a quello per i lampioni pull

signalRoutes.post(
    "/area/:idA/sensore/:idS/new",
    async (req: Request, res: Response) => {

        const { idA, idS } = req.params;
        const baseURL = "http://localhost:5000/api/segnale/";
        const urlPart1 = `area/${encodeURIComponent(
            idA
        )}/sensore/${encodeURIComponent(idS)}`;

        try {
            const response2 = await axios.post(urlPart1);
            const response1 = await axios.get(
                `area/${encodeURIComponent(idA)}`
            );

            res.status(200).json("Successo");
        } catch (error) {
            console.log("Errore nel routing del segnale");
            console.error(error);
            res.status(500).json("Errore nel routing del segnale");
        }
    }
);

/*
    GESTIONE CON TOKEN
*/

// Generazione del token
signalRoutes.post(
    "/area/:idA/sensore/:idS",
    async (req: Request, res: Response) => {
        const { idA, idS } = req.params;

        console.log(
            `Richiesta POST ricevuto a api/segnale/area/${idA}/sensore/${idS}`
        );

        try {
            // Generazione del token
            const tokenId = await generateTokenId();
            const area = await AreaSchema.findOne({ id: idA });

            if (area) {
                const sensoreData = area.sensori.find(
                    (sens) => sens.id === parseInt(idS, 10)
                );

                if (sensoreData) {
                    const token = new TokenSchema({
                        id: tokenId,
                        area: idA,
                        expiring: new Date(
                            Date.now() + 1000 * sensoreData.sig_time
                        ),
                        used: false,
                    });

                    // Salvataggio del token
                    await token.save();
                }
            }

            res.status(200).json("Token generato con successo");
        } catch (error) {
            res.status(500).json({
                error: "Errore nella generazione del token ",
            });
        }
    }
);

// Ricerca e verifica del token
signalRoutes.get("/area/:id/token", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    console.log(`Richiesta GET ricevuta a api/segnale/area/${id}`);

    try {
        const token = await TokenSchema.findOne({ area: id })
            .sort({ id: -1 })
            .exec();
        const areaMod = await AreaSchema.findOne({ id });
        if (!token) {
            return res
                .status(498)
                .json({ error: "Errore nel recupero del token" });
        }
        if (!areaMod) {
            return res
                .status(400)
                .json({ error: "Errore nel recupero dell'area" });
        }

        const startingLum = areaMod.lampioni.map((lamp) => lamp.lum);
        const now = new Date();

        if (token.expiring < now) {
            if (token.used === false) {
                return res.status(218).json("This is fine");
            } else {
                token.used = false;
                await token.save();
                await turnOffLamps(startingLum, areaMod, res);
                return res.status(200).json("Spegnimento lampioni");
            }
        } else {
            if (token.used === false) {
                token.used = true;
                await token.save();
                console.log("Inizio accensione lampioni");
                areaMod.lampioni.forEach((lamp) => {
                    if (lamp.mode === "manuale") {
                        console.log("Accensione Lampione:", lamp.id);
                        lamp.lum = 10;
                    }
                });
                console.log("Fine accensione lampioni");
                await areaMod.save();
                return res.status(200).json("Accensione lampioni");
            } else {
                return res.status(226).json("Token Utilizzato");
            }
        }
    } catch (error) {
        console.log("Errore:", error);
        return res
            .status(500)
            .json({ error: "Errore nell'esecuzione del processo" });
    }
});

/*
    GESTIONE SENZA TOKEN
*/

// Accensione e spegnimento dei lampioni senza token
signalRoutes.get("/area/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`Segnale ricevuto a /api/segnale/area/${id}`);

    try {
        console.log("Recupero area");
        const areaMod = await AreaSchema.findOne({ id: id });

        if (!areaMod) {
            console.log("Area non trovata");
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
            areaMod.lampioni.forEach((lamp: ILampSchema) => {
                if (lamp.mode == "automatico") lamp.lum = 10;
            });
            console.log("Fine accensione lampioni");
            await areaMod.save();

            setTimeout(() => {
                turnOffLamps(startingLum, areaMod, res);
            }, areaMod.polling * 1000);

            res.status(200).json("Successo");
        }
    } catch (error) {
        res.status(500).json("Errore");
    }
});

// Generazione della Schedule
generateSchedule();

export default signalRoutes;
