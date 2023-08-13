import { Router, Request, Response } from "express";

const movimentoRoutes =  Router();

movimentoRoutes.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    console.log(`Segnale ricevuto a /api/aree/${id}/movimento`);
    try {
        res.status(200).json("Successo")
    } catch (error) {
        res.status(500).json("Errore")
    }
});

export default movimentoRoutes;