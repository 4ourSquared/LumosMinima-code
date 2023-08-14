import { Router, Request, Response } from "express";
import AreaSchema from "../schemas/AreaSchema";
import { ILampSchema } from "../schemas/LampSchema";

const movimentoRoutes =  Router();

// TODO: Bisognerà implementare un lock qualora una zona fosse già illuminata che blocca la richiesta
movimentoRoutes.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const startingLum : number[] = []; 
    console.log(`Segnale ricevuto a /api/aree/${id}/movimento`);
    try {
        // TODO: Implementare prima richiesta per accensione di tutti i lampioni dell'area
        console.log("Inizio accensione lampioni");
        const areaMod = await AreaSchema.findOne({id: id});

        if (!areaMod) {
            res.status(400).json({ error: "Errore nel processo di accensione dei lampioni in un'area: errore nel recupero dell'area" });
        } else {
            // Salvataggio informazioni iniziali luminosità lampioni
            areaMod.lampioni.forEach((lamp : ILampSchema)=> startingLum.push(lamp.lum))

            // Accensione lampioni
            areaMod.lampioni.forEach((lamp : ILampSchema)=> lamp.lum = 10);

            await areaMod.save();
            console.log("Fine accensione lampioni");
        }



        // Timeout
        setTimeout( async (startingLum : number[]) => {
            // TODO: Implementare seconda richiesta per spegnimento di tutti i lampioni dell'area
            console.log("Inizio spegnimento lampioni");
            const areaMod = await AreaSchema.findOne({id: id});

        if (!areaMod) {
            res.status(400).json({ error: "Errore nel processo di spegnimento dei lampioni in un'area: errore nel recupero dell'area" });
        } else {
            // Spegnimento lampioni
            areaMod.lampioni.forEach((lamp : ILampSchema)=> lamp.lum = 1);
            await areaMod.save();
            console.log("Fine spegnimento lampioni");
        }

        
        }, 10000);
        
        res.status(200).json("Successo");
    } catch (error) {
        res.status(500).json("Errore")
    }
});

export default movimentoRoutes;