import { Router, Request, Response } from "express";
import TokenSchema from "../schemas/TokenSchema";

const tokenRoutes =  Router();

tokenRoutes.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    console.log(`Segnale ricevuto a api/movimento/token/aree/${id}`);

    try{
        // Generazione del token
        const tokenId = await generateTokenId();
        const token = new TokenSchema({
            id: tokenId,
            area: id,
            expiring: new Date(Date.now() + 1000 * 20)
        });

        // Salvataggio del token 
        await token.save();

        res.status(200).json("Token generato con successo");
    }
    catch(error){
        res.status(500).json({error: "Errore nella generazione del token "})
    }
});

// GENERAZIONE ID INCREMENTALE PER TOKEN
async function generateTokenId(): Promise<number> {
    try {

        const tokenId : number =  await TokenSchema.countDocuments({}).exec() + 1;

        if (!tokenId) {
            throw new Error(`Impossibile generare il token`);
        }
        return tokenId;
    } catch (error) {
        console.error(
            "Errore durante la generazione del token:",
            error
        );
        throw error;
    }
}

export default tokenRoutes;