import { IAreaSchema } from "../schemas/AreaSchema";
import { Response } from "express";
import TokenSchema from "../schemas/TokenSchema";

export async function turnOffLamps(startingLum: number[], areaMod: IAreaSchema, res: Response) {
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


export async function generateTokenId(): Promise<number> {
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