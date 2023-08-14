import { Router, Request, Response } from "express";
import AreaSchema, { IAreaSchema } from "../schemas/AreaSchema";
import { ILampSchema } from "../schemas/LampSchema";

const movimentoRoutes =  Router();

movimentoRoutes.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    console.log(`Segnale ricevuto a /api/aree/${id}/movimento`);

    try {
        const areaMod = await AreaSchema.findOne({ id: id });

        if (!areaMod) {
            res.status(400).json({ error: "Errore nel processo: errore nel recupero dell'area" });
        } else {
            const startingLum: number[] = [];

            // Salvataggio informazioni iniziali luminosità lampioni
            areaMod.lampioni.forEach((lamp: ILampSchema) => startingLum.push(lamp.lum))

            // Accensione lampioni
            console.log("Inizio accensione lampioni");
            areaMod.lampioni.forEach((lamp: ILampSchema) => lamp.lum = 10);
            console.log("Fine accensione lampioni");
            await areaMod.save();

            

            setTimeout(() => {
                turnOffLamps(startingLum, areaMod, res);
            }, 10000);

            res.status(200).json("Successo");
            
        }
    } catch (error) {
        res.status(500).json("Errore")
    }
});

async function turnOffLamps(startingLum: number[], areaMod: IAreaSchema, res: Response) {
    console.log("Inizio spegnimento lampioni");

    try {
        for (let i = 0; i < areaMod.lampioni.length; i++) {
            areaMod.lampioni[i].lum = startingLum[i];
        }

        await areaMod.save();
        console.log("Fine spegnimento lampioni");
    } catch (error) {
        res.status(400).json({ error: "Errore nel processo di spegnimento dei lampioni" });
    }
}


export default movimentoRoutes;