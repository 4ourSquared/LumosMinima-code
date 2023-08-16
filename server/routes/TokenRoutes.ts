import { Router, Request, Response } from "express";
import TokenSchema from "../schemas/TokenSchema";
import { Token } from "typescript";

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
                res.status(200).json("Token valido");

                // TODO: Manca la parte di gestione del token qualora fosse valido
            }
            else {
                res.status(401).json({error: "Token scaduto"});
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

export default tokenRoutes;
